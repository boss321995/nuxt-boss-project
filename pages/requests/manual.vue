<template>
  <section class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">เบิกวัสดุโดยผู้รับผิดชอบ</h1>

    <!-- 1) Employee Combobox -->
    <div class="mb-6">
    <Combobox
  v-model="employeeCode"
  as="div"
  :displayValue="empDisplay"

>
        <template #default>
          <div class="relative">
           <ComboboxInput
      :value="employeeQuery"
      class="w-full border rounded px-2 py-1"
      placeholder="พิมพ์รหัสหรือชื่อ…"
      @input="onEmpQuery"
      @blur="onEmpBlur"
    />
            <ComboboxButton class="absolute inset-y-0 right-0 px-2 flex items-center">
              <ChevronUpDownIcon class="w-5 h-5 text-gray-400" />
            </ComboboxButton>

            <ComboboxOptions
              class="absolute mt-1 w-72 bg-white border rounded shadow max-h-60 overflow-auto z-10"
            >
              <ComboboxOption
                v-for="e in filteredEmployees"
                :key="e.id"
                :value="e.id"
                class="px-2 py-1 cursor-pointer hover:bg-gray-100"
                :class="{ 'bg-indigo-100': e.id === employeeCode }"
              >
                {{ e.id }} – {{ e.name }}
              </ComboboxOption>
              <div v-if="filteredEmployees.length === 0" class="px-2 py-1 text-gray-500">
                ไม่พบพนักงาน
              </div>
            </ComboboxOptions>
          </div>
        </template>
      </Combobox>

      <p v-if="selectedEmployeeName" class="mt-1 text-sm text-gray-600">
        ชื่อพนักงาน: {{ selectedEmployeeName }}
      </p>
    </div>

    <!-- 2) Material Combobox (multi-line) -->
    <div
      v-for="(line, i) in lines"
      :key="i"
      class="flex items-start space-x-4 mb-4"
    >
      <div class="w-1/2">
        <label class="block mb-1 font-medium">วัสดุ #{{ i+1 }}</label>
     <Combobox
  v-model="line.materialCode"
  as="div"
  :displayValue="matDisplay"
  @change="val => onMaterialSelect(i, val)"
>
  <template #default>
    <div class="relative">
      <ComboboxInput
        class="w-full border rounded px-2 py-1"
        placeholder="พิมพ์รหัสหรือชื่อวัสดุ…"
        @input="e => onMaterialQuery(i, e)"
      />
      <ComboboxButton class="absolute inset-y-0 right-0 px-2 flex items-center">
        <ChevronUpDownIcon class="w-5 h-5 text-gray-400" />
      </ComboboxButton>
      <ComboboxOptions class="absolute mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto z-10">
        <ComboboxOption
          v-for="m in line.filtered"
          :key="m.id"
          :value="m.id"
          class="px-2 py-1 cursor-pointer hover:bg-gray-100 flex justify-between"
          :class="{ 'bg-indigo-100': m.id === line.materialCode }"
        >
          <span>{{ m.id }} – {{ m.name }}</span>
          <span class="text-sm text-gray-500">[{{ m.quantity }}]</span>
        </ComboboxOption>
        <div v-if="line.filtered.length === 0" class="px-2 py-1 text-gray-500">ไม่พบวัสดุ</div>
      </ComboboxOptions>
    </div>
  </template>
</Combobox>
<p v-if="line.selected" class="mt-1 text-sm text-gray-600">
  ชื่อ: {{ line.selected.name }} | สต็อกคงเหลือ: {{ line.selected.quantity }}
</p>
      </div>

      <!-- จำนวน -->
      <div class="w-1/6">
        <label class="block mb-1 font-medium">จำนวน</label>
      <input
  type="number"
  v-model.number="line.qty"
  :min="1"
  :max="line.selected?.quantity ?? 1"
  class="w-full border rounded px-2 py-1"
  @input="() => validateQty(i)"
/>
      </div>

      <button @click="removeLine(i)" class="pt-6 text-red-500">✕</button>
    </div>

    <button
      @click="addLine"
      class="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      + เพิ่มรายการวัสดุ
    </button>

    <!-- เหตุผล -->
    <div class="mb-6">
      <label class="block mb-1 font-medium">ภารกิจ / เหตุผล</label>
      <textarea
        v-model="mission"
        rows="3"
        class="w-full border rounded px-2 py-1"
      ></textarea>
    </div>

    <button
      @click="submitRequest"
      class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      ส่งคำขอเบิก
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption
} from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/24/outline'

interface Employee { id: string; name: string }
interface Material { id: string; name: string; quantity: number }
interface Line {
  materialCode: string
  query: string
  filtered: Material[]
  selected: Material | null
  qty: number
}

