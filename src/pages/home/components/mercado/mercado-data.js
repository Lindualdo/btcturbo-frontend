/* 
Arquivo: src/pages/home/components/mercado/mercado-data.js
Lógica de dados do Score de Mercado
*/

import formatters from '../../../../shared/formatters.js';

export class MercadoData {
    constructor() {}

    formatMercadoData(scores, indicadores) {
        console.log('🔄 Mercado: Formatando dados:', scores, indicadores);

        return {
            score: formatters.score(scores?.mercado || 0),
            classification: formatters.classification(scores?.classificacao_mercado),
            mvrv: formatters.decimal(indicadores?.mvrv),
            nupl: formatters.decimal3(indicadores?.nupl),
            ciclo: scores?.ciclo || 'N/A'
        };
    }
}

export default MercadoData;