import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Для GitHub Pages: base = '/repo-name/' (задається в workflow)
// Локально: base = '/' або './'
export default defineConfig({
  base: process.env.GITHUB_PAGES_BASE || './',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
