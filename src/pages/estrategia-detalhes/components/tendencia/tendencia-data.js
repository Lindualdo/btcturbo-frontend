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
                    score: this.calculateEmaScore(emas.ema_10_1w, btcPrice),
                    valor: formatters.currency(emas.ema_10_1w)
                },
                ema20: {
                    score: this.calculateEmaScore(emas.ema_20_1w, btcPrice),
                    valor: formatters.currency(emas.ema_20_1w)
                },
                ema50: {
                    score: this.calculateEmaScore(emas.ema_50_1w, btcPrice),
                    valor: formatters.currency(emas.ema_50_1w)
                },
                btcPrice: {
                    score: 100, // Preço atual sempre 100%
                    valor: formatters.currency(btcPrice)
                }
            }
        };
    }

    calculateEmaScore(emaValue, btcPrice) {
        // Score baseado na distância relativa do preço atual
        // Quanto maior a EMA comparada ao preço, menor o score
        if (!emaValue || !btcPrice) return 0;
        
        const ratio = emaValue / btcPrice;
        
        if (ratio >= 1.0) return 0; // EMA acima do preço = score baixo
        if (ratio >= 0.95) return 20;
        if (ratio >= 0.90) return 40;
        if (ratio >= 0.85) return 60;
        if (ratio >= 0.80) return 80;
        return 100; // EMA muito abaixo do preço = score alto
    }
}

export default TendenciaData;