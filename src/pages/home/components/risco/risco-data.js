/* 
Arquivo: src/pages/home/components/risco/risco-data.js
Lógica de dados do Score de Risco - CORRIGIDO para nova API financeiro/score-risco
*/

import formatters from '../../../../shared/formatters.js';

export class RiscoData {
    constructor() {}

    formatRiscoData(risco) {
        console.log('🔄 Risco: Formatando dados (apenas API específica):', risco);

        // Apenas API financeiro/score-risco (dash-main desativado)
        if (!risco || !risco.score || !risco.classificacao) {
            console.warn('⚠️ Dados de risco ausentes ou inválidos');
            return {
                score: 0,
                classification: 'ERRO',
                healthFactor: '0.00',
                liquidacao: '0.0%'
            };
        }

        console.log('📊 Usando dados da API financeiro/score-risco');
        
        return {
            score: formatters.score(risco.score || 0),
            classification: formatters.classification(risco.classificacao),
            healthFactor: formatters.decimal(risco.Health_Factor),
            liquidacao: risco.Dist_Liquidacao || 'N/A' // Já vem formatado como "61.7%"
        };
    }
}

export default RiscoData;