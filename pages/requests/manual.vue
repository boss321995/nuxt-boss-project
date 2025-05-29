<template>
  <section class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">เบิกวัสดุโดยผู้รับผิดชอบ</h1>

    <!-- Combobox เลือกพนักงาน -->
  <Combobox as="div" v-model="employeeCode" class="relative">
  <div class="relative">
    <ComboboxInput
      class="w-64 border rounded px-2 py-1"
      placeholder="พิมพ์รหัสหรือชื่อ…"
      @input="onEmpQuery"
    />
    <ComboboxButton class="absolute inset-y-0 right-0 px-2 flex items-center">
      <ChevronUpDownIcon class="w-5 h-5 text-gray-400" />
    </ComboboxButton>
    <ComboboxOptions as="div" class="absolute mt-1 w-64 bg-white border rounded shadow max-h-60 overflow-auto z-10">
      <ComboboxOption
        v-for="e in filteredEmployees"
        :key="e.id"
        :value="e.id"
        as="div"
        class="px-2 py-1 cursor-pointer hover:bg-gray-100"
        :class="{ 'bg-indigo-100': e.id === employeeCode }"
      >
        <span class="font-medium">{{ e.id }}</span>
        <span class="ml-2 text-gray-600">{{ e.name }}</span>
      </ComboboxOption>
      <ComboboxOption
        v-if="filteredEmployees.length === 0"
        as="div"
        disabled
        class="px-2 py-1 text-gray-500"
      >
        ไม่พบพนักงาน
      </ComboboxOption>
    </ComboboxOptions>
  </div>
</Combobox><p v-if="selectedEmployee">
  ชื่อพนักงาน: {{ selectedEmployee.name }}
</p>


  <!-- รายการวัสดุหลายรายการ -->
<div v-for="(line, i) in lines" :key="i" class="flex items-center space-x-2 mb-4">
  <div class="w-1/2">
    <label class="block mb-1 font-medium">วัสดุ #{{ i+1 }}</label>
    <Combobox v-model="line.materialCode" class="relative">
      <div class="relative">
        <ComboboxInput
          class="w-full border rounded px-2 py-1"
          placeholder="พิมพ์รหัสหรือชื่อวัสดุ…"
          @input="onMaterialQuery(i)"
        />
        <ComboboxButton class="absolute inset-y-0 right-0 px-2 flex items-center">
          <ChevronUpDownIcon class="w-5 h-5 text-gray-400" />
        </ComboboxButton>
        <ComboboxOptions as="div" class="absolute mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto z-10">
          <ComboboxOption
            v-for="m in line.filtered"
            :key="m.id"
            :value="m.id"
            as="div"
            class="px-2 py-1 cursor-pointer hover:bg-gray-100"
            :class="{ 'bg-indigo-100': m.id === line.materialCode }"
          >
            <span class="font-medium">{{ m.id }}</span>
            <span class="ml-2">{{ m.name }}</span>
            <span class="ml-auto text-sm text-gray-500">[{{ m.quantity }}]</span>
          </ComboboxOption>
          <ComboboxOption
            v-if="line.filtered.length === 0"
            as="div"
            disabled
            class="px-2 py-1 text-gray-500"
          >
            ไม่พบวัสดุ
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
  <p v-if="line.selected" class="mt-1 text-sm text-gray-600">
  วัสดุ: {{ line.selected.name }}<br>
  สต็อกคงเหลือ: {{ line.selected.quantity }}
</p>
  </div>
  <!-- ... -->



  <!-- จำนวน -->
  <div class="w-1/6">
    <label class="block mb-1 font-medium">จำนวน</label>
   <input
  type="number"
  v-model.number="line.qty"
  :min="1"
  :max="line.selected?.quantity ?? 1"
  class="w-full border rounded px-2 py-1"
  :disabled="!line.selected"
