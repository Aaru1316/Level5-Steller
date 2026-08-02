/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
// @ts-ignore
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: 'esbuild',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    server: {
      deps: {
        inline: ['@exodus/bytes'],
      },
    },
  },
})
