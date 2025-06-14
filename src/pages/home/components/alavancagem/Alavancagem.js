/* 
Arquivo: src/pages/home/components/alavancagem/Alavancagem.js
Componente UI de Gestão de Alavancagem
*/

export class Alavancagem {
    constructor() {
        this.elements = {
            currentBar: document.getElementById('leverage-current-bar'),
            allowedBar: document.getElementById('leverage-allowed-bar'),
            currentValue: document.getElementById('leverage-current-value'),
            allowedValue: document.getElementById('leverage-allowed-value'),
            capitalLiquido: document.getElementById('capital-liquido'),
            margemPercent: document.getElementById('margem-percent'),
            margemMoney: document.getElementById('margem-money'),
            valorReduzir: document.getElementById('valor-reduzir'),
            alavancagemStatus: document.getElementById('alavancagem-status')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('📈 Renderizando alavancagem:', data);

        this.updateElement('currentValue', data.currentLeverage);
        this.updateElement('allowedValue', data.allowedLeverage);
        this.updateElement('capitalLiquido', data.capitalLiquido);
        this.updateElement('margemPercent', data.margemPercent);
        this.updateElement('margemMoney', data.margemMoney);
        this.updateElement('valorReduzir', data.valorReduzir);
        this.updateElement('alavancagemStatus', data.status);

        this.updateLeverageBars(data.currentPercent, data.allowedPercent);
        this.clearLoading();
    }

    updateElement(key, value) {
        const element = this.elements[key];
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
        }
    }

    updateLeverageBars(currentPercent, allowedPercent) {
        const currentBar = this.elements.currentBar;
        const allowedBar = this.elements.allowedBar;

        if (currentBar) {
            currentBar.style.width = `${Math.min(currentPercent, 100)}%`;
            
            // Cor baseada no nível de risco
            if (currentPercent > 80) {
                currentBar.style.background = '#ff4757';
            } else if (currentPercent > 60) {
                currentBar.style.background = '#ffa726';
            } else {
                currentBar.style.background = '#4caf50';
            }
        }

        if (allowedBar) {
            allowedBar.style.width = `${Math.min(allowedPercent, 100)}%`;
            allowedBar.style.background = '#8b9dc3';
        }
    }

    showLoading() {
        const loadingElements = [
            'currentValue', 'allowedValue', 'capitalLiquido', 
            'margemPercent', 'margemMoney', 'valorReduzir', 'alavancagemStatus'
        ];

        loadingElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        // Reset das barras
        if (this.elements.currentBar) this.elements.currentBar.style.width = '0%';
        if (this.elements.allowedBar) this.elements.allowedBar.style.width = '0%';
    }

    showError() {
        const errorElements = [
            'currentValue', 'allowedValue', 'capitalLiquido', 
            'margemPercent', 'margemMoney', 'valorReduzir', 'alavancagemStatus'
        ];

        errorElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        // Reset das barras
        if (this.elements.currentBar) this.elements.currentBar.style.width = '0%';
        if (this.elements.allowedBar) this.elements.allowedBar.style.width = '0%';
    }

    clearLoading() {
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.classList.remove('loading');
            }
        });
    }
}

export default Alavancagem;