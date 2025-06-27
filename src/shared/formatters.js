/* 
Arquivo: src/shared/formatters.js
Formatadores de dados reutilizáveis - COM SISTEMA DE CORES 5 NÍVEIS
*/

export const formatters = {
    // Moeda
    currency: (value) => {
        if (!value && value !== 0) return 'N/A';
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    },

    // BTC
    btc: (value) => {
        if (!value && value !== 0) return 'N/A';
        return Number(value).toFixed(4);
    },

    // Percentual
    percent: (value) => {
        if (!value && value !== 0) return 'N/A';
        return `${value.toFixed(1)}%`;
    },

    // Score
    score: (value) => {
        if (!value && value !== 0) return 0;
        return Math.round(value);
    },

    // Decimal 2 casas
    decimal: (value) => {
        if (!value && value !== 0) return 'N/A';
        return value.toFixed(2);
    },

    // Decimal 3 casas
    decimal3: (value) => {
        if (!value && value !== 0) return 'N/A';
        return value.toFixed(3);
    },

    // Alavancagem
    leverage: (value) => {
        if (!value && value !== 0) return 'N/A';
        return `${value.toFixed(2)}x`;
    },

    // Status de classificação
    classification: (value) => {
        if (!value) return 'NEUTRO';
        return value.toUpperCase();
    },

    // Status de API
    apiStatus: (status) => {
        return status === 'success' ? '⚡ Operacional' : '❌ Erro';
    },

    // 🎨 SISTEMA DE CORES 5 NÍVEIS (0-100)
    getScoreColor: (score) => {
        const numScore = Number(score) || 0;
        
        if (numScore <= 20) {
            // 0-20: Vermelho forte
            return {
                background: 'linear-gradient(90deg, #d32f2f, #f44336)',
                solid: '#d32f2f'
            };
        } else if (numScore <= 40) {
            // 20-40: Vermelho claro
            return {
                background: 'linear-gradient(90deg, #f44336, #ff5722)',
                solid: '#f44336'
            };
        } else if (numScore <= 60) {
            // 40-60: Amarelo/Neutro
            return {
                background: 'linear-gradient(90deg, #ff9800, #ffc107)',
                solid: '#ff9800'
            };
        } else if (numScore <= 80) {
            // 60-80: Verde claro
            return {
                background: 'linear-gradient(90deg, #8bc34a, #4caf50)',
                solid: '#8bc34a'
            };
        } else {
            // 80-100: Verde forte
            return {
                background: 'linear-gradient(90deg, #4caf50, #388e3c)',
                solid: '#4caf50'
            };
        }
    },

    // Aplicar cor na barra baseada no score
    applyScoreColor: (element, score) => {
        if (!element) return;
        
        const colors = formatters.getScoreColor(score);
        element.style.background = colors.background;
    }
};

export default formatters;