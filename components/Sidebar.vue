<template>
  <aside class="w-64 bg-gray-50 border-r h-full flex flex-col">
    <nav class="flex-1 px-2 py-4 space-y-1">
      <SidebarLink icon="home"   text="Home"        href="/" />
      <SidebarLink icon="user"   text="ประวัติส่วนตัว" href="/profile" />
      <SidebarLink icon="bar-chart" text="รายงานด้าน HRD" href="/reports" />
      <SidebarLink icon="plus-square" text="ส่งชื่อ/สมัครอบรม" href="/enroll" />
      <!-- ... เพิ่มลิงก์ตามเมนูของคุณ ... -->
      <SidebarLink icon="package" text="Inventory" href="/inventory" />
    </nav>
  </aside>
</template>

<script setup>
import SidebarLink from './SidebarLink.vue'
</script>
