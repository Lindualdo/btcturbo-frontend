/* 
Arquivo: src/mainV2.js
Localização: btcturbo-frontend/src/mainV2.js
Nova versão da home usando API dashboard-home com Gestão de Alavancagem + Decisão Estratégica
*/

import { SimpleGauge, DashboardBase } from './components/shared.js';

class HomeDashboardV2 extends DashboardBase {
    constructor() {
        super();
        
        // Adicionar novo endpoint ao ApiClient
        this.api.getDashboardHome = async () => {
            console.log('📡 Chamando: dashboard-home');
            try {
                const response = await fetch(`${this.api.baseURL}/dashboard-home`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const result = await response.json();
                console.log('✅ Dashboard Home recebido:', result);
                return result;
            } catch (error) {
                console.error('❌ Erro dashboard-home:', {
                    message: error.message,
                    status: error.status,
                    url: `${this.api.baseURL}/dashboard-home`
                });
                throw error;
            }
        };
        
        this.gauges = {};
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando BTC Turbo Dashboard V2...');
        this.initGauges();
        await this.loadAllData();
        this.startRealTimeUpdates();
    }

    initGauges() {
        // Layout flat sem gauges circulares - apenas barras
        console.log('✅ Layout flat inicializado (sem gauges)');
    }

    async loadAllData() {
        try {
            console.log('🔄 Carregando dados da API...');
            this.showLoading(true);

            const dashboardData = await this.api.getDashboardHome();
            
            if (dashboardData.status === 'success' && dashboardData.data) {
                const { header, scores, tecnicos, estrategia, alavancagem, indicadores } = dashboardData.data;
                
                console.log('📊 Processando dados:', {
                    header: !!header,
                    scores: !!scores, 
                    tecnicos: !!tecnicos,
                    alavancagem: !!alavancagem,
                    estrategia: !!estrategia,
                    indicadores: !!indicadores
                });
                
                // Atualizar cada seção
                this.updateHeader(header, dashboardData.status);
                this.updateMercadoScore(scores, indicadores);
                this.updateRiscoScore(scores, indicadores);
                this.updateAlavancagem(alavancagem);
                this.updateEstrategia(estrategia, tecnicos);
                
                console.log('✅ Dashboard atualizado com sucesso!');
            } else {
                throw new Error('Estrutura de dados inválida');
            }

            this.showLoading(false);
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            this.showError('Erro de conexão com API');
            this.showLoading(false);
            
            // Retry automático após 5 segundos
            setTimeout(() => {
                console.log('🔄 Tentativa de reconexão...');
                this.loadAllData();
            }, 5000);
        }
    }

    updateHeader(headerData, apiStatus) {
        if (!headerData) {
            console.warn('⚠️ Header data não disponível');
            return;
        }
        
        console.log('📱 Atualizando header:', headerData);
        
        // Atualizar valores formatados da API
        const position_btc = headerData.position_usd / headerData.btc_price || 0;
        const btcFormatado = Number(position_btc).toFixed(4);
        const position_usd_formatado = `$${headerData.position_usd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        const btc_price_formatado = `$${headerData.btc_price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

        this.updateElement('btc-price', btc_price_formatado || 'N/A');
        this.updateElement('position-btc', btcFormatado || 'N/A');
        this.updateElement('position-usd', position_usd_formatado || 'N/A');
        
        // Status da API
        this.updateApiStatus(apiStatus);
        
        console.log('✅ Header atualizado');
    }

    updateApiStatus(status) {
        const statusEl = document.getElementById('api-status');
        if (!statusEl) return;
        
        if (status === 'success') {
            statusEl.innerHTML = '⚡ Operacional';
            statusEl.style.background = '#4caf50';
            statusEl.className = 'status-indicator';
        } else {
            statusEl.innerHTML = '❌ Erro';
            statusEl.style.background = '#ef4444';
            statusEl.className = 'status-indicator error';
        }
    }

    updateMercadoScore(scores, indicadores) {
        if (!scores || !indicadores) {
            console.warn('⚠️ Dados de mercado não disponíveis');
            return;
        }
        
        console.log('📊 Atualizando score de mercado:', scores, indicadores);
        
        const score = this.formatScore(scores.mercado || 0);
        const classification = (scores.classificacao_mercado || 'neutro').toUpperCase();
        
        // Atualizar elementos do layout flat
        this.updateElement('score-mercado-number', score);
        this.updateElement('score-mercado-class', classification);
        
        // Atualizar barra de progresso
        const barElement = document.getElementById('score-mercado-bar');
        if (barElement) {
            barElement.style.width = `${score}%`;
        }
        
        // Métricas MVRV, NUPL e Ciclo
        this.updateElement('mvrv-value', indicadores.mvrv ? indicadores.mvrv.toFixed(2) : 'N/A');
        this.updateElement('nupl-value', indicadores.nupl ? indicadores.nupl.toFixed(3) : 'N/A');
        this.updateElement('ciclo-value', scores.ciclo || 'N/A');
        
        console.log('✅ Score Mercado atualizado');
    }

    updateRiscoScore(scores, indicadores) {
        if (!scores || !indicadores) {
            console.warn('⚠️ Dados de risco não disponíveis');
            return;
        }
        
        console.log('🛡️ Atualizando score de risco:', scores, indicadores);
        
        const score = this.formatScore(scores.risco || 0);
        const classification = (scores.classificacao_risco || 'neutro').toUpperCase();
        
        // Atualizar elementos do layout flat
        this.updateElement('score-risco-number', score);
        this.updateElement('score-risco-class', classification);
        
        // Atualizar barra de progresso
        const barElement = document.getElementById('score-risco-bar');
        if (barElement) {
            barElement.style.width = `${score}%`;
        }
        
        // Métricas HF e Liquidação
        this.updateElement('hf-value', indicadores.health_factor ? indicadores.health_factor.toFixed(2) : 'N/A');
        this.updateElement('liq-value', indicadores.dist_liquidacao ? `${indicadores.dist_liquidacao.toFixed(1)}%` : 'N/A');
        
        console.log('✅ Score Risco atualizado');
    }

    updateAlavancagem(data) {
        if (!data) {
            console.warn('⚠️ Dados de alavancagem não disponíveis');
            return;
        }
        
        console.log('📈 Atualizando alavancagem:', data);
        
        // Calcular percentuais para as barras (baseado em max 3x)
        const maxLeverage = 3.0;
        const currentPercent = (data.atual / maxLeverage) * 100;
        const allowedPercent = (data.permitida / maxLeverage) * 100;
        
        // Calcular margem percentual corrigido: atual/permitida
        const margemPercent = data.permitida > 0 ? (data.atual / data.permitida * 100).toFixed(1) : 0;
        
        // Atualizar barras
        const currentBar = document.getElementById('leverage-current-bar');
        const allowedBar = document.getElementById('leverage-allowed-bar');
        
        if (currentBar) currentBar.style.width = `${Math.min(currentPercent, 100)}%`;
        if (allowedBar) allowedBar.style.width = `${Math.min(allowedPercent, 100)}%`;
        
        // Formatações
        const valorDisponivel = `$${data.valor_disponivel.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        const dividaTotal = `$${data.divida_total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        const valorReduzir = data.valor_a_reduzir > 0 ? `$${data.valor_a_reduzir.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : 'N/A';
        
        // Atualizar valores
        this.updateElement('leverage-current-value', `${data.atual.toFixed(2)}x`);
        this.updateElement('leverage-allowed-value', `${data.permitida.toFixed(2)}x`);
        this.updateElement('capital-liquido', valorDisponivel);
        this.updateElement('margem-percent', `${margemPercent}%`);
        this.updateElement('margem-money', dividaTotal);
        this.updateElement('valor-reduzir', valorReduzir);
        this.updateElement('alavancagem-status', data.status || 'N/A');
        
        console.log('✅ Alavancagem atualizada');
    }

    updateEstrategia(estrategia, tecnicos) {
        if (!estrategia || !tecnicos) {
            console.warn('⚠️ Dados de estratégia não disponíveis');
            return;
        }
        
        console.log('🎯 Atualizando estratégia:', estrategia, tecnicos);
        
        // Atualizar ação principal
        this.updateElement('acao-principal', estrategia.decisao || 'HOLD');
        
        // Atualizar justificativa
        this.updateElement('justificativa-valor', estrategia.justificativa || 'Análise em andamento...');
        
        // Atualizar setup (antes era cenário)
        const setup = estrategia.setup_4h || 'N/A';
        this.updateElement('setup-valor', setup.replace(/_/g, ' '));
        
        // Atualizar RSI Diário
        this.updateElement('rsi-diario-valor', tecnicos.rsi ? tecnicos.rsi.toFixed(1) : 'N/A');
        
        // Atualizar Distância EMA 144
        this.updateElement('ema-distance-valor', tecnicos.ema_144_distance ? `${tecnicos.ema_144_distance.toFixed(1)}%` : 'N/A');
        
        console.log('✅ Estratégia atualizada');
    }

    startRealTimeUpdates() {
        // Auto-refresh a cada 30 segundos
        setInterval(() => {
            console.log('🔄 Auto-refresh dos dados...');
            this.loadAllData();
        }, 30 * 1000);
        
        console.log('⏰ Auto-refresh configurado para 30s');
    }

    showLoading(show) {
        // Atualizar elementos específicos para loading
        const loadingElements = document.querySelectorAll('.loading');
        const cards = document.querySelectorAll('.score-card, .top-header');
        
        if (show) {
            loadingElements.forEach(el => {
                if (!el.textContent.includes('Carregando')) {
                    el.textContent = 'Carregando...';
                    el.classList.add('loading');
                }
            });
            
            cards.forEach(card => {
                card.style.opacity = '0.6';
                card.style.pointerEvents = 'none';
            });
        } else {
            // Remove loading class - os valores serão atualizados pelos métodos update
            loadingElements.forEach(el => {
                el.classList.remove('loading');
            });
            
            cards.forEach(card => {
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
            });
        }
    }

    showError(message) {
        console.error('🚨 Dashboard Error:', message);
        
        // Mostrar erro visual nos principais elementos
        this.updateElement('score-mercado-number', 'Erro');
        this.updateElement('score-risco-number', 'Erro');
        this.updateElement('score-mercado-class', 'ERRO');
        this.updateElement('score-risco-class', 'ERRO');
        
        // Header com erro
        this.updateElement('btc-price', 'Erro');
        this.updateElement('position-btc', 'Erro');
        this.updateElement('position-usd', 'Erro');
        
        // Estratégia com erro
        this.updateElement('acao-principal', 'ERRO');
        this.updateElement('setup-valor', 'Erro');
        this.updateElement('rsi-diario-valor', 'Erro');
        this.updateElement('ema-distance-valor', 'Erro');
        
        // Status de erro
        this.updateApiStatus('error');
        
        // Limpar gauges
        Object.values(this.gauges).forEach(gauge => {
            if (gauge && gauge.draw) {
                gauge.draw(0);
            }
        });
    }

    async refreshData() {
        console.log('🔄 Refresh manual dos dados...');
        await this.loadAllData();
    }

    // Método helper para debug
    getApiStatus() {
        return {
            baseURL: this.api.baseURL,
            dashboardEndpoint: `${this.api.baseURL}/dashboard-home`,
            gaugesInitialized: Object.keys(this.gauges).length,
            lastUpdate: new Date().toISOString()
        };
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM carregado, inicializando Dashboard V2...');
    
    window.btcDashboardV2 = new HomeDashboardV2();
    
    // Debug global
    window.debugDashboard = () => {
        console.log('🔍 Dashboard Status:', window.btcDashboardV2.getApiStatus());
    };
    
    // Refresh manual global
    window.refreshDashboard = () => {
        window.btcDashboardV2.refreshData();
    };
});

console.log('🎯 BTC Turbo Dashboard V2 carregado!');