/* 
Arquivo: src/pages/mercado-detalhes/components/tecnico/Tecnico.js
Componente UI do Bloco Técnico - COM SISTEMA DE CORES 5 NÍVEIS
*/

import formatters from '../../../../shared/formatters.js';

export class Tecnico {
    constructor() {
        this.canvas = document.getElementById('gauge-tecnico');
        this.ctx = this.canvas?.getContext('2d');
        
        this.elements = {
            score: document.getElementById('score-tecnico'),
            classification: document.getElementById('class-tecnico'),
            diarioScoreValor: document.getElementById('diario-score-valor'),
            diarioScoreBarra: document.getElementById('diario-score-barra'),
            diarioPosicaoValor: document.getElementById('diario-posicao-valor'),
            diarioPosicaoBarra: document.getElementById('diario-posicao-barra'),
            semanalScoreValor: document.getElementById('semanal-score-valor'),
            semanalScoreBarra: document.getElementById('semanal-score-barra'),
            semanalPosicaoValor: document.getElementById('semanal-posicao-valor'),
            semanalPosicaoBarra: document.getElementById('semanal-posicao-barra')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('📈 Renderizando Técnico:', data);

        // Atualizar gauge central
        this.updateGauge(data.score, data.classification);
        
        // Atualizar indicadores com novo sistema de cores
        this.updateIndicator('diarioScore', data.indicadores.diario_score);
        this.updateIndicator('diarioPosicao', data.indicadores.diario_posicao);
        this.updateIndicator('semanalScore', data.indicadores.semanal_score);
        this.updateIndicator('semanalPosicao', data.indicadores.semanal_posicao);

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

export default Tecnico;