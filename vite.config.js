import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' membuat hasil build bisa ditaruh di sub-folder mana pun (GitHub Pages, dsb.)
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
  },
})
