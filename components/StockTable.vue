<template>
  <div class="space-y-2">
    <!-- Search + Info -->
    <div class="flex justify-between items-center">
      <input
        v-model="search"
        type="text"
        placeholder="ค้นหา Stock Entry..."
        class="border rounded px-3 py-1 w-1/3 focus:outline-none focus:ring focus:border-yellow-300"
      />
      <p class="text-sm text-gray-600">
        แสดง {{ startItem }}–{{ endItem }} จาก {{ filtered.length }} รายการ
      </p>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="w-full text-left">
        <thead class="bg-gray-100">
          <tr>
            <th @click="sortBy('id')" class="px-4 py-2 cursor-pointer">
              ID <span v-if="sortKey==='id'">{{ sortDesc?'▼':'▲' }}</span>
            </th>
            <th @click="sortBy('purchaseId')" class="px-4 py-2 cursor-pointer">
              BuyID <span v-if="sortKey==='purchaseId'">{{ sortDesc?'▼':'▲' }}</span>
            </th>
            <th class="px-4 py-2">Material ID</th>
            <th @click="sortBy('quantity')" class="px-4 py-2 cursor-pointer">
              Quantity <span v-if="sortKey==='quantity'">{{ sortDesc?'▼':'▲' }}</span>
            </th>
            <th class="px-4 py-2">Price/Unit</th>
            <th @click="sortBy('date')" class="px-4 py-2 cursor-pointer">
              Date <span v-if="sortKey==='date'">{{ sortDesc?'▼':'▲' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in pageData" :key="e.id" class="border-t">
            <td class="px-4 py-2">{{ e.id }}</td>
            <td class="px-4 py-2">{{ e.purchaseId }}</td>
            <td class="px-4 py-2">{{ e.materialId }}</td>
            <td class="px-4 py-2">{{ e.quantity }}</td>
            <td class="px-4 py-2">{{ e.pricePerUnit }}</td>
            <td class="px-4 py-2">{{ e.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-2">
      <button @click="prevPage" :disabled="page===1" class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">
        Prev
      </button>
      <span class="text-sm text-gray-700">หน้า {{ page }} จาก {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page===totalPages" class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface StockEntry {
  id: number
  purchaseId: number
  materialId: string
  quantity: number
  pricePerUnit: number
  date: string
}

const props = defineProps<{ data: StockEntry[] }>()

// state
const search   = ref('')
const page     = ref(1)
const perPage  = ref(5)
const sortKey  = ref<'id'|'purchaseId'|'quantity'|'date'>('date')
const sortDesc = ref(true)

// filter
const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return props.data.filter(e =>
    String(e.id).includes(q) ||
    String(e.purchaseId).includes(q) ||
    e.materialId.toLowerCase().includes(q)
  )
})

// sort
const sorted = computed(() => {
  return [...filtered.value].sort((a,b) => {
    const aVal = String(a[sortKey.value]).toLowerCase()
    const bVal = String(b[sortKey.value]).toLowerCase()
    if (aVal < bVal) return sortDesc.value ? 1 : -1
    if (aVal > bVal) return sortDesc.value ? -1:  1
    return 0
  })
})

// paginate
const totalPages = computed(() =>
  Math.ceil(sorted.value.length / perPage.value) || 1
)
const startItem = computed(() =>
  sorted.value.length ? (page.value-1)*perPage.value + 1 : 0
)
const endItem = computed(() =>
  Math.min(page.value*perPage.value, sorted.value.length)
)
const pageData = computed(() =>
  sorted.value.slice((page.value-1)*perPage.value, page.value*perPage.value)
)

function prevPage() { if (page.value>1) page.value-- }
function nextPage() { if (page.value<totalPages.value) page.value++ }

function sortBy(k: typeof sortKey.value) {
  if (sortKey.value===k) sortDesc.value = !sortDesc.value
  else { sortKey.value = k; sortDesc.value = false }
}
</script>
