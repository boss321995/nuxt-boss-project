// server/api/materials/next-id.get.ts
import { defineEventHandler } from 'h3'
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const now = new Date()
  const beYear = now.getFullYear() + 543
  const yy     = String(beYear).slice(-2)
  const mm     = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy   = String(now.getFullYear()).padStart(4, '0')
  const prefix = `A${yy}${mm}${yyyy}`

  const { dbHost, dbUser, dbPassword, dbName } = useRuntimeConfig()
  const conn = await mysql.createConnection({ host: dbHost, user: dbUser, password: dbPassword, database: dbName })

  try {
    // หา material_id ล่าสุด
    const [[{ max_id }]]: any = await conn.query(
      `SELECT MAX(material_id) AS max_id
       FROM materials
       WHERE material_id LIKE ?`, [`${prefix}%`]
    )
    let serial = 1
    if (max_id) {
      serial = parseInt(max_id.slice(-6), 10) + 1
    }
    const nextId = `${prefix}${String(serial).padStart(6, '0')}`
    return { nextId }
  } finally {
    await conn.end()
  }
})
