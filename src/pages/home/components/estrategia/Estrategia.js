/* 
Arquivo: src/pages/home/components/estrategia/Estrategia.js
Componente UI da Decisão Estratégica - CORRIGIDO
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

        // RESET COMPLETO - Remove todas as classes e estilos inline
        parentDiv.className = 'strategy-main-action';
        parentDiv.style.background = ''; // Limpa qualquer estilo inline
        parentDiv.style.cssText = ''; // Limpa completamente inline styles
        
        // Força um reflow para garantir que os estilos foram removidos
        parentDiv.offsetHeight;
        
        // Aplica nova classe baseada na decisão com timeout para garantir aplicação
        setTimeout(() => {
            const decisaoLower = decisao?.toLowerCase() || 'hold';
            
            if (decisaoLower.includes('buy') || decisaoLower.includes('comprar')) {
                parentDiv.classList.add('comprar');
                console.log('✅ Aplicando classe: comprar');
            } else if (decisaoLower.includes('sell') || decisaoLower.includes('vender')) {
                parentDiv.classList.add('vender');
                console.log('✅ Aplicando classe: vender');
            } else {
                parentDiv.classList.add('hold');
                console.log('✅ Aplicando classe: hold');
            }
        }, 10);
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

        // Reset do container de ação para estado loading
        const actionElement = this.elements.acaoPrincipal;
        if (actionElement?.parentElement) {
            const parentDiv = actionElement.parentElement;
            parentDiv.className = 'strategy-main-action';
            parentDiv.style.cssText = '';
        }
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

        // Reset da cor de ação para estado de erro
        const actionElement = this.elements.acaoPrincipal;
        if (actionElement?.parentElement) {
            const parentDiv = actionElement.parentElement;
            parentDiv.className = 'strategy-main-action';
            parentDiv.style.cssText = '';
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