/* 
Arquivo: src/pages/home/components/mercado/mercado-data.js
Lógica de dados do Score de Mercado
*/

import formatters from '../../../../shared/formatters.js';

export class MercadoData {
    constructor(apiClient) {
        this.api = apiClient;
    }

    async fetchData() {
        try {
            console.log('📡 Mercado: Buscando dados...');
            const response = await this.api.getDashboardHome();
            
            if (response.status === 'success' && response.data) {
                return this.formatMercadoData(response.data.scores, response.data.indicadores);
            }
            
            throw new Error('Dados de mercado inválidos');
        } catch (error) {
            console.error('❌ Mercado: Erro ao buscar dados:', error);
            throw error;
        }
    }

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