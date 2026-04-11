import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tsconfigPaths({
      configNames: ["tsconfig.tests.json"]
    }), 
    react()
  ],
  test: {
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, '../../vitest.setup.ts')],
  },
})

