<template>
  <div class="space-y-4">
    <!-- Search + Summary -->
    <div class="flex justify-between items-center">
      <input
        v-model="search"
        type="text"
        placeholder="ค้นหาวัสดุ..."
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
            <th class="px-4 py-2 cursor-pointer" @click="sortBy('id')">
              ID <span v-if="sortKey==='id'">{{ sortDesc ? '▼' : '▲' }}</span>
            </th>
            <th class="px-4 py-2 cursor-pointer" @click="sortBy('name')">
              ชื่อวัสดุ <span v-if="sortKey==='name'">{{ sortDesc ? '▼' : '▲' }}</span>
            </th>
            <th class="px-4 py-2 cursor-pointer" @click="sortBy('quantity')">
              จำนวน <span v-if="sortKey==='quantity'">{{ sortDesc ? '▼' : '▲' }}</span>
            </th>
            <th class="px-4 py-2 cursor-pointer" @click="sortBy('category')">
              หมวดหมู่ <span v-if="sortKey==='category'">{{ sortDesc ? '▼' : '▲' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pageData" :key="item.id" class="border-t">
            <td class="px-4 py-2">{{ item.id }}</td>
            <td class="px-4 py-2">{{ item.name }}</td>
            <td class="px-4 py-2">{{ item.quantity }}</td>
            <td class="px-4 py-2">{{ categoryMap[item.category] || item.category }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center">
      <button
        @click="prevPage"
        :disabled="page === 1"
        class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
      >Prev</button>
      <span class="text-sm text-gray-700">หน้า {{ page }} / {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="page === totalPages"
        class="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
      >Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Material {
  id: string
  name: string
  quantity: number
  category: string
}

// รับ prop ชื่อ data
const props = defineProps<{ data: Material[] }>()

// State
const search = ref('')
const page = ref(1)
const perPage = ref(10)
const sortKey = ref<'id'|'name'|'quantity'|'category'>('id')
const sortDesc = ref(false)

// แผนที่ชื่อหมวดไทย
const categoryMap: Record<string,string> = {
  plumbing: 'ประปา',
  electrical: 'ไฟฟ้า',
  office_supplies: 'อุปกรณ์ออฟฟิศ',
  air: 'ปรับอากาศ'
}

// 1. filter
const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return props.data.filter(i =>
    i.id.toLowerCase().includes(q) ||
    i.name.toLowerCase().includes(q)
  )
})

// 2. sort
const sorted = computed(() =>
  [...filtered.value].sort((a,b) => {
    const aV = String(a[sortKey.value]).toLowerCase()
    const bV = String(b[sortKey.value]).toLowerCase()
    if (aV < bV) return sortDesc.value ? 1 : -1
    if (aV > bV) return sortDesc.value ? -1 :  1
    return 0
  })
)

// 3. paginate
const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / perPage.value)))
const startItem  = computed(() => sorted.value.length ? (page.value-1)*perPage.value + 1 : 0)
const endItem    = computed(() => Math.min(page.value*perPage.value, sorted.value.length))
const pageData   = computed(() => 
  sorted.value.slice((page.value-1)*perPage.value, page.value*perPage.value)
)

// controls
function prevPage() { if (page.value>1) page.value-- }
function nextPage() { if (page.value<totalPages.value) page.value++ }

// sorting handler
function sortBy(key: typeof sortKey.value) {
  if (sortKey.value === key) sortDesc.value = !sortDesc.value
  else {
    sortKey.value = key
    sortDesc.value = false
  }
}
</script>
