import mysql from 'mysql2/promise'
import { jwtVerify } from 'jose'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // ตรวจสอบ JWT และดึง userId
  const token = getCookie(event, 'token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const { payload } = await jwtVerify(token, new TextEncoder().encode(useRuntimeConfig().jwtSecret))
  const userId = payload.sub

  // เชื่อม DB
  const config = useRuntimeConfig()
  const conn = await mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
  })

  // ดึงสิทธิ์หมวดวัสดุของ user
  const [users] = await conn.query(
    'SELECT material_access FROM users WHERE user_id = ?',
    [userId]
  ) as any[]
  const access = users[0]?.material_access?.split(',') || []

  // ดึงวัสดุที่อยู่ใน category ที่ user มีสิทธิ์
  const [rows] = await conn.query(
    `SELECT material_id AS id, material_name AS name, quantity, unit, category_id AS category
     FROM materials
     WHERE category_id IN (?);`,
    [access]
  ) as any[]

  await conn.end()
  return rows
})