/* 
Arquivo: src/pages/mercado-detalhes/components/momentum/Momentum.js
Componente UI do Bloco Momentum - COM SISTEMA DE CORES 5 NÍVEIS
*/

import formatters from '../../../../shared/formatters.js';

export class Momentum {
    constructor() {
        this.canvas = document.getElementById('gauge-momentum');
        this.ctx = this.canvas?.getContext('2d');
        
        this.elements = {
            score: document.getElementById('score-momentum'),
            classification: document.getElementById('class-momentum'),
            soprValor: document.getElementById('sopr-valor'),
            soprBarra: document.getElementById('sopr-barra'),
            rsiSemanalValor: document.getElementById('rsi-semanal-valor'),
            rsiSemanalBarra: document.getElementById('rsi-semanal-barra'),
            fundingValor: document.getElementById('funding-valor'),
            fundingBarra: document.getElementById('funding-barra'),
            longshortValor: document.getElementById('longshort-valor'),
            longshortBarra: document.getElementById('longshort-barra')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('⚡ Renderizando Momentum:', data);

        // Atualizar gauge central
        this.updateGauge(data.score, data.classification);
        
        // Atualizar indicadores com novo sistema de cores
        this.updateIndicator('sopr', data.indicadores.sopr);
        this.updateIndicator('rsiSemanal', data.indicadores.rsi_semanal);
        this.updateIndicator('funding', data.indicadores.funding_rate);
        this.updateIndicator('longshort', data.indicadores.long_short_ratio);

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
        
        // 🎨 NOVO: Usar sistema de cores 5 níveis
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
            
            // 🎨 NOVO: Aplicar sistema de cores 5 níveis
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

export default Momentum;