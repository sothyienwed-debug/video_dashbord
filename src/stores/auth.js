import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'Admin',
    },
    users: [
      { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'active', videos: 12 },
      { id: 2, name: 'Mina Editor', email: 'editor@example.com', role: 'Editor', status: 'active', videos: 7 },
      { id: 3, name: 'Viewer Account', email: 'user@example.com', role: 'User', status: 'inactive', videos: 0 },
    ],
  }),

  getters: {
    totalUsers: (state) => state.users.length,
  },

  actions: {
    logout() {
      this.user = {
        name: 'Signed Out',
        email: 'signed-out@example.com',
        role: 'User',
      }
    },
  },
})
