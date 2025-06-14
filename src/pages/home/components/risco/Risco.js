/* 
Arquivo: src/pages/home/components/risco/Risco.js
Componente UI do Score de Risco
*/

export class Risco {
    constructor() {
        this.elements = {
            scoreNumber: document.getElementById('score-risco-number'),
            scoreClass: document.getElementById('score-risco-class'),
            scoreBar: document.getElementById('score-risco-bar'),
            hfValue: document.getElementById('hf-value'),
            liqValue: document.getElementById('liq-value')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('🛡️ Renderizando risco:', data);

        this.updateElement('scoreNumber', data.score);
        this.updateElement('scoreClass', data.classification);
        this.updateElement('hfValue', data.healthFactor);
        this.updateElement('liqValue', data.liquidacao);
        
        this.updateScoreBar(data.score);
        this.clearLoading();
    }

    updateElement(key, value) {
        const element = this.elements[key];
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
        }
    }

    updateScoreBar(score) {
        const barElement = this.elements.scoreBar;
        if (barElement) {
            // Remove loading e limpa texto
            barElement.classList.remove('loading');
            barElement.textContent = ''; // Remove texto "Carregando..."
            barElement.style.width = `${score}%`;
            
            // Cores dinâmicas baseadas no score (risco = inverso)
            if (score < 40) {
                barElement.style.background = 'linear-gradient(90deg, #ff4757, #ff6b6b)';
            } else if (score < 70) {
                barElement.style.background = 'linear-gradient(90deg, #ffa726, #ffb74d)';
            } else {
                barElement.style.background = 'linear-gradient(90deg, #4caf50, #66bb6a)';
            }
        }
    }

    showLoading() {
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });

        if (this.elements.scoreBar) {
            this.elements.scoreBar.style.width = '0%';
        }
    }

    showError() {
        const errorElements = ['scoreNumber', 'scoreClass', 'hfValue', 'liqValue'];
        
        errorElements.forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Erro';
                element.classList.add('error');
                element.classList.remove('loading');
            }
        });

        if (this.elements.scoreBar) {
            this.elements.scoreBar.style.width = '0%';
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

export default Risco;