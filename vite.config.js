import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base so the site loads correctly when served from GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/Codex-of-Algorithms/',
  server: {
    host: true,
    allowedHosts: ['openclaw-gateway', 'localhost', '127.0.0.1']
  }
})
