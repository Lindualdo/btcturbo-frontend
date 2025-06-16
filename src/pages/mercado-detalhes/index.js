/* 
Arquivo: src/pages/mercado-detalhes/index.js
Orquestrador da página Mercado Detalhes
*/

import ApiClient from '../../shared/api.js';
import { API_CONFIG } from '../../shared/constants.js';

// Componentes UI
import Ciclo from './components/ciclo/Ciclo.js';
import Momentum from './components/momentum/Momentum.js';
import Tecnico from './components/tecnico/Tecnico.js';

// Data Handlers
import CicloData from './components/ciclo/ciclo-data.js';
import MomentumData from './components/momentum/momentum-data.js';
import TecnicoData from './components/tecnico/tecnico-data.js';

class MercadoDetalhes {
    constructor() {
        this.api = new ApiClient();
        
        // Inicializar componentes UI
        this.components = {
            ciclo: new Ciclo(),
            momentum: new Momentum(),
            tecnico: new Tecnico()
        };

        // Inicializar data handlers
        this.dataHandlers = {
            ciclo: new CicloData(),
            momentum: new MomentumData(),
            tecnico: new TecnicoData()
        };

        this.isLoading = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async init() {
        console.log('🚀 Inicializando Mercado Detalhes...');
        
        await this.loadAllData();
        this.startAutoRefresh();
        this.setupGlobalMethods();
        
        console.log('✅ Mercado Detalhes inicializado!');
    }

    async loadAllData() {
        if (this.isLoading) {
            console.log('⏳ Carregamento já em andamento...');
            return;
        }

        try {
            this.isLoading = true;
            this.showLoading();
            
            console.log('🔄 Carregando dados do mercado...');

            // Fetch do endpoint dash-mercado
            const response = await this.api.fetchData('dash-mercado');
            
            if (response.status === 'success' && response.blocos) {
                const { score_consolidado, classificacao, blocos } = response;
                
                // Atualizar score consolidado
                this.updateConsolidatedScore(score_consolidado, classificacao);
                
                // Distribuir dados para cada componente
                this.components.ciclo.render(this.dataHandlers.ciclo.formatCicloData(blocos.ciclo));
                this.components.momentum.render(this.dataHandlers.momentum.formatMomentumData(blocos.momentum));
                this.components.tecnico.render(this.dataHandlers.tecnico.formatTecnicoData(blocos.tecnico));
                
                console.log('✅ Mercado Detalhes atualizado!');
                this.retryCount = 0;
            } else {
                throw new Error('Estrutura de dados inválida');
            }

        } catch (error) {
            console.error('❌ Erro ao carregar mercado:', error);
            this.handleLoadError();
        } finally {
            this.isLoading = false;
        }
    }

    updateConsolidatedScore(score, classificacao) {
        const scoreElement = document.getElementById('score-consolidado');
        const classElement = document.getElementById('classificacao-consolidada');

        if (scoreElement) {
            scoreFormatado = parseInt(score) * 10;
            scoreElement.textContent = scoreFormatado;
        }

        if (classElement) {
            classElement.textContent =  classificacao.toUpperCase() || 'erro';
        }
    }

    showLoading() {
        Object.values(this.components).forEach(component => {
            if (component.showLoading) {
                component.showLoading();
            }
        });

        // Loading no score consolidado
        const scoreElement = document.getElementById('score-consolidado');
        const classElement = document.getElementById('classificacao-consolidada');
        
        if (scoreElement) scoreElement.textContent = 'Carregando...';
        if (classElement) classElement.textContent = 'Carregando...';
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

        // Erro no score consolidado
        const scoreElement = document.getElementById('score-consolidado');
        const classElement = document.getElementById('classificacao-consolidada');
        
        if (scoreElement) scoreElement.textContent = 'Erro';
        if (classElement) classElement.textContent = 'Erro de conexão';
    }

    startAutoRefresh() {
        setInterval(() => {
            if (!this.isLoading) {
                console.log('🔄 Auto-refresh mercado...');
                this.loadAllData();
            }
        }, API_CONFIG.AUTO_REFRESH_INTERVAL);
        
        console.log(`⏰ Auto-refresh configurado para ${API_CONFIG.AUTO_REFRESH_INTERVAL/1000}s`);
    }

    setupGlobalMethods() {
        window.mercadoDetalhes = {
            refresh: () => this.loadAllData(),
            getStatus: () => ({
                isLoading: this.isLoading,
                retryCount: this.retryCount,
                apiUrl: this.api.baseURL,
                lastUpdate: new Date().toISOString()
            }),
            components: this.components
        };

        console.log('🔧 Métodos globais: window.mercadoDetalhes');
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM carregado, inicializando Mercado Detalhes...');
    
    const dashboard = new MercadoDetalhes();
    dashboard.init();
});

console.log('🎯 BTC Turbo - Mercado Detalhes carregado!');