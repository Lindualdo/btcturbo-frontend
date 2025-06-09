// BTC Turbo Dashboard - Versão Corrigida para API Real

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
        
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Arco de fundo
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#404552';
        ctx.stroke();
        
        // Arco colorido
        const angle = Math.PI + (Math.PI * Math.max(0, Math.min(100, value)) / 100);
        const gradient = ctx.createConicGradient(0, centerX, centerY);
        gradient.addColorStop(0, '#ff4757');
        gradient.addColorStop(0.25, '#ffa726');
        gradient.addColorStop(0.5, '#ffeb3b');
        gradient.addColorStop(0.75, '#8bc34a');
        gradient.addColorStop(1, '#4caf50');

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, angle);
        ctx.lineWidth = 15;
        ctx.strokeStyle = gradient;
        ctx.stroke();
        
        // Agulha
        const needleAngle = Math.PI + (Math.PI * Math.max(0, Math.min(100, value)) / 100);
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
            this.initGauges();
            await this.fetchAllData();
            console.log('✅ Dashboard inicializado!');
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
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

            const [mercadoData, riscoData, alavancagemData] = await Promise.all([
                this.fetchMercado(),
                this.fetchRisco(),
                this.fetchAlavancagem()
            ]);

            this.updateDashboard(mercadoData, riscoData, alavancagemData);
            this.showLoading(false);
            
        } catch (error) {
            console.error('❌ Erro ao buscar dados:', error);
            this.showLoading(false);
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
        console.log('📊 Dados recebidos:', { mercadoData, riscoData, alavancagemData });

        // Extrair scores e dados do breakdown
        const breakdown = mercadoData.composicao?.breakdown || {};
        
        const scoreData = {
            mercado: {
                value: Math.round(mercadoData.score_consolidado || 0),
                classification: mercadoData.classificacao || 'neutro',
                subtitle: 'Análise Geral'
            },
            ciclo: {
                value: Math.round(breakdown.ciclos?.score_bruto || 0),
                classification: breakdown.ciclos?.classificacao || 'neutro',
                peso: breakdown.ciclos?.peso || '40%'
            },
            momentum: {
                value: Math.round(breakdown.momentum?.score_bruto || 0),
                classification: breakdown.momentum?.classificacao || 'neutro',
                peso: breakdown.momentum?.peso || '20%'
            },
            tecnico: {
                value: Math.round(breakdown.tecnico?.score_bruto || 0),
                classification: breakdown.tecnico?.classificacao || 'neutro',
                peso: breakdown.tecnico?.peso || '40%'
            },
            risco: {
                value: Math.round(riscoData.score_consolidado || 0),
                classification: this.getScoreStatus(riscoData.score_consolidado || 0),
                subtitle: 'Health Factor'
            }
        };

        // Atualizar gauges
        Object.keys(scoreData).forEach(key => {
            if (this.gauges[key]) {
                this.gauges[key].draw(scoreData[key].value);
                this.updateScoreText(key, scoreData[key]);
            }
        });

        // Atualizar outros dados
        this.updateRiscoInfo(riscoData);
        this.updateFinancialInfo(alavancagemData);
        this.updateActionRecommendation(mercadoData);
    }

    updateScoreText(type, scoreData) {
        const valueElement = document.getElementById(`score-${type}-value`);
        if (valueElement) {
            valueElement.textContent = `Score: ${scoreData.value} - ${scoreData.classification}`;
            valueElement.className = 'score-info';
        }

        // Atualizar subtitle (peso ou descrição)
        const subtitleElement = valueElement?.parentElement?.querySelector('.score-status');
        if (subtitleElement) {
            if (scoreData.peso) {
                subtitleElement.textContent = `Peso: ${scoreData.peso}`;
            } else if (scoreData.subtitle) {
                subtitleElement.textContent = scoreData.subtitle;
            }
        }
    }

    updateRiscoInfo(riscoData) {
        const healthFactorElement = document.getElementById('health-factor');
        const distLiquidacaoElement = document.getElementById('dist-liquidacao');
        
        if (healthFactorElement && riscoData.health_factor) {
            healthFactorElement.textContent = `Health Factor: ${riscoData.health_factor}`;
        }
        
        if (distLiquidacaoElement && riscoData.distancia_liquidacao_pct) {
            distLiquidacaoElement.textContent = `Dist. Liquidação: ${Math.round(riscoData.distancia_liquidacao_pct)}%`;
        }
    }

    updateFinancialInfo(alavancagemData) {
        if (!alavancagemData) return;
        
        const updates = {
            'posicao-total': this.formatCurrency(alavancagemData.posicao_total_usd),
            'divida': this.formatCurrency(alavancagemData.divida_usd),
            'capital-liquido': this.formatCurrency(alavancagemData.capital_liquido_usd),
            'alavancagem': `${alavancagemData.alavancagem_atual}x`,
            'alavancagem-permitida': `${alavancagemData.alavancagem_maxima}x`,
            'valor-liberado': this.formatCurrency(alavancagemData.valor_liberado_usd),
            'valor-reduzir': this.formatCurrency(alavancagemData.valor_reduzir_usd)
        };

        Object.keys(updates).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = updates[id];
            }
        });

        // Status
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = alavancagemData.status_operacional ? '🟢 OPERACIONAL' : '🔴 ATENÇÃO';
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
            card.style.opacity = show ? '0.5' : '1';
            card.style.pointerEvents = show ? 'none' : 'auto';
        });
    }

    async refreshData() {
        console.log('🔄 Atualizando dados...');
        await this.fetchAllData();
    }
}

// Inicializar
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