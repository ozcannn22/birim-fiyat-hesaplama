import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.json'],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
})