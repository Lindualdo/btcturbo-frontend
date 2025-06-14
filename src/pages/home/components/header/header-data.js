/* 
Arquivo: src/pages/home/components/header/header-data.js
Lógica de dados do Header
*/

import formatters from '../../../../shared/formatters.js';

export class HeaderData {
    constructor() {}

    formatHeaderData(headerData, apiStatus) {
        console.log('🔄 Header: Formatando dados:', headerData);

        const positionBtc = headerData.position_usd / headerData.btc_price || 0;

        return {
            btcPrice: formatters.currency(headerData.btc_price),
            positionBtc: formatters.btc(positionBtc),
            positionUsd: formatters.currency(headerData.position_usd),
            apiStatus: apiStatus
        };
    }
}

export default HeaderData;