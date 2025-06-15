/* 
Arquivo: src/pages/home/components/alavancagem/alavancagem-data.js
Lógica de dados da Gestão de Alavancagem
*/

import formatters from '../../../../shared/formatters.js';
import { LEVERAGE_CONFIG } from '../../../../shared/constants.js';

export class AlavancagemData {
    constructor() {}

    formatAlavancagemData(data) {
        console.log('🔄 Alavancagem: Formatando dados:', data);

        // Calcular percentuais para as barras (baseado em max 3x)
        const maxLeverage = LEVERAGE_CONFIG.MAX;
        const currentPercent = (data.atual / maxLeverage) * 100;
        const allowedPercent = (data.permitida / maxLeverage) * 100;
        
        // Calcular margem percentual: atual/permitida
        const margemPercent = data.permitida > 0 ? (data.atual / data.permitida * 100) : 0;
        
        // Percentual de uso da alavancagem permitida
        const usagePercent = data.permitida > 0 ? (data.atual / data.permitida * 100) : 0;
        const status = data.status.replace(/_/g, " ").toUpperCase(); 

        return {
            valorReduzir: data.valor_a_reduzir > 0 ? formatters.currency(data.valor_a_reduzir) : 0,
            currentLeverage: formatters.leverage(data.atual),
            allowedLeverage: formatters.leverage(data.permitida),
            labelText: `${data.atual.toFixed(2)} / ${data.permitida.toFixed(2)}`,
            currentPercent: Math.min(currentPercent, 100),
            allowedPercent: Math.min(allowedPercent, 100),
            usagePercent: Math.min(usagePercent, 100),
            capitalLiquido: formatters.currency(data.valor_disponivel + valorReduzir),
            //margemPercent: `${margemPercent.toFixed(1)}%`,
            margemMoney: formatters.currency(data.divida_total),
            status: status|| 'N/A'

          
        };
    }
}

export default AlavancagemData;