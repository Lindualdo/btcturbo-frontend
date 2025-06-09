/* 
Arquivo: src/pages/tecnico.js
Localização: btcturbo-frontend/src/pages/tecnico.js
*/

import { SimpleGauge, DashboardBase } from '../components/shared.js';

class TecnicoDashboard extends DashboardBase {
    constructor() {
        super();
        this.init();
    }

    async init() {
        console.log('🔄 Iniciando dashboard Técnico...');
        this.initGauges();
        await this.loadData();
    }

    initGauges() {
        this.gauges = {
            'emas-semanal': new SimpleGauge(document.getElementById('gauge-emas-semanal')),
            'emas-diario': new SimpleGauge(document.getElementById('gauge-emas-diario')),
            'bbw': new SimpleGauge(document.getElementById('gauge-bbw'))
        };
    }

    async loadData() {
        try {
            this.showLoading(true);
            const data = await this.api.getTecnico();
            console.log('📊 Dados Técnico:', data);
            this.updateDashboard(data);
            this.showLoading(false);
        } catch (error) {
            this.showError('Erro ao carregar dados. Tentando novamente...');
            setTimeout(() => this.loadData(), 3000);
        }
    }

    updateDashboard(data) {
        // Score consolidado
        const scoreText = `Score: ${this.formatScore(data.score_consolidado)} - ${data.classificacao_consolidada.toUpperCase()}`;
        this.updateElement('score-consolidado', scoreText);
        this.updateElement('peso-bloco', data.peso_bloco);

        // Mapear indicadores
        const indicadorMap = {
            'emas-semanal': this.findIndicador(data.indicadores, ['EMAs_Semanal', 'EMAS_SEMANAL', 'EMA_Semanal']),
            'emas-diario': this.findIndicador(data.indicadores, ['EMAs_Diario', 'EMAS_DIARIO', 'EMA_Diario']),
            'bbw': this.findIndicador(data.indicadores, ['BBW', 'Bollinger_Width'])
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
        
        const contribuicao = indicador.score_consolidado ? indicador.score_consolidado.toFixed(2) : '-';
        this.updateElement(`${key}-contribuicao`, contribuicao);
    }

    async refreshData() {
        console.log('🔄 Atualizando dados...');
        await this.loadData();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.tecnicoDashboard = new TecnicoDashboard();
    
    // Auto-refresh a cada 2 minutos
    setInterval(() => window.tecnicoDashboard?.refreshData(), 2 * 60 * 1000);
});

console.log('🎯 Dashboard Técnico carregado!');