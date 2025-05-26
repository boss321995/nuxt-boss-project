<template>
  <NuxtLink
    :to="href"
    class="flex items-center px-3 py-2 rounded hover:bg-gray-100"
    :class="{ 'bg-gray-200 font-semibold': isActive }"
  >
    <component :is="iconComponent" class="w-5 h-5 mr-2 text-gray-600" />
    <span>{{ text }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import * as Icons from 'lucide-vue-next'

// Props: icon name, displayed text, and link href
const props = defineProps<{
  icon: string
  text: string
  href: string
}>()

// Determine active route for styling
const route = useRoute()
const isActive = computed(() => route.path === props.href)

// Compute icon component from lucide-vue-next
const iconComponent = computed(() => {
  const key =
    props.icon.charAt(0).toUpperCase() + props.icon.slice(1) + 'Icon'
  return (Icons as any)[key] || Icons.PackageIcon
})
</script>
