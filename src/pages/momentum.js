/* 
Arquivo: src/pages/momentum.js
Localização: btcturbo-frontend/src/pages/momentum.js
*/

import { SimpleGauge, DashboardBase } from '../components/shared.js';

class MomentumDashboard extends DashboardBase {
    constructor() {
        super();
        this.init();
    }

    async init() {
        console.log('🔄 Iniciando dashboard de Momentum...');
        this.initGauges();
        await this.loadData();
    }

    initGauges() {
        this.gauges = {
            'rsi-semanal': new SimpleGauge(document.getElementById('gauge-rsi-semanal')),
            'rsi-mensal': new SimpleGauge(document.getElementById('gauge-rsi-mensal')),
            'macd-semanal': new SimpleGauge(document.getElementById('gauge-macd-semanal')),
            'stoch-rsi': new SimpleGauge(document.getElementById('gauge-stoch-rsi'))
        };
    }

    async loadData() {
        try {
            this.showLoading(true);
            const data = await this.api.getMomentum();
            console.log('📊 Dados Momentum:', data);
            this.updateDashboard(data);
            this.showLoading(false);
        } catch (error) {
            this.showError('Erro ao carregar dados. Tentando novamente...');
            setTimeout(() => this.loadData(), 3000);
        }
    }

    updateDashboard(data) {
        // Score consolidado
        const scoreText = `Score: ${this.formatScore(data.score_consolidado_100)} - ${data.classificacao_consolidada.toUpperCase()}`;
        this.updateElement('score-consolidado', scoreText);
        this.updateElement('peso-bloco', data.peso_bloco);

        // Mapear indicadores
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

        const scoreNormalizado = this.formatScore(indicador.score);
        this.gauges[key].draw(scoreNormalizado);
        
        const scoreText = `Score: ${scoreNormalizado} - ${indicador.classificacao.toUpperCase()}`;
        this.updateElement(`${key}-score`, scoreText);
        
        const valor = indicador.valor ? indicador.valor.toFixed(2) : 'N/A';
        this.updateElement(`${key}-valor`, valor);
        this.updateElement(`${key}-peso`, indicador.peso || '-');
    }

    async refreshData() {
        console.log('🔄 Atualizando dados...');
        await this.loadData();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.momentumDashboard = new MomentumDashboard();
    
    // Auto-refresh a cada 2 minutos
    setInterval(() => window.momentumDashboard?.refreshData(), 2 * 60 * 1000);
});

console.log('🎯 Dashboard Momentum carregado!');