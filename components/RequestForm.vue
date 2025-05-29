<!-- components/RequestForm.vue -->
<template>
  <form @submit.prevent="submit">
    <div class="mb-4">
      <label>ผู้ขอเบิก:</label>
      <select v-model="form.username" required>
        <option v-for="u in users" :key="u.username" :value="u.username">
          {{ u.username }} ({{ u.role }})
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label>ภารกิจ / เหตุผล:</label>
      <textarea v-model="form.missionDetail" required class="w-full"></textarea>
    </div>

    <div v-for="(line, i) in form.items" :key="i" class="mb-2 flex space-x-2">
      <select v-model="line.material_id" required>
        <option v-for="m in materials" :key="m.id" :value="m.id">
          {{ m.name }} (คงเหลือ {{ m.quantity }})
        </option>
      </select>
      <input
        type="number"
        v-model.number="line.quantity_requested"
        min="1"
        :max="getStock(line.material_id)"
        required
      />
      <button type="button" @click="removeLine(i)">✕</button>
    </div>
    <button type="button" @click="addLine" class="underline mb-4">+ เพิ่มไอเท็ม</button>

    <button type="submit" class="bg-blue-600 text-white px-4 py-2">ส่งคำขอ</button>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface User { username:string; role:string }
interface Material { id:string; name:string; quantity:number }

const users = ref<User[]>([])
const materials = ref<Material[]>([])
const form = ref({
  username: '',
  missionDetail: '',
  items: [{ material_id:'', quantity_requested:1 }]
})

// Fetch lists
onMounted(async () => {
  users.value = await $fetch<User[]>('/api/users', { credentials:'include' })
  materials.value = await $fetch<Material[]>('/api/materials', { credentials:'include' })
})

function addLine() {
  form.value.items.push({ material_id:'', quantity_requested:1 })
}
function removeLine(i: number) {
  form.value.items.splice(i,1)
}
function getStock(id: string) {
  return materials.value.find(m=>m.id===id)?.quantity||0
}

async function submit() {
  await $fetch('/api/requests/manual', {
    method: 'POST',
    body: form.value,
    credentials: 'include'
  })
  alert('ส่งคำขอเรียบร้อยแล้ว')
  // reset, or redirect…
}
</script>
