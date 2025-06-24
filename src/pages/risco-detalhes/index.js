/* 
Arquivo: src/pages/risco-detalhes/index.js
Orquestrador da página Risco Detalhes
*/

import ApiClient from '../../shared/api.js';
import { API_CONFIG } from '../../shared/constants.js';

// Componentes UI
import HealthFactorChart from './components/health-factor/HealthFactorChart.js';
import LiquidationChart from './components/liquidation/LiquidationChart.js';
import MetricsCards from './components/metrics/MetricsCards.js';

// Data Handlers
import RiscoDetalhesData from './components/risco-detalhes-data.js';

class RiscoDetalhes {
    constructor() {
        this.api = new ApiClient();
        
        // Inicializar componentes UI
        this.components = {
            healthFactorChart: new HealthFactorChart(),
            liquidationChart: new LiquidationChart(),
            metricsCards: new MetricsCards()
        };

        // Inicializar data handler
        this.dataHandler = new RiscoDetalhesData();

        this.isLoading = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async init() {
        console.log('🚀 Inicializando Risco Detalhes...');
        
        await this.loadAllData();
        this.startAutoRefresh();
        this.setupGlobalMethods();
        
        console.log('✅ Risco Detalhes inicializado!');
    }

    async loadAllData() {
        if (this.isLoading) {
            console.log('⏳ Carregamento já em andamento...');
            return;
        }

        try {
            this.isLoading = true;
            this.showLoading();
            
            console.log('🔄 Carregando dados de risco...');

            // Fetch do endpoint dash-finance/health-factor
            const response = await this.api.fetchData('dash-finance/health-factor');
            
            if (response.status === 'success' && response.dados) {
                const formattedData = this.dataHandler.formatRiscoDetalhesData(response);
                
                // Atualizar timestamp (pegar o primeiro item dos dados)
                this.updateTimestamp(response.dados[0]?.timestamp);
                
                // Distribuir dados para componentes
                this.components.metricsCards.render(formattedData.current);
                this.components.healthFactorChart.render(formattedData.healthFactor);
                this.components.liquidationChart.render(formattedData.liquidation);
                
                console.log('✅ Risco Detalhes atualizado!');
                this.retryCount = 0;
            } else {
                throw new Error('Estrutura de dados inválida');
            }

        } catch (error) {
            console.error('❌ Erro ao carregar risco:', error);
            this.handleLoadError();
        } finally {
            this.isLoading = false;
        }
    }

    updateTimestamp(timestamp) {
        const timestampElement = document.getElementById('last-update-risco');
        
        if (timestampElement && timestamp) {
            try {
                const date = new Date(timestamp);
                const formattedTime = date.toLocaleTimeString('pt-PT', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/Lisbon'
                });
                timestampElement.textContent = `Última: ${formattedTime}`;
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
        const timestampElement = document.getElementById('last-update-risco');
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

        const timestampElement = document.getElementById('last-update-risco');
        if (timestampElement) timestampElement.textContent = 'Última: Erro';
    }

    startAutoRefresh() {
        setInterval(() => {
            if (!this.isLoading) {
                console.log('🔄 Auto-refresh risco...');
                this.loadAllData();
            }
        }, API_CONFIG.AUTO_REFRESH_INTERVAL);
        
        console.log(`⏰ Auto-refresh configurado para ${API_CONFIG.AUTO_REFRESH_INTERVAL/1000}s`);
    }

    setupGlobalMethods() {
        window.riscoDetalhes = {
            refresh: () => this.loadAllData(),
            changePeriod: (period) => this.loadDataByPeriod(period),
            getStatus: () => ({
                isLoading: this.isLoading,
                retryCount: this.retryCount,
                apiUrl: this.api.baseURL,
                lastUpdate: new Date().toISOString()
            }),
            components: this.components
        };

        console.log('🔧 Métodos globais: window.riscoDetalhes');
    }

    async loadDataByPeriod(period) {
        try {
            this.isLoading = true;
            this.showLoading();
            
            console.log(`🔄 Carregando dados para período: ${period}`);

            const response = await this.api.fetchData(`dash-finance/health-factor?periodo=${period}`);
            
            if (response.status === 'success' && response.dados) {
                const formattedData = this.dataHandler.formatRiscoDetalhesData(response);
                
                this.updateTimestamp(response.dados[0]?.timestamp);
                this.components.metricsCards.render(formattedData.current);
                this.components.healthFactorChart.render(formattedData.healthFactor);
                
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
    console.log('🎯 DOM carregado, inicializando Risco Detalhes...');
    
    const dashboard = new RiscoDetalhes();
    dashboard.init();
});

console.log('🎯 BTC Turbo - Risco Detalhes carregado!');