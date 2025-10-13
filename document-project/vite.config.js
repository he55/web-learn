import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/medical': 'https://mp.bsbdf.com:4000',
      '/bsfx': 'https://mp.bsbdf.com:4000',
      '/api': 'http://localhost:5000',
      '/test': {
        target: 'http://localhost:5000',
        rewrite: (path) => {
          return path.replace(/^\/test/, '')
        },
      },
    },
  },
  base: '/med2',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
