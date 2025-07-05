/* 
Arquivo: Tendencia.js
Caminho: src/pages/estrategia-detalhes/components/tendencia/Tendencia.js
Componente UI do Bloco Tendência (EMAs)
*/

import formatters from '../../../../shared/formatters.js';

export class Tendencia {
    constructor() {
        this.canvas = document.getElementById('gauge-tendencia');
        this.ctx = this.canvas?.getContext('2d');
        
        this.elements = {
            score: document.getElementById('score-tendencia'),
            classification: document.getElementById('class-tendencia'),
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

        console.log('📈 Renderizando Tendência:', data);

        // Atualizar gauge central
        this.updateGauge(data.score, data.classification);
        
        // Atualizar indicadores EMAs com distâncias
        this.updateEmaDistance('ema10', data.emas.ema10);
        this.updateEmaDistance('ema20', data.emas.ema20);
        this.updateEmaDistance('ema50', data.emas.ema50);
        this.updateEmaDistance('ema100', data.emas.ema100);
        this.updateEmaDistance('ema200', data.emas.ema200);
        this.updateEmaDistance('btcPrice', data.emas.btcPrice);

        this.clearLoading();
    }

    updateGauge(score, classification) {
        if (!this.ctx) return;

        // Limpar canvas
        this.ctx.clearRect(0, 0, 200, 200);

        // Configurações do gauge
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        const startAngle = -Math.PI;
        const endAngle = 0;

        // Background do gauge
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        this.ctx.lineWidth = 15;
        this.ctx.strokeStyle = '#404552';
        this.ctx.stroke();

        // Preenchimento baseado no score (0-100)
        const scoreAngle = startAngle + (score / 100) * Math.PI;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, startAngle, scoreAngle);
        this.ctx.lineWidth = 15;
        
        // Usar sistema de cores 5 níveis
        const colors = formatters.getScoreColor(score);
        this.ctx.strokeStyle = colors.solid;
        
        this.ctx.stroke();

        // Atualizar textos
        if (this.elements.score) {
            this.elements.score.textContent = score.toFixed(1);
        }
        
        if (this.elements.classification) {
            this.elements.classification.textContent = classification;
        }
    }

    updateEmaDistance(name, emaData) {
        const priceElement = this.elements[`${name}Price`];
        const distanceElement = this.elements[`${name}Distance`];

        if (priceElement) {
            priceElement.textContent = emaData.price;
        }

        if (distanceElement && name !== 'btcPrice') {
            distanceElement.textContent = emaData.distanceText;
            
            // Aplicar cores baseadas na distância
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
            if (element && !key.includes('Distance')) {
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
            this.ctx.clearRect(0, 0, 200, 200);
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