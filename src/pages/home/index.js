/* 
Arquivo: index.js
Caminho: src/pages/home/index.js
Orquestrador da página Home - ALAVANCAGEM COM ENDPOINT SEPARADO
*/

import ApiClient from '../../shared/api.js';
import { API_CONFIG } from '../../shared/constants.js';

// Componentes UI
import Header from './components/header/Header.js';
import DecisaoEstrategica from './components/decisao-estrategica/DecisaoEstrategica.js';
import Risco from './components/risco/Risco.js';
import Alavancagem from './components/alavancagem/Alavancagem.js';

// Data Handlers
import HeaderData from './components/header/header-data.js';
import DecisaoEstrategicaData from './components/decisao-estrategica/decisao-estrategica-data.js';
import RiscoData from './components/risco/risco-data.js';
import AlavancagemData from './components/alavancagem/alavancagem-data.js';

class HomeDashboard {
    constructor() {
        this.api = new ApiClient();
        
        // Inicializar componentes UI
        this.components = {
            header: new Header(),
            decisaoEstrategica: new DecisaoEstrategica(),
            risco: new Risco(),
            alavancagem: new Alavancagem()
        };

        // Inicializar data handlers (só formatação)
        this.dataHandlers = {
            header: new HeaderData(),
            decisaoEstrategica: new DecisaoEstrategicaData(),
            risco: new RiscoData(),
            alavancagem: new AlavancagemData()
        };

        this.isLoading = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.headerBaseData = null; // Armazenar dados base do header
    }

    async init() {
        console.log('🚀 Inicializando BTC Turbo Dashboard V3 (APIs específicas apenas)...');
        
        await this.loadAllData();
        this.startAutoRefresh();
        this.setupGlobalMethods();
        
        console.log('✅ Dashboard inicializado com sucesso!');
    }

