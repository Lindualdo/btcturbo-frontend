// BTC Turbo Dashboard - Versão Final com APIs Reais

class SimpleGauge {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }

    draw(value, title = '') {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        const centerY = this.height - 20;
        const radius = 70;
        
        // Limpar canvas
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Arco de fundo
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#404552';
        ctx.stroke();
        
        // Arco colorido baseado no valor
        const angle = Math.PI + (Math.PI * value / 100);
        const gradient = ctx.createConicGradient(0, centerX, centerY);
        gradient.addColorStop(0, '#ff4757');    // Vermelho
        gradient.addColorStop(0.25, '#ffa726'); // Laranja
        gradient.addColorStop(0.5, '#ffeb3b');  // Amarelo
        gradient.addColorStop(0.75, '#8bc34a'); // Verde claro
        gradient.addColorStop(1, '#4caf50');    // Verde

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, angle);
        ctx.lineWidth = 15;
        ctx.strokeStyle = gradient;
        ctx.stroke();
        
        // Agulha
        const needleAngle = Math.PI + (Math.PI * value / 100);
        const needleLength = radius - 10;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(needleAngle);
        
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.lineTo(needleLength, 0);
        ctx.lineTo(0, 3);
        ctx.closePath();
        ctx.fillStyle = '#666';
        ctx.fill();
        
        // Centro da agulha
        ctx.restore();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#555';
        ctx.fill();
    }
}

class BTCTurboDashboard {
    constructor() {
        this.baseURL = 'https://btcturbo-v5-production.up.railway.app/api/v1';
        this.gauges = {};
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando BTC Turbo Dashboard...');
        
        try {
            // Inicializar gauges
            this.initGauges();
            
            // Buscar dados das APIs
            await this.fetchAllData();
            
            console.log('✅ Dashboard inicializado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar dashboard:', error);
            this.showError('Erro ao carregar dados');
        }
    }

    initGauges() {
        this.gauges = {
            mercado: new SimpleGauge(document.getElementById('gauge-mercado')),
            ciclo: new SimpleGauge(document.getElementById('gauge-ciclo')),
            momentum: new SimpleGauge(document.getElementById('gauge-momentum')),
            tecnico: new SimpleGauge(document.getElementById('gauge-tecnico')),
            risco: new SimpleGauge(document.getElementById('gauge-risco'))
        };
    }

    async fetchAllData() {
        try {
            this.showLoading(true);

            // Buscar dados das 3 APIs em paralelo
            const [mercadoData, riscoData, alavancagemData] = await Promise.all([
                this.fetchMercado(),
                this.fetchRisco(),
                this.fetchAlavancagem()
            ]);

            // Atualizar dashboard com dados reais
            this.updateDashboard(mercadoData, riscoData, alavancagemData);
            
            this.showLoading(false);
            
        } catch (error) {
            console.error('❌ Erro ao buscar dados:', error);
            this.showLoading(false);
            this.showError('Erro ao carregar dados das APIs');
        }
    }

    async fetchMercado() {
        const response = await fetch(`${this.baseURL}/analise-mercado`);
        if (!response.ok) throw new Error(`Erro na API de Mercado: ${response.status}`);
        return await response.json();
    }

    async fetchRisco() {
        const response = await fetch(`${this.baseURL}/analise-risco`);
        if (!response.ok) throw new Error(`Erro na API de Risco: ${response.status}`);
        return await response.json();
    }

    async fetchAlavancagem() {
        const response = await fetch(`${this.baseURL}/analise-alavancagem`);
        if (!response.ok) throw new Error(`Erro na API de Alavancagem: ${response.status}`);
        return await response.json();
    }

    updateDashboard(mercadoData, riscoData, alavancagemData) {
        // Extrair scores do mercado
        const scores = {
            mercado: Math.round(mercadoData.score_consolidado || 0),
            ciclo: Math.round(mercadoData.composicao?.breakdown?.ciclos?.score_bruto || 0),
            momentum: Math.round(mercadoData.composicao?.breakdown?.momentum?.score_bruto || 0),
            tecnico: Math.round(mercadoData.composicao?.breakdown?.tecnico?.score_bruto || 0),
            risco: Math.round(riscoData.score_consolidado || 0)
        };

        // Atualizar gauges
        Object.keys(scores).forEach(key => {
            if (this.gauges[key]) {
                this.gauges[key].draw(scores[key]);
                this.updateScoreText(key, scores[key]);
            }
        });

        // Atualizar dados específicos do risco
        this.updateRiscoInfo(riscoData);

        // Atualizar dados financeiros
        this.updateFinancialInfo(alavancagemData);

        // Atualizar ação recomendada
        this.updateActionRecommendation(mercadoData);

        console.log('📊 Dashboard atualizado:', { scores, mercadoData, riscoData, alavancagemData });
    }

