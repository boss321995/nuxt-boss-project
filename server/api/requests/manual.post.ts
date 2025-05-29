// server/api/requests/manual.post.ts

import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import mysql from 'mysql2/promise'
import { jwtVerify } from 'jose'
import { appendFile } from 'fs/promises'

export default defineEventHandler(async (event) => {
  // 1) auth + role check
  const token = getCookie(event, 'token')
  if (!token) throw createError({ statusCode: 401 })
  let payload: any
  try {
    ({ payload } = await jwtVerify(
      token,
      new TextEncoder().encode(useRuntimeConfig().jwtSecret)
    ))
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
  const actorUsername = payload.username as string
  const actorRole     = payload.role as string
  if (!['admin','supervisor'].includes(actorRole)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // 2) อ่าน data จาก body
  const body = await readBody<{
    username: string
    missionDetail: string
    items: { material_id: string; quantity_requested: number }[]
  }>(event)

  const cfg = useRuntimeConfig()
  const conn = await mysql.createConnection({
    host:     cfg.dbHost,
    user:     cfg.dbUser,
    password: cfg.dbPassword,
    database: cfg.dbName
  })

  try {
    // เริ่ม transaction
    await conn.beginTransaction()

    // 3) insert แถวหลักใน requests
    const [reqRes] = await conn.execute(
      `INSERT INTO requests
         (username, missionDetail, batch_id)
       VALUES (?,?,?)`,
      [body.username, body.missionDetail, Date.now()]
    )
    const requestId = (reqRes as any).insertId

    // 4) สำหรับแต่ละไอเท็ม: ตรวจ stock → insert request_material → update materials
    for (const item of body.items) {
      // 4.1) ดึง stock ปัจจุบัน
      const [[{ quantity: currentQty }]] = await conn.query(
        `SELECT quantity FROM materials WHERE material_id = ? FOR UPDATE`,
        [item.material_id]
      ) as any

      if (item.quantity_requested > currentQty) {
        // ถ้าเกินสต็อค rollback แล้ว error
        await conn.rollback()
        throw createError({
          statusCode: 400,
          statusMessage: `Not enough stock for ${item.material_id}`
        })
      }

      // 4.2) บันทึกรายการใน request_material
      await conn.execute(
        `INSERT INTO request_material
           (request_id, user_id, material_id, quantity_requested, status, requested_at, approved_by, approved_at)
         VALUES (?,?,?,?,?,?,?,NOW())`,
        [
          requestId,
          payload.sub,               // user_id จาก token.sub
          item.material_id,
          item.quantity_requested,
          'approved',                // ตัดสต็อคทันที
          new Date(),                // requested_at
          payload.sub                // approved_by = ผู้ทำรายการ
        ]
      )

      // 4.3) ตัดสต็อค
      await conn.execute(
        `UPDATE materials
           SET quantity = quantity - ?
         WHERE material_id = ?`,
        [item.quantity_requested, item.material_id]
      )
    }

    // commit ถ้าไม่มี error
    await conn.commit()

  } catch (err) {
    // rollback ถ้า error
    await conn.rollback()
    throw err
  } finally {
    await conn.end()
  }

  // 5) เขียน log ลงไฟล์
  const logLines = body.items.map(it =>
    `${it.material_id}×${it.quantity_requested}`
  ).join('; ')
  const logEntry = [
    new Date().toISOString(),
    `by ${actorUsername} (${actorRole})`,
    `for ${body.username}`,
    `items: ${logLines}`,
    `mission: ${body.missionDetail}`
  ].join(' | ') + '\n'

  await appendFile('./logs/requests_manual.log', logEntry)

  return { success: true, requestId }
})
