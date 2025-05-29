// server/api/materials.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  // 1. อ่าน payload
  const { name, quantity, category } = await readBody<{
    name: string
    quantity: number
    category: string
  }>(event)

  // 2. สร้าง prefix ตามกติกา
  const now = new Date()
  const beYear = now.getFullYear() + 543           // ปี พ.ศ.
  const yy = String(beYear).slice(-2)               // 2 หลักสุดท้ายของ พ.ศ.
  const mm = String(now.getMonth() + 1).padStart(2, '0')  // เดือน 2 หลัก
  const yyyy = String(now.getFullYear()).padStart(4, '0') // ปี ค.ศ. 4 หลัก
  const prefix = `A${yy}${mm}${yyyy}`

  // 3. เชื่อมต่อ DB
  const { dbHost, dbUser, dbPassword, dbName } = useRuntimeConfig()
  const conn = await mysql.createConnection({ host: dbHost, user: dbUser, password: dbPassword, database: dbName })

  try {
    // 4. หาค่า material_id ล่าสุดที่ขึ้นต้นด้วย prefix นี้
    const [[{ max_id }]]: any = await conn.query(
      `SELECT MAX(material_id) AS max_id
       FROM materials
       WHERE material_id LIKE ?`,
      [`${prefix}%`]
    )

    // 5. ถ้ามีค่าเดิม ให้ +1 ถ้าไม่มี ให้เริ่ม 1
    let serial = 1
    if (max_id) {
      const lastSerial = parseInt(max_id.slice(-6), 10)
      serial = lastSerial + 1
    }
    const serialStr = String(serial).padStart(6, '0')  // 6 หลัก

    // 6. ประกอบ material_id ใหม่
    const material_id = `${prefix}${serialStr}`

    // 7. แทรกข้อมูล
    await conn.execute(
      `INSERT INTO materials
         (material_id, material_name, quantity, category_id)
       VALUES
         (?, ?, ?, (SELECT category_id FROM material_categories WHERE category_name = ?))`,
      [material_id, name, quantity, category]
    )

    // 8. ตอบกลับ
    return {
      id: material_id,
      name,
      quantity,
      category
    }
  } finally {
    await conn.end()
  }
})
