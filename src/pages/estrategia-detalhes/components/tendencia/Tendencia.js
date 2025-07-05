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
            ema10Valor: document.getElementById('ema-10-valor'),
            ema10Barra: document.getElementById('ema-10-barra'),
            ema20Valor: document.getElementById('ema-20-valor'),
            ema20Barra: document.getElementById('ema-20-barra'),
            ema50Valor: document.getElementById('ema-50-valor'),
            ema50Barra: document.getElementById('ema-50-barra'),
            btcPriceValor: document.getElementById('btc-price-valor'),
            btcPriceBarra: document.getElementById('btc-price-barra')
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
        
        // Atualizar indicadores EMAs
        this.updateIndicator('ema10', data.emas.ema10);
        this.updateIndicator('ema20', data.emas.ema20);
        this.updateIndicator('ema50', data.emas.ema50);
        this.updateIndicator('btcPrice', data.emas.btcPrice);

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

    updateIndicator(name, indicadorData) {
        const valorElement = this.elements[`${name}Valor`];
        const barraElement = this.elements[`${name}Barra`];

        if (valorElement) {
            valorElement.textContent = indicadorData.valor;
        }

        if (barraElement) {
            const percentage = indicadorData.score;
            barraElement.style.width = `${Math.min(percentage, 100)}%`;
            
            // Aplicar sistema de cores 5 níveis
            formatters.applyScoreColor(barraElement, percentage);
        }
    }

    showLoading() {
        // Loading nos elementos de texto
        Object.entries(this.elements).forEach(([key, element]) => {
            if (element && !key.includes('Barra')) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        // Reset das barras
        Object.entries(this.elements).forEach(([key, element]) => {
            if (element && key.includes('Barra')) {
                element.style.width = '0%';
            }
        });

        // Limpar gauge
        if (this.ctx) {
            this.ctx.clearRect(0, 0, 200, 200);
        }
    }

    showError() {
        Object.entries(this.elements).forEach(([key, element]) => {
            if (element && !key.includes('Barra')) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        // Reset das barras
        Object.entries(this.elements).forEach(([key, element]) => {
            if (element && key.includes('Barra')) {
                element.style.width = '0%';
                element.style.background = '#666';
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