    updateScoreText(type, score) {
        const valueElement = document.getElementById(`score-${type}-value`);
        if (valueElement) {
            const status = this.getScoreStatus(score);
            valueElement.textContent = `Score: ${score} - ${status}`;
            valueElement.className = 'score-info';
        }
    }

    updateRiscoInfo(riscoData) {
        // Health Factor
        const healthFactorElement = document.getElementById('health-factor');
        if (healthFactorElement && riscoData.health_factor) {
            healthFactorElement.textContent = `Health Factor: ${riscoData.health_factor}`;
        }

        // Distância Liquidação
        const distLiquidacaoElement = document.getElementById('dist-liquidacao');
        if (distLiquidacaoElement && riscoData.distancia_liquidacao_pct) {
            distLiquidacaoElement.textContent = `Dist. Liquidação: ${Math.round(riscoData.distancia_liquidacao_pct)}%`;
        }
    }

    updateFinancialInfo(alavancagemData) {
        // Mapear dados financeiros
        const financialMapping = {
            'posicao-total': alavancagemData.posicao_total_usd,
            'divida': alavancagemData.divida_usd,
            'capital-liquido': alavancagemData.capital_liquido_usd,
            'alavancagem': `${alavancagemData.alavancagem_atual}x`,
            'alavancagem-permitida': `${alavancagemData.alavancagem_maxima}x`,
            'valor-liberado': alavancagemData.valor_liberado_usd,
            'valor-reduzir': alavancagemData.valor_reduzir_usd
        };

        // Atualizar cada elemento
        Object.keys(financialMapping).forEach(id => {
            const element = document.getElementById(id);
            if (element && financialMapping[id] !== undefined) {
                const value = financialMapping[id];
                element.textContent = typeof value === 'number' ? this.formatCurrency(value) : value;
            }
        });

        // Status
        const statusElement = document.getElementById('status');
        if (statusElement) {
            const status = alavancagemData.status_operacional ? '🟢 OPERACIONAL' : '🔴 ATENÇÃO';
            statusElement.textContent = status;
            statusElement.className = alavancagemData.status_operacional ? 'info-value status-ok' : 'info-value status-alert';
        }
    }

    updateActionRecommendation(mercadoData) {
        const actionPanel = document.querySelector('.action-panel .action-title');
        const actionDescription = document.querySelector('.action-panel div:last-child');
        
        if (actionPanel && mercadoData.acao_recomendada) {
            actionPanel.textContent = `🎯 AÇÃO RECOMENDADA: ${mercadoData.acao_recomendada.toUpperCase()}`;
        }

        if (actionDescription && mercadoData.analise?.insights) {
            actionDescription.textContent = mercadoData.analise.insights.join(' | ');
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value).replace('US$', '$');
    }

    getScoreStatus(score) {
        if (score >= 80) return 'excelente';
        if (score >= 70) return 'bom';
        if (score >= 50) return 'neutro';
        if (score >= 30) return 'atenção';
        return 'crítico';
    }

    showLoading(show) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (show) {
                card.style.opacity = '0.5';
                card.style.pointerEvents = 'none';
            } else {
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
            }
        });
    }

    showError(message) {
        console.error('Dashboard Error:', message);
        // Implementar toast de erro futuramente
    }

    async refreshData() {
        console.log('🔄 Atualizando dados...');
        await this.fetchAllData();
        console.log('✅ Dados atualizados!');
    }
}

// Inicializar dashboard quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.btcDashboard = new BTCTurboDashboard();
    
    // Auto-refresh a cada 5 minutos
    setInterval(() => {
        if (window.btcDashboard) {
            window.btcDashboard.refreshData();
        }
    }, 5 * 60 * 1000);
});

console.log('🎯 BTC Turbo Dashboard carregado!');