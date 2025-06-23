/* 
Arquivo: src/pages/home/components/mercado/mercado-data.js
Lógica de dados do Score de Mercado
*/

import formatters from '../../../../shared/formatters.js';

export class MercadoData {
    constructor() {}

    formatMercadoData(mercado) {
        console.log('🔄 Mercado: Formatando dados:', mercado);
        //const classification = formatters.classification(mercado?.classificacao_mercado);
        const classification = `Ciclo: ${mercado?.ciclo_name} - ${mercado?.ciclo_detail}`;

        return {
            score: formatters.score(mercado?.score_mercado || 0),
            classification: formatters.classification(classification),
        };
    }
}

export default MercadoData;