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
        mercadoDetalhes: resolve(__dirname, 'mercado-detalhes.html'),
        riscoDetalhes: resolve(__dirname, 'risco-detalhes.html'),
        patrimonioDetalhes: resolve(__dirname, 'patrimonio-detalhes.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})