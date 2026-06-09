<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const router = useRouter()
const isSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)
const savedTheme = localStorage.getItem('teenth-theme')
const theme = ref(savedTheme || 'light')

const pageTitles = {
  dashboard: 'Dashboard Admin',
  category: 'Category',
  upload: 'Upload Video',
  list: 'Video List',
  user: 'User',
  userPermission: 'Permission',
  permission: 'Permission',
  setting: 'Setting',
}

const routeToPage = {
  dashboard: 'dashboard',
  videos: 'list',
  'upload-video': 'upload',
  categories: 'category',
  users: 'user',
  permissions: 'permission',
  settings: 'setting',
}

const pageToPath = {
  dashboard: '/',
  category: '/categories',
  upload: '/upload-video',
  list: '/videos',
  user: '/users',
  userPermission: '/permissions',
  permission: '/permissions',
  setting: '/settings',
}

const isPublicRoute = computed(() => route.meta?.public === true)
const activePage = computed(() => routeToPage[route.name] || 'dashboard')
const activeTitle = computed(() => pageTitles[activePage.value] || 'Dashboard Admin')

const navigateTo = async (page) => {
  await router.push(pageToPath[page] || '/')
  isSidebarOpen.value = false
}

watch(
  theme,
  (nextTheme) => {
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('teenth-theme', nextTheme)
  },
  { immediate: true },
)
</script>

<template>
  <router-view v-if="isPublicRoute" />

  <div v-else class="min-h-screen bg-page text-textDark">
    <Sidebar
      :active-page="activePage"
      :is-open="isSidebarOpen"
      :is-collapsed="isSidebarCollapsed"
      @navigate="navigateTo"
      @close="isSidebarOpen = false"
      @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
    />

    <div
      class="min-h-screen transition-[padding] duration-300"
      :class="isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'"
    >
      <header class="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur">
        <div class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted">TeenTH admin</p>
            <h1 class="text-xl font-bold text-textDark sm:text-2xl">{{ activeTitle }}</h1>
          </div>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primaryBlue px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark lg:hidden"
            @click="isSidebarOpen = true"
          >
            <span class="h-0.5 w-4 bg-white shadow-[0_5px_0_#fff,0_-5px_0_#fff]" />
            Menu
          </button>
        </div>
      </header>

      <main class="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <router-view />
      </main>
    </div>
  </div>
</template>
