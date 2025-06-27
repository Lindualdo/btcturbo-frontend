/* 
Arquivo: src/pages/mercado-detalhes/components/momentum/momentum-data.js
Formatação de dados do Bloco Momentum - CORRIGIDO para nova estrutura JSON
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
            score: momentumData.score_consolidado || 0,
            classification: momentumData.classificacao_consolidada || 'neutro',
            indicadores: {
                sopr: {
                    score: momentumData.indicadores?.SOPR?.score || 0,
                    valor: formatters.decimal3(momentumData.indicadores?.SOPR?.valor)
                },
                rsi_semanal: {
                    score: momentumData.indicadores?.RSI_Semanal?.score || 0,
                    valor: formatters.decimal(momentumData.indicadores?.RSI_Semanal?.valor)
                },
                funding_rate: {
                    score: momentumData.indicadores?.Funding_Rates?.score || 0,
                    valor: momentumData.indicadores?.Funding_Rates?.valor || 'N/A'
                },
                long_short_ratio: {
                    score: momentumData.indicadores?.Long_Short_Ratio?.score || 0,
                    valor: formatters.decimal3(momentumData.indicadores?.Long_Short_Ratio?.valor)
                }
            }
        };
    }
}

export default MomentumData;