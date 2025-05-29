// server/api/login.post.ts
import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<{username:string,password:string}>(event)
  const config = useRuntimeConfig()

  const conn = await mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
  })

  try {
    const [rows] = await conn.execute(
      'SELECT user_id,username,role,password FROM users WHERE username = ?',
      [username]
    ) as any[][]
    const user = rows[0]
    if (!user) throw createError({ statusCode: 401, statusMessage: 'ไม่พบผู้ใช้' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw createError({ statusCode: 401, statusMessage: 'รหัสผ่านไม่ถูกต้อง' })

    const accessToken = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .setSubject(String(user.user_id))
      .sign(new TextEncoder().encode(config.jwtSecret))

    setCookie(event, 'token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15
    })

    // ส่งกลับข้อมูลเบื้องต้น (จะใช้ใน client)
    return { userId: user.user_id, username: user.username, role: user.role }
  } finally {
    await conn.end()
  }
})
