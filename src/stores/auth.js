import { defineStore } from 'pinia'
import api, { AUTH_TOKEN_KEY } from '@/services/api'

const SESSION_KEY = 'video-admin-session'

const readSessionUser = () => {
  if (typeof localStorage === 'undefined') return null

  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

const saveSessionUser = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: readSessionUser(),
    token: localStorage.getItem(AUTH_TOKEN_KEY) || '',
    users: [
      { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'active', videos: 12 },
      { id: 2, name: 'Mina Editor', email: 'editor@example.com', role: 'Editor', status: 'active', videos: 7 },
      { id: 3, name: 'Viewer Account', email: 'user@example.com', role: 'User', status: 'inactive', videos: 0 },
    ],
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user && state.token),
    totalUsers: (state) => state.users.length,
  },

  actions: {
    async login(credentials) {
      const response = await api.post('/login', {
        email: credentials.email.trim(),
        password: credentials.password,
        device_name: 'admin-dashboard',
      })

      const payload = response.data?.data || response.data
      const token = payload?.token || response.data?.token
      const user = normalizeUser(payload?.user || response.data?.user)

      this.user = user
      this.token = token
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      saveSessionUser(user)
      return user
    },

    updateProfile(profile) {
      if (!this.user) return

      this.user = {
        ...this.user,
        name: profile.name.trim(),
        email: profile.email.trim(),
      }

      saveSessionUser(this.user)
    },

    async logout() {
      try {
        if (this.token) {
          await api.post('/logout')
        }
      } catch {
        // The local session should still be cleared if the token is already invalid.
      }

      this.user = null
      this.token = ''
      localStorage.removeItem(SESSION_KEY)
      localStorage.removeItem(AUTH_TOKEN_KEY)
    },
  },
})
