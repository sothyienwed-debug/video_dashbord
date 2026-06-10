import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import Watch from '@/pages/Watch.vue'
import Dashboard from '@/views/Dashboard.vue'
import Videos from '@/views/Videos.vue'
import UploadVideo from '@/views/UploadVideo.vue'
import Categories from '@/views/Categories.vue'
import Users from '@/views/Users.vue'
import Permissions from '@/views/Permissions.vue'
import Settings from '@/views/Settings.vue'
import AdminLogin from '@/views/AdminLogin.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: AdminLogin,
    meta: { title: 'Admin Login', public: true },
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' },
  },
  {
    path: '/dashboard',
    redirect: '/',
  },
  {
    path: '/videos',
    name: 'videos',
    component: Videos,
    meta: { title: 'Videos' },
  },
  {
    path: '/upload-video',
    name: 'upload-video',
    component: UploadVideo,
    meta: { title: 'Upload Video' },
  },
  {
    path: '/categories',
    name: 'categories',
    component: Categories,
    meta: { title: 'Categories' },
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
    meta: { title: 'Users' },
  },
  {
    path: '/permissions',
    name: 'permissions',
    component: Permissions,
    meta: { title: 'Permissions' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { title: 'Settings' },
  },
  {
    path: '/watch/:id',
    name: 'watch',
    component: Watch,
    props: true,
    meta: { public: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (!to.meta?.public && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/'
    return redirect === '/login' ? '/' : redirect
  }

  return true
})

export default router
