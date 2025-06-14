/* 
Arquivo: src/pages/home/components/header/header-data.js
Lógica de dados do Header
*/

import formatters from '../../../../shared/formatters.js';

export class HeaderData {
    constructor(apiClient) {
        this.api = apiClient;
    }

    async fetchData() {
        try {
            console.log('📡 Header: Buscando dados...');
            const response = await this.api.getDashboardHome();
            
            if (response.status === 'success' && response.data?.header) {
                return this.formatHeaderData(response.data.header, response.status);
            }
            
            throw new Error('Dados de header inválidos');
        } catch (error) {
            console.error('❌ Header: Erro ao buscar dados:', error);
            throw error;
        }
    }

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