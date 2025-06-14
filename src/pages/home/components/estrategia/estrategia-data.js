/* 
Arquivo: src/pages/home/components/estrategia/estrategia-data.js
Lógica de dados da Decisão Estratégica
*/

import formatters from '../../../../shared/formatters.js';

export class EstrategiaData {
    constructor(apiClient) {
        this.api = apiClient;
    }

    async fetchData() {
        try {
            console.log('📡 Estratégia: Buscando dados...');
            const response = await this.api.getDashboardHome();
            
            if (response.status === 'success' && response.data) {
                return this.formatEstrategiaData(
                    response.data.estrategia, 
                    response.data.tecnicos
                );
            }
            
            throw new Error('Dados de estratégia inválidos');
        } catch (error) {
            console.error('❌ Estratégia: Erro ao buscar dados:', error);
            throw error;
        }
    }

    formatEstrategiaData(estrategia, tecnicos) {
        console.log('🔄 Estratégia: Formatando dados:', estrategia, tecnicos);

        return {
            decisao: estrategia?.decisao || 'HOLD',
            justificativa: estrategia?.justificativa || 'Análise em andamento...',
            setup: this.formatSetup(estrategia?.setup_4h),
            rsiDiario: tecnicos?.rsi ? tecnicos.rsi.toFixed(1) : 'N/A',
            emaDistance: tecnicos?.ema_144_distance ? 
                formatters.percent(tecnicos.ema_144_distance) : 'N/A'
        };
    }

    formatSetup(setup) {
        if (!setup) return 'N/A';
        
        // Formatar setup removendo underscores e capitalizando
        return setup.replace(/_/g, ' ')
                   .split(' ')
                   .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                   .join(' ');
    }
}

export default EstrategiaData;