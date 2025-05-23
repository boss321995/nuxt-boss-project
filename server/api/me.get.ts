// server/api/me.get.ts
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  // 1) อ่าน token จาก cookie
  const token = getCookie(event, 'access_token') || ''
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // 2) เตรียม secret key ด้วย TextEncoder
  const encoder = new TextEncoder()
  const secret = encoder.encode(useRuntimeConfig().jwtSecret)

  // 3) verify JWT
  const { payload } = await jwtVerify(token, secret)

  return { userId: payload.sub }
})
