<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({})
const errorMessage = ref('')
const submitting = ref(false)

const clearError = (key) => {
  delete errors[key]
  errorMessage.value = ''
}

const validate = () => {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!form.email.trim()) errors.email = 'Email is required.'
  if (!form.password) errors.password = 'Password is required.'

  return Object.keys(errors).length === 0
}

const submit = async () => {
  errorMessage.value = ''

  if (!validate()) return

  submitting.value = true

  try {
    await authStore.login(form)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect === '/login' ? '/' : redirect)
  } catch (error) {
    errorMessage.value = error.message || 'Login failed.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-page px-4 py-10">
    <section class="w-full max-w-md">
      <div class="mb-8 text-center">
        <div class="mx-auto h-16 w-16 overflow-hidden rounded-xl bg-surface shadow-sm ring-1 ring-border">
          <img class="h-full w-full object-cover" src="/thai logo.jpg" alt="TeenTH Thai logo" />
        </div>
        <h1 class="mt-5 text-3xl font-extrabold text-textDark">Admin Login</h1>
        <p class="mt-2 text-sm font-medium text-muted">TeenTH Video Admin</p>
      </div>

      <form class="admin-card space-y-5" @submit.prevent="submit">
        <label class="form-label">
          Email
          <input
            v-model="form.email"
            class="form-input"
            type="email"
            autocomplete="username"
            placeholder="super_admin@example.com"
            @input="clearError('email')"
          />
          <span v-if="errors.email" class="form-help text-admin-red">{{ errors.email }}</span>
        </label>

        <label class="form-label">
          Password
          <input
            v-model="form.password"
            class="form-input"
            type="password"
            autocomplete="current-password"
            placeholder="password123"
            @input="clearError('password')"
          />
          <span v-if="errors.password" class="form-help text-admin-red">{{ errors.password }}</span>
        </label>

        <div v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-admin-red">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn-primary w-full" :disabled="submitting">
          {{ submitting ? 'Signing in...' : 'Login' }}
        </button>
      </form>
    </section>
  </main>
</template>