    async loadAllData() {
        if (this.isLoading) {
            console.log('⏳ Carregamento já em andamento...');
            return;
        }

        try {
            this.isLoading = true;
            this.showLoading();
            
            console.log('🔄 Carregando dados da API...');

            // NOVO: Carregar apenas das APIs específicas (dash-main desativado)
            const decisaoResponse = await this.api.getDecisaoEstrategica();
            
            // Inicializar dados base do header vazio
            this.headerBaseData = {
                dashboardData: {},
                status: 'success',
                metadata: { timestamp: new Date().toISOString() }
            };
            
            console.log('✅ Inicialização básica concluída (sem dash-main)!');

            // Carregar risco do endpoint específico (OBRIGATÓRIO)
            let riscoData = null;
            try {
                console.log('🔄 Carregando risco do endpoint específico...');
                
                if (!this.api.getScoreRisco) {
                    throw new Error('Método getScoreRisco não existe na API');
                }
                
                const riscoResponse = await this.api.getScoreRisco();
                console.log('📊 Resposta risco completa:', riscoResponse);
                
                if (riscoResponse && riscoResponse.status === 'success') {
                    console.log('📊 Dados risco extraídos:', riscoResponse);
                    const formattedData = this.dataHandlers.risco.formatRiscoData(riscoResponse);
                    console.log('📊 Dados risco formatados:', formattedData);
                    this.components.risco.render(formattedData);
                    riscoData = riscoResponse;
                    console.log('✅ Risco carregado!');
                } else {
                    console.warn('⚠️ Resposta da API de risco inválida:', riscoResponse);
                    this.components.risco.showError();
                }
            } catch (riscoError) {
                console.error('❌ Falha crítica no carregamento do risco:', riscoError);
                console.log('📊 Métodos disponíveis na API:', Object.getOwnPropertyNames(this.api.__proto__));
                this.components.risco.showError();
            }

            // Carregar alavancagem do endpoint específico (OBRIGATÓRIO)
            let alavancagemData = null;
            try {
                console.log('🔄 Carregando alavancagem do endpoint específico...');
                const alavancagemResponse = await this.api.getAlavancagem();
                console.log('📊 Resposta alavancagem completa:', alavancagemResponse);
                
                if (alavancagemResponse && alavancagemResponse.alavancagem) {
                    console.log('📊 Dados alavancagem extraídos:', alavancagemResponse.alavancagem);
                    const formattedData = this.dataHandlers.alavancagem.formatAlavancagemData(alavancagemResponse.alavancagem);
                    console.log('📊 Dados alavancagem formatados:', formattedData);
                    this.components.alavancagem.render(formattedData);
                    alavancagemData = alavancagemResponse.alavancagem;
                    console.log('✅ Alavancagem carregada!');
                } else {
                    console.warn('⚠️ Resposta da API de alavancagem inválida:', alavancagemResponse);
                    this.components.alavancagem.showZeroedData();
                }
            } catch (alavancagemError) {
                console.error('❌ Falha crítica no carregamento da alavancagem:', alavancagemError);
                this.components.alavancagem.showZeroedData();
            }

            // Atualizar header com dados financeiros das APIs específicas
            this.updateHeaderWithFinancialData(riscoData, alavancagemData);
            
            // Carregar decisão estratégica (verificar se API está ativa)
            try {
                console.log('🔄 Carregando decisão estratégica...');
                
                if (decisaoResponse.status === 'success') {
                    this.components.decisaoEstrategica.render(this.dataHandlers.decisaoEstrategica.formatDecisaoEstrategicaData(decisaoResponse));
                    console.log('✅ Decisão estratégica carregada!');
                } else {
                    console.warn('⚠️ Decisão estratégica indisponível');
                    this.components.decisaoEstrategica.showError();
                }
            } catch (decisaoError) {
                console.warn('⚠️ Erro na decisão estratégica:', decisaoError);
                this.components.decisaoEstrategica.showError();
            }
            
            if (!riscoData && !alavancagemData) {
                throw new Error('Falha crítica: nenhuma API específica disponível');
            }

        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            this.handleLoadError();
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    async loadComponent(componentName) {
        try {
            const dataHandler = this.dataHandlers[componentName];
            const component = this.components[componentName];

            if (!dataHandler || !component) {
                throw new Error(`Componente ${componentName} não encontrado`);
            }

            console.log(`📡 Carregando ${componentName}...`);
            
            // Tratar endpoints específicos
            let data;
            if (componentName === 'alavancagem') {
                const response = await this.api.getAlavancagem();
                if (response && response.alavancagem) {
                    data = dataHandler.formatAlavancagemData(response.alavancagem);
                    // Atualizar header também
                    this.updateHeaderWithFinancialData(null, response.alavancagem);
                } else {
                    data = dataHandler.getZeroedData();
                    this.updateHeaderWithFinancialData(null, null);
                }
            } else if (componentName === 'risco') {
                // Verificar se método existe
                if (!this.api.getScoreRisco) {
                    throw new Error('Método getScoreRisco não existe na API');
                }
                
                const response = await this.api.getScoreRisco();
                if (response && response.status === 'success') {
                    data = dataHandler.formatRiscoData(response);
                    // Atualizar header também
                    this.updateHeaderWithFinancialData(response, null);
                } else {
                    data = null;
                    this.updateHeaderWithFinancialData(null, null);
                }
            } else {
                data = await dataHandler.fetchData();
            }
            
            component.render(data);
            
            console.log(`✅ ${componentName} carregado com sucesso`);
            
        } catch (error) {
            console.error(`❌ Erro ao carregar ${componentName}:`, error);
            this.components[componentName]?.showError();
            throw error;
        }
    }

    showLoading() {
        // Mostrar loading apenas nos elementos de texto, não nas barras
        Object.values(this.components).forEach(component => {
            if (component.showLoading) {
                component.showLoading();
            }
        });
    }

    hideLoading() {
        // Sem efeitos visuais de loading
        console.log('✅ Dados carregados');
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
    }

    updateHeaderWithFinancialData(riscoData, alavancagemData) {
        if (!this.headerBaseData) {
            console.warn('⚠️ Dados base do header não disponíveis');
            return;
        }

        // Criar cópia dos dados do dashboard e atualizar dados financeiros
        const dashboardDataWithFinancials = {
            ...this.headerBaseData.dashboardData,
            alavancagem: alavancagemData,
            risco: riscoData
        };

        // Renderizar header com dados atualizados
        const headerData = this.dataHandlers.header.formatHeaderData(
            dashboardDataWithFinancials,
            this.headerBaseData.status,
            this.headerBaseData.metadata
        );

        this.components.header.render(headerData);
        console.log('✅ Header atualizado com dados financeiros:', {
            risco: riscoData ? 'API específica' : 'dash-main/zerado',
            alavancagem: alavancagemData ? 'API específica' : 'dash-main/zerado'
        });
    }

    startAutoRefresh() {
        setInterval(() => {
            if (!this.isLoading) {
                console.log('🔄 Auto-refresh dos dados...');
                this.loadAllData();
            }
        }, API_CONFIG.AUTO_REFRESH_INTERVAL);
        
        console.log(`⏰ Auto-refresh configurado para ${API_CONFIG.AUTO_REFRESH_INTERVAL/1000}s`);
    }

    setupGlobalMethods() {
        // Métodos globais para debug e controle manual
        window.btcDashboard = {
            refresh: () => this.loadAllData(),
            refreshComponent: (name) => this.loadComponent(name),
            getStatus: () => ({
                isLoading: this.isLoading,
                retryCount: this.retryCount,
                apiUrl: this.api.baseURL,
                components: Object.keys(this.components),
                lastUpdate: new Date().toISOString()
            }),
            components: this.components,
            dataHandlers: this.dataHandlers
        };

        console.log('🔧 Métodos globais disponíveis: window.btcDashboard');
    }

    // Método para refresh manual de componente específico
    async refreshComponent(componentName) {
        if (this.isLoading) {
            console.log('⏳ Dashboard ocupado, aguarde...');
            return;
        }

        try {
            await this.loadComponent(componentName);
        } catch (error) {
            console.error(`❌ Erro ao atualizar ${componentName}:`, error);
        }
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM carregado, inicializando Dashboard Home...');
    
    const dashboard = new HomeDashboard();
    dashboard.init();
});

console.log('🎯 BTC Turbo Dashboard V3 - Home carregado!');