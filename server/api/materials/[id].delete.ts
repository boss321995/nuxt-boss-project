import mysql from 'mysql2/promise'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const config = useRuntimeConfig()
  const conn = await mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
  })

  // ลบวัสดุ
  await conn.execute(
    'DELETE FROM materials WHERE material_id = ?',
    [id]
  )
  await conn.end()
  return { success: true }
})