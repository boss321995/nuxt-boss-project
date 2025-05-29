import { defineEventHandler } from 'h3'
import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const conn = await mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: 'hrd_db'    // ชื่อตาราง hrnt อยู่ในฐานข้อมูล hrd_db
  })
  const [rows] = await conn.query(`
    SELECT ID8 AS id, name
    FROM hrnt
    ORDER BY ID8
  `)
  await conn.end()
  return rows as { id: string; name: string }[]
})
