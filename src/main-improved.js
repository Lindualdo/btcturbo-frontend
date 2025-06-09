import { ImprovedGaugeChart } from './components/gauge-chart-improved.js';
import { fetchMockData, getScoreColor, getScoreStatus } from './data/mock-data.js';

class BTCTurboDashboard {
  constructor() {
    this.gauges = {};
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando BTC Turbo Dashboard (Versão Melhorada)...');
    
    try {
      // Mostrar loading
      this.showLoading(true);
      
      // Buscar dados (mockados por enquanto)
      const data = await fetchMockData(1000);
      
      // Criar gauges melhorados
      this.createImprovedGauges();
      
      // Atualizar com dados (com animação)
      this.updateDashboard(data);
      
      // Esconder loading
      this.showLoading(false);
      
      console.log('✅ Dashboard melhorado inicializado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar dashboard:', error);
      this.showError('Erro ao carregar dados');
    }
  }

  createImprovedGauges() {
    // Gauge Score Final - Maior
    const canvasFinal = document.getElementById('gauge-final');
    if (canvasFinal) {
      this.gauges.final = new ImprovedGaugeChart(canvasFinal, {
        min: 0,
        max: 100,
        title: '',
        size: 220, // Maior para destaque
        thickness: 18
      });
    }

    // Gauge Semanal
    const canvasSemanal = document.getElementById('gauge-semanal');
    if (canvasSemanal) {
      this.gauges.semanal = new ImprovedGaugeChart(canvasSemanal, {
        min: 0,
        max: 100,
        title: '',
        size: 200,
        thickness: 16
      });
    }

    // Gauge Diário
    const canvasDiario = document.getElementById('gauge-diario');
    if (canvasDiario) {
      this.gauges.diario = new ImprovedGaugeChart(canvasDiario, {
        min: 0,
        max: 100,
        title: '',
        size: 200,
        thickness: 16
      });
    }
  }

  updateDashboard(data) {
    const { scores } = data;
    
    // Delay escalonado para efeito visual mais impressionante
    setTimeout(() => {
      if (this.gauges.final) {
        this.gauges.final.animateTo(scores.final.value, 2000);
        this.updateScoreInfo('final', scores.final);
      }
    }, 200);

    setTimeout(() => {
      if (this.gauges.semanal) {
        this.gauges.semanal.animateTo(scores.semanal.value, 1800);
        this.updateScoreInfo('semanal', scores.semanal);
      }
    }, 400);

    setTimeout(() => {
      if (this.gauges.diario) {
        this.gauges.diario.animateTo(scores.diario.value, 1600);
        this.updateScoreInfo('diario', scores.diario);
      }
    }, 600);

    console.log('📊 Dashboard atualizado com gauges melhorados:', scores);
  }

  updateScoreInfo(type, scoreData) {
    // Atualizar valor do score com animação
    const valueElement = document.getElementById(`score-${type}-value`);
    if (valueElement) {
      // Animar contagem do número
      this.animateNumber(valueElement, 0, scoreData.value, 1500);
      valueElement.style.color = scoreData.color;
    }

    // Atualizar status
    const statusElement = document.getElementById(`score-${type}-status`);
    if (statusElement) {
      setTimeout(() => {
        statusElement.textContent = scoreData.status;
        statusElement.style.color = scoreData.color;
        statusElement.style.opacity = '0';
        statusElement.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
          statusElement.style.opacity = '1';
        }, 100);
      }, 800);
    }
  }

  animateNumber(element, start, end, duration) {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = Math.floor(start + (end - start) * easedProgress);
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  showLoading(show) {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      if (show) {
        card.style.opacity = '0.3';
        card.style.pointerEvents = 'none';
        card.style.transform = 'translateY(10px)';
      } else {
        // Animação escalonada dos cards
        setTimeout(() => {
          card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '1';
          card.style.pointerEvents = 'auto';
          card.style.transform = 'translateY(0)';
        }, index * 200);
      }
    });
  }

  showError(message) {
    console.error('Dashboard Error:', message);
    // Implementar toast de erro futuramente
  }

  async refreshData() {
    try {
      console.log('🔄 Atualizando dados...');
      this.showLoading(true);
      
      const data = await fetchMockData(500);
      this.updateDashboard(data);
      
      setTimeout(() => {
        this.showLoading(false);
      }, 1000);
      
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

// Event listeners melhorados
document.addEventListener('DOMContentLoaded', () => {
  // Botão Ver Detalhes com feedback visual
  const detailsBtn = document.querySelector('.btn-details');
  if (detailsBtn) {
    detailsBtn.addEventListener('click', (e) => {
      console.log('🔍 Abrindo detalhes...');
      
      // Feedback visual
      e.target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        e.target.style.transform = 'scale(1)';
      }, 150);
      
      // Modal de detalhes (futuro)
      alert('Detalhes do Score Técnico\n\n✅ Gauges melhorados implementados!\n📊 Design idêntico ao original\n🚀 Performance otimizada');
    });
  }

  // Refresh manual com Ctrl+R
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'r') {
      e.preventDefault();
      if (window.btcDashboard) {
        window.btcDashboard.refreshData();
      }
    }
  });

  // Auto-refresh a cada 5 minutos
  setInterval(() => {
    if (window.btcDashboard) {
      window.btcDashboard.refreshData();
    }
  }, 5 * 60 * 1000);
});

console.log('🎯 BTC Turbo Dashboard Melhorado carregado!');