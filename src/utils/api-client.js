// API Client para consumir as APIs do BTCTurbo Backend

class BTCTurboAPI {
  constructor(baseURL = 'http://localhost:8000') {
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

  // === ENDPOINTS DOS BLOCOS ===

  async obterIndicadores(bloco) {
    return this.request(`/api/v1/obter-indicadores/${bloco}`);
  }

  async calcularScore(bloco) {
    return this.request(`/api/v1/calcular-score/${bloco}`);
  }

  async coletarIndicadores(bloco, forcarColeta = false) {
    return this.request(`/api/v1/coletar-indicadores/${bloco}`, {
      method: 'POST',
      body: JSON.stringify({ forcar_coleta: forcarColeta })
    });
  }

  // === ENDPOINTS DE ANÁLISE ===

  async analiseBTC() {
    return this.request('/api/v1/analise-btc');
  }

  async analiseMercado() {
    return this.request('/api/v1/analise-mercado');
  }

  async analiseRisco() {
    return this.request('/api/v1/analise-risco');
  }

  async analiseAlavancagem() {
    return this.request('/api/v1/analise-alavancagem');
  }

  async analiseTatico() {
    return this.request('/api/v1/analise-tatico');
  }

  // === ENDPOINTS DE ALERTAS ===

  async verificarAlertas() {
    return this.request('/api/v1/alertas/verificar');
  }

  async alertasCriticos() {
    return this.request('/api/v1/alertas-debug/criticos');
  }

  // === MÉTODOS ESPECÍFICOS PARA DASHBOARD ===

  async getDashboardTecnico() {
    try {
      // Buscar dados técnicos consolidados
      const [indicadores, scores] = await Promise.all([
        this.obterIndicadores('tecnico'),
        this.calcularScore('tecnico')
      ]);

      return {
        indicadores,
        scores,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erro ao buscar dashboard técnico:', error);
      throw error;
    }
  }

  async getDashboardCompleto() {
    try {
      // Buscar todos os dados para dashboard principal
      const [analise, mercado, risco, tatico] = await Promise.all([
        this.analiseBTC(),
        this.analiseMercado(), 
        this.analiseRisco(),
        this.analiseTatico()
      ]);

      return {
        analise_geral: analise,
        mercado,
        risco,
        tatico,
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

// Exemplo de uso:
/*
import apiClient from './utils/api-client.js';

// Buscar dados técnicos
const tecnico = await apiClient.getDashboardTecnico();

// Buscar análise completa
const analise = await apiClient.analiseBTC();

// Configurar URL diferente
apiClient.setBaseURL('https://btcturbo-api.herokuapp.com');
*/