/* 
Arquivo: src/pages/home/components/mercado/mercado-data.js
Lógica de dados do Score de Mercado
*/

import formatters from '../../../../shared/formatters.js';

export class MercadoData {
    constructor() {}

    formatMercadoData(mercado) {
        console.log('🔄 Mercado: Formatando dados:', mercado);

        return {
            score: formatters.score(mercado?.score_mercado || 0),
            classification: formatters.classification(mercado?.classificacao_mercado),
            ciclo: mercado?.ciclo_name,
            ciclo_detail: mercado?.ciclo_detail
        };
    }
}

export default MercadoData;