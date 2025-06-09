// Gauge Chart Melhorado - Idêntico ao Design Original

export class ImprovedGaugeChart {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chart = null;
    this.defaultOptions = {
      value: 0,
      min: 0,
      max: 100,
      title: '',
      size: 200,
      thickness: 20, // Mais fino que o original
      ...options
    };
  }

  create(value, options = {}) {
    const config = { ...this.defaultOptions, ...options };
    
    // Configurar canvas
    this.setupCanvas(config.size);
    
    // Limpar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Calcular valores
    const percentage = ((value - config.min) / (config.max - config.min)) * 100;
    const center = config.size / 2;
    const radius = center - config.thickness - 10;
    
    // Desenhar gauge background
    this.drawGaugeBackground(center, radius, config.thickness);
    
    // Desenhar gauge colorido (gradiente)
    this.drawGaugeProgress(center, radius, config.thickness, percentage, value);
    
    // Desenhar agulha elegante
    this.drawElegantNeedle(center, radius, percentage);
    
    // Desenhar texto central
    this.drawCenterText(center, value, config.title);
    
    return this;
  }

  setupCanvas(size) {
    this.canvas.width = size;
    this.canvas.height = size * 0.7; // Proporção do semicírculo
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size * 0.7}px`;
  }

  drawGaugeBackground(centerX, radius, thickness) {
    const centerY = centerX; // Centro Y igual ao X para semicírculo
    
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    this.ctx.lineWidth = thickness;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineCap = 'round';
    this.ctx.stroke();
  }

  drawGaugeProgress(centerX, radius, thickness, percentage, value) {
    const centerY = centerX;
    
    // Criar gradiente baseado no score
    const gradient = this.createGradient(centerX, centerY, radius, value);
    
    // Calcular ângulo baseado na porcentagem
    const startAngle = Math.PI;
    const endAngle = Math.PI + (Math.PI * percentage / 100);
    
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    this.ctx.lineWidth = thickness;
    this.ctx.strokeStyle = gradient;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();
  }

  createGradient(centerX, centerY, radius, value) {
    const gradient = this.ctx.createConicGradient(Math.PI, centerX, centerY);
    
    // Gradiente baseado no score (igual ao seu design)
    if (value >= 80) {
      // Verde completo
      gradient.addColorStop(0, '#ff4757');    // Vermelho início
      gradient.addColorStop(0.3, '#ffa726');  // Laranja
      gradient.addColorStop(0.6, '#ffeb3b');  // Amarelo
      gradient.addColorStop(1, '#66bb6a');    // Verde final
    } else if (value >= 60) {
      // Verde-amarelo
      gradient.addColorStop(0, '#ff4757');    // Vermelho
      gradient.addColorStop(0.4, '#ffa726');  // Laranja
      gradient.addColorStop(0.7, '#ffeb3b');  // Amarelo
      gradient.addColorStop(1, '#a5d6a7');    // Verde claro
    } else if (value >= 40) {
      // Amarelo-laranja
      gradient.addColorStop(0, '#ff4757');    // Vermelho
      gradient.addColorStop(0.5, '#ffa726');  // Laranja
      gradient.addColorStop(1, '#ffeb3b');    // Amarelo
    } else {
      // Vermelho-laranja
      gradient.addColorStop(0, '#ff4757');    // Vermelho
      gradient.addColorStop(1, '#ff8a65');    // Laranja claro
    }
    
    return gradient;
  }

  drawElegantNeedle(centerX, radius, percentage) {
    const centerY = centerX;
    const needleLength = radius - 15;
    
    // Calcular ângulo da agulha
    const angle = Math.PI + (Math.PI * percentage / 100);
    
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(angle);
    
    // Agulha mais elegante e fina
    this.ctx.beginPath();
    this.ctx.moveTo(0, -2);
    this.ctx.lineTo(needleLength, 0);
    this.ctx.lineTo(0, 2);
    this.ctx.closePath();
    
    // Gradiente na agulha
    const needleGradient = this.ctx.createLinearGradient(0, 0, needleLength, 0);
    needleGradient.addColorStop(0, '#666');
    needleGradient.addColorStop(1, '#999');
    
    this.ctx.fillStyle = needleGradient;
    this.ctx.fill();
    
    // Sombra da agulha
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.ctx.shadowBlur = 3;
    this.ctx.shadowOffsetY = 1;
    this.ctx.fill();
    
    this.ctx.restore();
    
    // Centro da agulha mais elegante
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    this.ctx.fillStyle = '#444';
    this.ctx.fill();
    
    // Brilho no centro
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = '#666';
    this.ctx.fill();
  }

  drawCenterText(centerX, value, title) {
    const centerY = centerX + 40; // Abaixo do gauge
    
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // Valor principal (maior e mais destacado)
    this.ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(value, centerX, centerY);
    
    // Título (se fornecido)
    if (title) {
      this.ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      this.ctx.fillStyle = '#8b9dc3';
      this.ctx.fillText(title, centerX, centerY + 25);
    }
  }

  // Animação suave
  animateTo(targetValue, duration = 1500) {
    const startValue = this.currentValue || 0;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (targetValue - startValue) * easedProgress;
      this.create(currentValue);
      this.currentValue = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  update(value) {
    this.animateTo(value);
  }

  destroy() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

export default ImprovedGaugeChart;