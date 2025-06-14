/* 
Arquivo: src/shared/formatters.js
Formatadores de dados reutilizáveis
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
    }
};

export default formatters;