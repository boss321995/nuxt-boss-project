<template>
  <aside class="w-64 bg-gray-50 border-r h-full flex flex-col">
    <nav class="flex-1 px-2 py-4 space-y-1">
      <SidebarLink icon="home"   text="Home"        href="/" />
      <SidebarLink icon="user"   text="รายงานจำนวนวัสดุ" href="/materials/manage" />
      <SidebarLink icon="bar-chart" text="รายงานการเบิกวัสดุ" href="/reports" />
      <SidebarLink icon="plus-square" text="รายงานวัสดุต่ำกว่าจุดสั่งซื้อ" href="/enroll" />
      <!-- ... เพิ่มลิงก์ตามเมนูของคุณ ... -->
      <SidebarLink icon="package" text="Inventory" href="/inventory" />
    </nav>
  </aside>
</template>

<script setup>
import SidebarLink from './SidebarLink.vue'
</script>
