/* 
Arquivo: Tendencia.js
Caminho: src/pages/estrategia-detalhes/components/tendencia/Tendencia.js
Componente UI do Bloco Tendência - GAUGE MODERNO SEMICÍRCULO
*/

import formatters from '../../../../shared/formatters.js';

export class Tendencia {
    constructor() {
        this.canvas = document.getElementById('gauge-tendencia');
        this.ctx = this.canvas?.getContext('2d');
        
        this.elements = {
            score: document.getElementById('score-tendencia'),
            classification: document.getElementById('class-tendencia'),
            updateTime: document.getElementById('update-tendencia'),
            ema10Price: document.getElementById('ema-10-valor'),
            ema10Distance: document.getElementById('ema-10-distance'),
            ema20Price: document.getElementById('ema-20-valor'),
            ema20Distance: document.getElementById('ema-20-distance'),
            ema50Price: document.getElementById('ema-50-valor'),
            ema50Distance: document.getElementById('ema-50-distance'),
            ema100Price: document.getElementById('ema-100-valor'),
            ema100Distance: document.getElementById('ema-100-distance'),
            ema200Price: document.getElementById('ema-200-valor'),
            ema200Distance: document.getElementById('ema-200-distance'),
            btcPriceValor: document.getElementById('btc-price-valor')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('📈 Renderizando Tendência Moderna:', data);

        // Atualizar gauge moderno
        this.updateModernGauge(data.score, data.classification);
        
        // Atualizar textos
        this.updateElement('score', data.score.toFixed(0));
        this.updateElement('classification', data.classification.toUpperCase());
        this.updateCurrentTime();
        
        // Atualizar indicadores EMAs com distâncias
        this.updateEmaDistance('ema10', data.emas.ema10);
        this.updateEmaDistance('ema20', data.emas.ema20);
        this.updateEmaDistance('ema50', data.emas.ema50);
        this.updateEmaDistance('ema100', data.emas.ema100);
        this.updateEmaDistance('ema200', data.emas.ema200);
        this.updateEmaDistance('btcPrice', data.emas.btcPrice);

        this.clearLoading();
    }

    updateModernGauge(score, classification) {
        if (!this.ctx) return;

        const centerX = 120;
        const centerY = 110;
        const radius = 90;
        const lineWidth = 20;
        
        // Limpar canvas
        this.ctx.clearRect(0, 0, 240, 140);
        
        // Criar gradiente para o arco COMPLETO
        const gradient = this.ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
        gradient.addColorStop(0, '#ff4757');    // Vermelho (0) - Bear
        gradient.addColorStop(0.25, '#ff6b35'); // Laranja
        gradient.addColorStop(0.5, '#ffa726');  // Amarelo
        gradient.addColorStop(0.75, '#8bc34a'); // Verde claro
        gradient.addColorStop(1, '#4caf50');    // Verde forte (100) - Bull
        
        // Arco SEMPRE COMPLETO com gradiente
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = gradient;
        this.ctx.stroke();
        
        // Indicador (ponto) na posição do score
        const indicatorAngle = Math.PI + (score / 100) * Math.PI;
        const indicatorX = centerX + Math.cos(indicatorAngle) * radius;
        const indicatorY = centerY + Math.sin(indicatorAngle) * radius;
        
        // Círculo externo do indicador
        this.ctx.beginPath();
        this.ctx.arc(indicatorX, indicatorY, 12, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#1a1d29';
        this.ctx.fill();
        
        // Círculo interno do indicador
        this.ctx.beginPath();
        this.ctx.arc(indicatorX, indicatorY, 8, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ff8c42';
        this.ctx.fill();
    }

    updateElement(key, value) {
        const element = this.elements[key];
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
        }
    }

    updateCurrentTime() {
        if (this.elements.updateTime) {
            const now = new Date();
            this.elements.updateTime.textContent = now.toLocaleTimeString('pt-PT', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Lisbon'
            });
        }
    }

    updateEmaDistance(name, emaData) {
        if (name === 'btcPrice') {
            // Caso especial para preço atual
            const priceElement = this.elements.btcPriceValor;
            if (priceElement) {
                priceElement.textContent = emaData.price;
            }
            return;
        }
        
        // Lógica normal para EMAs
        const priceElement = this.elements[`${name}Price`];
        const distanceElement = this.elements[`${name}Distance`];
        
        if (priceElement) {
            priceElement.textContent = emaData.price;
        }
        
        if (distanceElement) {
            distanceElement.textContent = emaData.distanceText;
            distanceElement.classList.remove('positive', 'negative');
            if (emaData.distance >= 0) {
                distanceElement.classList.add('positive');
            } else {
                distanceElement.classList.add('negative');
            }
        }
    }

    showLoading() {
        // Loading nos elementos de texto
        Object.entries(this.elements).forEach(([key, element]) => {
            if (element && !key.includes('Distance') && !key.includes('updateTime')) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        // Reset das distâncias
        ['ema10Distance', 'ema20Distance', 'ema50Distance', 'ema100Distance', 'ema200Distance'].forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = '--';
                element.classList.remove('positive', 'negative');
            }
        });

        // Limpar gauge
        if (this.ctx) {
            this.ctx.clearRect(0, 0, 240, 140);
        }

        if (this.elements.updateTime) {
            this.elements.updateTime.textContent = '--:--';
        }
    }

    showError() {
        Object.entries(this.elements).forEach(([key, element]) => {
            if (element && !key.includes('Distance')) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        // Reset das distâncias
        ['ema10Distance', 'ema20Distance', 'ema50Distance', 'ema100Distance', 'ema200Distance'].forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Erro';
                element.classList.remove('positive', 'negative');
            }
        });

        if (this.elements.updateTime) {
            this.elements.updateTime.textContent = '--:--';
        }
    }

    clearLoading() {
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.classList.remove('loading');
            }
        });
    }
}

export default Tendencia;