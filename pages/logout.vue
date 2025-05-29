<template>
  <div class="flex items-center justify-center h-screen">
    <p class="text-gray-600">กำลังออกจากระบบ…</p>
  </div>
</template>

<script setup>
import { navigateTo } from '#app'

// เรียก API ล้างคุกกี้ แล้วพาไปหน้า login
await $fetch('/api/logout', { method: 'POST' })
navigateTo('/login')
</script>
