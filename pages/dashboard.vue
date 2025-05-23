<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto bg-white shadow rounded-lg p-8">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
      <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>
      <div v-else-if="data">
        <p>สวัสดี User ID: <strong>{{ data.userId }}</strong></p>
        <!-- ใส่เนื้อหา dashboard เพิ่มเติมตรงนี้ -->
      </div>
      <div v-else class="text-gray-500">กำลังโหลดข้อมูล...</div>
      <button
        @click="logout"
        class="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// บังคับใช้ middleware auth ก่อนเข้าเพจนี้
definePageMeta({
  middleware: 'auth'
})

import { useRouter } from 'vue-router'
import { useFetch } from '#app'

const { data, error } = await useFetch('/api/me')
const router = useRouter()

function logout() {
  // ลบ cookie แล้วไปหน้า login
  useCookie('access_token').value = null
  router.push('/login')
}
</script>
