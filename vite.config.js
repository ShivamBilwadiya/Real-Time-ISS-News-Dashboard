import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/iss-now': {
        target: 'http://api.open-notify.org',
        changeOrigin: true,
        rewrite: () => '/iss-now.json'
      },
      '/api/astros': {
        target: 'http://api.open-notify.org',
        changeOrigin: true,
        rewrite: () => '/astros.json'
      },
      '/api/ai': {
        target: 'https://router.huggingface.co',
        changeOrigin: true,
        rewrite: () => '/v1/chat/completions'
      }
    }
  }
})
