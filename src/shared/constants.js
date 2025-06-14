/* 
Arquivo: src/shared/constants.js
Constantes e configurações globais
*/

export const API_CONFIG = {
    BASE_URL: 'https://btcturbo-v5-production.up.railway.app/api/v2',
    TIMEOUT: 10000,
    RETRY_DELAY: 5000,
    AUTO_REFRESH_INTERVAL: 30000 // 30 segundos
};

export const SCORE_THRESHOLDS = {
    LOW: 40,
    HIGH: 70
};

export const LEVERAGE_CONFIG = {
    MAX: 3.0,
    WARNING_THRESHOLD: 0.8 // 80% da permitida
};

export const COLORS = {
    SUCCESS: '#4caf50',
    WARNING: '#ffa726',
    ERROR: '#ff4757',
    ACCENT: '#ff8c42',
    NEUTRAL: '#8b9dc3',
    BACKGROUND: '#1a1d29',
    CARD: '#2a2f3e',
    BORDER: '#3a3f4e'
};

export const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200
};

export default {
    API_CONFIG,
    SCORE_THRESHOLDS,
    LEVERAGE_CONFIG,
    COLORS,
    BREAKPOINTS
};