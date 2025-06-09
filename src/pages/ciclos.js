/* 
Arquivo: src/pages/ciclos.js
Localização: btcturbo-frontend/src/pages/ciclos.js
*/

import { SimpleGauge, DashboardBase } from '../components/shared.js';

class CiclosDashboard extends DashboardBase {
    constructor() {
        super();
        this.init();
    }

    async init() {
        console.log('🔄 Iniciando dashboard de Ciclos...');
        this.initGauges();
        await this.loadData();
    }

    initGauges() {
        this.gauges = {
            mvrv: new SimpleGauge(document.getElementById('gauge-mvrv')),
            nupl: new SimpleGauge(document.getElementById('gauge-nupl')),
            realized: new SimpleGauge(document.getElementById('gauge-realized')),
            puell: new SimpleGauge(document.getElementById('gauge-puell'))
        };
    }

    async loadData() {
        try {
            this.showLoading(true);
            const data = await this.api.getCiclos();
            console.log('📊 Dados Ciclos:', data);
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

        // Indicadores
        const { indicadores } = data;
        
        this.updateIndicator('mvrv', indicadores.MVRV_Z);
        this.updateIndicator('nupl', indicadores.NUPL);
        this.updateIndicator('realized', indicadores.Realized_Ratio);
        this.updateIndicator('puell', indicadores.Puell_Multiple);
    }

    updateIndicator(key, indicador) {
        if (!indicador) return;

        const scoreNormalizado = this.formatScore(indicador.score);
        this.gauges[key].draw(scoreNormalizado);
        
        // NUPL indisponível
        if (key === 'nupl' && !indicador.disponivel) {
            document.getElementById('nupl-card').classList.add('unavailable');
        }
        
        const scoreText = `Score: ${scoreNormalizado} - ${indicador.classificacao.toUpperCase()}`;
        this.updateElement(`${key}-score`, scoreText);
        
        const valor = indicador.valor !== null ? indicador.valor.toFixed(4) : 'N/A';
        this.updateElement(`${key}-valor`, valor);
        this.updateElement(`${key}-peso`, indicador.peso);
    }

    async refreshData() {
        console.log('🔄 Atualizando dados...');
        await this.loadData();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.ciclosDashboard = new CiclosDashboard();
    
    // Auto-refresh a cada 2 minutos
    setInterval(() => window.ciclosDashboard?.refreshData(), 2 * 60 * 1000);
});

console.log('🎯 Dashboard Ciclos carregado!');