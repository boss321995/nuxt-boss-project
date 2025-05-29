
<template>
  <aside class="w-64 bg-gray-50 border-r h-full flex flex-col">
    <nav class="flex-1 px-2 py-4 space-y-1">
      <SidebarLink icon="Home" text="Home" href="/" />
      <SidebarLink icon="User" text="รายงานจำนวนวัสดุ" href="/materials/manage" />

      <!-- ลิงก์ขอเบิกวัสดุ (Admin/Supervisor เท่านั้น) -->
     <SidebarLink
  v-if="currentUser && ['admin','supervisor'].includes(currentUser.role)"
  icon="clipboard"
  text="เบิกวัสดุโดยผู้รับผิดชอบ"
  href="/requests/manual"
/>

      <SidebarLink icon="PlusSquare" text="รายงานวัสดุต่ำกว่าจุดสั่งซื้อ" href="/enroll" />
      <SidebarLink icon="Package" text="Inventory" href="/inventory" />

      <SidebarLink icon="LogOut" text="ออกจากระบบ" href="/logout" />
    </nav>
  </aside>
</template>

<script setup lang="ts">
import SidebarLink from './SidebarLink.vue'
import { useState } from '#imports'
interface User { username: string; role: string }
const currentUser = useState<User|null>('currentUser', () => null)
onMounted(() => {
  console.log('💡 sidebar sees currentUser =', currentUser.value)
})
</script>
