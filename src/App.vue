<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Dashboard from './components/Dashboard.vue'
import CategoryPage from './components/CategoryPage.vue'
import UploadVideo from './components/UploadVideo.vue'
import VideoList from './components/VideoList.vue'
import UserPage from './components/UserPage.vue'
import UserPermissionPage from './components/UserPermissionPage.vue'
import PermissionPage from './components/PermissionPage.vue'
import SettingPage from './components/SettingPage.vue'

type PageId = 'dashboard' | 'category' | 'upload' | 'list' | 'user' | 'userPermission' | 'permission' | 'setting'
type ThemeId = 'light' | 'dark' | 'thai'

const activePage = ref<PageId>('dashboard')
const isSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)
const savedTheme = localStorage.getItem('teenth-theme') as ThemeId | null
const theme = ref<ThemeId>(savedTheme ?? 'light')

const pageTitles: Record<PageId, string> = {
  dashboard: 'Dashboard Admin',
  category: 'Category',
  upload: 'Upload Video',
  list: 'Video List',
  user: 'User',
  userPermission: 'Permission',
  permission: 'Permission',
  setting: 'Setting',
}

const activeTitle = computed(() => pageTitles[activePage.value])

const navigateTo = (page: string) => {
  activePage.value = page as PageId
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
  <div class="min-h-screen bg-page text-textDark">
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
        <Dashboard v-if="activePage === 'dashboard'" />
        <CategoryPage v-else-if="activePage === 'category'" />
        <UploadVideo v-else-if="activePage === 'upload'" />
        <VideoList v-else-if="activePage === 'list'" />
        <UserPage v-else-if="activePage === 'user'" />
        <UserPermissionPage v-else-if="activePage === 'userPermission'" />
        <PermissionPage v-else-if="activePage === 'permission'" />
        <SettingPage v-else :theme="theme" @update-theme="theme = $event" />
      </main>
    </div>
  </div>
</template>
