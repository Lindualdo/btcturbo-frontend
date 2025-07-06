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
    }

    async init() {
        console.log('🚀 Inicializando BTC Turbo Dashboard V3...');
        
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

            // Fetch dos endpoints - ALAVANCAGEM SEPARADA
            const [homeResponse, decisaoResponse, alavancagemResponse] = await Promise.all([
                this.api.getDashboardHome(),
                this.api.getDecisaoEstrategica(),
                this.api.getAlavancagem() // NOVO: Chamada separada
            ]);
            
            if (homeResponse.status === 'success' && homeResponse.data) {
                const { header, risco } = homeResponse.data; // Removido alavancagem
                const metadata = homeResponse.metadata;
                
                // Distribuir dados formatados para cada componente
                this.components.header.render(this.dataHandlers.header.formatHeaderData(homeResponse.data, homeResponse.status, metadata));
                this.components.risco.render(this.dataHandlers.risco.formatRiscoData(risco));
                
                console.log('✅ Dashboard básico carregado!');
                this.retryCount = 0;
            }

            // NOVO: Processar alavancagem separadamente
            if (alavancagemResponse.status === 'success' && alavancagemResponse.data) {
                this.components.alavancagem.render(this.dataHandlers.alavancagem.formatAlavancagemData(alavancagemResponse.data));
                console.log('✅ Alavancagem carregada!');
            }
            
            if (decisaoResponse.status === 'success') {
                this.components.decisaoEstrategica.render(this.dataHandlers.decisaoEstrategica.formatDecisaoEstrategicaData(decisaoResponse));
                console.log('✅ Decisão estratégica carregada!');
            }
            
            if (!homeResponse.data && !decisaoResponse.status && !alavancagemResponse.data) {
                throw new Error('Estrutura de dados inválida');
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
            
            // NOVO: Tratar alavancagem com endpoint específico
            let data;
            if (componentName === 'alavancagem') {
                const response = await this.api.getAlavancagem();
                data = dataHandler.formatAlavancagemData(response.data);
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