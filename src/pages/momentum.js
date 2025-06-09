/* 
Arquivo: src/pages/momentum.js
Localização: btcturbo-frontend/src/pages/momentum.js
*/

import { ImprovedGaugeChart } from '../components/gauge-chart-improved.js';

class MomentumDashboard {
    constructor() {
        this.baseURL = 'https://btcturbo-v5-production.up.railway.app/api/v1';
        this.gauges = {};
        this.init();
    }

    async init() {
        console.log('🔄 Iniciando dashboard de Momentum...');
        this.initGauges();
        await this.loadData();
    }

    initGauges() {
        this.gauges = {
            'rsi-semanal': new ImprovedGaugeChart(document.getElementById('gauge-rsi-semanal'), { size: 200 }),
            'rsi-mensal': new ImprovedGaugeChart(document.getElementById('gauge-rsi-mensal'), { size: 200 }),
            'macd-semanal': new ImprovedGaugeChart(document.getElementById('gauge-macd-semanal'), { size: 200 }),
            'stoch-rsi': new ImprovedGaugeChart(document.getElementById('gauge-stoch-rsi'), { size: 200 })
        };
    }

    async loadData() {
        try {
            const response = await fetch(`${this.baseURL}/calcular-score/momentum`);
            const data = await response.json();
            console.log('📊 Dados Momentum:', data);
            this.updateDashboard(data);
        } catch (error) {
            console.error('❌ Erro ao carregar dados de momentum:', error);
        }
    }

    updateDashboard(data) {
        // Score consolidado
        document.getElementById('score-consolidado').textContent = 
            `Score: ${Math.round(data.score_consolidado * 10)} - ${data.classificacao_consolidada}`;
        
        document.getElementById('peso-bloco').textContent = data.peso_bloco;
        document.getElementById('formula-calculo').textContent = data.calculo.formula;

        // Mapear indicadores para chaves dos gauges
        const indicadorMap = {
            'rsi-semanal': this.findIndicador(data.indicadores, ['RSI_Semanal', 'RSI_SEMANAL']),
            'rsi-mensal': this.findIndicador(data.indicadores, ['RSI_Mensal', 'RSI_MENSAL']),
            'macd-semanal': this.findIndicador(data.indicadores, ['MACD_Semanal', 'MACD_SEMANAL']),
            'stoch-rsi': this.findIndicador(data.indicadores, ['Stoch_RSI', 'STOCH_RSI'])
        };

        // Atualizar cada indicador
        Object.keys(indicadorMap).forEach(key => {
            const indicador = indicadorMap[key];
            if (indicador) {
                this.updateIndicator(key, indicador);
            }
        });
    }

    findIndicador(indicadores, possibleKeys) {
        for (const key of possibleKeys) {
            if (indicadores[key]) {
                return indicadores[key];
            }
        }
        return null;
    }

    updateIndicator(key, indicador) {
        if (!indicador) return;

        // Gauge
        this.gauges[key].animateTo(indicador.score * 10);
        
        // Textos
        document.getElementById(`${key}-score`).textContent = 
            `Score: ${Math.round(indicador.score * 10)} - ${indicador.classificacao}`;
        
        document.getElementById(`${key}-valor`).textContent = 
            indicador.valor ? indicador.valor.toFixed(2) : 'N/A';
        
        document.getElementById(`${key}-peso`).textContent = indicador.peso || '-';
        document.getElementById(`${key}-contribuicao`).textContent = 
            indicador.score_consolidado ? indicador.score_consolidado.toFixed(2) : '-';
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new MomentumDashboard();
});