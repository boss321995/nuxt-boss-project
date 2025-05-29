// plugins/auth.client.ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async () => {
  const currentUser = useState<{ username: string; role: string } | null>('currentUser', () => null)
  try {
    const me = await $fetch<{ username: string; role: string }>('/api/me', {
      credentials: 'include'
    })
    currentUser.value = me
  } catch {
    currentUser.value = null
  }
})
