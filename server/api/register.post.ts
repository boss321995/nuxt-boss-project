// server/api/register.post.ts
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<{ username: string; password: string }>(event)
  // 1) ดึงค่า runtimeConfig กลับมา
  const config = useRuntimeConfig()
    // 2) เชื่อมต่อฐานข้อมูลด้วยค่าใน config
  const conn = await mysql.createConnection({
    host:     config.dbHost,
    user:     config.dbUser,
    password: config.dbPassword,
    database: config.dbName
  })
console.log('DB Config:', useRuntimeConfig())
  try {
    // ตรวจสอบซ้ำ
    const [rows] = await conn.execute('SELECT id FROM users WHERE username = ?', [username])
    if ((rows as any[]).length > 0) {
      throw createError({ statusCode: 409, statusMessage: 'ชื่อผู้ใช้ถูกใช้งานไปแล้ว' })
    }

    // hash รหัสผ่าน
    const hash = await bcrypt.hash(password, 10)
    const [result] = await conn.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hash]
    )

    return { message: 'สมัครสมาชิกสำเร็จ', userId: (result as any).insertId }
  } finally {
    await conn.end()
  }
})
