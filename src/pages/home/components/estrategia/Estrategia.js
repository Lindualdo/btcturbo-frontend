/* 
Arquivo: src/pages/home/components/estrategia/Estrategia.js
Componente UI da Decisão Estratégica
*/

export class Estrategia {
    constructor() {
        this.elements = {
            acaoPrincipal: document.getElementById('acao-principal'),
            justificativaValor: document.getElementById('justificativa-valor'),
            setupValor: document.getElementById('setup-valor'),
            rsiDiarioValor: document.getElementById('rsi-diario-valor'),
            emaDistanceValor: document.getElementById('ema-distance-valor')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('🎯 Renderizando estratégia:', data);

        this.updateElement('acaoPrincipal', data.decisao);
        this.updateElement('justificativaValor', data.justificativa);
        this.updateElement('setupValor', data.setup);
        this.updateElement('rsiDiarioValor', data.rsiDiario);
        this.updateElement('emaDistanceValor', data.emaDistance);

        this.updateActionStyle(data.decisao);
        this.clearLoading();
    }

    updateElement(key, value) {
        const element = this.elements[key];
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
        }
    }

    updateActionStyle(decisao) {
        const actionElement = this.elements.acaoPrincipal;
        if (!actionElement) return;

        const parentDiv = actionElement.parentElement;
        if (!parentDiv) return;

        // Remove classes anteriores
        parentDiv.className = 'strategy-main-action';
        
        // Adiciona classe baseada na decisão
        switch (decisao?.toUpperCase()) {
            case 'BUY':
            case 'COMPRAR':
                parentDiv.classList.add('comprar');
                break;
            case 'SELL':
            case 'VENDER':
                parentDiv.classList.add('vender');
                break;
            case 'HOLD':
            case 'MANTER':
            default:
                parentDiv.classList.add('hold');
                break;
        }
    }

    showLoading() {
        const loadingElements = [
            'acaoPrincipal', 'justificativaValor', 'setupValor', 
            'rsiDiarioValor', 'emaDistanceValor'
        ];

        loadingElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });
    }

    showError() {
        const errorElements = [
            'acaoPrincipal', 'justificativaValor', 'setupValor', 
            'rsiDiarioValor', 'emaDistanceValor'
        ];

        errorElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        // Reset da cor de ação
        const actionElement = this.elements.acaoPrincipal;
        if (actionElement?.parentElement) {
            actionElement.parentElement.style.background = 'linear-gradient(135deg, #666, #555)';
        }
    }

    clearLoading() {
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.classList.remove('loading');
            }
        });
    }
}

export default Estrategia;