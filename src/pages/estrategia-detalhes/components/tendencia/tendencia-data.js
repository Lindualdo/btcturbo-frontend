/* 
Arquivo: tendencia-data.js
Caminho: src/pages/estrategia-detalhes/components/tendencia/tendencia-data.js
Formatação de dados do Bloco Tendência
*/

import formatters from '../../../../shared/formatters.js';

export class TendenciaData {
    constructor() {}

    formatTendenciaData(emasData, tendenciaScore) {
        console.log('🔄 Tendência: Formatando dados:', emasData, tendenciaScore);

        if (!emasData) {
            return null;
        }

        const emas = emasData.emas_json;
        const btcPrice = emas.btc_price_current;

        return {
            score: tendenciaScore || emasData.score_emas || 0,
            classification: emasData.classificacao_emas || 'neutro',
            emas: {
                ema10: {
                    price: formatters.currency(emas.ema_10_1w),
                    distance: this.calculateDistance(btcPrice, emas.ema_10_1w),
                    distanceText: this.formatDistance(btcPrice, emas.ema_10_1w)
                },
                ema20: {
                    price: formatters.currency(emas.ema_20_1w),
                    distance: this.calculateDistance(btcPrice, emas.ema_20_1w),
                    distanceText: this.formatDistance(btcPrice, emas.ema_20_1w)
                },
                ema50: {
                    price: formatters.currency(emas.ema_50_1w),
                    distance: this.calculateDistance(btcPrice, emas.ema_50_1w),
                    distanceText: this.formatDistance(btcPrice, emas.ema_50_1w)
                },
                ema100: {
                    price: formatters.currency(emas.ema_100_1w),
                    distance: this.calculateDistance(btcPrice, emas.ema_100_1w),
                    distanceText: this.formatDistance(btcPrice, emas.ema_100_1w)
                },
                ema200: {
                    price: formatters.currency(emas.ema_200_1w),
                    distance: this.calculateDistance(btcPrice, emas.ema_200_1w),
                    distanceText: this.formatDistance(btcPrice, emas.ema_200_1w)
                },
                btcPrice: {
                    price: formatters.currency(btcPrice),
                    distance: 0,
                    distanceText: 'Referência'
                }
            }
        };
    }

    calculateDistance(currentPrice, emaValue) {
        if (!emaValue || !currentPrice) return 0;
        return ((currentPrice - emaValue) / emaValue) * 100;
    }

    formatDistance(currentPrice, emaValue) {
        const distance = this.calculateDistance(currentPrice, emaValue);
        const sign = distance >= 0 ? '+' : '';
        return `${sign}${distance.toFixed(1)}%`;
    }
}

export default TendenciaData;