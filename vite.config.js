import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import './index.css'

export default defineConfig({
  plugins: [react(),tailwindcss()],
})
