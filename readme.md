# 💰 BTC Turbo - Frontend Dashboard

Dashboard modular para análise e gestão de posições Bitcoin alavancadas.

## 📋 Estrutura do Projeto

```
btcturbo-frontend/
├── src/
│   ├── pages/
│   │   ├── home/
│   │   │   ├── components/
│   │   │   │   ├── header/ (Header.js + header-data.js)
│   │   │   │   ├── mercado/ (Mercado.js + mercado-data.js)
│   │   │   │   ├── risco/ (Risco.js + risco-data.js)
│   │   │   │   ├── alavancagem/ (Alavancagem.js + alavancagem-data.js)
│   │   │   │   └── estrategia/ (Estrategia.js + estrategia-data.js)
│   │   │   └── index.js (orquestrador)
│   │   ├── portfolio/ (futuro)
│   │   └── analytics/ (futuro)
│   ├── shared/
│   │   ├── api.js
│   │   ├── formatters.js
│   │   └── constants.js
│   └── styles/
│       ├── shared.css
│       └── components.css
├── index.html
├── package.json
└── vite.config.js
```

## 🏗️ Arquitetura de Componentes

### Padrão por Página
Cada dashboard tem sua própria pasta com componentes isolados:

```
pages/[dashboard]/
├── components/
│   └── [modulo]/
│       ├── Modulo.js      # UI + DOM manipulation
│       └── modulo-data.js # API calls + formatação
└── index.js               # Orquestrador da página
```

### Separação de Responsabilidades

**Component.js**
- Renderização DOM
- Event handlers
- Animações e interações

**component-data.js**
- Chamadas API
- Formatação de dados
- Lógica de negócio
- Validações

**index.js**
- Inicialização
- Coordenação entre componentes
- Ciclo de vida da página

## 📡 API Integration

Base URL: `https://btcturbo-v5-production.up.railway.app/api/v2`

### Endpoints Utilizados
- `/dashboard-home` - Dados completos da home
- `/analise-mercado` - Score e métricas de mercado
- `/analise-risco` - Health factor e liquidação
- `/analise-alavancagem` - Gestão de posições

## 🎯 Funcionalidades

### Dashboard Home
- **Header**: Preço BTC, posição atual, status API
- **Mercado**: Score de entrada, MVRV, NUPL, ciclos
- **Risco**: Health factor, distância liquidação
- **Alavancagem**: Atual vs permitida, capital disponível
- **Estratégia**: Decisão (HOLD/BUY/SELL), setup técnico

### Auto-refresh
- Atualização automática a cada 30s
- Retry automático em caso de erro
- Estados de loading e erro

## 🎨 Design System

### Cores
- `#1a1d29` - Background principal
- `#2a2f3e` - Cards e painéis
- `#3a3f4e` - Bordas
- `#ff8c42` - Accent (CTAs)
- `#8b9dc3` - Texto secundário

### Responsividade
- Desktop: Grid 2 colunas para scores
- Mobile: Stacked layout, bottom navigation

## 🔧 Desenvolvimento

### Adicionar Nova Página
1. Criar pasta em `src/pages/nova-pagina/`
2. Implementar componentes seguindo padrão
3. Criar `index.js` orquestrador
4. Adicionar arquivo HTML raiz

### Adicionar Componente
1. Criar pasta `src/pages/[pagina]/components/novo-modulo/`
2. Implementar `NovoModulo.js` (UI)
3. Implementar `novo-modulo-data.js` (dados)
4. Registrar no orquestrador da página

## 📈 Performance

- Vite para bundling otimizado
- CSS modular por componente
- Lazy loading de recursos
- Debounce em chamadas API

## 🚀 Deploy

Deploy automático na Vercel via `vercel.json`:
- Build: `npm run build`
- Output: `/dist`
- Framework: Vite

---

**Versão**: 2.0 - Arquitetura Modular  
**Última atualização**: Junho 2025