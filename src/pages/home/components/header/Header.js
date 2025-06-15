/* 
Arquivo: src/pages/home/components/header/Header.js
Componente UI do Header
*/

export class Header {
    constructor() {
        this.elements = {
            btcPrice: document.getElementById('btc-price'),
            positionBtc: document.getElementById('position-btc'),
            positionUsd: document.getElementById('position-usd'),
            apiStatus: document.getElementById('api-status')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('📱 Renderizando header:', data);

        this.updateElement('btcPrice', data.btcPrice);
        this.updateElement('positionBtc', data.positionBtc);
        this.updateElement('positionUsd', data.positionUsd);
        this.updateApiStatus(data.apiStatus);

        this.clearLoading();
    }

    updateElement(key, value) {
        const element = this.elements[key];
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
        }
    }

    updateApiStatus(status) {
        const element = this.elements.apiStatus;
        if (!element) return;

        if (status === 'success') {
            element.innerHTML = '⚡ Online';
            element.style.background = '#4caf50';
            element.className = 'status-indicator';
        } else {
            element.innerHTML = '❌ Erro';
            element.style.background = '#ef4444';
            element.className = 'status-indicator error';
        }
    }

    showLoading() {
        Object.values(this.elements).forEach(element => {
            if (element && element.id !== 'api-status') {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        if (this.elements.apiStatus) {
            this.elements.apiStatus.innerHTML = '⏳ Conectando...';
        }
    }

    showError() {
        Object.values(this.elements).forEach(element => {
            if (element && element.id !== 'api-status') {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        this.updateApiStatus('error');
    }

    clearLoading() {
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.classList.remove('loading');
            }
        });
    }
}

export default Header;