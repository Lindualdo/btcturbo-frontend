/* 
Arquivo: src/pages/home/components/alavancagem/alavancagem-data.js
Lógica de dados da Gestão de Alavancagem - SEM VALORES FIXOS
*/

import formatters from '../../../../shared/formatters.js';

export class AlavancagemData {
    constructor() {}

    formatAlavancagemData(data) {
        console.log('🔄 Alavancagem: Formatando dados RAW:', data);

        // Verificar se data existe
        if (!data) {
            console.warn('⚠️ Dados de alavancagem ausentes');
            return this.getZeroedData();
        }

        // Usar dados diretos da API conforme estrutura fornecida
        const atual = data.atual || 0;
        const permitida = data.permitida || 0;
        const valorDisponivel = data.valor_disponivel || 0;
        const valorAReduzir = data.valor_a_reduzir || 0;
        const dividaTotal = data.divida_total || 0;
        const status = data.status || 'erro';

        console.log('📊 Dados extraídos:', {
            atual, permitida, valorDisponivel, valorAReduzir, dividaTotal, status
        });

        // Calcular valor disponível real (pode ser negativo)
        const valorDisponivelReal = valorDisponivel - valorAReduzir;
        
        // Percentual de uso da alavancagem permitida (pode passar de 100%)
        const usagePercent = permitida > 0 ? (atual / permitida * 100) : 0;
        
        // Status formatado
        const statusFormatted = status.replace(/_/g, " ").toUpperCase();

        const result = {
            currentLeverage: formatters.leverage(atual),
            allowedLeverage: formatters.leverage(permitida),
            labelText: `${atual.toFixed(2)}x / ${permitida.toFixed(2)}x`,
            usagePercent: usagePercent,
            capitalLiquido: formatters.currency(valorDisponivelReal),
            margemMoney: formatters.currency(dividaTotal),
            status: statusFormatted,
            isOverLimit: atual > permitida
        };

        console.log('✅ Alavancagem formatada FINAL:', result);
        return result;
    }

    getZeroedData() {
        return {
            currentLeverage: '0.00x',
            allowedLeverage: '0.00x',
            labelText: '0.00x / 0.00x',
            usagePercent: 0,
            capitalLiquido: '$0',
            margemMoney: '$0',
            status: 'ERRO',
            isOverLimit: false
        };
    }
}

export default AlavancagemData;