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
                const { header, scores, tecnicos, estrategia, alavancagem, indicadores, } = dashboardData.data;
                
                console.log('📊 Processando dados:', {
                    header: !!header,
                    scores: !!scores, 
                    tecnicos: !!tecnicos,
                    alavancagem: !!alavancagem,
                    estrategia: !!estrategia,
                    indicadores: !!indicadores
                });
                
                // Atualizar cada seção
                this.updateHeader(header);
                //this.updateMercadoScore(scores,indicadores);
                //this.updateRiscoScore(scores,indicadores);
                //this.updateAlavancagem(alavancagem);
                //this.updateEstrategia(estrategia);
                
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

    updateHeader(headerData) {
        if (!headerData) {
            console.warn('⚠️ Header data não disponível');
            return;
        }
        
        console.log('📱 Atualizando header:', headerData);
        
        // Atualizar valores formatados da API

        const btcFormatado = Number(position_btc).toFixed(4);
        const position_usd = `$${headerData.position_usd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

        this.updateElement('btc-price', headerData.btc_price || 'N/A');
        this.updateElement('position-btc',btcFormatado || 'N/A');
        this.updateElement('position-usd', position_usd || 'N/A');
        //this.updateElement('leverage-current', headerData.alavancagem_formatado || 'N/A');
        
        // Status dinâmico baseado na alavancagem
        //this.updateStatus(headerData.alavancagem_atual || 0);
        
        console.log('✅ Header atualizado');
    }

    updateStatus(leverage) {
        const statusEl = document.getElementById('status-operational');
        if (!statusEl) return;
        
        if (leverage > 0) {
            statusEl.innerHTML = '⚡ <span>Operacional</span>';
            statusEl.style.background = '#4caf50';
            statusEl.className = 'status-indicator';
        } else {
            statusEl.innerHTML = '⏸️ <span>Inativo</span>';
            statusEl.style.background = '#6b7280';
            statusEl.className = 'status-indicator';
        }
    }

    updateMercadoScore(data) {
        if (!data) {
            console.warn('⚠️ Dados de mercado não disponíveis');
            return;
        }
        
        console.log('📊 Atualizando score de mercado:', data);
        
        const score = this.formatScore(data.score || 0);
        const classification = (data.classificacao || 'neutro').toUpperCase();
        
        // Atualizar elementos do layout flat
        this.updateElement('score-mercado-number', score);
        this.updateElement('score-mercado-class', classification);
        
        // Atualizar barra de progresso
        const barElement = document.getElementById('score-mercado-bar');
        if (barElement) {
            barElement.style.width = `${score}%`;
        }
        
        // Métricas MVRV e NUPL
        this.updateElement('mvrv-value', data.mvrv_formatado || (data.mvrv ? data.mvrv.toFixed(2) : 'N/A'));
        this.updateElement('nupl-value', data.nupl_formatado || (data.nupl ? data.nupl.toFixed(3) : 'N/A'));
        
        console.log('✅ Score Mercado atualizado');
    }

    updateRiscoScore(data) {
        if (!data) {
            console.warn('⚠️ Dados de risco não disponíveis');
            return;
        }
        
        console.log('🛡️ Atualizando score de risco:', data);
        
        const score = this.formatScore(data.score || 0);
        const classification = (data.classificacao || 'neutro').toUpperCase();
        
        // Atualizar elementos do layout flat
        this.updateElement('score-risco-number', score);
        this.updateElement('score-risco-class', classification);
        
        // Atualizar barra de progresso
        const barElement = document.getElementById('score-risco-bar');
        if (barElement) {
            barElement.style.width = `${score}%`;
        }
        
        // Métricas HF e Liquidação
        this.updateElement('hf-value', data.health_factor_formatado || (data.health_factor ? data.health_factor.toFixed(2) : 'N/A'));
        this.updateElement('liq-value', data.dist_liquidacao_formatado || (data.dist_liquidacao ? `${data.dist_liquidacao.toFixed(1)}%` : 'N/A'));
        
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
        const currentPercent = (data.alavancagem_atual / maxLeverage) * 100;
        const allowedPercent = (data.alavancagem_permitida / maxLeverage) * 100;
        
        // Atualizar barras
        const currentBar = document.getElementById('leverage-current-bar');
        const allowedBar = document.getElementById('leverage-allowed-bar');
        
        if (currentBar) currentBar.style.width = `${Math.min(currentPercent, 100)}%`;
        if (allowedBar) allowedBar.style.width = `${Math.min(allowedPercent, 100)}%`;
        
        // Atualizar valores
        this.updateElement('leverage-current-value', data.alavancagem_atual_formatado);
        this.updateElement('leverage-allowed-value', data.alavancagem_permitida_formatado);
        this.updateElement('capital-liquido', data.valor_disponivel_formatado);
        this.updateElement('margem-percent', data.margem_percentual_formatado);
        this.updateElement('margem-money', data.divida_total_formatado);
        this.updateElement('stop-loss', data.stop_loss_formatado);
        this.updateElement('valor-reduzir', data.valor_a_reduzir_formatado);
        
        console.log('✅ Alavancagem atualizada');
    }

    updateEstrategia(data) {
        if (!data) {
            console.warn('⚠️ Dados de estratégia não disponíveis');
            return;
        }
        
        console.log('🎯 Atualizando estratégia:', data);
        
        // Atualizar ação principal
        this.updateElement('acao-principal', data.acao || 'HOLD');
        
        // Atualizar justificativa
        this.updateElement('justificativa-valor', data.justificativa || 'Análise em andamento...');
        
        // Atualizar matriz usada
        this.updateElement('matriz-usada', data.dados_decisao?.matriz_usada || 'N/A');
        
        // Atualizar cenário
        const cenario = data.cenario || 'N/A';
        this.updateElement('cenario-valor', cenario.replace('matriz_', '').replace('_', ' ').toUpperCase());
        
        // Atualizar RSI Diário
        const rsiDiario = data.dados_decisao?.rsi_diario;
        this.updateElement('rsi-diario-valor', rsiDiario ? rsiDiario.toFixed(1) : 'N/A');
        
        // Atualizar Distância EMA 144
        const emaDistance = data.dados_decisao?.ema_distance;
        this.updateElement('ema-distance-valor', emaDistance ? `${emaDistance.toFixed(1)}%` : 'N/A');
        
        console.log('✅ Estratégia atualizada');
    }

    startRealTimeUpdates() {
        // Auto-refresh a cada 30 segundos
        setInterval(() => {
            //console.log('🔄 Auto-refresh dos dados...');
            //this.loadAllData();
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
        this.updateElement('leverage-current', 'Erro');
        
        // Estratégia com erro
        this.updateElement('acao-principal', 'ERRO');
        this.updateElement('matriz-usada', 'Erro');
        this.updateElement('cenario-valor', 'Erro');
        this.updateElement('rsi-diario-valor', 'Erro');
        this.updateElement('ema-distance-valor', 'Erro');
        
        // Status de erro
        const statusEl = document.getElementById('status-operational');
        if (statusEl) {
            statusEl.innerHTML = '❌ <span>Erro de Conexão</span>';
            statusEl.style.background = '#ef4444';
            statusEl.className = 'status-indicator error';
        }
        
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