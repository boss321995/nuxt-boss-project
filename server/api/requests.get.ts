// server/api/requests.get.ts
import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
  const cfg = useRuntimeConfig()
  const conn = await mysql.createConnection({ 
    host: cfg.dbHost, user: cfg.dbUser, password: cfg.dbPassword, database: cfg.dbName 
  })
  try {
    const [rows] = await conn.execute(`
      SELECT r.request_id AS id, u.username AS user, m.material_name AS material,
             r.quantity_requested AS qty, r.status, r.requested_at AS date
      FROM requests r
      JOIN users u ON r.user_id = u.user_id
      JOIN materials m ON r.material_id = m.material_id
      ORDER BY r.requested_at DESC
    `)
    return rows
  } finally { await conn.end() }
})
