// API Client para BTCTurbo Backend - Versão Atualizada

class BTCTurboAPI {
  constructor(baseURL = 'https://btcturbo-v5-production.up.railway.app') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ API Response:`, data);
      
      return data;
      
    } catch (error) {
      console.error(`❌ API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // === ENDPOINTS PRINCIPAIS ===

  async analiseMercado() {
    return this.request('/api/v1/analise-mercado');
  }

  async analiseRisco() {
    return this.request('/api/v1/analise-risco');
  }

  async analiseAlavancagem() {
    return this.request('/api/v1/analise-alavancagem');
  }

  // === ENDPOINTS LEGADOS (manter compatibilidade) ===

  async analiseBTC() {
    return this.request('/api/v1/analise-btc');
  }

  async analiseTatico() {
    return this.request('/api/v1/analise-tatico');
  }

  async verificarAlertas() {
    return this.request('/api/v1/alertas/verificar');
  }

  // === ENDPOINTS DOS BLOCOS (legado) ===

  async obterIndicadores(bloco) {
    return this.request(`/api/v1/obter-indicadores/${bloco}`);
  }

  async calcularScore(bloco) {
    return this.request(`/api/v1/calcular-score/${bloco}`);
  }

  // === MÉTODOS ESPECÍFICOS PARA DASHBOARD ===

  async getDashboardCompleto() {
    try {
      // Buscar dados das 3 APIs principais
      const [mercado, risco, alavancagem] = await Promise.all([
        this.analiseMercado(),
        this.analiseRisco(),
        this.analiseAlavancagem()
      ]);

      return {
        mercado,
        risco,
        alavancagem,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erro ao buscar dashboard completo:', error);
      throw error;
    }
  }

  // === UTILITÁRIOS ===

  setBaseURL(url) {
    this.baseURL = url;
  }

  setAuthToken(token) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Instância singleton
export const apiClient = new BTCTurboAPI();

// Para usar em outros módulos:
export default apiClient;