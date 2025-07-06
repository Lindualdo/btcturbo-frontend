/* 
Arquivo: src/pages/home/components/risco/risco-data.js
Lógica de dados do Score de Risco - CORRIGIDO para nova API financeiro/score-risco
*/

import formatters from '../../../../shared/formatters.js';

export class RiscoData {
    constructor() {}

    formatRiscoData(risco) {
        console.log('🔄 Risco: Formatando dados:', risco);

        // Detectar se é da nova API financeiro/score-risco ou dash-main
        const isNewApi = risco && risco.score && risco.classificacao && risco.Health_Factor;

        if (isNewApi) {
            // NOVA API: financeiro/score-risco
            console.log('📊 Usando dados da nova API financeiro/score-risco');
            
            return {
                score: formatters.score(risco.score || 0),
                classification: formatters.classification(risco.classificacao),
                healthFactor: formatters.decimal(risco.Health_Factor),
                liquidacao: risco.Dist_Liquidacao || 'N/A' // Já vem formatado como "61.7%"
            };
        } else {
            // FALLBACK: dash-main (estrutura antiga)
            console.log('📊 Usando dados do dash-main (fallback)');
            
            return {
                score: formatters.score(risco?.score_risco || 0),
                classification: formatters.classification(risco?.classificacao_risco),
                healthFactor: formatters.decimal(risco?.health_factor),
                liquidacao: formatters.percent(risco?.dist_liquidacao)
            };
        }
    }
}

export default RiscoData;