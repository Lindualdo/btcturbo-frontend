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
            'funding-rates': new SimpleGauge(document.getElementById('gauge-funding-rates')),
            'sopr': new SimpleGauge(document.getElementById('gauge-sopr')),
            'long-short': new SimpleGauge(document.getElementById('gauge-long-short'))
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
            'rsi-semanal': this.findIndicador(data.indicadores, ['RSI_Semanal']),
            'funding-rates': this.findIndicador(data.indicadores, ['Funding_Rates']),
            'sopr': this.findIndicador(data.indicadores, ['SOPR']),
            'long-short': this.findIndicador(data.indicadores, ['Long_Short_Ratio'])
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

        const scoreNormalizado = this.formatScore(indicador.score * 10);
        this.gauges[key].draw(scoreNormalizado);
        
        // SOPR indisponível
        if (key === 'sopr' && !indicador.disponivel) {
            document.getElementById('sopr-card').classList.add('unavailable');
        }
        
        const scoreText = `Score: ${scoreNormalizado} - ${indicador.classificacao.toUpperCase()}`;
        this.updateElement(`${key}-score`, scoreText);
        
        const valor = indicador.valor ? (key === 'funding-rates' ? indicador.valor : indicador.valor.toFixed(4)) : 'N/A';
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