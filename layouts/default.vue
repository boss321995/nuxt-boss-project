<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Content area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navbar -->
      <Navbar />

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-6">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue'
import Sidebar from '~/components/Sidebar.vue'
</script>
