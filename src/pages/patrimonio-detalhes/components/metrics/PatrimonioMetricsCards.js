/* 
Arquivo: src/pages/patrimonio-detalhes/components/metrics/PatrimonioMetricsCards.js
Componente de Cards de Métricas do Patrimônio
*/

export class PatrimonioMetricsCards {
    constructor() {
        this.elements = {
            patrimonioUsd: document.getElementById('current-patrimonio-usd'),
            patrimonioBtc: document.getElementById('current-patrimonio-btc'),
            btcPrice: document.getElementById('current-btc-price'),
            usdChange: document.getElementById('usd-change'),
            btcChange: document.getElementById('btc-change'),
            btcPriceChange: document.getElementById('btc-price-change')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('📊 Renderizando Patrimônio Metrics Cards:', data);

        this.updateElement('patrimonioUsd', data.patrimonioUsd);
        this.updateElement('patrimonioBtc', data.patrimonioBtc);
        this.updateElement('btcPrice', data.btcPrice);

        this.updateChangeElement('usdChange', data.changes.usd);
        this.updateChangeElement('btcChange', data.changes.btc);
        this.updateChangeElement('btcPriceChange', data.changes.btcPrice);

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
        
        // Classes baseadas na mudança (positivo = verde, negativo = vermelho)
        element.className = `metric-change ${changePercent > 0 ? 'positive' : 'negative'}`;
    }

    showLoading() {
        const loadingElements = ['patrimonioUsd', 'patrimonioBtc', 'btcPrice'];
        
        loadingElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        const changeElements = ['usdChange', 'btcChange', 'btcPriceChange'];
        changeElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = '--';
                element.className = 'metric-change neutral';
            }
        });
    }

    showError() {
        const errorElements = ['patrimonioUsd', 'patrimonioBtc', 'btcPrice'];
        
        errorElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        const changeElements = ['usdChange', 'btcChange', 'btcPriceChange'];
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

export default PatrimonioMetricsCards;