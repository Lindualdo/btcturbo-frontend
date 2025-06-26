/* 
Arquivo: src/pages/risco-detalhes/components/metrics/MetricsCards.js
Componente de Cards de Métricas Atuais - RESPONSIVO (PC + Mobile)
*/

export class MetricsCards {
    constructor() {
        // Elementos PC (cards separados)
        this.elements = {
            healthFactor: document.getElementById('current-health-factor'),
            liquidation: document.getElementById('current-liquidation'),
            score: document.getElementById('current-score'),
            hfChange: document.getElementById('hf-change'),
            liqChange: document.getElementById('liq-change'),
            scoreChange: document.getElementById('score-change')
        };

        // Elementos Mobile (card único)
        this.mobileElements = {
            healthFactor: document.getElementById('current-health-factor-mobile'),
            liquidation: document.getElementById('current-liquidation-mobile'),
            score: document.getElementById('current-score-mobile'),
            hfChange: document.getElementById('hf-change-mobile'),
            liqChange: document.getElementById('liq-change-mobile'),
            scoreChange: document.getElementById('score-change-mobile')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('📊 Renderizando Metrics Cards:', data);

        // Renderizar PC
        this.updateElement('healthFactor', data.healthFactor);
        this.updateElement('liquidation', data.liquidation);
        this.updateElement('score', data.score);

        this.updateChangeElement('hfChange', data.changes.healthFactor);
        this.updateChangeElement('liqChange', data.changes.liquidation);
        this.updateChangeElement('scoreChange', data.changes.score);

        // Renderizar Mobile
        this.updateMobileElement('healthFactor', data.healthFactor);
        this.updateMobileElement('liquidation', data.liquidation);
        this.updateMobileElement('score', data.score);

        this.updateMobileChangeElement('hfChange', data.changes.healthFactor);
        this.updateMobileChangeElement('liqChange', data.changes.liquidation);
        this.updateMobileChangeElement('scoreChange', data.changes.score);

        this.clearLoading();
    }

    updateElement(key, value) {
        const element = this.elements[key];
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
        }
    }

    updateMobileElement(key, value) {
        const element = this.mobileElements[key];
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
        
        // Classes baseadas na mudança (para risco, aumento é bom)
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

    updateMobileChangeElement(key, changePercent) {
        const element = this.mobileElements[key];
        if (!element) return;

        if (changePercent === 0 || isNaN(changePercent)) {
            element.textContent = '--';
            element.className = 'metric-compact-change neutral';
            return;
        }

        const sign = changePercent > 0 ? '+' : '';
        element.textContent = `${sign}${changePercent.toFixed(1)}%`;
        
        // Classes baseadas na mudança (para risco, aumento é bom)
        if (key === 'hfChange') {
            // Health Factor: aumento é bom
            element.className = `metric-compact-change ${changePercent > 0 ? 'positive' : 'negative'}`;
        } else {
            // Liquidação e Score: aumento é ruim para liquidação, bom para score
            if (key === 'liqChange') {
                element.className = `metric-compact-change ${changePercent > 0 ? 'negative' : 'positive'}`;
            } else {
                element.className = `metric-compact-change ${changePercent > 0 ? 'positive' : 'negative'}`;
            }
        }
    }

    showLoading() {
        const loadingElements = ['healthFactor', 'liquidation', 'score'];
        
        // Loading nos elementos PC
        loadingElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        // Loading nos elementos Mobile
        loadingElements.forEach(key => {
            const element = this.mobileElements[key];
            if (element) {
                element.textContent = '--';
                element.classList.add('loading');
            }
        });

        // Reset das mudanças PC
        const changeElements = ['hfChange', 'liqChange', 'scoreChange'];
        changeElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = '--';
                element.className = 'metric-change neutral';
            }
        });

        // Reset das mudanças Mobile
        changeElements.forEach(key => {
            const element = this.mobileElements[key];
            if (element) {
                element.textContent = '--';
                element.className = 'metric-compact-change neutral';
            }
        });
    }

    showError() {
        const errorElements = ['healthFactor', 'liquidation', 'score'];
        
        // Erro nos elementos PC
        errorElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        // Erro nos elementos Mobile
        errorElements.forEach(key => {
            const element = this.mobileElements[key];
            if (element) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        // Erro nas mudanças PC
        const changeElements = ['hfChange', 'liqChange', 'scoreChange'];
        changeElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Erro';
                element.className = 'metric-change negative';
            }
        });

        // Erro nas mudanças Mobile
        changeElements.forEach(key => {
            const element = this.mobileElements[key];
            if (element) {
                element.textContent = 'Erro';
                element.className = 'metric-compact-change negative';
            }
        });
    }

    clearLoading() {
        // Clear PC elements
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.classList.remove('loading');
            }
        });

        // Clear Mobile elements
        Object.values(this.mobileElements).forEach(element => {
            if (element) {
                element.classList.remove('loading');
            }
        });
    }
}

export default MetricsCards;