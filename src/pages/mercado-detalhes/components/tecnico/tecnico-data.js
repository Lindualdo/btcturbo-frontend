/* 
Arquivo: src/pages/mercado-detalhes/components/tecnico/tecnico-data.js
Formatação de dados do Bloco Técnico - ATUALIZADO para JSON v3
Apenas Alinhamento Diário e Semanal
*/

import formatters from '../../../../shared/formatters.js';

export class TecnicoData {
    constructor() {}

    formatTecnicoData(tecnicoData) {
        console.log('🔄 Técnico: Formatando dados:', tecnicoData);

        if (!tecnicoData) {
            return null;
        }

        return {
            score: tecnicoData.score_consolidado || 0,
            classification: tecnicoData.classificacao_consolidada || 'neutro',
            indicadores: {
                diario_alinhamento: {
                    score: tecnicoData.score_consolidado_1d || 0,
                    valor: formatters.decimal(tecnicoData.score_consolidado_1d || 0)
                },
                semanal_alinhamento: {
                    score: tecnicoData.score_consolidado_1w || 0,
                    valor: formatters.decimal(tecnicoData.score_consolidado_1w || 0)
                }
            }
        };
    }
}

export default TecnicoData;