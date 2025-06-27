/* 
Arquivo: src/pages/mercado-detalhes/components/tecnico/tecnico-data.js
Formatação de dados do Bloco Técnico - CORRIGIDO para EMAs
EMAs Expansão (Day/Week) e EMAs Alinhamento (Day/Week)
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
                diario_score: {
                    score: tecnicoData.score_diario?.score_expansao || 0,
                    valor: formatters.decimal(tecnicoData.score_diario?.score_expansao || 0)
                },
                diario_posicao: {
                    score: tecnicoData.score_diario?.score_alinhamento || 0,
                    valor: formatters.decimal(tecnicoData.score_diario?.score_alinhamento || 0)
                },
                semanal_score: {
                    score: tecnicoData.score_semanal?.score_expansao || 0,
                    valor: formatters.decimal(tecnicoData.score_semanal?.score_expansao || 0)
                },
                semanal_posicao: {
                    score: tecnicoData.score_semanal?.score_alinhamento || 0,
                    valor: formatters.decimal(tecnicoData.score_semanal?.score_alinhamento || 0)
                }
            }
        };
    }
}

export default TecnicoData;