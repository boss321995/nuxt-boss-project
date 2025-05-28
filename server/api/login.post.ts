// server/api/login.post.ts

import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<{username:string,password:string}>(event)
  const config = useRuntimeConfig()

  // 1) เชื่อม DB
  const conn = await mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
  })

  try {
    // 2) หา user
    const [rows] = await conn.execute(
      'SELECT user_id, password FROM users WHERE username = ?',
      [username]
    ) as any[][]
    const user = rows[0]
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'ไม่พบผู้ใช้' })
    }

    // 3) ตรวจรหัส
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw createError({ statusCode: 401, statusMessage: 'รหัสผ่านไม่ถูกต้อง' })
    }

    // 4) สร้าง JWT โดยใช้ sub claim เป็น user_id
    const accessToken = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .setSubject(String(user.user_id))
      .sign(new TextEncoder().encode(config.jwtSecret))

    // 5) เซ็ต cookie
    setCookie(event, 'token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15
    })

    // 6) ตอบผล
    return { message: 'Login สำเร็จ', userId: user.user_id }
  } finally {
    await conn.end()
  }
})
