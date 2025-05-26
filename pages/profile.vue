<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4">โปรไฟล์ของฉัน</h1>
    <p>สวัสดี, {{ userName }}!</p>
  </section>
</template>

<script setup lang="ts">
// หากมีระบบล็อกอินไว้แล้ว คุณอาจจะดึงข้อมูล user จาก API /api/me
import { ref, onMounted } from 'vue'
const userName = ref('แขกผู้เยี่ยมชม')

onMounted(async () => {
  try {
    const me = await $fetch<{ userId: number; username: string }>('/api/me')
    userName.value = me.username
  } catch {
    userName.value = 'แขกผู้เยี่ยมชม'
  }
})
</script>
