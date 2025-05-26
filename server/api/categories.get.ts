// server/api/categories.get.ts
import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
  const cfg = useRuntimeConfig()
  const conn = await mysql.createConnection({ 
    host: cfg.dbHost, user: cfg.dbUser, password: cfg.dbPassword, database: cfg.dbName 
  })
  try {
    const [rows] = await conn.execute(
      'SELECT category_id AS id, category_name AS name FROM material_categories'
    )
    return rows
  } finally { await conn.end() }
})
