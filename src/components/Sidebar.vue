<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  activePage: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  isCollapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate', 'close', 'toggle-collapse', 'logout'])

const isVideoOpen = ref(['upload', 'list'].includes(props.activePage))
const isUserOpen = ref(['user', 'userPermission'].includes(props.activePage))

watch(
  () => props.activePage,
  (page) => {
    if (['upload', 'list'].includes(page)) isVideoOpen.value = true
    if (['user', 'userPermission'].includes(page)) isUserOpen.value = true
  },
)

const isActive = (page) => props.activePage === page

const goTo = (page) => {
  emit('navigate', page)
}
</script>

<template>
  <div>
    <button
      v-if="isOpen"
      type="button"
      class="fixed inset-0 z-30 bg-primaryDark/45 lg:hidden"
      aria-label="Close sidebar"
      @click="emit('close')"
    />

    <aside
      class="fixed inset-y-0 left-0 z-40 flex transform flex-col border-r border-border bg-surface shadow-soft transition-[transform,width] duration-300 lg:translate-x-0"
      :class="[isOpen ? 'translate-x-0' : '-translate-x-full', isCollapsed ? 'lg:w-20' : 'lg:w-72', 'w-72']"
    >
      <button
        type="button"
        class="sidebar-collapse-toggle hidden lg:flex"
        :aria-label="isCollapsed ? 'Open sidebar' : 'Close sidebar'"
        @click="emit('toggle-collapse')"
      >
        {{ isCollapsed ? '>' : '<' }}
      </button>

      <div
        class="flex h-20 items-center border-b border-border transition-all"
        :class="isCollapsed ? 'justify-center px-3' : 'gap-3 px-6'"
      >
        <div class="h-12 w-12 overflow-hidden rounded-xl bg-surface shadow-sm ring-1 ring-border">
          <img class="h-full w-full object-cover" src="/thai logo.jpg" alt="TeenTH Thai logo" />
        </div>
        <div v-if="!isCollapsed">
          <p class="text-lg font-extrabold text-primaryBlue">TeenTH</p>
          <p class="text-xs font-medium text-muted">Video Admin</p>
        </div>
      </div>

      <nav class="flex-1 space-y-2 overflow-y-auto py-6" :class="isCollapsed ? 'px-3' : 'px-4'">
        <button
          type="button"
          class="sidebar-link"
          :class="[{ 'sidebar-link-active': isActive('dashboard') }, isCollapsed ? 'justify-center px-0' : '']"
          title="Dashboard Admin"
          @click="goTo('dashboard')"
        >
          <span class="sidebar-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z" />
            </svg>
          </span>
          <span v-if="!isCollapsed">Dashboard Admin</span>
        </button>

        <button
          type="button"
          class="sidebar-link"
          :class="[{ 'sidebar-link-active': isActive('category') }, isCollapsed ? 'justify-center px-0' : '']"
          title="Category"
          @click="goTo('category')"
        >
          <span class="sidebar-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z" />
            </svg>
          </span>
          <span v-if="!isCollapsed">Category</span>
        </button>

        <div>
          <button
            type="button"
            class="sidebar-link"
            :class="[{ 'sidebar-link-active': ['upload', 'list'].includes(activePage) }, isCollapsed ? 'justify-center px-0' : '']"
            title="Update Video"
            @click="isVideoOpen = !isVideoOpen"
          >
            <span class="sidebar-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Zm7 1.75v5.5L15.5 12 11 9.25Z" />
              </svg>
            </span>
            <span v-if="!isCollapsed" class="flex-1 text-left">Update Video</span>
            <span v-if="!isCollapsed" class="sidebar-chevron" :class="{ 'rotate-180': isVideoOpen }">
              <svg viewBox="0 0 24 24">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </span>
          </button>

          <div v-if="isVideoOpen && !isCollapsed" class="mt-2 space-y-1 pl-8">
            <button
              type="button"
              class="sidebar-sub-link"
              :class="{ 'sidebar-sub-link-active': isActive('upload') }"
              @click="goTo('upload')"
            >
              <span class="sidebar-sub-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 15V5m0 0 4 4m-4-4-4 4M5 19h14" />
                </svg>
              </span>
              <span>Upload</span>
            </button>
            <button
              type="button"
              class="sidebar-sub-link"
              :class="{ 'sidebar-sub-link-active': isActive('list') }"
              @click="goTo('list')"
            >
              <span class="sidebar-sub-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
                </svg>
              </span>
              <span>List</span>
            </button>
          </div>
        </div>

        <div>
          <button
            type="button"
            class="sidebar-link"
            :class="[{ 'sidebar-link-active': ['user', 'userPermission'].includes(activePage) }, isCollapsed ? 'justify-center px-0' : '']"
            title="User"
            @click="isUserOpen = !isUserOpen"
          >
            <span class="sidebar-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" />
              </svg>
            </span>
            <span v-if="!isCollapsed" class="flex-1 text-left">User</span>
            <span v-if="!isCollapsed" class="sidebar-chevron" :class="{ 'rotate-180': isUserOpen }">
              <svg viewBox="0 0 24 24">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </span>
          </button>

          <div v-if="isUserOpen && !isCollapsed" class="mt-2 space-y-1 pl-8">
            <button
              type="button"
              class="sidebar-sub-link"
              :class="{ 'sidebar-sub-link-active': isActive('user') }"
              @click="goTo('user')"
            >
              <span class="sidebar-sub-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M16 11a4 4 0 1 0-8 0m8 0a4 4 0 0 1-8 0m8 0h2a3 3 0 0 1 3 3v5H3v-5a3 3 0 0 1 3-3h2" />
                </svg>
              </span>
              <span>User</span>
            </button>
            <button
              type="button"
              class="sidebar-sub-link"
              :class="{ 'sidebar-sub-link-active': isActive('userPermission') }"
              @click="goTo('userPermission')"
            >
              <span class="sidebar-sub-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z" />
                  <path d="m9 12 2 2 4-5" />
                </svg>
              </span>
              <span>Permission</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          class="sidebar-link"
          :class="[{ 'sidebar-link-active': isActive('permission') }, isCollapsed ? 'justify-center px-0' : '']"
          title="Permission"
          @click="goTo('permission')"
        >
          <span class="sidebar-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z" />
              <path d="m9 12 2 2 4-5" />
            </svg>
          </span>
          <span v-if="!isCollapsed">Permission</span>
        </button>

        <button
          type="button"
          class="sidebar-link"
          :class="[{ 'sidebar-link-active': isActive('setting') }, isCollapsed ? 'justify-center px-0' : '']"
          title="Setting"
          @click="goTo('setting')"
        >
          <span class="sidebar-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.04.04a2 2 0 0 1-2.83 2.83l-.04-.04A1.7 1.7 0 0 0 15 19.37a1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.04.04a2 2 0 0 1-2.83-2.83l.04-.04A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.04-.04a2 2 0 0 1 2.83-2.83l.04.04A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.04-.04a2 2 0 0 1 2.83 2.83l-.04.04A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.08a1.7 1.7 0 0 0-1.52 1Z" />
            </svg>
          </span>
          <span v-if="!isCollapsed">Setting</span>
        </button>
      </nav>

      <div class="border-t border-border p-4" :class="isCollapsed ? 'px-3' : ''">
        <div v-if="!isCollapsed" class="mb-3 rounded-lg bg-softPurple p-4">
          <p class="text-sm font-bold text-primaryBlue">Admin Studio</p>
          <p class="mt-1 text-xs leading-5 text-muted">Manage video uploads, roles, and site settings.</p>
        </div>

        <button
          type="button"
          class="sidebar-link text-thaiRed hover:bg-thaiRed/10 hover:text-thaiRed"
          :class="isCollapsed ? 'justify-center px-0' : ''"
          title="Logout"
          @click="emit('logout')"
        >
          <span class="sidebar-icon text-thaiRed" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M10 17 15 12 10 7" />
              <path d="M15 12H3" />
              <path d="M14 4h4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-4" />
            </svg>
          </span>
          <span v-if="!isCollapsed">Logout</span>
        </button>
      </div>
    </aside>
  </div>
</template>
