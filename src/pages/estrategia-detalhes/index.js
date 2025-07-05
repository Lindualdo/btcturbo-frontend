/* 
Arquivo: index.js
Caminho: src/pages/estrategia-detalhes/index.js
Orquestrador da página Estratégia Detalhes
*/

import ApiClient from '../../shared/api.js';
import { API_CONFIG } from '../../shared/constants.js';

// Componentes UI
import Tendencia from './components/tendencia/Tendencia.js';
import Ciclo from './components/ciclo/Ciclo.js';

// Data Handlers
import TendenciaData from './components/tendencia/tendencia-data.js';
import CicloData from './components/ciclo/ciclo-data.js';

class EstrategiaDetalhes {
    constructor() {
        this.api = new ApiClient();
        
        // Inicializar componentes UI
        this.components = {
            tendencia: new Tendencia(),
            ciclo: new Ciclo()
        };

        // Inicializar data handlers
        this.dataHandlers = {
            tendencia: new TendenciaData(),
            ciclo: new CicloData()
        };

        this.isLoading = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async init() {
        console.log('🚀 Inicializando Estratégia Detalhes...');
        
        await this.loadAllData();
        this.startAutoRefresh();
        this.setupGlobalMethods();
        
        console.log('✅ Estratégia Detalhes inicializado!');
    }

    async loadAllData() {
        if (this.isLoading) {
            console.log('⏳ Carregamento já em andamento...');
            return;
        }

        try {
            this.isLoading = true;
            this.showLoading();
            
            console.log('🔄 Carregando dados de estratégia...');

            // Fetch do endpoint decisao-estrategica-detalhe
            const response = await this.api.fetchData('decisao-estrategica-detalhe');
            
            if (response.status === 'success') {
                const { decisao, scores, auditoria } = response;
                
                // Atualizar dados consolidados
                this.updateConsolidatedData(decisao);
                
                // Atualizar timestamp
                this.updateTimestamp(response.timestamp);
                
                // Distribuir dados para cada componente
                this.components.tendencia.render(this.dataHandlers.tendencia.formatTendenciaData(auditoria.json_emas, scores.tendencia));
                this.components.ciclo.render(this.dataHandlers.ciclo.formatCicloData(auditoria.json_ciclo, scores.ciclo));
                
                console.log('✅ Estratégia Detalhes atualizado!');
                this.retryCount = 0;
            } else {
                throw new Error('Estrutura de dados inválida');
            }

        } catch (error) {
            console.error('❌ Erro ao carregar estratégia:', error);
            this.handleLoadError();
        } finally {
            this.isLoading = false;
        }
    }

    updateConsolidatedData(decisao) {
        const faseElement = document.getElementById('fase-operacional-consolidada');
        const tendenciaElement = document.getElementById('tendencia-consolidada');
        const acaoElement = document.getElementById('acao-consolidada');

        if (faseElement) {
            faseElement.textContent = decisao?.fase_operacional || 'N/A';
        }

        if (tendenciaElement) {
            tendenciaElement.textContent = decisao?.tendencia || 'N/A';
        }

        if (acaoElement) {
            acaoElement.textContent = decisao?.acao_primaria || 'N/A';
        }
    }

    updateTimestamp(timestamp) {
        const timestampElement = document.getElementById('last-update-estrategia');
        
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

        // Loading nos dados consolidados
        const faseElement = document.getElementById('fase-operacional-consolidada');
        const tendenciaElement = document.getElementById('tendencia-consolidada');
        const acaoElement = document.getElementById('acao-consolidada');
        const timestampElement = document.getElementById('last-update-estrategia');
        
        if (faseElement) faseElement.textContent = 'Carregando...';
        if (tendenciaElement) tendenciaElement.textContent = 'Carregando...';
        if (acaoElement) acaoElement.textContent = 'Carregando...';
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

        // Erro nos dados consolidados
        const faseElement = document.getElementById('fase-operacional-consolidada');
        const tendenciaElement = document.getElementById('tendencia-consolidada');
        const acaoElement = document.getElementById('acao-consolidada');
        const timestampElement = document.getElementById('last-update-estrategia');
        
        if (faseElement) faseElement.textContent = 'Erro';
        if (tendenciaElement) tendenciaElement.textContent = 'Erro de conexão';
        if (acaoElement) acaoElement.textContent = 'Erro';
        if (timestampElement) timestampElement.textContent = 'Última: Erro';
    }

    startAutoRefresh() {
        setInterval(() => {
            if (!this.isLoading) {
                console.log('🔄 Auto-refresh estratégia...');
                this.loadAllData();
            }
        }, API_CONFIG.AUTO_REFRESH_INTERVAL);
        
        console.log(`⏰ Auto-refresh configurado para ${API_CONFIG.AUTO_REFRESH_INTERVAL/1000}s`);
    }

    setupGlobalMethods() {
        window.estrategiaDetalhes = {
            refresh: () => this.loadAllData(),
            getStatus: () => ({
                isLoading: this.isLoading,
                retryCount: this.retryCount,
                apiUrl: this.api.baseURL,
                lastUpdate: new Date().toISOString()
            }),
            components: this.components
        };

        console.log('🔧 Métodos globais: window.estrategiaDetalhes');
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM carregado, inicializando Estratégia Detalhes...');
    
    const dashboard = new EstrategiaDetalhes();
    dashboard.init();
});

console.log('🎯 BTC Turbo - Estratégia Detalhes carregado!');