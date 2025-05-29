<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
      <div class="bg-green-600 px-8 py-6">
        <h2 class="text-white text-3xl font-bold text-center">สมัครสมาชิก</h2>
      </div>
      <form @submit.prevent="onSubmit" class="px-8 py-6 space-y-5">
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            ชื่อผู้ใช้
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="กรอกชื่อผู้ใช้"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div class="relative">
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            รหัสผ่าน
          </label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            <component
              :is="showPassword ? EyeOffIcon : EyeIcon"
              class="w-5 h-5"
            />
          </button>
        </div>
        <div class="relative">
          <label
            for="confirm"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            ยืนยันรหัสผ่าน
          </label>
          <input
            :type="showConfirm ? 'text' : 'password'"
            id="confirm"
            v-model="confirm"
            placeholder="••••••••"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
          />
          <button
            type="button"
            @click="toggleConfirm"
            class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            <component
              :is="showConfirm ? EyeOffIcon : EyeIcon"
              class="w-5 h-5"
            />
          </button>
        </div>
        <button
          type="submit"
          class="w-full py-2 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition"
        >
          สมัครสมาชิก
        </button>
        <p v-if="error" class="text-red-500 text-center text-sm">
          {{ error }}
        </p>
      </form>
      <div class="px-8 py-4 bg-gray-50 text-center text-sm">
        มีบัญชีแล้ว?
        <NuxtLink to="/login" class="text-green-600 hover:underline">
          เข้าสู่ระบบ
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})
import { ref } from "vue";
import { navigateTo } from "#app";
import { EyeIcon, EyeOffIcon } from "lucide-vue-next";

const username = ref("");
const password = ref("");
const confirm = ref("");
const error = ref<string | null>(null);

const showPassword = ref(false);
const showConfirm = ref(false);
function togglePassword() {
  showPassword.value = !showPassword.value;
}
function toggleConfirm() {
  showConfirm.value = !showConfirm.value;
}

async function onSubmit() {
  error.value = null;
  if (password.value !== confirm.value) {
    error.value = "รหัสผ่านไม่ตรงกัน";
    return;
  }
  try {
    await $fetch("/api/register", {
      method: "POST",
      body: { username: username.value, password: password.value },
    });
    navigateTo("/login");
  } catch (e: any) {
    error.value = e.data?.message || e.message || "เกิดข้อผิดพลาด";
  }
}
</script>
