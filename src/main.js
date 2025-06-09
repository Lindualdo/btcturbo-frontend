import { GaugeChart } from './components/gauge-chart.js';
import { fetchMockData, getScoreColor, getScoreStatus } from './data/mock-data.js';

class BTCTurboDashboard {
  constructor() {
    this.gauges = {};
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando BTC Turbo Dashboard...');
    
    try {
      // Mostrar loading
      this.showLoading(true);
      
      // Buscar dados (mockados por enquanto)
      const data = await fetchMockData(1000);
      
      // Criar gauges
      this.createGauges();
      
      // Atualizar com dados
      this.updateDashboard(data);
      
      // Esconder loading
      this.showLoading(false);
      
      console.log('✅ Dashboard inicializado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar dashboard:', error);
      this.showError('Erro ao carregar dados');
    }
  }

  createGauges() {
    // Gauge Score Final
    const canvasFinal = document.getElementById('gauge-final');
    if (canvasFinal) {
      this.gauges.final = new GaugeChart(canvasFinal, {
        min: 0,
        max: 100,
        title: 'Score'
      });
    }

    // Gauge Semanal
    const canvasSemanal = document.getElementById('gauge-semanal');
    if (canvasSemanal) {
      this.gauges.semanal = new GaugeChart(canvasSemanal, {
        min: 0,
        max: 100,
        title: 'Score'
      });
    }

    // Gauge Diário
    const canvasDiario = document.getElementById('gauge-diario');
    if (canvasDiario) {
      this.gauges.diario = new GaugeChart(canvasDiario, {
        min: 0,
        max: 100,
        title: 'Score'
      });
    }
  }

  updateDashboard(data) {
    const { scores } = data;
    
    // Atualizar Score Final
    if (this.gauges.final) {
      this.gauges.final.create(scores.final.value);
      this.updateScoreInfo('final', scores.final);
    }

    // Atualizar Score Semanal
    if (this.gauges.semanal) {
      this.gauges.semanal.create(scores.semanal.value);
      this.updateScoreInfo('semanal', scores.semanal);
    }

    // Atualizar Score Diário
    if (this.gauges.diario) {
      this.gauges.diario.create(scores.diario.value);
      this.updateScoreInfo('diario', scores.diario);
    }

    console.log('📊 Dashboard atualizado com dados:', scores);
  }

  updateScoreInfo(type, scoreData) {
    // Atualizar valor do score
    const valueElement = document.getElementById(`score-${type}-value`);
    if (valueElement) {
      valueElement.textContent = scoreData.value;
      valueElement.style.color = scoreData.color;
    }

    // Atualizar status
    const statusElement = document.getElementById(`score-${type}-status`);
    if (statusElement) {
      statusElement.textContent = scoreData.status;
      statusElement.style.color = scoreData.color;
    }
  }

  showLoading(show) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      if (show) {
        card.style.opacity = '0.5';
        card.style.pointerEvents = 'none';
      } else {
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
      }
    });
  }

  showError(message) {
    console.error('Dashboard Error:', message);
    // Aqui você pode implementar um toast ou modal de erro
  }

  // Método para atualizar dados (para usar com APIs reais)
  async refreshData() {
    try {
      console.log('🔄 Atualizando dados...');
      this.showLoading(true);
      
      const data = await fetchMockData(500);
      this.updateDashboard(data);
      
      this.showLoading(false);
      console.log('✅ Dados atualizados!');
      
    } catch (error) {
      console.error('❌ Erro ao atualizar:', error);
      this.showError('Erro ao atualizar dados');
      this.showLoading(false);
    }
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.btcDashboard = new BTCTurboDashboard();
});

// Adicionar event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Botão Ver Detalhes
  const detailsBtn = document.querySelector('.btn-details');
  if (detailsBtn) {
    detailsBtn.addEventListener('click', () => {
      console.log('🔍 Abrindo detalhes...');
      // Aqui você pode implementar modal ou navegação
      alert('Detalhes do Score Técnico\n\nEsta funcionalidade será implementada em breve!');
    });
  }

  // Auto-refresh a cada 5 minutos (opcional)
  setInterval(() => {
    if (window.btcDashboard) {
      window.btcDashboard.refreshData();
    }
  }, 5 * 60 * 1000);
});

console.log('🎯 BTC Turbo Dashboard carregado!');