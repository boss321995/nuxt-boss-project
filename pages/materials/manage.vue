<template>
  <section class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-yellow-600 mb-6">จัดการวัสดุ</h1>

    <!-- ปุ่ม เพิ่มวัสดุ -->
    <div class="mb-4">
      <button
        @click="openAdd()"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        + เพิ่มวัสดุ
      </button>
    </div>

    <!-- ตาราง -->
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="w-full text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2">ID</th>
            <th class="px-4 py-2">ชื่อวัสดุ</th>
            <th class="px-4 py-2">จำนวน</th>
            <th class="px-4 py-2">หมวดหมู่</th>
            <th class="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in materials" :key="item.id" class="border-t">
            <td class="px-4 py-2">{{ item.id }}</td>
            <td class="px-4 py-2">{{ item.name }}</td>
            <td class="px-4 py-2">{{ item.quantity }}</td>
            <td class="px-4 py-2">{{ categoryMap[item.category] || item.category }}</td>
            <td class="px-4 py-2 space-x-2">
              <button
                @click="openEdit(item)"
                class="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
              >แก้ไข</button>
              <button
                @click="deleteItem(item)"
                class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >ลบ</button>
            </td>
          </tr>
          <tr v-if="!materials.length">
            <td colspan="5" class="px-4 py-2 text-center text-gray-500">
              ไม่มีวัสดุให้จัดการ
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- โมดัล เพิ่ม/แก้ไข -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ isEdit ? 'แก้ไขวัสดุ' : 'เพิ่มวัสดุ' }}
        </h2>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="block mb-1 font-medium">ชื่อวัสดุ</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-yellow-300"
            />
          </div>
          <div class="mb-3">
            <label class="block mb-1 font-medium">จำนวน</label>
            <input
              v-model.number="form.quantity"
              type="number"
              min="1"
              required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-yellow-300"
            />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">หมวดหมู่</label>
            <select
              v-model="form.category"
              required
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-yellow-300"
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              <option v-for="(label, key) in categoryMap" :key="key" :value="key">
                {{ label }}
              </option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button @click="closeModal" type="button"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              ยกเลิก
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {{ isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มวัสดุ' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

interface Material {
  id: string
  name: string
  quantity: number
  category: string
}

// State
const materials = ref<Material[]>([])
const showModal  = ref(false)
const isEdit     = ref(false)
const form       = reactive({ id: '', name: '', quantity: 1, category: '' })

// แผนที่ชื่อหมวดไทย
const categoryMap: Record<string,string> = {
  plumbing: 'ประปา',
  electrical: 'ไฟฟ้า',
  office_supplies: 'อุปกรณ์ออฟฟิศ',
  air: 'ปรับอากาศ'
}

// โหลดข้อมูลจาก API
async function loadMaterials() {
  materials.value = await $fetch<Material[]>('/api/materials/assigned', {
    credentials: 'include'
  })
}

// เปิดโมดัลเพิ่ม
function openAdd() {
  isEdit.value = false
  form.id = ''
  form.name = ''
  form.quantity = 1
  form.category = ''
  showModal.value = true
}

// เปิดโมดัลแก้ไข
function openEdit(item: Material) {
  isEdit.value = true
  form.id = item.id
  form.name = item.name
  form.quantity = item.quantity
  form.category = item.category
  showModal.value = true
}

// ปิดโมดัล
function closeModal() {
  showModal.value = false
}

// ส่งข้อมูลเพิ่มหรือแก้ไข
async function submitForm() {
  if (isEdit.value) {
    // แก้ไข
    await $fetch(`/api/materials/${form.id}`, {
      method: 'PUT',
      credentials: 'include',
      body: {
        name: form.name,
        quantity: form.quantity,
        category: form.category
      }
    })
  } else {
    // เพิ่ม
    await $fetch('/api/materials', {
      method: 'POST',
      credentials: 'include',
      body: {
        name: form.name,
        quantity: form.quantity,
        category: form.category
      }
    })
  }
  await loadMaterials()
  closeModal()
}

// ลบรายการ
async function deleteItem(item: Material) {
  if (!confirm(`ลบวัสดุ "${item.name}" จริงหรือเปล่า?`)) return
  await $fetch(`/api/materials/${item.id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  await loadMaterials()
}

onMounted(loadMaterials)
</script>
