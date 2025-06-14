/* 
Arquivo: src/pages/home/components/mercado/Mercado.js
Componente UI do Score de Mercado
*/

export class Mercado {
    constructor() {
        this.elements = {
            scoreNumber: document.getElementById('score-mercado-number'),
            scoreClass: document.getElementById('score-mercado-class'),
            scoreBar: document.getElementById('score-mercado-bar'),
            mvrvValue: document.getElementById('mvrv-value'),
            nuplValue: document.getElementById('nupl-value'),
            cicloValue: document.getElementById('ciclo-value')
        };
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('📊 Renderizando mercado:', data);

        this.updateElement('scoreNumber', data.score);
        this.updateElement('scoreClass', data.classification);
        this.updateElement('mvrvValue', data.mvrv);
        this.updateElement('nuplValue', data.nupl);
        this.updateElement('cicloValue', data.ciclo);
        
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
            // Remove loading primeiro
            barElement.classList.remove('loading');
            barElement.style.width = `${score}%`;
            
            // Cores dinâmicas baseadas no score
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
        const errorElements = ['scoreNumber', 'scoreClass', 'mvrvValue', 'nuplValue', 'cicloValue'];
        
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

export default Mercado;