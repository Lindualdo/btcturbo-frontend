/* 
Arquivo: Ciclo.js
Caminho: src/pages/estrategia-detalhes/components/ciclo/Ciclo.js
Componente UI do Bloco Ciclo - GAUGE MODERNO COM COR DINÂMICA + BARRAS COM GRADIENTE E INDICADORES
*/

import formatters from '../../../../shared/formatters.js';

export class Ciclo {
    constructor() {
        this.canvas = document.getElementById('gauge-ciclo');
        this.ctx = this.canvas?.getContext('2d');
        
        this.elements = {
            score: document.getElementById('score-ciclo'),
            updateTime: document.getElementById('update-ciclo'),
            nuplValor: document.getElementById('nupl-valor'),
            nuplIndicator: document.getElementById('nupl-indicator'),
            mvrvValor: document.getElementById('mvrv-valor'),
            mvrvIndicator: document.getElementById('mvrv-indicator'),
            reserveValor: document.getElementById('reserve-valor'),
            reserveIndicator: document.getElementById('reserve-indicator'),
            puellValor: document.getElementById('puell-valor'),
            puellIndicator: document.getElementById('puell-indicator')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('🔄 Renderizando Ciclo Moderno (COR DINÂMICA + BARRAS COM GRADIENTE):', data);

        // Atualizar gauge moderno
        this.updateModernGauge(data.score, data.classification);
        
        // Atualizar textos
        this.updateElement('score', data.score.toFixed(0));
        this.updateCurrentTime();
        
        // Atualizar indicadores de ciclo com novo sistema
        this.updateIndicator('nupl', data.indicadores.nupl);
        this.updateIndicator('mvrv', data.indicadores.mvrv);
        this.updateIndicator('reserve', data.indicadores.reserve);
        this.updateIndicator('puell', data.indicadores.puell);

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
        
        // Criar gradiente para o arco COMPLETO (invertido: Caro -> Barato)
        const gradient = this.ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
        gradient.addColorStop(0, '#ff4757');    // Vermelho (0) - Caro
        gradient.addColorStop(0.25, '#ff6b35'); // Laranja
        gradient.addColorStop(0.5, '#ffa726');  // Amarelo
        gradient.addColorStop(0.75, '#8bc34a'); // Verde claro
        gradient.addColorStop(1, '#4caf50');    // Verde forte (100) - Barato
        
        // Arco SEMPRE COMPLETO com gradiente
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = gradient;
        this.ctx.stroke();
        
        // ✅ FUNÇÃO PARA OBTER COR DINÂMICA BASEADA NO SCORE
        const getIndicatorColor = (percentage) => {
            console.log(`🎨 Calculando cor para score: ${percentage}`);
            if (percentage <= 20) return '#ff4757';      // Vermelho
            if (percentage <= 40) return '#ff6b35';      // Laranja
            if (percentage <= 60) return '#ffa726';      // Amarelo
            if (percentage <= 80) return '#8bc34a';      // Verde claro
            return '#4caf50';                            // Verde forte
        };
        
        // Indicador (ponto) na posição do score
        const indicatorAngle = Math.PI + (score / 100) * Math.PI;
        const indicatorX = centerX + Math.cos(indicatorAngle) * radius;
        const indicatorY = centerY + Math.sin(indicatorAngle) * radius;
        
        // Círculo externo do indicador (anel escuro)
        this.ctx.beginPath();
        this.ctx.arc(indicatorX, indicatorY, 12, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#1a1d29';
        this.ctx.fill();
        
        // ✅ CÍRCULO INTERNO COM COR DINÂMICA
        const dynamicColor = getIndicatorColor(score);
        console.log(`🎨 Aplicando cor dinâmica: ${dynamicColor} para score ${score}`);
        
        this.ctx.beginPath();
        this.ctx.arc(indicatorX, indicatorY, 8, 0, 2 * Math.PI);
        this.ctx.fillStyle = dynamicColor;
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

    updateIndicator(name, indicadorData) {
        const valorElement = this.elements[`${name}Valor`];
        const indicatorElement = this.elements[`${name}Indicator`];

        if (valorElement) {
            valorElement.textContent = indicadorData.valor;
        }

        if (indicatorElement) {
            const percentage = Math.min(Math.max(indicadorData.score, 0), 100);
            
            // Posicionar indicador na barra (0% = esquerda, 100% = direita)
            indicatorElement.style.left = `${percentage}%`;
            
            // Cor do indicador baseada no score (mesmo sistema dos gauges)
            let indicatorColor;
            if (percentage <= 20) {
                indicatorColor = '#ff4757';      // Vermelho
            } else if (percentage <= 40) {
                indicatorColor = '#ff6b35';      // Laranja
            } else if (percentage <= 60) {
                indicatorColor = '#ffa726';      // Amarelo
            } else if (percentage <= 80) {
                indicatorColor = '#8bc34a';      // Verde claro
            } else {
                indicatorColor = '#4caf50';      // Verde forte
            }
            
            indicatorElement.style.backgroundColor = indicatorColor;
            
            console.log(`🎯 ${name}: ${percentage}% → ${indicatorColor}`);
        }
    }

    showLoading() {
        // Loading nos elementos de texto
        Object.entries(this.elements).forEach(([key, element]) => {
            if (element && !key.includes('Indicator') && !key.includes('updateTime')) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        // Reset dos indicadores
        ['nupl', 'mvrv', 'reserve', 'puell'].forEach(name => {
            const indicatorElement = this.elements[`${name}Indicator`];
            if (indicatorElement) {
                indicatorElement.style.left = '0%';
                indicatorElement.style.backgroundColor = '#666';
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
            if (element && !key.includes('Indicator')) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        // Reset dos indicadores
        ['nupl', 'mvrv', 'reserve', 'puell'].forEach(name => {
            const indicatorElement = this.elements[`${name}Indicator`];
            if (indicatorElement) {
                indicatorElement.style.left = '0%';
                indicatorElement.style.backgroundColor = '#ff4757';
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

export default Ciclo;