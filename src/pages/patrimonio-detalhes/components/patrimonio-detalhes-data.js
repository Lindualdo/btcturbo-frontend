/* 
Arquivo: src/pages/patrimonio-detalhes/components/patrimonio-detalhes-data.js
Formatação de dados do Patrimônio Detalhes
*/

import formatters from '../../../shared/formatters.js';

export class PatrimonioDetalhesData {
    constructor() {}

    formatPatrimonioDetalhesData(response) {
        console.log('🔄 PatrimonioDetalhes: Formatando dados:', response);

        if (!response || !response.dados || response.dados.length === 0) {
            return null;
        }

        const dados = response.dados;
        
        // Calcular métricas atuais e variações
        const currentUsd = dados[0].valor;
        const currentBtcPrice = dados[0].btc_price;
        const currentBtc = currentUsd / currentBtcPrice;
        
        const previousUsd = dados[1]?.valor;
        const previousBtcPrice = dados[1]?.btc_price;
        const previousBtc = previousUsd ? previousUsd / previousBtcPrice : 0;

        const usdChange = previousUsd ? ((currentUsd - previousUsd) / previousUsd) * 100 : 0;
        const btcChange = previousBtc ? ((currentBtc - previousBtc) / previousBtc) * 100 : 0;
        const btcPriceChange = previousBtcPrice ? ((currentBtcPrice - previousBtcPrice) / previousBtcPrice) * 100 : 0;

        // Preparar dados para gráficos
        const patrimonioUsdChart = this.prepareUsdChartData(dados);
        const patrimonioBtcChart = this.prepareBtcChartData(dados);
        const btcDistributionChart = this.prepareBtcDistributionData(response.saldo_btc_core, currentBtc);
        
        return {
            current: {
                patrimonioUsd: formatters.currency(currentUsd),
                patrimonioBtc: formatters.btc(currentBtc),
                btcPrice: formatters.currency(currentBtcPrice),
                changes: {
                    usd: usdChange,
                    btc: btcChange,
                    btcPrice: btcPriceChange
                }
            },
            patrimonioUsd: patrimonioUsdChart,
            patrimonioBtc: patrimonioBtcChart,
            btcDistribution: btcDistributionChart,
            metadata: {
                periodo: response.periodo,
                indicador: response.indicador,
                totalPoints: dados.length
            }
        };
    }

    prepareUsdChartData(dados) {
        // Ordenar por data (mais antiga primeiro)
        const sortedData = dados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Calcular média
        const values = sortedData.map(item => item.valor);
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        
        return {
            labels: sortedData.map(item => this.formatChartDate(item.timestamp)),
            datasets: [
                {
                    label: 'Patrimônio (USD)',
                    data: values,
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4caf50',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: `Média (${formatters.currency(average)})`,
                    data: new Array(values.length).fill(average),
                    borderColor: '#8b9dc3',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        };
    }

    prepareBtcChartData(dados) {
        const sortedData = dados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Calcular valores em BTC
        const btcValues = sortedData.map(item => item.valor / item.btc_price);
        const average = btcValues.reduce((a, b) => a + b, 0) / btcValues.length;
        
        return {
            labels: sortedData.map(item => this.formatChartDate(item.timestamp)),
            datasets: [
                {
                    label: 'Patrimônio (BTC)',
                    data: btcValues,
                    borderColor: '#ff8c42',
                    backgroundColor: 'rgba(255, 140, 66, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ff8c42',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: `Média (${formatters.btc(average)})`,
                    data: new Array(btcValues.length).fill(average),
                    borderColor: '#8b9dc3',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        };
    }

    prepareBtcDistributionData(btcCore, btcSatelite) {
        return {
            labels: ['BTC Core', 'BTC Satélite'],
            datasets: [{
                data: [btcCore, btcSatelite],
                backgroundColor: [
                    '#ff8c42',  // Laranja para Core
                    '#4caf50'   // Verde para Satélite
                ],
                borderWidth: 0,
                hoverBackgroundColor: [
                    '#ff6b35',  // Laranja mais escuro no hover
                    '#388e3c'   // Verde mais escuro no hover
                ]
            }]
        };
    }

    formatChartDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit'
        });
    }
}

export default PatrimonioDetalhesData;