/* 
Arquivo: decisao-estrategica-data.js
Caminho: src/pages/home/components/decisao-estrategica/decisao-estrategica-data.js
Lógica de dados da Decisão Estratégica
*/

import formatters from '../../../../shared/formatters.js';

export class DecisaoEstrategicaData {
    constructor() {}

    formatDecisaoEstrategicaData(data) {
        console.log('🔄 DecisaoEstrategica: Formatando dados:', data);

        if (!data || !data.decisao || !data.scores) {
            return null;
        }

        const decisao = data.decisao;
        const scores = data.scores;

        return {
            faseOperacional: decisao.fase_operacional || 'N/A',
            acaoPrimaria: `Ação: ${decisao.acao_primaria || 'N/A'}`,
            tendenciaScore: scores.tendencia || 0,
            cicloScore: scores.ciclo || 0,
            alavancagemMax: `Alav.Máx: ${decisao.alavancagem ? decisao.alavancagem.toFixed(1) : '0.0'}x`,
            satelitePercent: `Sat: ${decisao.satelite_percentual || '0%'}`
        };
    }
}

export default DecisaoEstrategicaData;