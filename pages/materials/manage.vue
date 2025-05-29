<template>
  <section class="p-6 bg-gray-50">
    <h1 class="text-2xl font-bold mb-4">เบิกวัสดุโดยผู้รับผิดชอบ</h1>

    <!-- เลือกผู้ขอเบิก -->
    <div class="mb-4">
      <label class="block mb-1">ผู้ขอเบิก (รหัสพนักงาน)</label>
      <input
        v-model="employeeCode"
        list="hrnt-list"
        placeholder="พิมพ์รหัสพนักงาน…"
        class="w-64 border rounded px-2 py-1"
      />
      <datalist id="hrnt-list">
        <option v-for="e in filteredEmployees" :key="e.id" :value="e.id">
          {{ e.name }}
        </option>
      </datalist>
      <p v-if="selectedEmployeeName" class="mt-1 text-sm text-gray-600">
        ชื่อ: {{ selectedEmployeeName }}
      </p>
    </div>

    <!-- รายการวัสดุหลายรายการ -->
    <div v-for="(line, i) in lines" :key="i" class="flex items-center space-x-2 mb-2">
      <input
        v-model="line.materialCode"
        list="materials-list"
        placeholder="พิมพ์ชื่อหรือรหัสวัสดุ…"
        class="border rounded px-2 py-1 flex-1"
      />
      <datalist id="materials-list">
        <option v-for="m in filteredMaterials(line.materialCode)" :key="m.id" :value="m.id">
          {{ m.name }}
        </option>
      </datalist>
      <span class="w-32">{{ getMaterialName(line.materialCode) }}</span>
      <input
        type="number"
        v-model.number="line.qty"
        :min="1"
        :max="getMaterialStock(line.materialCode)"
        class="w-20 border rounded px-2 py-1"
      />
      <span class="text-sm text-gray-500">/ {{ getMaterialStock(line.materialCode) }}</span>
      <button @click="removeLine(i)" class="text-red-500">✕</button>
    </div>
    <button @click="addLine" class="text-blue-600 mb-4">+ เพิ่มรายการวัสดุ</button>

    <!-- ภารกิจ / เหตุผล -->
    <div class="mb-4">
      <label class="block mb-1">ภารกิจ / เหตุผล</label>
      <textarea v-model="mission" class="w-full border rounded px-2 py-1" rows="3" />
    </div>

    <button @click="submitRequest" class="px-4 py-2 bg-blue-600 text-white rounded">
      ส่งคำขอ
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Material { id: string; name: string; quantity: number }
interface Employee { id: string; name: string }
interface RequestLine { materialCode: string; qty: number }

const materials    = ref<Material[]>([])
const employees    = ref<Employee[]>([])
const employeeCode = ref('')
const mission      = ref('')

const lines = ref<RequestLine[]>([
  { materialCode: '', qty: 1 }
])

// Load materials & employees
onMounted(async () => {
  materials.value = await $fetch<Material[]>('/api/materials/assigned', {
    credentials: 'include'
  })
  employees.value = await $fetch<Employee[]>('/api/employees', {
    credentials: 'include'
  })
})

// Employee dropdown/filter
const filteredEmployees = computed(() => {
  const q = employeeCode.value.toLowerCase()
  return employees.value.filter(e =>
    e.id.includes(q) || e.name.toLowerCase().includes(q)
  )
})
const selectedEmployeeName = computed(() =>
  employees.value.find(e => e.id === employeeCode.value)?.name || ''
)

// Material dropdown/filter
function filteredMaterials(query: string) {
  const q = query.toLowerCase()
  return materials.value.filter(m =>
    m.id.includes(q) || m.name.toLowerCase().includes(q)
  )
}
function getMaterialName(code: string) {
  return materials.value.find(m => m.id === code)?.name || ''
}
function getMaterialStock(code: string) {
  return materials.value.find(m => m.id === code)?.quantity || 0
}

// CRUD lines
function addLine() {
  lines.value.push({ materialCode: '', qty: 1 })
}
function removeLine(i: number) {
  lines.value.splice(i, 1)
}

// Submit request
async function submitRequest() {
  if (!employeeCode.value) {
    return alert('กรุณาระบุรหัสพนักงาน')
  }
  for (const line of lines.value) {
    if (!line.materialCode) {
      return alert('กรุณาเลือกวัสดุให้ครบทุกแถว')
    }
    if (line.qty < 1 || line.qty > getMaterialStock(line.materialCode)) {
      return alert(`จำนวนต้องเป็น 1–${getMaterialStock(line.materialCode)}`)
    }
  }

  try {
    await $fetch('/api/requests', {
      method: 'POST',
      credentials: 'include',
      body: {
        username: employeeCode.value,
        missionDetail: mission.value,
        items: lines.value.map(l => ({
          material_id:       l.materialCode,
          quantity_requested: l.qty
        }))
      }
    })
    alert('ส่งคำขอเรียบร้อย')
    lines.value   = [{ materialCode: '', qty: 1 }]
    mission.value = ''
    employeeCode.value = ''
  } catch (e: any) {
    alert('เกิดข้อผิดพลาด: ' + (e.data?.message || e.message))
  }
}
</script>
