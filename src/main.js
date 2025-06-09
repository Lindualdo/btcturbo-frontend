/* 
Arquivo: src/main.js
Localização: btcturbo-frontend/src/main.js
*/

import { SimpleGauge, DashboardBase } from './components/shared.js';

class HomeDashboard extends DashboardBase {
    constructor() {
        super();
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando BTC Turbo Dashboard...');
        this.initGauges();
        await this.loadAllData();
    }

    initGauges() {
        this.gauges = {
            mercado: new SimpleGauge(document.getElementById('gauge-mercado')),
            ciclo: new SimpleGauge(document.getElementById('gauge-ciclo')),
            momentum: new SimpleGauge(document.getElementById('gauge-momentum')),
            tecnico: new SimpleGauge(document.getElementById('gauge-tecnico'))
        };
    }

    async loadAllData() {
        try {
            this.showLoading(true);

            const [mercadoData] = await Promise.all([
                this.api.getMercado()
            ]);

            this.updateDashboard(mercadoData);
            this.showLoading(false);
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            this.showLoading(false);
        }
    }

    updateDashboard(mercadoData) {
        console.log('📊 Dados recebidos:', mercadoData);

        // Extrair scores do breakdown
        const breakdown = mercadoData.composicao?.breakdown || {};
        
        const scoreData = {
            mercado: {
                value: this.formatScore(mercadoData.score_consolidado || 0),
                classification: mercadoData.classificacao || 'neutro'
            },
            ciclo: {
                value: this.formatScore(breakdown.ciclos?.score_bruto || 0),
                classification: breakdown.ciclos?.classificacao || 'neutro'
            },
            momentum: {
                value: this.formatScore(breakdown.momentum?.score_bruto || 0),
                classification: breakdown.momentum?.classificacao || 'neutro'
            },
            tecnico: {
                value: this.formatScore(breakdown.tecnico?.score_bruto || 0),
                classification: breakdown.tecnico?.classificacao || 'neutro'
            }
        };

        // Atualizar gauges
        Object.keys(scoreData).forEach(key => {
            if (this.gauges[key]) {
                this.gauges[key].draw(scoreData[key].value);
                this.updateScoreText(key, scoreData[key]);
            }
        });
    }

    updateScoreText(type, scoreData) {
        const valueElement = document.getElementById(`score-${type}-value`);
        if (valueElement) {
            valueElement.textContent = `Score: ${scoreData.value} - ${scoreData.classification}`;
            valueElement.className = 'score-info';
        }
    }

    async refreshData() {
        console.log('🔄 Atualizando dados...');
        await this.loadAllData();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.btcDashboard = new HomeDashboard();
    
    // Auto-refresh a cada 5 minutos
    setInterval(() => window.btcDashboard?.refreshData(), 5 * 60 * 1000);
});

console.log('🎯 BTC Turbo Dashboard carregado!');