<!-- pages/logout.vue -->
<template><div>กำลังออกจากระบบ…</div></template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
  await $fetch('/api/logout', { method: 'POST' })
  router.replace('/login')
})
</script>