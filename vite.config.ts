import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Three.js and R3F into separate chunks for better caching
          'three': ['three'],
          'r3f': ['@react-three/fiber', '@react-three/drei', 'zustand'],
          'postprocessing': ['@react-three/postprocessing', 'postprocessing'],
          // Split animation library
          'animation': ['framer-motion'],
        },
      },
    },
  },
})
