// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo, useState } from '#imports'

export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    // ดึงข้อมูลตัวเอง (จะขว้าง error ถ้ายังไม่ล็อกอิน)
    const me = await $fetch('/api/me', { credentials: 'include' })
    // เก็บเข้า shared state เพื่อให้ Sidebar & ส่วนอื่นๆ อ่านได้
    useState('currentUser', () => me)
    // ถ้า page นี้เป็น /requests/manual แต่อยู่นอกกลุ่ม admin|supervisor
    if (to.path.startsWith('/requests') && !['admin','supervisor'].includes(me.role)) {
      return navigateTo('/dashboard')
    }
  } catch {
    // ยังไม่ล็อกอิน → ไปหน้า login
    return navigateTo('/login')
  }
})
