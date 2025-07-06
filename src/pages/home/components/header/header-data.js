/* 
Arquivo: src/pages/home/components/header/header-data.js
Lógica de dados do Header - CORRIGIDO para nova API de alavancagem
*/

import formatters from '../../../../shared/formatters.js';

export class HeaderData {
    constructor() {}

    formatHeaderData(dashboardData, apiStatus, metadata) {
        console.log('🔄 Header: Formatando dados:', dashboardData);

        // NOVO: Priorizar dados da API financeiro/score-risco se disponível
        const riscoApiData = dashboardData.risco;
        const isNewRiscoApi = riscoApiData && riscoApiData.btc_price && riscoApiData.posicao_total;

        // Extrair dados financeiros (prioridade: nova API > dash-main)
        const btcPrice = isNewRiscoApi ? riscoApiData.btc_price : (dashboardData.header?.btc_price || 0);
        const positionUsd = isNewRiscoApi ? riscoApiData.posicao_total : (dashboardData.header?.position_usd || 0);
        const dividaTotal = isNewRiscoApi ? riscoApiData.divida_total : (dashboardData.alavancagem?.divida_total || 0);

        // Cálculos
        const saldoLiquidoUsd = positionUsd - dividaTotal;
        const saldoLiquidoBtc = btcPrice > 0 ? saldoLiquidoUsd / btcPrice : 0;

        // Alavancagem da API específica
        const alavancagemAtual = dashboardData.alavancagem?.atual || 0;
        const alavancagemPermitida = dashboardData.alavancagem?.permitida || 0;
        
        // Formatar timestamp do metadata
        const lastUpdate = this.formatTimestamp(metadata?.timestamp);

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

        console.log('✅ Header formatado:', result);
        console.log('📊 Fonte dos dados financeiros:', isNewRiscoApi ? 'API score-risco' : 'dash-main');
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