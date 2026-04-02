import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Change 'compliance-ledger' to your GitHub repo name
  base: process.env.NODE_ENV === 'production' ? '/compliance-ledger/' : '/',
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
