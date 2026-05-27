<script setup lang="ts">
import { reactive } from 'vue'

type UserPermissionKey = 'dashboard' | 'category' | 'upload' | 'list' | 'user' | 'setting'

type UserPermission = {
  id: number
  name: string
  email: string
  role: string
  permissions: Record<UserPermissionKey, boolean>
}

const pages: Array<{ key: UserPermissionKey; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'category', label: 'Category' },
  { key: 'upload', label: 'Upload' },
  { key: 'list', label: 'List' },
  { key: 'user', label: 'User' },
  { key: 'setting', label: 'Setting' },
]

const users = reactive<UserPermission[]>([
  {
    id: 1,
    name: 'Sophea Admin',
    email: 'sophea@teenth.local',
    role: 'Admin',
    permissions: {
      dashboard: true,
      category: true,
      upload: true,
      list: true,
      user: true,
      setting: true,
    },
  },
  {
    id: 2,
    name: 'Mina Editor',
    email: 'mina@teenth.local',
    role: 'Editor',
    permissions: {
      dashboard: true,
      category: true,
      upload: true,
      list: true,
      user: false,
      setting: false,
    },
  },
  {
    id: 3,
    name: 'Dara Moderator',
    email: 'dara@teenth.local',
    role: 'Moderator',
    permissions: {
      dashboard: true,
      category: false,
      upload: false,
      list: true,
      user: false,
      setting: false,
    },
  },
  {
    id: 4,
    name: 'Nita Member',
    email: 'nita@teenth.local',
    role: 'Member',
    permissions: {
      dashboard: false,
      category: false,
      upload: false,
      list: true,
      user: false,
      setting: false,
    },
  },
])

const enabledPages = (user: UserPermission) =>
  pages.filter((page) => user.permissions[page.key]).length

const setEveryPage = (user: UserPermission, enabled: boolean) => {
  pages.forEach((page) => {
    user.permissions[page.key] = enabled
  })
}
</script>

<template>
  <section class="space-y-6">
    <div class="admin-card">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">People</p>
      <h2 class="mt-2 text-2xl font-extrabold text-textDark">Permission</h2>
    </div>

    <section class="admin-card overflow-hidden p-0">
      <div class="border-b border-border px-5 py-4">
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Specific user</p>
        <h3 class="mt-2 text-xl font-extrabold text-textDark">Set User Permission</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="permission-table">
          <thead>
            <tr>
              <th>User</th>
              <th v-for="page in pages" :key="page.key">{{ page.label }}</th>
              <th>Enabled</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <div class="min-w-56">
                  <p class="font-extrabold text-primaryBlue">{{ user.name }}</p>
                  <p class="mt-1 text-xs leading-5 text-muted">{{ user.email }}</p>
                  <span class="mt-3 inline-flex rounded-full bg-surfaceMuted px-3 py-1 text-xs font-bold text-muted">
                    {{ user.role }}
                  </span>
                  <div class="mt-3 flex gap-2">
                    <button class="permission-mini-button" type="button" @click="setEveryPage(user, true)">
                      All
                    </button>
                    <button class="permission-mini-button" type="button" @click="setEveryPage(user, false)">
                      None
                    </button>
                  </div>
                </div>
              </td>
              <td v-for="page in pages" :key="page.key">
                <label class="permission-switch">
                  <input v-model="user.permissions[page.key]" type="checkbox" />
                  <span />
                </label>
              </td>
              <td>
                <span class="status-pill">{{ enabledPages(user) }}/{{ pages.length }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
