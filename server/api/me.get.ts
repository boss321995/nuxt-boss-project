// server/api/me.get.ts

import { defineEventHandler, getCookie, createError } from 'h3'
import { jwtVerify } from 'jose'
// ← เพิ่มบรรทัดนี้:
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  // 1) ดึง token จาก cookie
  const token = getCookie(event, 'token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // 2) verify JWT
  let payload: any
  try {
    ({ payload } = await jwtVerify(
      token,
      new TextEncoder().encode(useRuntimeConfig().jwtSecret)
    ))
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized - invalid token' })
  }

  // 3) connect to DB
  const { dbHost, dbUser, dbPassword, dbName } = useRuntimeConfig()
  const conn = await mysql.createConnection({ host: dbHost, user: dbUser, password: dbPassword, database: dbName })

  // 4) query user
  const [rows] = await conn.query(
    'SELECT user_id AS userId, username, role FROM users WHERE user_id = ?',
    [payload.sub]
  ) as any[][]
  await conn.end()

  if (!rows.length) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return rows[0]
})
