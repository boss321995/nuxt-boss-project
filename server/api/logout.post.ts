import { defineEventHandler, setCookie } from 'h3'

export default defineEventHandler((event) => {
  // ล้างคุกกี้ token
  setCookie(event, 'token', '', {
    maxAge: 0,
    path: '/',
    httpOnly: true,
    sameSite: 'lax'
  })
  return { message: 'Logged out' }
})
