<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const saved = ref(false)

const settings = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  siteName: 'Video Admin Dashboard',
  defaultStatus: 'pending',
  maxDuration: 10,
})

const save = () => {
  authStore.updateProfile({
    name: settings.name,
    email: settings.email,
  })
  saved.value = true
  window.setTimeout(() => {
    saved.value = false
  }, 2200)
}
</script>

<template>
  <section class="mx-auto max-w-4xl space-y-6">
    <div>
      <h2 class="text-lg font-bold text-gray-900">Settings</h2>
      <p class="text-sm text-gray-500">Configure dashboard defaults and admin profile details.</p>
    </div>

    <form class="admin-card space-y-5" @submit.prevent="save">
      <div class="grid gap-5 md:grid-cols-2">
        <label class="form-label">
          Admin Name
          <input v-model="settings.name" class="form-input" type="text" />
        </label>

        <label class="form-label">
          Admin Email
          <input v-model="settings.email" class="form-input" type="email" />
        </label>

        <label class="form-label">
          Site Name
          <input v-model="settings.siteName" class="form-input" type="text" />
        </label>

        <label class="form-label">
          Default Upload Status
          <select v-model="settings.defaultStatus" class="form-input">
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
          </select>
        </label>

        <label class="form-label">
          Max Video Duration
          <input v-model.number="settings.maxDuration" class="form-input" type="number" min="1" max="10" />
          <span class="form-help">Current upload validation is capped at 10 minutes.</span>
        </label>
      </div>

      <div v-if="saved" class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        Settings saved.
      </div>

      <div class="flex justify-end border-t border-gray-100 pt-5">
        <button type="submit" class="btn-primary">Save Settings</button>
      </div>
    </form>
  </section>
</template>
