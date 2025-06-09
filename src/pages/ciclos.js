/* 
Arquivo: src/pages/ciclos.js
Localização: btcturbo-frontend/src/pages/ciclos.js
*/

/* 
Arquivo: src/pages/ciclos.js
Localização: btcturbo-frontend/src/pages/ciclos.js
*/

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

class CiclosDashboard {
    constructor() {
        this.baseURL = 'https://btcturbo-v5-production.up.railway.app/api/v1';
        this.gauges = {};
        this.init();
    }

    async init() {
        console.log('🔄 Iniciando dashboard de Ciclos...');
        this.initGauges();
        await this.loadData();
    }

    initGauges() {
        this.gauges = {
            mvrv: new SimpleGauge(document.getElementById('gauge-mvrv')),
            nupl: new SimpleGauge(document.getElementById('gauge-nupl')),
            realized: new SimpleGauge(document.getElementById('gauge-realized')),
            puell: new SimpleGauge(document.getElementById('gauge-puell'))
        };
    }

    async loadData() {
        try {
            console.log('📡 Buscando dados da API...');
            const response = await fetch(`${this.baseURL}/calcular-score/ciclos`);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Dados Ciclos recebidos:', data);
            this.updateDashboard(data);
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados de ciclos:', error);
            this.showError('Erro ao carregar dados. Tentando novamente...');
        }
    }

    updateDashboard(data) {
        // Score consolidado
        const scoreText = `Score: ${Math.round(data.score_consolidado * 10)} - ${data.classificacao_consolidada.toUpperCase()}`;
        document.getElementById('score-consolidado').textContent = scoreText;
        
        // Informações gerais
        document.getElementById('peso-bloco').textContent = data.peso_bloco;

        // Indicadores individuais
        const indicadores = data.indicadores;
        const componentes = data.calculo.componentes;
        
        // MVRV Z-Score
        this.updateIndicator('mvrv', indicadores.MVRV_Z, componentes.mvrv_contribuicao);
        
        // NUPL - CORRIGIR: existe no JSON
        this.updateIndicator('nupl', indicadores.NUPL, componentes.nupl_contribuicao);
        
        // Realized Ratio
        this.updateIndicator('realized', indicadores.Realized_Ratio, componentes.realized_contribuicao);
        
        // Puell Multiple
        this.updateIndicator('puell', indicadores.Puell_Multiple, componentes.puell_contribuicao);

        console.log('✅ Dashboard atualizado com sucesso!');
    }

    updateIndicator(key, indicador, contribuicao) {
        if (!indicador) return;

        // Atualizar gauge
        const scoreNormalizado = indicador.score * 10; // Score vem de 0-10, converter para 0-100
        this.gauges[key].draw(scoreNormalizado);
        
        // Verificar se é NUPL e não está disponível
        if (key === 'nupl' && !indicador.disponivel) {
            // Marcar como indisponível
            const card = document.getElementById('nupl-card');
            if (card) {
                card.classList.add('unavailable');
            }
        }
        
        // Atualizar textos
        const scoreText = `Score: ${Math.round(scoreNormalizado)} - ${indicador.classificacao.toUpperCase()}`;
        document.getElementById(`${key}-score`).textContent = scoreText;
        
        // Valor do indicador
        const valor = indicador.valor !== null ? indicador.valor.toFixed(4) : 'N/A';
        document.getElementById(`${key}-valor`).textContent = valor;
        
        // Peso
        document.getElementById(`${key}-peso`).textContent = indicador.peso;
        
        // Contribuição para o score final
        document.getElementById(`${key}-contribuicao`).textContent = contribuicao.toFixed(2);

        console.log(`✅ ${key.toUpperCase()} atualizado:`, {
            score: scoreNormalizado,
            valor: valor,
            peso: indicador.peso,
            contribuicao: contribuicao
        });
    }

    showError(message) {
        const scoreElement = document.getElementById('score-consolidado');
        if (scoreElement) {
            scoreElement.textContent = message;
            scoreElement.style.color = '#ff6b6b';
        }
        
        // Tentar novamente após 3 segundos
        setTimeout(() => {
            this.loadData();
        }, 3000);
    }

    async refreshData() {
        console.log('🔄 Atualizando dados...');
        await this.loadData();
    }
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.ciclosDashboard = new CiclosDashboard();
    
    // Auto-refresh a cada 2 minutos
    setInterval(() => {
        if (window.ciclosDashboard) {
            window.ciclosDashboard.refreshData();
        }
    }, 2 * 60 * 1000);
});

console.log('🎯 Dashboard Ciclos carregado!');
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.ciclosDashboard = new CiclosDashboard();
    
    // Auto-refresh a cada 2 minutos
    setInterval(() => {
        if (window.ciclosDashboard) {
            window.ciclosDashboard.refreshData();
        }
    }, 2 * 60 * 1000);
});

console.log('🎯 Dashboard Ciclos carregado!');