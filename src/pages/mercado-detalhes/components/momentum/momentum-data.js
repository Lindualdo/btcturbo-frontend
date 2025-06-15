/* 
Arquivo: src/pages/mercado-detalhes/components/momentum/momentum-data.js
Formatação de dados do Bloco Momentum
*/

import formatters from '../../../../shared/formatters.js';

export class MomentumData {
    constructor() {}

    formatMomentumData(momentumData) {
        console.log('🔄 Momentum: Formatando dados:', momentumData);

        if (!momentumData) {
            return null;
        }

        return {
            score: (momentumData.score || 0) * 10,
            classification: momentumData.classificacao || 'neutro',
            indicadores: {
                sopr: {
                    score: (momentumData.indicadores?.sopr?.score || 0) * 10,
                    valor: formatters.decimal3(momentumData.indicadores?.sopr?.valor)
                },
                rsi_semanal: {
                    score: (momentumData.indicadores?.rsi_semanal?.score || 0) * 10,
                    valor: formatters.decimal(momentumData.indicadores?.rsi_semanal?.valor)
                },
                funding_rate: {
                    score: (momentumData.indicadores?.funding_rate?.score || 0) * 10,
                    valor: momentumData.indicadores?.funding_rate?.valor || 'N/A'
                },
                long_short_ratio: {
                    score: (momentumData.indicadores?.long_short_ratio?.score || 0) * 10,
                    valor: formatters.decimal3(momentumData.indicadores?.long_short_ratio?.valor)
                }
            }
        };
    }
}

export default MomentumData;