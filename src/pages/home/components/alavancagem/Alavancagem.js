/* 
Arquivo: src/pages/home/components/alavancagem/Alavancagem.js
Componente UI de Gestão de Alavancagem - IDs CORRETOS DO HTML
*/

export class Alavancagem {
    constructor() {
        this.elements = {
            // ✅ IDs que EXISTEM no index.html
            currentBar: document.getElementById('leverage-current-bar'),
            currentValue: document.getElementById('leverage-current-value'),
            capitalLiquido: document.getElementById('capital-liquido'),
            alavancagemStatus: document.getElementById('alavancagem-status')
        };

        // Debug: verificar se elementos foram encontrados
        console.log('🔍 Elementos encontrados:', {
            currentBar: !!this.elements.currentBar,
            currentValue: !!this.elements.currentValue,
            capitalLiquido: !!this.elements.capitalLiquido,
            alavancagemStatus: !!this.elements.alavancagemStatus
        });
    }

    render(data) {
        if (!data) {
            console.warn('⚠️ Dados de alavancagem ausentes - zerado');
            this.showZeroedData();
            return;
        }

        console.log('📈 Renderizando alavancagem com dados:', data);

        // Atualizar apenas elementos que existem
        this.updateElement('currentValue', data.labelText || '0.00x / 0.00x');
        this.updateElement('alavancagemStatus', data.status || 'ERRO');
        this.updateCapitalLiquido(data.capitalLiquido || '$0', (data.capitalLiquido || '').includes('-'));

        // Atualizar barra
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
        } else {
            console.warn('❌ Elemento capital-liquido não encontrado');
        }
    }

    updateElement(key, value) {
        const element = this.elements[key];
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
            console.log(`✅ ${key} atualizado para: ${value}`);
        } else {
            console.warn(`❌ Elemento ${key} não encontrado no DOM`);
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
            
            console.log(`✅ Barra atualizada: ${barWidth}% (${usagePercent}% real)`);
        } else {
            console.warn('❌ Elemento leverage-current-bar não encontrado');
        }
    }

    showLoading() {
        // Loading apenas nos elementos que existem
        const loadingElements = ['currentValue', 'capitalLiquido', 'alavancagemStatus'];

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
        this.updateElement('alavancagemStatus', 'SEM DADOS');
        this.updateCapitalLiquido('$0', false);
        this.updateLeverageBars(0, false);
        this.clearLoading();
    }

    showError() {
        console.log('❌ Mostrando erro para alavancagem');
        
        this.updateElement('currentValue', 'Erro');
        this.updateElement('alavancagemStatus', 'ERRO');
        this.updateCapitalLiquido('Erro', false);
        this.updateLeverageBars(0, false);
        this.clearLoading();
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