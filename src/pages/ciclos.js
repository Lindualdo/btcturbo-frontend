/* 
Arquivo: src/pages/ciclos.js
Localização: btcturbo-frontend/src/pages/ciclos.js
*/

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
            console.log('📡 Buscando dados da API...');
            const response = await fetch(`${this.baseURL}/calcular-score/ciclos`);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Dados Ciclos recebidos:', data);
            this.updateDashboard(data);
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados de ciclos:', error);
            this.showError('Erro ao carregar dados. Tentando novamente...');
        }
    }

    updateDashboard(data) {
        // Score consolidado
        const scoreText = `Score: ${Math.round(data.score_consolidado * 10)} - ${data.classificacao_consolidada.toUpperCase()}`;
        document.getElementById('score-consolidado').textContent = scoreText;
        
        // Informações gerais
        document.getElementById('peso-bloco').textContent = data.peso_bloco;
        document.getElementById('formula-calculo').textContent = data.calculo.formula;

        // Alertas (se existirem)
        if (data.alertas && data.alertas.length > 0) {
            const alertasContainer = document.getElementById('alertas-container');
            alertasContainer.innerHTML = data.alertas.map(alerta => `<div class="alerta">${alerta}</div>`).join('');
        }

        // Indicadores individuais
        const indicadores = data.indicadores;
        const componentes = data.calculo.componentes;
        
        // MVRV Z-Score
        this.updateIndicator('mvrv', indicadores.MVRV_Z, componentes.mvrv_contribuicao);
        
        // NUPL
        this.updateIndicator('nupl', indicadores.NUPL, componentes.nupl_contribuicao);
        if (!indicadores.NUPL.disponivel) {
            document.getElementById('nupl-card').classList.add('unavailable');
        }
        
        // Realized Ratio
        this.updateIndicator('realized', indicadores.Realized_Ratio, componentes.realized_contribuicao);
        
        // Puell Multiple
        this.updateIndicator('puell', indicadores.Puell_Multiple, componentes.puell_contribuicao);

        // Informações de rebalanceamento
        if (data.rebalanceamento) {
            this.updateRebalanceInfo(data.rebalanceamento);
        }

        console.log('✅ Dashboard atualizado com sucesso!');
    }

    updateIndicator(key, indicador, contribuicao) {
        if (!indicador) return;

        // Atualizar gauge
        const scoreNormalizado = indicador.score * 10; // Score vem de 0-10, converter para 0-100
        this.gauges[key].animateTo(scoreNormalizado);
        
        // Atualizar textos
        const scoreText = `Score: ${Math.round(scoreNormalizado)} - ${indicador.classificacao.toUpperCase()}`;
        document.getElementById(`${key}-score`).textContent = scoreText;
        
        // Valor do indicador
        const valor = indicador.valor !== null ? indicador.valor.toFixed(4) : 'N/A';
        document.getElementById(`${key}-valor`).textContent = valor;
        
        // Peso
        document.getElementById(`${key}-peso`).textContent = indicador.peso;
        
        // Contribuição para o score final
        document.getElementById(`${key}-contribuicao`).textContent = contribuicao.toFixed(2);

        console.log(`✅ ${key.toUpperCase()} atualizado:`, {
            score: scoreNormalizado,
            valor: valor,
            peso: indicador.peso,
            contribuicao: contribuicao
        });
    }

    updateRebalanceInfo(rebalanceamento) {
        const changesContainer = document.getElementById('rebalance-changes');
        const justificativaContainer = document.getElementById('rebalance-justificativa');
        
        if (changesContainer && rebalanceamento.mudancas) {
            const changesHTML = rebalanceamento.mudancas
                .map(mudanca => `<div class="change-item">• ${mudanca}</div>`)
                .join('');
            changesContainer.innerHTML = `
                <h4>Mudanças na versão ${rebalanceamento.versao_atual}:</h4>
                ${changesHTML}
            `;
        }
        
        if (justificativaContainer && rebalanceamento.justificativa) {
            justificativaContainer.innerHTML = `
                <h4>Justificativa:</h4>
                <div class="justificativa-text">${rebalanceamento.justificativa}</div>
            `;
        }
    }

    showError(message) {
        const scoreElement = document.getElementById('score-consolidado');
        if (scoreElement) {
            scoreElement.textContent = message;
            scoreElement.style.color = '#ff6b6b';
        }
        
        // Tentar novamente após 3 segundos
        setTimeout(() => {
            this.loadData();
        }, 3000);
    }

    async refreshData() {
        console.log('🔄 Atualizando dados...');
        await this.loadData();
    }
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.ciclosDashboard = new CiclosDashboard();
    
    // Auto-refresh a cada 2 minutos
    setInterval(() => {
        if (window.ciclosDashboard) {
            window.ciclosDashboard.refreshData();
        }
    }, 2 * 60 * 1000);
});

console.log('🎯 Dashboard Ciclos carregado!');