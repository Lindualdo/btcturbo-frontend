/* 
Arquivo: src/pages/mercado-detalhes/components/tecnico/tecnico-data.js
Formatação de dados do Bloco Técnico
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
            score: tecnicoData.score || 0,
            classification: tecnicoData.classificacao || 'neutro',
            indicadores: {
                diario_score: {
                    score: tecnicoData.indicadores?.diario?.score || 0,
                    valor: formatters.decimal(tecnicoData.indicadores?.diario?.score)
                },
                diario_posicao: {
                    score: tecnicoData.indicadores?.diario?.posicao || 0,
                    valor: formatters.decimal(tecnicoData.indicadores?.diario?.posicao)
                },
                semanal_score: {
                    score: tecnicoData.indicadores?.semanal?.score || 0,
                    valor: formatters.decimal(tecnicoData.indicadores?.semanal?.score)
                },
                semanal_posicao: {
                    score: tecnicoData.indicadores?.semanal?.posicao || 0,
                    valor: formatters.decimal(tecnicoData.indicadores?.semanal?.posicao)
                }
            }
        };
    }
}

export default TecnicoData;