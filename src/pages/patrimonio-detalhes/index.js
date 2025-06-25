/* 
Arquivo: src/pages/patrimonio-detalhes/index.js
Orquestrador da página Patrimônio Detalhes
*/

import ApiClient from '../../shared/api.js';
import { API_CONFIG } from '../../shared/constants.js';

// Componentes UI
import PatrimonioUsdChart from './components/patrimonio-usd/PatrimonioUsdChart.js';
import PatrimonioBtcChart from './components/patrimonio-btc/PatrimonioBtcChart.js';
import PatrimonioMetricsCards from './components/metrics/PatrimonioMetricsCards.js';
import BtcDistributionChart from './components/btc-distribution/BtcDistributionChart.js';

// Data Handler
import PatrimonioDetalhesData from './components/patrimonio-detalhes-data.js';

class PatrimonioDetalhes {
    constructor() {
        this.api = new ApiClient();
        
        // Inicializar componentes UI
        this.components = {
            patrimonioUsdChart: new PatrimonioUsdChart(),
            patrimonioBtcChart: new PatrimonioBtcChart(),
            metricsCards: new PatrimonioMetricsCards(),
            btcDistributionChart: new BtcDistributionChart()
        };

        // Inicializar data handler
        this.dataHandler = new PatrimonioDetalhesData();

        this.isLoading = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async init() {
        console.log('🚀 Inicializando Patrimônio Detalhes...');
        
        await this.loadAllData();
        this.startAutoRefresh();
        this.setupGlobalMethods();
        
        console.log('✅ Patrimônio Detalhes inicializado!');
    }

    async loadAllData() {
        if (this.isLoading) {
            console.log('⏳ Carregamento já em andamento...');
            return;
        }

        try {
            this.isLoading = true;
            this.showLoading();
            
            console.log('🔄 Carregando dados de patrimônio...');

            // Fetch do endpoint dash-finance/patrimonio
            const response = await this.api.fetchData('dash-finance/patrimonio');
            
            if (response.status === 'success' && response.dados) {
                // PEGAR TIMESTAMP ANTES de formatar (antes da ordenação)
                const timestampMaisRecente = response.dados[0]?.timestamp;
                
                const formattedData = this.dataHandler.formatPatrimonioDetalhesData(response);
                
                // Usar timestamp capturado ANTES da formatação
                this.updateTimestamp(timestampMaisRecente);
                
                // Distribuir dados para componentes
                this.components.metricsCards.render(formattedData.current);
                this.components.btcDistributionChart.render(formattedData.btcDistribution);
                this.components.patrimonioUsdChart.render(formattedData.patrimonioUsd);
                this.components.patrimonioBtcChart.render(formattedData.patrimonioBtc);
                
                console.log('✅ Patrimônio Detalhes atualizado!');
                this.retryCount = 0;
            } else {
                throw new Error('Estrutura de dados inválida');
            }

        } catch (error) {
            console.error('❌ Erro ao carregar patrimônio:', error);
            this.handleLoadError();
        } finally {
            this.isLoading = false;
        }
    }

    updateTimestamp(timestamp) {
        const timestampElement = document.getElementById('last-update-patrimonio');
        
        if (timestampElement && timestamp) {
            try {
                const date = new Date(timestamp);
                
                // Tratar como UTC
                const utcDate = new Date(timestamp + 'Z'); // Força UTC
                const formattedTime = utcDate.toLocaleTimeString('pt-PT', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/Lisbon'
                });
                
                // DEBUG no console
                console.log('Timestamp:', timestamp, '→', formattedTime);
                timestampElement.textContent = formattedTime;
            } catch (error) {
                timestampElement.textContent = 'Última: --:--';
            }
        }
    }

    showLoading() {
        Object.values(this.components).forEach(component => {
            if (component.showLoading) {
                component.showLoading();
            }
        });

        // Loading no timestamp
        const timestampElement = document.getElementById('last-update-patrimonio');
        if (timestampElement) timestampElement.textContent = 'Última: --:--';
    }

    handleLoadError() {
        this.retryCount++;
        
        if (this.retryCount <= this.maxRetries) {
            const retryDelay = API_CONFIG.RETRY_DELAY * this.retryCount;
            
            console.log(`🔄 Tentativa ${this.retryCount}/${this.maxRetries} em ${retryDelay/1000}s...`);
            
            setTimeout(() => {
                this.loadAllData();
            }, retryDelay);
        } else {
            console.error('❌ Máximo de tentativas excedido');
            this.showGlobalError();
        }
    }

    showGlobalError() {
        Object.values(this.components).forEach(component => {
            component.showError?.();
        });

        const timestampElement = document.getElementById('last-update-patrimonio');
        if (timestampElement) timestampElement.textContent = 'Última: Erro';
    }

    startAutoRefresh() {
        setInterval(() => {
            if (!this.isLoading) {
                console.log('🔄 Auto-refresh patrimônio...');
                this.loadAllData();
            }
        }, API_CONFIG.AUTO_REFRESH_INTERVAL);
        
        console.log(`⏰ Auto-refresh configurado para ${API_CONFIG.AUTO_REFRESH_INTERVAL/1000}s`);
    }

    setupGlobalMethods() {
        window.patrimonioDetalhes = {
            refresh: () => this.loadAllData(),
            changePeriod: (period) => this.loadDataByPeriod(period),
            getStatus: () => ({
                isLoading: this.isLoading,
                retryCount: this.retryCount,
                apiUrl: this.api.baseURL,
                lastUpdate: new Date().toISOString()
            }),
            components: this.components,
            dataHandler: this.dataHandler
        };

        console.log('🔧 Métodos globais: window.patrimonioDetalhes');
    }

    async loadDataByPeriod(period) {
        try {
            this.isLoading = true;
            this.showLoading();
            
            console.log(`🔄 Carregando dados para período: ${period}`);

            const response = await this.api.fetchData(`dash-finance/patrimonio?periodo=${period}`);
            
            if (response.status === 'success' && response.dados) {
                const formattedData = this.dataHandler.formatPatrimonioDetalhesData(response);
                
                this.updateTimestamp(response.dados[0]?.timestamp);
                this.components.metricsCards.render(formattedData.current);
                this.components.btcDistributionChart.render(formattedData.btcDistribution);
                this.components.patrimonioUsdChart.render(formattedData.patrimonioUsd);
                this.components.patrimonioBtcChart.render(formattedData.patrimonioBtc);
                
                console.log(`✅ Dados ${period} carregados!`);
            }

        } catch (error) {
            console.error(`❌ Erro ao carregar período ${period}:`, error);
            this.showGlobalError();
        } finally {
            this.isLoading = false;
        }
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM carregado, inicializando Patrimônio Detalhes...');
    
    const dashboard = new PatrimonioDetalhes();
    dashboard.init();
});

console.log('🎯 BTC Turbo - Patrimônio Detalhes carregado!');