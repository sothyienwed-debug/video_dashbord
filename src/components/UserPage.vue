<script setup lang="ts">
import { computed, ref } from 'vue'

type UserRole = 'Admin' | 'Editor' | 'Moderator' | 'Member'

const users = ref([
  {
    id: 1,
    name: 'Sophea Admin',
    email: 'sophea@teenth.local',
    role: 'Admin' as UserRole,
    password: 'Admin@2026',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Mina Editor',
    email: 'mina@teenth.local',
    role: 'Editor' as UserRole,
    password: 'Editor#184',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Dara Moderator',
    email: 'dara@teenth.local',
    role: 'Moderator' as UserRole,
    password: 'ModReview77',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Nita Member',
    email: 'nita@teenth.local',
    role: 'Member' as UserRole,
    password: 'Member2026!',
    status: 'Blocked',
  },
])

const roles: UserRole[] = ['Admin', 'Editor', 'Moderator', 'Member']
const visiblePasswords = ref<number[]>([])

const stats = computed(() => [
  { label: 'Admins', value: users.value.filter((user) => user.role === 'Admin').length, detail: 'Full dashboard access' },
  { label: 'Editors', value: users.value.filter((user) => user.role === 'Editor').length, detail: 'Upload and edit videos' },
  { label: 'Members', value: 9400, detail: 'Registered viewers' },
])

const isPasswordVisible = (userId: number) => visiblePasswords.value.includes(userId)

const togglePassword = (userId: number) => {
  visiblePasswords.value = isPasswordVisible(userId)
    ? visiblePasswords.value.filter((id) => id !== userId)
    : [...visiblePasswords.value, userId]
}
</script>

<template>
  <section class="space-y-6">
    <div class="admin-card flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">People</p>
        <h2 class="mt-2 text-2xl font-extrabold text-textDark">User</h2>
      </div>
      <button class="primary-button" type="button">Add User</button>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <article v-for="item in stats" :key="item.label" class="admin-card">
        <p class="text-sm font-semibold text-muted">{{ item.label }}</p>
        <p class="mt-4 text-4xl font-extrabold text-textDark">{{ item.value.toLocaleString() }}</p>
        <p class="mt-2 text-sm text-muted">{{ item.detail }}</p>
      </article>
    </div>

    <section class="admin-card overflow-hidden p-0">
      <div class="border-b border-border px-5 py-4">
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">User list</p>
        <h3 class="mt-2 text-xl font-extrabold text-textDark">View Password</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Password</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <p class="font-extrabold text-textDark">{{ user.name }}</p>
                <p class="mt-1 text-xs text-muted">{{ user.email }}</p>
              </td>
              <td>
                <select v-model="user.role" class="permission-select">
                  <option v-for="role in roles" :key="role" :value="role">
                    {{ role }}
                  </option>
                </select>
              </td>
              <td>
                <div class="password-viewer">
                  <code>{{ isPasswordVisible(user.id) ? user.password : '**********' }}</code>
                  <button
                    type="button"
                    class="password-toggle"
                    :aria-label="isPasswordVisible(user.id) ? `Hide password for ${user.name}` : `View password for ${user.name}`"
                    @click="togglePassword(user.id)"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    </svg>
                    {{ isPasswordVisible(user.id) ? 'Hide' : 'View' }}
                  </button>
                </div>
              </td>
              <td>
                <span :class="user.status === 'Active' ? 'user-status-active' : 'user-status-blocked'">
                  {{ user.status }}
                </span>
              </td>
              <td>
                <button class="action-button action-button-edit" type="button">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
