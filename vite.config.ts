import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relative base so the same build works on GitHub Pages project sites,
// custom domains, and local preview without changes.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { host: '0.0.0.0', allowedHosts: true },
  preview: { host: '0.0.0.0', allowedHosts: true },
})
