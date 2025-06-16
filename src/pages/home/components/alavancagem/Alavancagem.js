/* 
Arquivo: src/pages/home/components/alavancagem/Alavancagem.js
Componente UI de Gestão de Alavancagem - CORRIGIDO
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
            alavancagemStatus: document.getElementById('alavancagem-status')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('📈 Renderizando alavancagem:', data);

        this.updateElement('currentValue', data.labelText);
        this.updateElement('allowedValue', data.allowedLeverage);
        this.updateElement('margemMoney', data.margemMoney);
        this.updateElement('alavancagemStatus', data.status);

        // Destacar valor negativo em vermelho
        this.updateCapitalLiquido(data.capitalLiquido, data.capitalLiquido.includes('-'));

        this.updateLeverageBars(data.usagePercent, data.isOverLimit);
        this.clearLoading();
    }

    updateCapitalLiquido(value, isNegative) {
        const element = this.elements.capitalLiquido;
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
            
            // Destacar valores negativos em vermelho
            if (isNegative) {
                element.style.color = '#ff4757';
            } else {
                element.style.color = '#ffffff';
            }
        }
    }

    updateElement(key, value) {
        const element = this.elements[key];
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
        }
    }

    updateLeverageBars(usagePercent, isOverLimit) {
        const currentBar = this.elements.currentBar;

        if (currentBar) {
            // Permitir que a barra passe de 100% quando estourar
            const barWidth = Math.min(usagePercent, 100);
            currentBar.style.width = `${barWidth}%`;
            
            // Cores baseadas no status da alavancagem
            if (isOverLimit) {
                currentBar.style.background = '#ff4757'; // Vermelho - estourou o limite
            } else if (usagePercent > 80) {
                currentBar.style.background = '#ffa726'; // Laranja - próximo do limite
            } else {
                currentBar.style.background = '#4caf50'; // Verde - seguro
            }
        }
    }

    showLoading() {
        const loadingElements = [
            'currentValue', 'allowedValue', 'capitalLiquido', 
            'margemPercent', 'margemMoney', 'alavancagemStatus'
        ];

        loadingElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        // Reset da barra
        if (this.elements.currentBar) this.elements.currentBar.style.width = '0%';
    }

    showError() {
        const errorElements = [
            'currentValue', 'allowedValue', 'capitalLiquido', 
            'margemPercent', 'margemMoney', 'alavancagemStatus'
        ];

        errorElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        // Reset da barra
        if (this.elements.currentBar) this.elements.currentBar.style.width = '0%';
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