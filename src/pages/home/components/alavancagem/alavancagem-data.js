/* 
Arquivo: src/pages/home/components/alavancagem/alavancagem-data.js
Lógica de dados da Gestão de Alavancagem - CORRIGIDO
*/

import formatters from '../../../../shared/formatters.js';
import { LEVERAGE_CONFIG } from '../../../../shared/constants.js';

export class AlavancagemData {
    constructor() {}

    formatAlavancagemData(data) {
        console.log('🔄 Alavancagem: Formatando dados:', data);

        // Calcular valor disponível real (pode ser negativo)
        const valorDisponivelReal = data.valor_disponivel - data.valor_a_reduzir;
        
        // Percentual de uso da alavancagem permitida (pode passar de 100%)
        const usagePercent = data.permitida > 0 ? (data.atual / data.permitida * 100) : 0;
        
        // Status formatado
        const status = data.status.replace(/_/g, " ").toUpperCase();

        return {
            currentLeverage: formatters.leverage(data.atual),
            allowedLeverage: formatters.leverage(data.permitida),
            labelText: `${data.atual.toFixed(2)} / ${data.permitida.toFixed(2)}`,
            usagePercent: usagePercent, // Remove Math.min para permitir > 100%
            capitalLiquido: formatters.currency(valorDisponivelReal), // Pode ser negativo
            margemMoney: formatters.currency(data.divida_total),
            status: status || 'N/A',
            isOverLimit: data.atual > data.permitida // Flag para saber se estourou
        };
    }
}

export default AlavancagemData;