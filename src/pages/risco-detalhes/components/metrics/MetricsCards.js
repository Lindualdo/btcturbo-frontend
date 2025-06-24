/* 
Arquivo: src/pages/risco-detalhes/components/metrics/MetricsCards.js
Componente de Cards de Métricas Atuais
*/

export class MetricsCards {
    constructor() {
        this.elements = {
            healthFactor: document.getElementById('current-health-factor'),
            liquidation: document.getElementById('current-liquidation'),
            score: document.getElementById('current-score'),
            hfChange: document.getElementById('hf-change'),
            liqChange: document.getElementById('liq-change'),
            scoreChange: document.getElementById('score-change')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('📊 Renderizando Metrics Cards:', data);

        this.updateElement('healthFactor', data.healthFactor);
        this.updateElement('liquidation', data.liquidation);
        this.updateElement('score', data.score);

        this.updateChangeElement('hfChange', data.changes.healthFactor);
        this.updateChangeElement('liqChange', data.changes.liquidation);
        this.updateChangeElement('scoreChange', data.changes.score);

        this.clearLoading();
    }

    updateElement(key, value) {
        const element = this.elements[key];
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
        }
    }

    updateChangeElement(key, changePercent) {
        const element = this.elements[key];
        if (!element) return;

        if (changePercent === 0 || isNaN(changePercent)) {
            element.textContent = '--';
            element.className = 'metric-change neutral';
            return;
        }

        const sign = changePercent > 0 ? '+' : '';
        element.textContent = `${sign}${changePercent.toFixed(1)}%`;
        
        // Classes baseadas na mudança (para risco, aumento é ruim)
        if (key === 'hfChange') {
            // Health Factor: aumento é bom
            element.className = `metric-change ${changePercent > 0 ? 'positive' : 'negative'}`;
        } else {
            // Liquidação e Score: aumento é ruim para liquidação, bom para score
            if (key === 'liqChange') {
                element.className = `metric-change ${changePercent > 0 ? 'negative' : 'positive'}`;
            } else {
                element.className = `metric-change ${changePercent > 0 ? 'positive' : 'negative'}`;
            }
        }
    }

    showLoading() {
        const loadingElements = ['healthFactor', 'liquidation', 'score'];
        
        loadingElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        const changeElements = ['hfChange', 'liqChange', 'scoreChange'];
        changeElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = '--';
                element.className = 'metric-change neutral';
            }
        });
    }

    showError() {
        const errorElements = ['healthFactor', 'liquidation', 'score'];
        
        errorElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        const changeElements = ['hfChange', 'liqChange', 'scoreChange'];
        changeElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Erro';
                element.className = 'metric-change negative';
            }
        });
    }

    clearLoading() {
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.classList.remove('loading');
            }
        });
    }
}

export default MetricsCards;