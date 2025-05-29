<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      <main class="flex-1 overflow-auto p-6">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar      from '~/components/Sidebar.vue'
import Navbar       from '~/components/Navbar.vue'
import { useState } from '#imports'

interface User { username: string; role: string }
const currentUser = useState<User|null>('currentUser', () => null)
</script>
