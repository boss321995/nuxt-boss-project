<template>
  <section class="p-6 bg-soft-gray min-h-screen">
    <h1 class="text-3xl font-bold text-deep-yellow mb-6">Dashboard</h1>

    <!-- สรุปสถิติ -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      <!-- ... your cards ... -->
    </div>

    <!-- ตารางสินค้า -->
    <h2 class="text-xl mb-4">รายการสินค้า</h2>
    <InventoryTable :data="materials" />

    <!-- Stock Entries -->
    <h2 class="text-xl mt-8 mb-4">Stock Entries</h2>
    <StockTable :data="stockEntries" />

    <!-- Requests -->
    <h2 class="text-xl mt-8 mb-4">Requests</h2>
    <RequestTable :data="requests" />
  </section>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import InventoryTable from '@/components/InventoryTable.vue'
import StockTable     from '@/components/StockTable.vue'
import RequestTable   from '@/components/RequestTable.vue'

const materials    = ref([])
const stockEntries = ref([])
const requests     = ref([])

onMounted(async () => {
  materials.value    = await $fetch('/api/materials')
  stockEntries.value = await $fetch('/api/stock-entries')
  requests.value     = await $fetch('/api/requests')
})
</script>
