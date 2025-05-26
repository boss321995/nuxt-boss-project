// server/api/materials.get.ts
import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
  const cfg = useRuntimeConfig()
  const conn = await mysql.createConnection({ 
    host: cfg.dbHost, user: cfg.dbUser, password: cfg.dbPassword, database: cfg.dbName 
  })
  try {
    const [rows] = await conn.execute(`
      SELECT m.material_id AS id, m.material_name AS name, m.quantity, m.unit,
             c.category_name AS category
      FROM materials m
      LEFT JOIN material_categories c ON m.category_id = c.category_id
      ORDER BY m.material_name
    `)
    return rows
  } finally { await conn.end() }
})
