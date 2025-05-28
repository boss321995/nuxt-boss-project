// server/api/materials/assigned.get.ts
import { defineEventHandler, getCookie, getRequestHeaders, createError } from 'h3'
import mysql from 'mysql2/promise'
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  // 1️⃣ ดึง token จาก cookie / authorization header
  const cookieToken = getCookie(event, 'token')
  const authHeader  = getRequestHeaders(event).authorization || ''
  const bearerToken = authHeader.split(' ')[1] || ''
  const token       = cookieToken || bearerToken
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  // 2️⃣ verify JWT
  let payload: any
  try {
    ({ payload } = await jwtVerify(
      token,
      new TextEncoder().encode(useRuntimeConfig().jwtSecret)
    ))
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized - invalid token' })
  }
  const userId = payload.sub as string

  // 3️⃣ เชื่อม DB
  const { dbHost, dbUser, dbPassword, dbName } = useRuntimeConfig()
  const conn = await mysql.createConnection({ host: dbHost, user: dbUser, password: dbPassword, database: dbName })

  // 4️⃣ ดึง role + material_access สำหรับ user นี้
  const [userRows] = await conn.query(
    'SELECT role, material_access FROM users WHERE user_id = ?',
    [userId]
  ) as any[][]
  if (!userRows.length) {
    await conn.end()
    return []
  }
  const { role, material_access } = userRows[0]
  const accessList = material_access
    ? material_access.split(',').map((s: string) => s.trim()).filter(Boolean)
    : []

  // 5️⃣ สร้าง SQL Base
  let sql = `
    SELECT
      m.material_id AS id,
      m.material_name AS name,
      m.quantity,
      mc.category_name AS category
    FROM materials m
    JOIN material_categories mc
      ON m.category_id = mc.category_id
  `
  const params: string[] = []

  // ถ้าไม่ใช่ admin และมีสิทธิ์ จึงต่อ WHERE
  if (role !== 'admin' && accessList.length > 0) {
    const ph = accessList.map(() => '?').join(',')
    sql += ` WHERE mc.category_name IN (${ph})`
    params.push(...accessList)
  }

  // 6️⃣ รัน query ครั้งเดียว
  const [rows] = await conn.query(sql, params) as any[][]
  await conn.end()
  //console.log({ userId, role, accessList, sql, params, count: rows.length })
  console.log({ userId, materials: rows })
  return rows
})
