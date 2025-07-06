// Arquivo: vite.config.js
// Localização: btcturbo-frontend/vite.config.js
// ATUALIZADO: Removidas páginas que dependem de APIs desativadas

import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        // ✅ PÁGINAS ATIVAS (APIs funcionando)
        main: resolve(__dirname, 'index.html'),
        riscoDetalhes: resolve(__dirname, 'risco-detalhes.html'),
        patrimonioDetalhes: resolve(__dirname, 'patrimonio-detalhes.html'),
        estrategiaDetalhes: resolve(__dirname, 'detalhe-estrategia.html'),
        btcturbo: resolve(__dirname, 'btcturbo.html'),
        
        // ❌ REMOVIDAS: Páginas que dependem de APIs desativadas
        // mercadoDetalhes: resolve(__dirname, 'mercado-detalhes.html'), // dash-mercado desativado
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})