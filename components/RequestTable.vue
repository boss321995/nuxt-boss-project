<template>
  <ClientOnly>
    <!-- v-if เช็ก mounted ด้วย จะช่วยเลี่ยง error -->
    <EasyDataTable
      v-if="isClient"
      :headers="columns"
      :items="data"
      :pagination-options="{ enabled: true, perPage: 10 }"
      :sort-options="{ enabled: true }"
      class="bg-white rounded shadow"
    />
  </ClientOnly>
</template>


<script setup lang="ts">
import { defineProps } from 'vue'

interface Material {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
}

const props = defineProps<{
  data: Material[]
}>()

// Mapping from English keys to Thai labels
const categoryMap: Record<string, string> = {
  plumbing: 'ประปา',
  electrical: 'ไฟฟ้า',
  office_supplies: 'อุปกรณ์ออฟฟิศ',
  air: 'ปรับอากาศ'
}
</script>
