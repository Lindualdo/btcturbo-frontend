/* 
Arquivo: src/pages/home/components/risco/risco-data.js
Lógica de dados do Score de Risco
*/

import formatters from '../../../../shared/formatters.js';

export class RiscoData {
    constructor(apiClient) {
        this.api = apiClient;
    }

    async fetchData() {
        try {
            console.log('📡 Risco: Buscando dados...');
            const response = await this.api.getDashboardHome();
            
            if (response.status === 'success' && response.data) {
                return this.formatRiscoData(response.data.scores, response.data.indicadores);
            }
            
            throw new Error('Dados de risco inválidos');
        } catch (error) {
            console.error('❌ Risco: Erro ao buscar dados:', error);
            throw error;
        }
    }

    formatRiscoData(scores, indicadores) {
        console.log('🔄 Risco: Formatando dados:', scores, indicadores);

        return {
            score: formatters.score(scores?.risco || 0),
            classification: formatters.classification(scores?.classificacao_risco),
            healthFactor: formatters.decimal(indicadores?.health_factor),
            liquidacao: formatters.percent(indicadores?.dist_liquidacao)
        };
    }
}

export default RiscoData;