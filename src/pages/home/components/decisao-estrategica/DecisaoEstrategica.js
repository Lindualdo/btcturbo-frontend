/* 
Arquivo: DecisaoEstrategica.js
Caminho: src/pages/home/components/decisao-estrategica/DecisaoEstrategica.js
Componente UI da Decisão Estratégica - ARQUIVO COMPLETO COM INDICADORES MODERNOS
*/

export class DecisaoEstrategica {
    constructor() {
        this.elements = {
            faseOperacional: document.getElementById('fase-operacional'),
            acaoPrimaria: document.getElementById('acao-primaria'),
            tendenciaScore: document.getElementById('tendencia-score'),
            tendenciaIndicator: document.getElementById('tendencia-indicator'),
            cicloScore: document.getElementById('ciclo-score'),
            cicloIndicator: document.getElementById('ciclo-indicator'),
            alavancagemMax: document.getElementById('alavancagem-max'),
            satelitePercent: document.getElementById('satelite-percent')
        };

        // Setup da navegação
        this.setupNavigation();

        console.log('🔍 Elementos DecisaoEstrategica encontrados:', {
            faseOperacional: !!this.elements.faseOperacional,
            acaoPrimaria: !!this.elements.acaoPrimaria,
            tendenciaScore: !!this.elements.tendenciaScore,
            tendenciaIndicator: !!this.elements.tendenciaIndicator,
            cicloScore: !!this.elements.cicloScore,
            cicloIndicator: !!this.elements.cicloIndicator,
            alavancagemMax: !!this.elements.alavancagemMax,
            satelitePercent: !!this.elements.satelitePercent
        });
    }

    setupNavigation() {
        // Encontrar o botão "Ver Detalhes" no card de decisão estratégica
        const estrategiaCard = document.getElementById('fase-operacional')?.closest('.score-card');
        const detailButton = estrategiaCard?.querySelector('.btn-detail-minimal');
        
        if (detailButton) {
            detailButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔄 Navegando para detalhes da estratégia...');
                window.location.href = '/detalhe-estrategia.html';
            });
            
            console.log('✅ Navegação configurada para estratégia detalhes');
        } else {
            console.log('⚠️ Botão de detalhes não encontrado no card de estratégia');
        }
    }

    render(data) {
        if (!data) {
            this.showError();
            return;
        }

        console.log('🎯 Renderizando decisão estratégica com indicadores modernos:', data);

        this.updateElement('faseOperacional', data.faseOperacional);
        this.updateElement('acaoPrimaria', data.acaoPrimaria);
        this.updateElement('tendenciaScore', data.tendenciaScore);
        this.updateElement('cicloScore', data.cicloScore);
        this.updateElement('alavancagemMax', data.alavancagemMax);
        this.updateElement('satelitePercent', data.satelitePercent);

        // Sistema de indicadores modernos
        this.updateIndicator('tendencia', data.tendenciaScore);
        this.updateIndicator('ciclo', data.cicloScore);
        
        this.clearLoading();
    }

    updateElement(key, value) {
        const element = this.elements[key];
        if (element) {
            element.textContent = value;
            element.classList.remove('loading');
        }
    }

    // Sistema de indicadores circulares modernos com posicionamento e cor exatos
    updateIndicator(name, score) {
        const indicatorElement = this.elements[`${name}Indicator`];
        
        if (!indicatorElement) {
            console.warn(`❌ Indicador ${name} não encontrado no DOM`);
            return;
        }

        // Garantir que o score está entre 0 e 100
        const percentage = Math.min(Math.max(score || 0, 0), 100);
        
        // Posicionamento correto - indicador sempre dentro da barra
        const isMobile = window.innerWidth <= 768;
        const indicatorWidth = isMobile ? 14 : 16;
        const barElement = indicatorElement.parentElement;
        const barWidth = barElement ? barElement.offsetWidth : 300;
        
        // Calcular posição considerando largura do indicador
        const availableWidth = barWidth - indicatorWidth;
        const positionInPixels = (percentage / 100) * availableWidth + (indicatorWidth / 2);
        const positionInPercentage = (positionInPixels / barWidth) * 100;
        
        indicatorElement.style.left = `${positionInPercentage}%`;
        
        // Cor exata do gradiente - interpolar cor baseada na posição
        const exactColor = this.interpolateGradientColor(percentage);
        indicatorElement.style.backgroundColor = exactColor;
        
        console.log(`✅ ${name}: score=${score}% → posição=${positionInPercentage.toFixed(1)}% → cor=${exactColor}`);
    }

    // Calcular cor exata do gradiente baseada na posição
    interpolateGradientColor(percentage) {
        // Cores do gradiente: 0% → 25% → 50% → 75% → 100%
        const colors = [
            { pos: 0,   color: { r: 255, g: 71,  b: 87  } }, // #ff4757 vermelho
            { pos: 25,  color: { r: 255, g: 107, b: 53  } }, // #ff6b35 laranja
            { pos: 50,  color: { r: 255, g: 167, b: 38  } }, // #ffa726 amarelo
            { pos: 75,  color: { r: 139, g: 195, b: 74  } }, // #8bc34a verde claro
            { pos: 100, color: { r: 76,  g: 175, b: 80  } }  // #4caf50 verde forte
        ];
        
        // Encontrar as duas cores entre as quais interpolar
        let lowerColor = colors[0];
        let upperColor = colors[colors.length - 1];
        
        for (let i = 0; i < colors.length - 1; i++) {
            if (percentage >= colors[i].pos && percentage <= colors[i + 1].pos) {
                lowerColor = colors[i];
                upperColor = colors[i + 1];
                break;
            }
        }
        
        // Calcular fator de interpolação (0 a 1)
        const range = upperColor.pos - lowerColor.pos;
        const factor = range === 0 ? 0 : (percentage - lowerColor.pos) / range;
        
        // Interpolar RGB
        const r = Math.round(lowerColor.color.r + (upperColor.color.r - lowerColor.color.r) * factor);
        const g = Math.round(lowerColor.color.g + (upperColor.color.g - lowerColor.color.g) * factor);
        const b = Math.round(lowerColor.color.b + (upperColor.color.b - lowerColor.color.b) * factor);
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Métodos antigos mantidos para compatibilidade (redirecionam para novo sistema)
    updateTendenciaBar(score) {
        console.log('⚠️ Método antigo updateTendenciaBar chamado, redirecionando para novo sistema');
        this.updateIndicator('tendencia', score);
    }

    updateCicloBar(score) {
        console.log('⚠️ Método antigo updateCicloBar chamado, redirecionando para novo sistema');
        this.updateIndicator('ciclo', score);
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

        // Reset dos indicadores modernos
        this.resetIndicators();
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

        // Reset dos indicadores modernos com cor de erro
        this.resetIndicators(true);
    }

    // Reset dos indicadores modernos
    resetIndicators(isError = false) {
        ['tendencia', 'ciclo'].forEach(name => {
            const indicatorElement = this.elements[`${name}Indicator`];
            if (indicatorElement) {
                // Reset para posição 0 (extrema esquerda, mas dentro da barra)
                const isMobile = window.innerWidth <= 768;
                const indicatorWidth = isMobile ? 14 : 16;
                const barElement = indicatorElement.parentElement;
                const barWidth = barElement ? barElement.offsetWidth : 300;
                const positionInPixels = indicatorWidth / 2;
                const positionInPercentage = (positionInPixels / barWidth) * 100;
                
                indicatorElement.style.left = `${positionInPercentage}%`;
                indicatorElement.style.backgroundColor = '#ff4757'; // Vermelho (posição 0)
            }
        });
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