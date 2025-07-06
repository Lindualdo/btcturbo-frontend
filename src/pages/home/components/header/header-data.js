/* 
Arquivo: src/pages/home/components/header/header-data.js
Lógica de dados do Header - CORRIGIDO para nova API de alavancagem
*/

import formatters from '../../../../shared/formatters.js';

export class HeaderData {
    constructor() {}

    formatHeaderData(dashboardData, apiStatus, metadata) {
        console.log('🔄 Header: Formatando dados:', dashboardData);

        // Extrair dados dos objetos corretos
        const btcPrice = dashboardData.header?.btc_price || 0;
        const positionUsd = dashboardData.header?.position_usd || 0;
        const dividaTotal = dashboardData.alavancagem?.divida_total || 0;

        // Cálculos
        const saldoLiquidoUsd = positionUsd - dividaTotal;
        const saldoLiquidoBtc = btcPrice > 0 ? saldoLiquidoUsd / btcPrice : 0;

        // CORRIGIDO: Alavancagem da nova API
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