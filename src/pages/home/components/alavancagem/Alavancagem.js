/* 
Arquivo: src/pages/home/components/alavancagem/Alavancagem.js
Componente UI de Gestão de Alavancagem - SEM VALORES FIXOS
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
            console.warn('⚠️ Dados de alavancagem ausentes - zerado');
            this.showZeroedData();
            return;
        }

        console.log('📈 Renderizando alavancagem com dados:', data);

        // Garantir que nunca mostre valores fixos
        this.updateElement('currentValue', data.labelText || '0.00x / 0.00x');
        this.updateElement('allowedValue', data.allowedLeverage || '0.00x');
        this.updateElement('margemMoney', data.margemMoney || '$0');
        this.updateElement('alavancagemStatus', data.status || 'ERRO');

        // Capital líquido com destaque para negativo
        this.updateCapitalLiquido(data.capitalLiquido || '$0', (data.capitalLiquido || '').includes('-'));

        // Atualizar barras
        this.updateLeverageBars(data.usagePercent || 0, data.isOverLimit || false);
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

    showZeroedData() {
        console.log('📈 Mostrando dados zerados para alavancagem');
        
        this.updateElement('currentValue', '0.00x / 0.00x');
        this.updateElement('allowedValue', '0.00x');
        this.updateElement('margemMoney', '$0');
        this.updateElement('alavancagemStatus', 'SEM DADOS');
        this.updateCapitalLiquido('$0', false);
        this.updateLeverageBars(0, false);
        this.clearLoading();
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