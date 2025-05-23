// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    await $fetch('/api/me')      // ถ้า 200 → ผ่าน
  } catch {
    return navigateTo('/login')   // ถ้า 401 หรือ error → กลับไปล็อกอิน
  }
})
