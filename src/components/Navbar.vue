<script setup>
import { useAuthStore } from '@/stores/auth'

defineProps({
  title: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'admin',
  },
})

defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
    <div v-if="variant === 'public'" class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-3" aria-label="Go to dashboard">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-admin-brand text-sm font-black text-white">
          VA
        </span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-bold text-gray-900">{{ title }}</span>
          <span class="block text-xs font-medium text-gray-500">Dashboard</span>
        </span>
      </RouterLink>

      <nav class="flex items-center gap-2">
        <RouterLink to="/" class="btn-secondary px-3 py-2">Dashboard</RouterLink>
      </nav>
    </div>

    <div v-else class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div class="flex min-w-0 items-center gap-3">
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm lg:hidden"
          aria-label="Open sidebar"
          @click="$emit('toggle-sidebar')"
        >
          Menu
        </button>

        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wide text-admin-muted">Admin Dashboard</p>
          <h1 class="truncate text-xl font-bold text-admin-ink sm:text-2xl">{{ title }}</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="hidden min-w-64 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 md:flex">
          Search videos, users, categories
        </div>

        <div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-admin-brand text-xs font-bold text-white">
            {{ authStore.user.name.slice(0, 2).toUpperCase() }}
          </span>
          <span class="hidden text-right sm:block">
            <span class="block text-sm font-semibold text-gray-900">{{ authStore.user.name }}</span>
            <span class="block text-xs text-gray-500">{{ authStore.user.email }}</span>
          </span>
        </div>
      </div>
    </div>
  </header>
</template>
