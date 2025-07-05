/* 
Arquivo: DecisaoEstrategica.js
Caminho: src/pages/home/components/decisao-estrategica/DecisaoEstrategica.js
Componente UI da Decisão Estratégica
*/

export class DecisaoEstrategica {
    constructor() {
        this.elements = {
            faseOperacional: document.getElementById('fase-operacional'),
            acaoPrimaria: document.getElementById('acao-primaria'),
            tendenciaScore: document.getElementById('tendencia-score'),
            tendenciaBar: document.getElementById('tendencia-bar'),
            cicloScore: document.getElementById('ciclo-score'),
            cicloBar: document.getElementById('ciclo-bar'),
            alavancagemMax: document.getElementById('alavancagem-max'),
            satelitePercent: document.getElementById('satelite-percent')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('🎯 Renderizando decisão estratégica:', data);

        this.updateElement('faseOperacional', data.faseOperacional);
        this.updateElement('acaoPrimaria', data.acaoPrimaria);
        this.updateElement('tendenciaScore', data.tendenciaScore);
        this.updateElement('cicloScore', data.cicloScore);
        this.updateElement('alavancagemMax', data.alavancagemMax);
        this.updateElement('satelitePercent', data.satelitePercent);

        this.updateTendenciaBar(data.tendenciaScore);
        this.updateCicloBar(data.cicloScore);
        this.clearLoading();
    }

    updateElement(key, value) {
        const element = this.elements[key];
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
        }
    }

    updateTendenciaBar(score) {
        const barElement = this.elements.tendenciaBar;
        if (barElement) {
            barElement.classList.remove('loading');
            barElement.style.width = `${score}%`;
            
            // Cores baseadas na tendência (0-100: Bear para Bull)
            if (score >= 80) {
                barElement.style.background = '#4caf50'; // Verde forte - BULL
            } else if (score >= 60) {
                barElement.style.background = '#8bc34a'; // Verde claro
            } else if (score >= 40) {
                barElement.style.background = '#ffc107'; // Amarelo - Neutro
            } else if (score >= 20) {
                barElement.style.background = '#ff9800'; // Laranja
            } else {
                barElement.style.background = '#f44336'; // Vermelho - BEAR
            }
        }
    }

    updateCicloBar(score) {
        const barElement = this.elements.cicloBar;
        if (barElement) {
            barElement.classList.remove('loading');
            barElement.style.width = `${score}%`;
            
            // Cores baseadas no ciclo (0-100: Bolha para Ext.Barato)
            if (score >= 80) {
                barElement.style.background = '#f44336'; // Vermelho - Bolha
            } else if (score >= 60) {
                barElement.style.background = '#ff9800'; // Laranja
            } else if (score >= 40) {
                barElement.style.background = '#ffc107'; // Amarelo - Neutro
            } else if (score >= 20) {
                barElement.style.background = '#8bc34a'; // Verde claro
            } else {
                barElement.style.background = '#4caf50'; // Verde forte - Ext.Barato
            }
        }
    }

    showLoading() {
        const loadingElements = [
            'faseOperacional', 'acaoPrimaria', 'tendenciaScore', 
            'cicloScore', 'alavancagemMax', 'satelitePercent'
        ];

        loadingElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        // Reset das barras
        if (this.elements.tendenciaBar) this.elements.tendenciaBar.style.width = '0%';
        if (this.elements.cicloBar) this.elements.cicloBar.style.width = '0%';
    }

    showError() {
        const errorElements = [
            'faseOperacional', 'acaoPrimaria', 'tendenciaScore', 
            'cicloScore', 'alavancagemMax', 'satelitePercent'
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
        if (this.elements.tendenciaBar) this.elements.tendenciaBar.style.width = '0%';
        if (this.elements.cicloBar) this.elements.cicloBar.style.width = '0%';
    }

    clearLoading() {
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.classList.remove('loading');
            }
        });
    }
}

export default DecisaoEstrategica;