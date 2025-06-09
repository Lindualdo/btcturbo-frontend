/* 
Arquivo: src/pages/tecnico.js
Localização: btcturbo-frontend/src/pages/tecnico.js
*/

import { ImprovedGaugeChart } from '../components/gauge-chart-improved.js';

class TecnicoDashboard {
    constructor() {
        this.baseURL = 'https://btcturbo-v5-production.up.railway.app/api/v1';
        this.gauges = {};
        this.init();
    }

    async init() {
        console.log('🔄 Iniciando dashboard Técnico...');
        this.initGauges();
        await this.loadData();
    }

    initGauges() {
        this.gauges = {
            'emas-semanal': new ImprovedGaugeChart(document.getElementById('gauge-emas-semanal'), { size: 200 }),
            'emas-diario': new ImprovedGaugeChart(document.getElementById('gauge-emas-diario'), { size: 200 }),
            'bbw': new ImprovedGaugeChart(document.getElementById('gauge-bbw'), { size: 200 })
        };
    }

    async loadData() {
        try {
            const response = await fetch(`${this.baseURL}/calcular-score/tecnico`);
            const data = await response.json();
            console.log('📊 Dados Técnico:', data);
            this.updateDashboard(data);
        } catch (error) {
            console.error('❌ Erro ao carregar dados técnicos:', error);
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
            'emas-semanal': this.findIndicador(data.indicadores, ['EMAs_Semanal', 'EMAS_SEMANAL', 'EMA_Semanal']),
            'emas-diario': this.findIndicador(data.indicadores, ['EMAs_Diario', 'EMAS_DIARIO', 'EMA_Diario']),
            'bbw': this.findIndicador(data.indicadores, ['BBW', 'Bollinger_Width'])
        };

        // Atualizar cada indicador
        Object.keys(indicadorMap).forEach(key => {
            const indicador = indicadorMap[key];
            if (indicador) {
                this.updateIndicador(key, indicador);
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

    updateIndicador(key, indicador) {
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
    new TecnicoDashboard();
});