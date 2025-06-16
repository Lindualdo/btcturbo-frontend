/* 
Arquivo: src/pages/home/components/header/Header.js
Componente UI do Header - Atualizado com novos campos financeiros
*/

export class Header {
    constructor() {
        this.elements = {
            btcPrice: document.getElementById('btc-price'),
            positionUsd: document.getElementById('position-usd'),
            dividaTotal: document.getElementById('divida-total'),
            saldoLiquidoUsd: document.getElementById('saldo-liquido-usd'),
            saldoLiquidoBtc: document.getElementById('saldo-liquido-btc'),
            apiStatus: document.getElementById('api-status'),
            financeBtn: document.getElementById('finance-detalhe-btn')
        };

        // Setup da navegação para finanças
        this.setupNavigation();
    }

    setupNavigation() {
        if (this.elements.financeBtn) {
            this.elements.financeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔄 Navegando para detalhes financeiros...');
                window.location.href = '/finance-detalhe.html';
            });
            
            console.log('✅ Navegação configurada para finance-detalhe');
        }
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('📱 Renderizando header:', data);

        this.updateElement('btcPrice', data.btcPrice);
        this.updateElement('positionUsd', data.positionUsd);
        this.updateElement('dividaTotal', data.dividaTotal);
        this.updateElement('saldoLiquidoUsd', data.saldoLiquidoUsd);
        this.updateElement('saldoLiquidoBtc', data.saldoLiquidoBtc);
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

        // Remove todas as classes e estilos anteriores
        element.className = '';
        element.style.cssText = '';

        if (status === 'success') {
            element.innerHTML = '●';
            element.style.color = '#4caf50'; // Verde
            element.style.fontSize = '1.2rem';
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';
        } else {
            element.innerHTML = '●';
            element.style.color = '#ff4757'; // Vermelho
            element.style.fontSize = '1.2rem';
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';
        }
    }

    showLoading() {
        // Loading em todos os campos exceto status e botão
        const loadingElements = [
            'btcPrice', 'positionUsd', 'dividaTotal', 
            'saldoLiquidoUsd', 'saldoLiquidoBtc'
        ];

        loadingElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        if (this.elements.apiStatus) {
            this.elements.apiStatus.innerHTML = '●';
            this.elements.apiStatus.className = '';
            this.elements.apiStatus.style.cssText = '';
            this.elements.apiStatus.style.color = '#ffa726'; // Amarelo/Laranja
            this.elements.apiStatus.style.fontSize = '1.2rem';
            this.elements.apiStatus.style.display = 'flex';
            this.elements.apiStatus.style.alignItems = 'center';
            this.elements.apiStatus.style.justifyContent = 'center';
        }
    }

    showError() {
        // Erro em todos os campos exceto status e botão
        const errorElements = [
            'btcPrice', 'positionUsd', 'dividaTotal', 
            'saldoLiquidoUsd', 'saldoLiquidoBtc'
        ];

        errorElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        this.updateApiStatus('error');
    }

    clearLoading() {
        Object.values(this.elements).forEach(element => {
            if (element && element.id !== 'finance-detalhe-btn') {
                element.classList.remove('loading');
            }
        });
    }
}

export default Header;