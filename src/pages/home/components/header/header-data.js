/* 
Arquivo: src/pages/home/components/header/header-data.js
Lógica de dados do Header - Atualizada com timestamp
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

        // Formatar timestamp do metadata
        const lastUpdate = this.formatTimestamp(metadata?.timestamp);

        return {
            btcPrice: formatters.currency(btcPrice),
            positionUsd: formatters.currency(positionUsd),
            dividaTotal: formatters.currency(dividaTotal),
            saldoLiquidoUsd: formatters.currency(saldoLiquidoUsd),
            saldoLiquidoBtc: formatters.btc(saldoLiquidoBtc),
            leverageValue: `${dashboardData.alavancagem?.atual?.toFixed(2) || 0} / ${dashboardData.alavancagem?.permitida?.toFixed(2) || 0}`,
            apiStatus: apiStatus || 'error',
            lastUpdate: lastUpdate
        };
    }

    formatTimestamp(timestamp) {
        if (!timestamp) return '--:--';
        
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.warn('Erro ao formatar timestamp:', error);
            return '--:--';
        }
    }
}

export default HeaderData;