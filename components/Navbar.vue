<template>
  <header class="flex items-center justify-between bg-mid-gray h-16 px-6 shadow">
    <!-- Logo / ชื่อระบบ -->
    <div class="flex items-center space-x-2">
      <img src="/NT_Logo.png" alt="Logo" class="h-8 w-auto" />
       <span class="text-xl font-bold text-mid-yellow">HRD</span>
    </div>
    <!-- ปุ่มด้านขวา หรือเมนูผู้ใช้ -->
    <div class="flex items-center space-x-4">
      
      <!-- User dropdown -->
      <div class="relative" @click="open = !open">
        <span class="cursor-pointer">{{ userName }}</span>
        <div
          v-if="open"
          class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg"
        >
          <a href="/profile" class="block px-4 py-2 hover:bg-gray-100">Profile</a>
          <a href="/logout"  class="block px-4 py-2 hover:bg-gray-100">Logout</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
// TODO: ดึงชื่อ user จาก state หรือ API
const userName = 'คุณณัฐนนท์ แก้วโรมา'
</script>
