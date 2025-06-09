// Arquivo: vite.config.js
// Localização: btcturbo-frontend/vite.config.js

import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ciclos: resolve(__dirname, 'ciclos.html'),
        momentum: resolve(__dirname, 'momentum.html'),
        tecnico: resolve(__dirname, 'tecnco.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})