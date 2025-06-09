import Chart from 'chart.js/auto';

export class GaugeChart {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.chart = null;
    this.defaultOptions = {
      value: 0,
      min: 0,
      max: 100,
      title: '',
      ...options
    };
  }

  create(value, options = {}) {
    const config = { ...this.defaultOptions, ...options };
    
    // Destruir chart anterior se existir
    if (this.chart) {
      this.chart.destroy();
    }

    // Calcular porcentagem
    const percentage = ((value - config.min) / (config.max - config.min)) * 100;
    
    // Cores do gauge baseadas no valor
    const gaugeColors = this.getGaugeColors(value);
    
    this.chart = new Chart(this.canvas, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [percentage, 100 - percentage],
          backgroundColor: [
            gaugeColors.fill,
            'rgba(255, 255, 255, 0.1)'
          ],
          borderWidth: 0,
          cutout: '75%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -90, // Começar do topo
        circumference: 180, // Meio círculo
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        animation: {
          animateRotate: true,
          duration: 1500,
          easing: 'easeOutCubic'
        }
      },
      plugins: [{
        id: 'gaugeNeedle',
        afterDatasetsDraw: (chart) => {
          this.drawNeedle(chart, percentage);
        }
      }, {
        id: 'gaugeText',
        afterDatasetsDraw: (chart) => {
          this.drawCenterText(chart, value, config.title);
        }
      }]
    });

    return this.chart;
  }

  drawNeedle(chart, percentage) {
    const { ctx, chartArea: { width, height } } = chart;
    const centerX = width / 2;
    const centerY = height * 0.85; // Posição Y da base do gauge
    
    // Calcular ângulo da agulha
    const angle = (Math.PI * percentage) / 100 - Math.PI / 2;
    const needleLength = Math.min(width, height) * 0.35;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    // Desenhar agulha
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(needleLength, 0);
    ctx.lineTo(0, 3);
    ctx.fillStyle = '#666';
    ctx.fill();
    
    // Centro da agulha
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    
    ctx.restore();
  }

  drawCenterText(chart, value, title) {
    const { ctx, chartArea: { width, height } } = chart;
    const centerX = width / 2;
    const centerY = height * 0.75;
    
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Valor principal
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(value, centerX, centerY - 10);
    
    // Título (se fornecido)
    if (title) {
      ctx.font = '12px Arial';
      ctx.fillStyle = '#8b9dc3';
      ctx.fillText(title, centerX, centerY + 15);
    }
    
    ctx.restore();
  }

  getGaugeColors(value) {
    // Cores baseadas nos scores
    if (value >= 80) {
      return {
        fill: '#66bb6a', // Verde
        stroke: '#4caf50'
      };
    } else if (value >= 60) {
      return {
        fill: '#ffeb3b', // Amarelo
        stroke: '#fbc02d'
      };
    } else if (value >= 40) {
      return {
        fill: '#ffa726', // Laranja
        stroke: '#f57c00'
      };
    } else {
      return {
        fill: '#ff4757', // Vermelho
        stroke: '#d32f2f'
      };
    }
  }

  update(value) {
    if (!this.chart) return;
    
    const percentage = (value / 100) * 100;
    const colors = this.getGaugeColors(value);
    
    this.chart.data.datasets[0].data = [percentage, 100 - percentage];
    this.chart.data.datasets[0].backgroundColor[0] = colors.fill;
    this.chart.update('active');
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}

export default GaugeChart;