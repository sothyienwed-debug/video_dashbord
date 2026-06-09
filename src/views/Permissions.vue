<script setup>
const roles = [
  {
    name: 'Admin',
    description: 'Full administration access.',
    permissions: [
      'Manage videos',
      'Upload videos',
      'Create category',
      'Edit category',
      'Delete category',
      'Manage users',
      'Manage permissions',
    ],
  },
  {
    name: 'Editor',
    description: 'Content creation and category viewing.',
    permissions: ['Upload videos', 'Edit own videos', 'View categories'],
  },
  {
    name: 'User',
    description: 'Viewer access.',
    permissions: ['View videos', 'View categories'],
  },
]

const allPermissions = [
  'Manage videos',
  'Upload videos',
  'Edit own videos',
  'Create category',
  'Edit category',
  'Delete category',
  'View videos',
  'View categories',
  'Manage users',
  'Manage permissions',
]

const hasPermission = (role, permission) => role.permissions.includes(permission)
</script>

<template>
  <section class="space-y-6">
    <div class="grid gap-4 md:grid-cols-3">
      <div v-for="role in roles" :key="role.name" class="admin-card">
        <p class="text-lg font-bold text-gray-900">{{ role.name }}</p>
        <p class="mt-1 text-sm text-gray-500">{{ role.description }}</p>
        <p class="mt-4 text-2xl font-bold text-admin-brand">{{ role.permissions.length }}</p>
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Permissions</p>
      </div>
    </div>

    <div class="table-wrap">
      <div class="border-b border-gray-200 px-5 py-4">
        <h2 class="text-base font-bold text-gray-900">Role Permissions</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Permission</th>
              <th v-for="role in roles" :key="role.name">{{ role.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="permission in allPermissions" :key="permission">
              <td class="font-semibold text-gray-900">{{ permission }}</td>
              <td v-for="role in roles" :key="`${role.name}-${permission}`">
                <span
                  class="status-pill"
                  :class="hasPermission(role, permission) ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'"
                >
                  {{ hasPermission(role, permission) ? 'Yes' : 'No' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
