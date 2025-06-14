/* 
Arquivo: src/pages/home/components/alavancagem/alavancagem-data.js
Lógica de dados da Gestão de Alavancagem
*/

import formatters from '../../../../shared/formatters.js';
import { LEVERAGE_CONFIG } from '../../../../shared/constants.js';

export class AlavancagemData {
    constructor(apiClient) {
        this.api = apiClient;
    }

    async fetchData() {
        try {
            console.log('📡 Alavancagem: Buscando dados...');
            const response = await this.api.getDashboardHome();
            
            if (response.status === 'success' && response.data?.alavancagem) {
                return this.formatAlavancagemData(response.data.alavancagem);
            }
            
            throw new Error('Dados de alavancagem inválidos');
        } catch (error) {
            console.error('❌ Alavancagem: Erro ao buscar dados:', error);
            throw error;
        }
    }

    formatAlavancagemData(data) {
        console.log('🔄 Alavancagem: Formatando dados:', data);

        // Calcular percentuais para as barras (baseado em max 3x)
        const maxLeverage = LEVERAGE_CONFIG.MAX;
        const currentPercent = (data.atual / maxLeverage) * 100;
        const allowedPercent = (data.permitida / maxLeverage) * 100;
        
        // Calcular margem percentual: atual/permitida
        const margemPercent = data.permitida > 0 ? (data.atual / data.permitida * 100) : 0;

        return {
            currentLeverage: formatters.leverage(data.atual),
            allowedLeverage: formatters.leverage(data.permitida),
            currentPercent: Math.min(currentPercent, 100),
            allowedPercent: Math.min(allowedPercent, 100),
            capitalLiquido: formatters.currency(data.valor_disponivel),
            margemPercent: `${margemPercent.toFixed(1)}%`,
            margemMoney: formatters.currency(data.divida_total),
            valorReduzir: data.valor_a_reduzir > 0 ? formatters.currency(data.valor_a_reduzir) : 'N/A',
            status: data.status || 'N/A'
        };
    }
}

export default AlavancagemData;