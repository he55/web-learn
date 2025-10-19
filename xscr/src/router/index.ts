import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from '@/views/settings/SettingsView.vue'
import S2SettingsView from '@/views/settings/S2SettingsView.vue'
import S3SettingsView from '@/views/settings/S3SettingsView.vue'
import S4SettingsView from '@/views/settings/S4SettingsView.vue'
import S6SettingsView from '@/views/settings/S6SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/screens/ss',
      component: () => import('@/views/screens/ShouShu.vue'),
    },
    {
      path: '/settings',
      component: SettingsView,
      children: [
        {
          path: 's2',
          component: S2SettingsView,
        },
        {
          path: 's3',
          component: S3SettingsView,
        },
        {
          path: 's4',
          component: S4SettingsView,
        },
        {
          path: 's6',
          component: S6SettingsView,
        },
      ],
    },
  ],
})

export default router
