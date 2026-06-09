<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const search = ref('')

const users = computed(() =>
  authStore.users.filter((user) =>
    `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.value.toLowerCase()),
  ),
)
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg font-bold text-gray-900">Users</h2>
        <p class="text-sm text-gray-500">Manage admin, editor, and user accounts.</p>
      </div>
      <input v-model="search" class="form-input mt-0 sm:max-w-xs" type="search" placeholder="Search users" />
    </div>

    <div class="table-wrap">
      <div class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Videos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="font-semibold text-gray-900">{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <span class="status-pill" :class="user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'">
                  {{ user.status }}
                </span>
              </td>
              <td>{{ user.videos }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
