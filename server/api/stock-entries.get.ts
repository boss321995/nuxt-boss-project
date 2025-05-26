// server/api/stock-entries.get.ts
import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
  const cfg = useRuntimeConfig()
  const conn = await mysql.createConnection({ 
    host: cfg.dbHost, user: cfg.dbUser, password: cfg.dbPassword, database: cfg.dbName 
  })
  try {
    const [rows] = await conn.execute(`
      SELECT entry_id AS id, buyID AS purchaseId, material_id AS materialId,
             quantity, price_per_unit AS pricePerUnit, entry_date AS date
      FROM stock_entries
      ORDER BY entry_date DESC
    `)
    return rows
  } finally { await conn.end() }
})
