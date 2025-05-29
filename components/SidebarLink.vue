<!-- components/SidebarLink.vue -->
<template>
  <NuxtLink
    :to="href"
    class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-200 rounded"
  >
    <!-- use whatever icon system you like -->
    <component :is="`icon-${icon}`" class="w-5 h-5" />
    <span>{{ text }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{
  icon: string
  text: string
  href: string
}>()
</script>
