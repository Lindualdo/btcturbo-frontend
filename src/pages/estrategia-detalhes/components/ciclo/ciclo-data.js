/* 
Arquivo: ciclo-data.js
Caminho: src/pages/estrategia-detalhes/components/ciclo/ciclo-data.js
Formatação de dados do Bloco Ciclo
*/

import formatters from '../../../../shared/formatters.js';

export class CicloData {
    constructor() {}

    formatCicloData(cicloData, cicloScore) {
        console.log('🔄 Ciclo: Formatando dados:', cicloData, cicloScore);

        if (!cicloData) {
            return null;
        }

        const indicadores = cicloData.indicadores;

        return {
            score: cicloScore || cicloData.score_consolidado || 0,
            classification: cicloData.classificacao_consolidada || 'neutro',
            indicadores: {
                nupl: {
                    score: indicadores?.NUPL?.score || 0,
                    valor: formatters.decimal3(indicadores?.NUPL?.valor)
                },
                mvrv: {
                    score: indicadores?.mvrv_score?.score || 0,
                    valor: formatters.decimal(indicadores?.mvrv_score?.valor)
                },
                reserve: {
                    score: indicadores?.Reserve_Risk?.score || 0,
                    valor: formatters.decimal3(indicadores?.Reserve_Risk?.valor)
                },
                puell: {
                    score: indicadores?.puell_multiple?.score || 0,
                    valor: formatters.decimal(indicadores?.puell_multiple?.valor)
                }
            }
        };
    }
}

export default CicloData;