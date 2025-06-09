import { ImprovedGaugeChart } from '../components/gauge-chart-improved.js';

class CiclosDashboard {
    constructor() {
        this.baseURL = 'https://btcturbo-v5-production.up.railway.app/api/v1';
        this.gauges = {};
        this.init();
    }

    async init() {
        console.log('🔄 Iniciando dashboard de Ciclos...');
        this.initGauges();
        await this.loadData();
    }

    initGauges() {
        this.gauges = {
            mvrv: new ImprovedGaugeChart(document.getElementById('gauge-mvrv'), { size: 200 }),
            nupl: new ImprovedGaugeChart(document.getElementById('gauge-nupl'), { size: 200 }),
            realized: new ImprovedGaugeChart(document.getElementById('gauge-realized'), { size: 200 }),
            puell: new ImprovedGaugeChart(document.getElementById('gauge-puell'), { size: 200 })
        };
    }

    async loadData() {
        try {
            const response = await fetch(`${this.baseURL}/calcular-score/ciclos`);
            const data = await response.json();
            console.log('📊 Dados Ciclos:', data);
            this.updateDashboard(data);
        } catch (error) {
            console.error('❌ Erro ao carregar dados de ciclos:', error);
        }
    }

    updateDashboard(data) {
        // Score consolidado
        document.getElementById('score-consolidado').textContent = 
            `Score: ${Math.round(data.score_consolidado * 10)} - ${data.classificacao_consolidada}`;
        
        document.getElementById('peso-bloco').textContent = data.peso_bloco;
        document.getElementById('formula-calculo').textContent = data.calculo.formula;

        // Indicadores
        const indicadores = data.indicadores;
        
        // MVRV Z-Score
        this.updateIndicator('mvrv', indicadores.MVRV_Z, data.calculo.componentes.mvrv_contribuicao);
        
        // NUPL
        this.updateIndicator('nupl', indicadores.NUPL, data.calculo.componentes.nupl_contribuicao);
        if (!indicadores.NUPL.disponivel) {
            document.getElementById('nupl-card').classList.add('unavailable');
        }
        
        // Realized Ratio
        this.updateIndicator('realized', indicadores.Realized_Ratio, data.calculo.componentes.realized_contribuicao);
        
        // Puell Multiple
        this.updateIndicator('puell', indicadores.Puell_Multiple, data.calculo.componentes.puell_contribuicao);
    }

    updateIndicator(key, indicador, contribuicao) {
        // Gauge
        this.gauges[key].animateTo(indicador.score * 10);
        
        // Textos
        document.getElementById(`${key}-score`).textContent = 
            `Score: ${Math.round(indicador.score * 10)} - ${indicador.classificacao}`;
        
        document.getElementById(`${key}-valor`).textContent = 
            indicador.valor ? indicador.valor.toFixed(2) : 'N/A';
        
        document.getElementById(`${key}-peso`).textContent = indicador.peso;
        document.getElementById(`${key}-contribuicao`).textContent = contribuicao.toFixed(2);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new CiclosDashboard();
});