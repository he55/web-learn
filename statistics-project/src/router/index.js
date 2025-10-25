import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SettingsView from '@/views/SettingsView.vue'
import HomeView_njfs from '@/views/njfs/HomeView.vue'
import HomeView_gyqzfs from '@/views/gyqzfs/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/njfs',
      component: HomeView_njfs,
    },
    {
      path: '/gyqzfs',
      component: HomeView_gyqzfs,
    },
    {
      path: '/zztffs',
      component: () => import('@/views/zztffs/HomeView.vue'),
    },
  ],
})

export default router
