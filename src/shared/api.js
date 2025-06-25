/* 
Arquivo: src/shared/api.js
API Client centralizado para todas as páginas
*/

export class ApiClient {
    constructor() {
        this.baseURL = 'https://btcturbo-prod.up.railway.app/api/v1';
    }

    async fetchData(endpoint) {
        try {
            console.log(`📡 Chamando: ${endpoint}`);
            const response = await fetch(`${this.baseURL}/${endpoint}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();
            console.log(`✅ ${endpoint} recebido:`, result);
            return result;
        } catch (error) {
            console.error(`❌ Erro API (${endpoint}):`, {
                message: error.message,
                status: error.status,
                url: `${this.baseURL}/${endpoint}`
            });
            throw error;
        }
    }

    // Endpoints específicos
    async getDashboardHome() { return this.fetchData('dash-main'); } // Home
    async getDashMercado() { return this.fetchData('dash-mercado'); } // Detalhes Mercado
    async getHealthFactor(periodo = '30d') { return this.fetchData(`dash-finance/health-factor?periodo=${periodo}`); } // Risco Detalhes
    async getPatrimonio(periodo = '30d') { return this.fetchData(`dash-finance/patrimonio?periodo=${periodo}`); }
}

export default ApiClient;