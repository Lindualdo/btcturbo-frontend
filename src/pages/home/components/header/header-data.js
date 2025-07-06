/* 
Arquivo: src/pages/home/components/header/header-data.js
Lógica de dados do Header - CORRIGIDO para nova API de alavancagem
*/

import formatters from '../../../../shared/formatters.js';

export class HeaderData {
    constructor() {}

    formatHeaderData(dashboardData, apiStatus, metadata) {
        console.log('🔄 Header: Formatando dados (apenas APIs específicas):', dashboardData);

        // Dados da API financeiro/score-risco
        const riscoApiData = dashboardData.risco;
        const btcPrice = riscoApiData?.btc_price || 0;
        const positionUsd = riscoApiData?.posicao_total || 0;
        const dividaTotal = riscoApiData?.divida_total || 0;

        // Cálculos
        const saldoLiquidoUsd = positionUsd - dividaTotal;
        const saldoLiquidoBtc = btcPrice > 0 ? saldoLiquidoUsd / btcPrice : 0;

        // Alavancagem da API específica
        const alavancagemAtual = dashboardData.alavancagem?.atual || 0;
        const alavancagemPermitida = dashboardData.alavancagem?.permitida || 0;
        
        // Formatar timestamp do metadata ou usar atual
        const lastUpdate = this.formatTimestamp(metadata?.timestamp || new Date().toISOString());

        const result = {
            btcPrice: formatters.currency(btcPrice),
            positionUsd: formatters.currency(positionUsd),
            dividaTotal: formatters.currency(dividaTotal),
            saldoLiquidoUsd: formatters.currency(saldoLiquidoUsd),
            saldoLiquidoBtc: formatters.btc(saldoLiquidoBtc),
            leverageValue: `${alavancagemAtual.toFixed(2)}x / ${alavancagemPermitida.toFixed(2)}x`,
            apiStatus: apiStatus || 'error',
            lastUpdate: lastUpdate
        };

        console.log('✅ Header formatado (apenas APIs específicas):', result);
        console.log('📊 Fontes dos dados:', {
            financeiros: riscoApiData ? 'API score-risco' : 'ausente',
            alavancagem: dashboardData.alavancagem ? 'API alavancagem' : 'ausente'
        });
        return result;
    }

    formatTimestamp(timestamp) {
        if (!timestamp) return '--:--';
        
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('pt-PT', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Lisbon' // Horário de Lisboa
            });
        } catch (error) {
            console.warn('Erro ao formatar timestamp:', error);
            return '--:--';
        }
    }
}

export default HeaderData;