function validateQty(i: number) {
  const line = lines[i]
  if (line.selected && line.qty > line.selected.quantity) {
    line.qty = line.selected.quantity
  } else if (line.qty < 1) {
    line.qty = 1
  }
}

// state
const employees     = ref<Employee[]>([])
const materials     = ref<Material[]>([])
const employeeCode  = ref('')
const employeeQuery = ref('')
const mission       = ref('')
watch(employeeCode, (val) => {
  if (typeof val === "string") {
    employeeQuery.value = empDisplay(val)
  } else {
    employeeQuery.value = ""
  }
})
const lines         = reactive<Line[]>([
  { materialCode: '', query: '', filtered: [], selected: null, qty: 1 }
])

onMounted(async () => {
  employees.value = await $fetch<Employee[]>('/api/hrnt', { credentials: 'include' })
  materials.value = await $fetch<Material[]>('/api/materials/assigned')
  console.log('วัสดุที่โหลดได้:', materials.value)
  lines.forEach(l => (l.filtered = materials.value))
   //console.log('filtered:', lines[0]?.filtered)
})

// helpers for Combobox
const filteredEmployees = computed(() => {
  const q = typeof employeeQuery.value === "string" ? employeeQuery.value.toLowerCase() : ""
  return employees.value.filter(e =>
    e.id.includes(q) || e.name.toLowerCase().includes(q)
  )
})
const selectedEmployeeName = computed(() =>
  employees.value.find(e => e.id === employeeCode.value)?.name || ''
)

// displayValue for ComboboxInput

function onEmpSelect(val: string) {
  console.log("onEmpSelect", val, typeof val)
  if (typeof val === "string") {
    employeeCode.value = val
    employeeQuery.value = empDisplay(val)
  } else {
    // ป้องกันกรณีผิด
    employeeCode.value = ""
    employeeQuery.value = ""
  }
}
function onEmpBlur() {
  // ให้โชว์รหัส+ชื่อเต็ม เมื่อ blur (เลือกเสร็จ)
  employeeQuery.value = empDisplay(employeeCode.value)
}
const empDisplay = (val: string) => {
  const e = employees.value.find(x => x.id === val)
  return e ? `${e.id} – ${e.name}` : val
}

// material helpers
function onMaterialQuery(i: number, e: Event) {
   const l = lines[i]
  const value = (e.target as HTMLInputElement).value
  l.filtered = materials.value.filter(m =>
    m.id.includes(value) || m.name.toLowerCase().includes(value.toLowerCase())
  )
    // debug!
  //console.log('กรองแล้ว:', l.filtered)
}


function onEmpQuery(event: Event) {
    const val = (event.target as HTMLInputElement).value
  employeeQuery.value = val  // ตรงนี้คือค่าที่ผู้ใช้พิมพ์ เช่น "262"
}
// เวลาเลือกวัสดุจาก dropdown
function onMaterialSelect(i, val) {
  const l = lines[i]
  l.materialCode = val
  l.selected = materials.value.find(m => m.id === val) || null
  if (l.selected && l.qty > l.selected.quantity) {
    l.qty = l.selected.quantity
  }
}
const matDisplay = (val) => {
   if (!val) return ''
  const m = materials.value.find(x => x.id === val)
  return m ? `${m.id} – ${m.name}` : val   // <<< ชื่อ field คือ name

}
// เวลา blur (focus ไปจุดอื่น) ให้โชว์ชื่อวัสดุเสมอ
function onMaterialBlur(i: number) {
  //const l = lines[i]
  //l.query = matDisplay(l.materialCode)
}


// add/remove lines
function addLine() {
    const newLine = {
    materialCode: '',
    query: '',
    filtered: materials.value, // <--- ใส่ตรงนี้เลย!
    selected: null,
    qty: 1
  }
  lines.push(newLine)
  //setupLineWatch(newLine)
}
function removeLine(i: number) {
  lines.splice(i, 1)
}

// submit...
async function submitRequest() {
  if (!employeeCode.value)                  return alert('กรุณาเลือกผู้ขอเบิก')
  if (!lines.every(l => l.selected))        return alert('กรุณาเลือกวัสดุทุกแถว')
  if (!mission.value.trim())                return alert('กรุณาระบุภารกิจ/เหตุผล')

  const items = lines.map(l => ({
    material_id:        l.selected!.id,
    quantity_requested: l.qty
  }))

  try {
    await $fetch('/api/requests', {
      method: 'POST',
      credentials: 'include',
      body: {
        username:      employeeCode.value,
        missionDetail: mission.value,
        items
      }
    })
    alert('ส่งคำขอสำเร็จ')
    // reset
    employeeCode.value = ''
    employeeQuery.value = ''
    mission.value       = ''
    lines.splice(0); addLine()
  } catch (e: any) {
    alert('ไม่สำเร็จ: ' + (e.data?.message || e.message))
  }
}

</script>
