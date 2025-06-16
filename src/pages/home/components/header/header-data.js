/* 
Arquivo: src/pages/home/components/header/header-data.js
Lógica de dados do Header - Atualizada com novos campos financeiros
*/

import formatters from '../../../../shared/formatters.js';

export class HeaderData {
    constructor() {}

    formatHeaderData(dashboardData, apiStatus) {
        console.log('🔄 Header: Formatando dados:', dashboardData);

        // Extrair dados dos objetos corretos
        const btcPrice = dashboardData.header?.btc_price || 0;
        const positionUsd = dashboardData.header?.position_usd || 0;
        const dividaTotal = dashboardData.alavancagem?.divida_total || 0;

        // Cálculos
        const saldoLiquidoUsd = positionUsd - dividaTotal;
        const saldoLiquidoBtc = btcPrice > 0 ? saldoLiquidoUsd / btcPrice : 0;

        return {
            btcPrice: formatters.currency(btcPrice),
            positionUsd: formatters.currency(positionUsd),
            dividaTotal: formatters.currency(dividaTotal),
            saldoLiquidoUsd: formatters.currency(saldoLiquidoUsd),
            saldoLiquidoBtc: formatters.btc(saldoLiquidoBtc),
            apiStatus: apiStatus || 'error'
        };
    }
}

export default HeaderData;