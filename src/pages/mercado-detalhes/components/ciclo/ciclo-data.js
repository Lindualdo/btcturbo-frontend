/* 
Arquivo: src/pages/mercado-detalhes/components/ciclo/ciclo-data.js
Formatação de dados do Bloco Ciclo - CORRIGIDO com puell_multiple
*/

import formatters from '../../../../shared/formatters.js';

export class CicloData {
    constructor() {}

    formatCicloData(cicloData) {
        console.log('🔄 Ciclo: Formatando dados:', cicloData);

        if (!cicloData) {
            return null;
        }

        return {
            score: cicloData.score_consolidado || 0,
            classification: cicloData.classificacao_consolidada || 'neutro',
            indicadores: {
                mvrv: {
                    score: cicloData.indicadores?.mvrv_score?.score || 0,
                    valor: formatters.decimal(cicloData.indicadores?.mvrv_score?.valor)
                },
                nupl: {
                    score: cicloData.indicadores?.NUPL?.score || 0,
                    valor: formatters.decimal3(cicloData.indicadores?.NUPL?.valor)
                },
                reserve: {
                    score: cicloData.indicadores?.Reserve_Risk?.score || 0,
                    valor: formatters.decimal3(cicloData.indicadores?.Reserve_Risk?.valor)
                },
                realized: {
                    score: cicloData.indicadores?.Realized_Ratio?.score || 0,
                    valor: formatters.decimal(cicloData.indicadores?.Realized_Ratio?.valor)
                },
                puell: {
                    score: cicloData.indicadores?.puell_multiple?.score || 0,
                    valor: formatters.decimal(cicloData.indicadores?.puell_multiple?.valor)
                }
            }
        };
    }
}

export default CicloData;