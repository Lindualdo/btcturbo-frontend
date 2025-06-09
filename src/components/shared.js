/* 
Arquivo: src/components/shared.js
Localização: btcturbo-frontend/src/components/shared.js
*/

export class SimpleGauge {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }

    draw(value) {
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

export class ApiClient {
    constructor() {
        this.baseURL = 'https://btcturbo-v5-production.up.railway.app/api/v1';
    }

    async fetchData(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}/${endpoint}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`❌ Erro API (${endpoint}):`, error);
            throw error;
        }
    }

    async getMercado() { return this.fetchData('analise-mercado'); }
    async getRisco() { return this.fetchData('analise-risco'); }
    async getAlavancagem() { return this.fetchData('analise-alavancagem'); }
    async getCiclos() { return this.fetchData('calcular-score/ciclos'); }
    async getMomentum() { return this.fetchData('calcular-score/momentum'); }
    async getTecnico() { return this.fetchData('calcular-score/tecnico'); }
}

export class DashboardBase {
    constructor() {
        this.api = new ApiClient();
        this.gauges = {};
    }

    showLoading(show) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = show ? '0.5' : '1';
            card.style.pointerEvents = show ? 'none' : 'auto';
        });
    }

    showError(message) {
        console.error('Dashboard Error:', message);
        const scoreElement = document.getElementById('score-consolidado');
        if (scoreElement) {
            scoreElement.textContent = message;
            scoreElement.style.color = '#ff6b6b';
        }
    }

    formatScore(score) {
        return Math.round(score * 10);
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) element.textContent = content;
    }
}