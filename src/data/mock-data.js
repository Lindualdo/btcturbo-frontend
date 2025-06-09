// Mock data simulando as APIs do BTCTurbo

export const mockTecnicoData = {
  bloco: "tecnico",
  score_consolidado: 7.6,
  classificacao_consolidada: "Correção Saudável",
  timestamp: new Date().toISOString(),
  
  // Dados dos timeframes
  timeframes: {
    semanal: {
      score_total: 7.5,
      peso: "70%",
      emas: {
        17: 64250.50,
        34: 63800.25,
        144: 62100.75,
        305: 59800.30,
        610: 55200.85
      },
      scores: {
        alinhamento: 8.5,
        posicao: 6.5,
        consolidado: 7.5
      }
    },
    diario: {
      score_total: 7.9,
      peso: "30%", 
      emas: {
        17: 64300.20,
        34: 64100.45,
        144: 63200.60,
        305: 61500.25,
        610: 58900.40
      },
      scores: {
        alinhamento: 9.0,
        posicao: 6.8,
        consolidado: 7.9
      }
    }
  },

  // Dados do BBW
  bbw: {
    percentage: 12.5,
    score: 6.2,
    status: "Volatilidade Normal"
  },

  // Metadados
  btc_price: 64285.50,
  fonte: "tvdatafeed_emas_bbw"
};

export const mockScoreData = {
  final: {
    value: 76,
    status: "Correção Saudável",
    color: "#66bb6a" // Verde
  },
  semanal: {
    value: 75, 
    status: "Correção Saudável",
    color: "#66bb6a"
  },
  diario: {
    value: 79,
    status: "Correção Saudável", 
    color: "#66bb6a"
  }
};

// Função para simular delay de API
export const fetchMockData = async (delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return {
    tecnico: mockTecnicoData,
    scores: mockScoreData
  };
};

// Função para determinar cor baseada no score
export const getScoreColor = (score) => {
  if (score >= 80) return "#66bb6a"; // Verde
  if (score >= 60) return "#ffeb3b"; // Amarelo
  if (score >= 40) return "#ffa726"; // Laranja
  return "#ff4757"; // Vermelho
};

// Função para determinar status baseado no score
export const getScoreStatus = (score) => {
  if (score >= 85) return "Tendência Forte";
  if (score >= 70) return "Correção Saudável";
  if (score >= 50) return "Neutro/Transição";
  if (score >= 30) return "Reversão Iminente";
  return "Bear Confirmado";
};