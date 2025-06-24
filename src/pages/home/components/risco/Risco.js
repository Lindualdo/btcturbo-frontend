/* 
Arquivo: src/pages/home/components/risco/Risco.js
Componente UI do Score de Risco - COM NAVEGAÇÃO
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

        // NOVA FUNCIONALIDADE: Setup da navegação
        this.setupNavigation();
    }

    setupNavigation() {
        // Encontrar o botão "Ver Detalhes" no card de risco
        const riscoCard = document.getElementById('score-risco-number')?.closest('.score-card');
        const detailButton = riscoCard?.querySelector('.btn-detail-minimal');
        
        if (detailButton) {
            detailButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔄 Navegando para detalhes do risco...');
                window.location.href = '/risco-detalhes.html';
            });
            
            console.log('✅ Navegação configurada para risco detalhes');
        } else {
            console.log('⚠️ Botão de detalhes não encontrado no card de risco');
        }
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
            barElement.classList.remove('loading');
            barElement.textContent = '';
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
        ['scoreNumber', 'scoreClass', 'hfValue', 'liqValue'].forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });
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