>
<!-- หากเกินให้เตือน -->
<p v-if="line.selected && line.qty > line.selected.quantity" class="text-red-500 text-xs">
  จำนวนที่ขอเกินสต็อก!
</p>
  </div>

  <!-- ลบแถว -->
  <div class="pt-6">
    <button @click="removeLine(i)" class="text-red-500">✕</button>
  </div>
</div>

    <button @click="addLine" class="mb-6 px-3 py-1 bg-green-500 text-white rounded">
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
import {
  ref,
  reactive,
  computed,
  onMounted
} from 'vue'
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
  filtered: Material[]
  selected: Material | null
  qty: number
}

// State
const employees = ref<Employee[]>([])
const materials = ref<Material[]>([])
const employeeCode = ref('')
const mission = ref('')
const lines = reactive<Line[]>([
  { materialCode: '', filtered: [], selected: null, qty: 1 }
])
const selectedEmployee = computed(() => {
  return employees.value.find(e => e.id === employeeCode.value) || null
})
// Load data
onMounted(async () => {
  employees.value = await $fetch<Employee[]>('/api/hrnt', { credentials: 'include' })
  materials.value = await $fetch<Material[]>('/api/materials/assigned', { credentials: 'include' })
  // init filtered for first line
  lines.forEach(l => (l.filtered = materials.value))
})

// Employee combobox
const filteredEmployees = computed(() => {
  const q = employeeCode.value.toLowerCase()
  const matched = employees.value.find(e => e.id === employeeCode.value)
  if (matched) return [matched]
  if (!q) return employees.value
  return employees.value.filter(e =>
    e.id.includes(q) || e.name.toLowerCase().includes(q)
  )
})
const selectedEmployeeName = computed(() => {
  const e = employees.value.find(e => e.id === employeeCode.value)
  return e?.name || ''
})
function onEmpQuery() {
  // computed will refresh
}

// Material combobox per line
function onMaterialQuery(idx: number) {
  const line = lines[idx];
  if (!line) return; // <--- สำคัญมาก

  const q = line.materialCode ? line.materialCode.toLowerCase() : '';
  line.filtered = materials.value.filter(
    (m) =>
      m.id.includes(q) ||
      m.name.toLowerCase().includes(q)
  );
  const sel = materials.value.find((m) => m.id === line.materialCode);
  line.selected = sel || null;
  if (line.selected && line.qty > line.selected.quantity) {
    line.qty = line.selected.quantity;
  }
}
// Add / Remove lines
function addLine() {
  lines.push({
    materialCode: '',
    filtered: materials.value,
    selected: null,
    qty: 1
  })
}
function removeLine(i: number) {
  lines.splice(i, 1)
}

// Submit
async function submitRequest() {
  if (!employeeCode.value || !selectedEmployeeName.value) {
    return alert('กรุณาเลือกผู้ขอเบิก')
  }
  for (const l of lines) {
    if (!l.selected) {
      return alert('กรุณาเลือกวัสดุทุกแถว')
    }
    if (l.qty < 1 || l.qty > l.selected.quantity) {
      return alert(
        `จำนวน ${l.selected.name} ต้องอยู่ระหว่าง 1–${l.selected.quantity}`
      )
    }
  }
  if (!mission.value.trim()) {
    return alert('กรุณาระบุภารกิจ/เหตุผล')
  }

  const items = lines.map(l => ({
    material_id: l.selected!.id,
    quantity_requested: l.qty
  }))

  try {
    await $fetch('/api/requests', {
      method: 'POST',
      credentials: 'include',
      body: {
        username: employeeCode.value,
        missionDetail: mission.value,
        items
      }
    })
    alert('ส่งคำขอสำเร็จ')
    // reset
    employeeCode.value = ''
    mission.value = ''
    lines.splice(0)
    addLine()
  } catch (e: any) {
    alert('ไม่สามารถส่งคำขอได้: ' + (e.data?.message || e.message))
  }
}

</script>
