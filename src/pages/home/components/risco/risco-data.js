/* 
Arquivo: src/pages/home/components/risco/risco-data.js
Lógica de dados do Score de Risco
*/

import formatters from '../../../../shared/formatters.js';

export class RiscoData {
    constructor() {}

    formatRiscoData(risco) {
        console.log('🔄 Risco: Formatando dados:', risco);

        return {
            score: formatters.score(risco?.score_risco || 0),
            classification: formatters.classification(risco?.classificacao_risco),
            healthFactor: formatters.decimal(risco?.health_factor),
            liquidacao: formatters.percent(risco?.dist_liquidacao)
        };
    }
}

export default RiscoData;