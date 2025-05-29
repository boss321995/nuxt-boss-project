// middleware/role.ts
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#imports'
import { jwtVerify } from 'jose'

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('token').value
  if (!token) return navigateTo('/login')
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(useRuntimeConfig().jwtSecret)
    )
    if (!['admin','supervisor'].includes(payload.role as string)) {
      return navigateTo('/dashboard')  // redirect if not allowed
    }
  } catch {
    return navigateTo('/login')
  }
})
