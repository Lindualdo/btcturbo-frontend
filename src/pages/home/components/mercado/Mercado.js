/* 
Arquivo: src/pages/home/components/mercado/Mercado.js
Componente UI do Score de Mercado - COM SISTEMA DE CORES 5 NÍVEIS
*/

import formatters from '../../../../shared/formatters.js';

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

        // Setup da navegação
        this.setupNavigation();
    }

    setupNavigation() {
        // Encontrar o botão "Ver Detalhes" no card de mercado
        const mercadoCard = document.getElementById('score-mercado-number')?.closest('.score-card');
        const detailButton = mercadoCard?.querySelector('.btn-detail-minimal');
        
        if (detailButton) {
            detailButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔄 Navegando para detalhes do mercado...');
                window.location.href = '/mercado-detalhes.html';
            });
            
            console.log('✅ Navegação configurada para mercado detalhes');
        } else {
            console.log('⚠️ Botão de detalhes não encontrado no card de mercado');
        }
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
            // Remove loading e limpa texto
            barElement.classList.remove('loading');
            barElement.textContent = ''; // Remove texto "Carregando..."
            barElement.style.width = `${score}%`;
            
            // 🎨 NOVO: Aplicar sistema de cores 5 níveis
            formatters.applyScoreColor(barElement, score);
        }
    }

    showLoading() {
        // Loading apenas nos textos, não nas barras
        ['scoreNumber', 'scoreClass', 'mvrvValue', 'nuplValue', 'cicloValue'].forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.textContent = 'Carregando...';
                element.classList.add('loading');
            }
        });
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