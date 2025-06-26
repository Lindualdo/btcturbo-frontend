/* 
Arquivo: src/pages/patrimonio-detalhes/components/metrics/PatrimonioMetricsCards.js
Componente de Cards de Métricas do Patrimônio - RESPONSIVO
*/

export class PatrimonioMetricsCards {
    constructor() {
        // Elementos PC (cards separados)
        this.elements = {
            patrimonioUsd: document.getElementById('current-patrimonio-usd'),
            patrimonioBtc: document.getElementById('current-patrimonio-btc'),
            btcPrice: document.getElementById('current-btc-price'),
            usdChange: document.getElementById('usd-change'),
            btcChange: document.getElementById('btc-change'),
            btcPriceChange: document.getElementById('btc-price-change')
        };

        // Elementos Mobile (card único)
        this.mobileElements = {
            patrimonioUsd: document.getElementById('current-patrimonio-usd-mobile'),
            patrimonioBtc: document.getElementById('current-patrimonio-btc-mobile'),
            btcPrice: document.getElementById('current-btc-price-mobile'),
            usdChange: document.getElementById('usd-change-mobile'),
            btcChange: document.getElementById('btc-change-mobile'),
            btcPriceChange: document.getElementById('btc-price-change-mobile')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('📊 Renderizando Patrimônio Metrics Cards:', data);

        // Renderizar PC
        this.updateElement('patrimonioUsd', data.patrimonioUsd);
        this.updateElement('patrimonioBtc', data.patrimonioBtc);
        this.updateElement('btcPrice', data.btcPrice);

        this.updateChangeElement('usdChange', data.changes.usd);
        this.updateChangeElement('btcChange', data.changes.btc);
        this.updateChangeElement('btcPriceChange', data.changes.btcPrice);

        // Renderizar Mobile
        this.updateMobileElement('patrimonioUsd', data.patrimonioUsd);
        this.updateMobileElement('patrimonioBtc', data.patrimonioBtc);
        this.updateMobileElement('btcPrice', data.btcPrice);

        this.updateMobileChangeElement('usdChange', data.changes.usd);
        this.updateMobileChangeElement('btcChange', data.changes.btc);
        this.updateMobileChangeElement('btcPriceChange', data.changes.btcPrice);

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
        
        // Classes baseadas na mudança (positivo = verde, negativo = vermelho)
        element.className = `metric-change ${changePercent > 0 ? 'positive' : 'negative'}`;
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
        
        // Classes baseadas na mudança (positivo = verde, negativo = vermelho)
        element.className = `metric-compact-change ${changePercent > 0 ? 'positive' : 'negative'}`;
    }

    showLoading() {
        const loadingElements = ['patrimonioUsd', 'patrimonioBtc', 'btcPrice'];
        
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
        const changeElements = ['usdChange', 'btcChange', 'btcPriceChange'];
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
        const errorElements = ['patrimonioUsd', 'patrimonioBtc', 'btcPrice'];
        
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
        const changeElements = ['usdChange', 'btcChange', 'btcPriceChange'];
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

export default PatrimonioMetricsCards;