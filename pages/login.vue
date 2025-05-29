<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
      <div class="bg-indigo-600 px-8 py-6">
        <h2 class="text-white text-3xl font-bold text-center">เข้าสู่ระบบ</h2>
      </div>
      <form @submit.prevent="onSubmit" class="px-8 py-6 space-y-5">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
            ชื่อผู้ใช้
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="กรอกชื่อผู้ใช้"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            รหัสผ่าน
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 text-white font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
        >
          เข้าสู่ระบบ
        </button>
        <p v-if="error" class="text-red-500 text-center text-sm">
          {{ error }}
        </p>
      </form>
      <div class="px-8 py-4 bg-gray-50 text-center text-sm">
        ไม่มีบัญชี? 
        <NuxtLink to="/register" class="text-indigo-600 hover:underline">
          สมัครสมาชิก
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})
import { ref } from 'vue'
import { useRouter } from 'vue-router'
interface User { username: string; role: string }
const currentUser = useState<User|null>('currentUser')
const username = ref('')
const password = ref('')
const error = ref<string|null>(null)
const router = useRouter()
const form = reactive({ username: '', password: '' })
async function onSubmit() {
  console.log('🔧 onSubmit invoked', username.value, password.value)
  error.value = null
  try {
    // เรียก API /api/login จะคืน { userId, username, role }
   const res = await $fetch<{ username: string; role: string }>('/api/login', {
  method: 'POST',
  credentials: 'include',
  body: {
    username: username.value,
    password: password.value
  }
})
    console.log('✅ login OK', res)
     currentUser.value = { username: res.username, role: res.role }
    await router.push('/dashboard')
    console.log('🚀 router.push to /dashboard')
  } catch (e: any) {
    console.error('❌ login failed', e)
    error.value = e.data?.message || e.message || 'เกิดข้อผิดพลาด'
  }
}
</script>
