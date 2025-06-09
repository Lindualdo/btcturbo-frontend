# 📊 BTC Turbo Frontend

Dashboard de análise  Bitcoin construído com **Vanilla JS + Vite + Chart.js**.

## 📁 Estrutura  do Projeto

´´´
btcturbo-frontend/
├── index.html                          # Dashboard principal
├── ciclos.html                         # Página Ciclos
├── momentum.html                       # Página Momentum  
├── tecnco.html                         # Página Técnico
├── package.json
├── vite.config.js
├── vercel.json                         # Configuração Vercel
└── src/
    ├── main.js                         # Lógica dashboard principal
    ├── components/
    │   └── shared.js                   # Classes base (SimpleGauge, ApiClient, DashboardBase)
    ├── pages/
    │   ├── ciclos.js                   # Lógica página Ciclos
    │   ├── momentum.js                 # Lógica página Momentum
    │   └── tecnico.js                  # Lógica página Técnico
    └── styles/
        └── shared.css                  # Estilos únicos compartilhados

´´´