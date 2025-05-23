// server/api/login.post.ts

import { SignJWT } from 'jose'             // ← เพิ่มบรรทัดนี้
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  const config = useRuntimeConfig()

  // เชื่อมต่อฐานข้อมูล
  const conn = await mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
  })

  try {
    const [rows] = await conn.execute('SELECT id, password FROM users WHERE username = ?', [username])
    const user = (rows as any[])[0]
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'ไม่พบผู้ใช้' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw createError({ statusCode: 401, statusMessage: 'รหัสผ่านไม่ถูกต้อง' })
    }

    // สร้าง JWT
    const accessToken = await new SignJWT({ sub: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(new TextEncoder().encode(config.jwtSecret))

    // เซ็ต cookie เก็บ token
    setCookie(event, 'access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15
    })

    return { message: 'Login สำเร็จ', userId: user.id }
  } finally {
    await conn.end()
  }
})
