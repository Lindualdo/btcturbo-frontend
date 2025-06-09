# 📊 BTC Turbo Frontend

Dashboard de análise  Bitcoin construído com **Vanilla JS + Vite + Chart.js**.

## 📁 Estrutura incial do Projeto

```
btcturbo-frontend/
├── index.html              # Página principal
├── package.json            # Dependências
├── vite.config.js          # Configuração Vite
└── src/
    ├── main.js             # Ponto de entrada
    ├── components/         
    │   └── gauge-chart.js  # Componente dos gauges
    ├── data/
    │   └── mock-data.js    # Dados mockados
    ├── styles/
    │   ├── main.css        # Estilos base
    │   └── components.css  # Estilos componentes
    └── utils/
        └── api-client.js   # Cliente para APIs
```

## 🎯 Funcionalidades Implementadas

### ✅ Dashboard Básico
- [x] Layout responsivo dark theme
- [x] 3 cards com gauges (Score Final, Semanal, Diário)
- [x] Navegação funcional
- [x] Dados mockados simulando as APIs

### ✅ Componentes
- [x] **GaugeChart**: Speedometer personalizado com Chart.js
- [x] **Navigation**: Header com abas
- [x] **Cards**: Containers dos widgets

### ✅ Dados Mockados
- [x] Scores: 76, 75, 79 (como na imagem)
- [x] Status: "Correção Saudável"
- [x] Cores dinâmicas baseadas no score

## 🔄 Migração para APIs Reais

### Passo 1: Configurar API Base URL
```javascript
// src/utils/api-client.js
const apiClient = new BTCTurboAPI('https://sua-api.herokuapp.com');
```

### Passo 2: Substituir Mock por API Real
```javascript
// src/main.js
// De:
const data = await fetchMockData(1000);

// Para:
const data = await apiClient.getDashboardTecnico();
```

### Passo 3: Endpoints Disponíveis
```javascript
// Análise técnica específica
await apiClient.calcularScore('tecnico');
await apiClient.obterIndicadores('tecnico');

// Análises gerais
await apiClient.analiseBTC();
await apiClient.analiseMercado();
await apiClient.analiseRisco();
```

## 🎨 Customização

### Cores do Theme
```css
/* src/styles/main.css */
:root {
  --bg-primary: #0a0e1a;     /* Fundo principal */
  --bg-card: #232937;        /* Fundo dos cards */
  --accent-orange: #ff8c42;  /* Cor principal */
  --text-primary: #ffffff;   /* Texto principal */
}
```

### Cores dos Gauges
```javascript
// src/components/gauge-chart.js
getGaugeColors(value) {
  if (value >= 80) return { fill: '#66bb6a' }; // Verde
  if (value >= 60) return { fill: '#ffeb3b' }; // Amarelo
  if (value >= 40) return { fill: '#ffa726' }; // Laranja
  return { fill: '#ff4757' }; // Vermelho
}
```

## 📱 Responsividade

- **Desktop**: Grid 3 colunas
- **Tablet**: Grid 2 colunas  
- **Mobile**: Grid 1 coluna

## 🚀 Deploy na Vercel

```bash
# 1. Build para produção
npm run build

# 2. Deploy via CLI
npx vercel

# 3. Ou conectar repositório GitHub na Vercel
```

## 🛠️ Próximos Passos

### Curto Prazo
- [ ] Conectar APIs reais do BTCTurbo
- [ ] Adicionar mais páginas (Riscos, Momentum, Ciclos)
- [ ] Implementar modal de detalhes
- [ ] Loading states melhorados

### Médio Prazo
- [ ] Sistema de notificações
- [ ] Histórico de scores
- [ ] Filtros de período
- [ ] Exportar relatórios

### Longo Prazo
- [ ] PWA (offline support)
- [ ] WebSockets para real-time
- [ ] Temas customizáveis
- [ ] Multi-idioma

## 💡 Tecnologias

- **Vite**: Build tool rápido
- **Chart.js**: Gráficos gauge
- **Vanilla JS**: Zero frameworks, máxima performance
- **CSS Grid/Flexbox**: Layout responsivo
- **Fetch API**: Comunicação com backend

---

**Desenvolvido para BTCTurbo** 🚀