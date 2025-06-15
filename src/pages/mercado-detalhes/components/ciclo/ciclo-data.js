/* 
Arquivo: src/pages/mercado-detalhes/components/ciclo/ciclo-data.js
Formatação de dados do Bloco Ciclo
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
            score: (cicloData.score || 0) * 10,
            classification: cicloData.classificacao || 'neutro',
            indicadores: {
                mvrv: {
                    score: (cicloData.indicadores?.mvrv?.score || 0) * 10,
                    valor: formatters.decimal(cicloData.indicadores?.mvrv?.valor)
                },
                nupl: {
                    score: (cicloData.indicadores?.nupl?.score || 0) * 10,
                    valor: formatters.decimal3(cicloData.indicadores?.nupl?.valor)
                },
                puell_multiple: {
                    score: (cicloData.indicadores?.puell_multiple?.score || 0) * 10,
                    valor: formatters.decimal(cicloData.indicadores?.puell_multiple?.valor)
                },
                realized_price_ratio: {
                    score: (cicloData.indicadores?.realized_price_ratio?.score || 0) * 10,
                    valor: formatters.decimal(cicloData.indicadores?.realized_price_ratio?.valor)
                }
            }
        };
    }
}

export default CicloData;