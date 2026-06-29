import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base 设为 GitHub repo 名，部署到 https://<user>.github.io/FOMO/
export default defineConfig({
  base: '/FOMO/',
  plugins: [react(), tailwindcss()],
})
