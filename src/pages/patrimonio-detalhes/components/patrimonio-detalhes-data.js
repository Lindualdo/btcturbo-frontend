/* 
Arquivo: src/pages/patrimonio-detalhes/components/patrimonio-detalhes-data.js
Formatação de dados do Patrimônio Detalhes - USANDO BTC CORE HISTÓRICO
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
        
        // USAR DADOS DO PRIMEIRO PONTO (mais recente)
        const currentData = dados[0];
        const currentBtcPrice = response.btc_price;
        const currentUsdSatelite = currentData.valor;
        const currentBtcCore = currentData.saldo_btc_core; // USAR DO HISTÓRICO
        const currentBtcSatelite = currentUsdSatelite / currentBtcPrice;
        
        // CALCULAR TOTAIS ATUAIS
        const currentBtcTotal = currentBtcSatelite + currentBtcCore;
        const currentUsdTotal = currentBtcTotal * currentBtcPrice;
        const currentUsdCore = currentBtcCore * currentBtcPrice;
        
        // CALCULAR VARIAÇÕES usando dados históricos
        let usdChange = 0;
        let btcChange = 0;
        let btcPriceChange = 0;
        
        if (dados.length > 1) {
            const previousData = dados[1];
            const previousUsdSatelite = previousData.valor;
            const previousBtcPrice = previousData.btc_price;
            const previousBtcCore = previousData.saldo_btc_core;
            const previousBtcSatelite = previousUsdSatelite / previousBtcPrice;
            const previousBtcTotal = previousBtcSatelite + previousBtcCore;
            const previousUsdTotal = previousBtcTotal * previousBtcPrice;

            usdChange = ((currentUsdTotal - previousUsdTotal) / previousUsdTotal) * 100;
            btcChange = ((currentBtcTotal - previousBtcTotal) / previousBtcTotal) * 100;
            btcPriceChange = ((currentBtcPrice - previousBtcPrice) / previousBtcPrice) * 100;
        }

        // Preparar dados para gráficos
        const patrimonioUsdChart = this.prepareUsdChartData(dados);
        const patrimonioBtcChart = this.prepareBtcChartData(dados);
        const btcDistributionChart = this.prepareBtcDistributionData(currentBtcCore, currentBtcSatelite);
        const usdDistributionChart = this.prepareUsdDistributionData(currentUsdCore, currentUsdSatelite);
        
        return {
            current: {
                patrimonioUsd: formatters.currency(currentUsdTotal),
                patrimonioBtc: formatters.btc(currentBtcTotal),
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
            usdDistribution: usdDistributionChart,
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
        
        // Calcular valores USD totais usando BTC Core histórico
        const values = sortedData.map(item => {
            const btcSatelite = item.valor / item.btc_price;
            const btcCore = item.saldo_btc_core;
            const btcTotal = btcSatelite + btcCore;
            return btcTotal * item.btc_price;
        });
        
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        
        return {
            labels: sortedData.map(item => this.formatChartDate(item.timestamp)),
            datasets: [
                {
                    label: 'Patrimônio Total (USD)',
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
        
        // Calcular valores BTC totais usando BTC Core histórico
        const btcValues = sortedData.map(item => {
            const btcSatelite = item.valor / item.btc_price;
            const btcCore = item.saldo_btc_core;
            return btcSatelite + btcCore;
        });
        
        const average = btcValues.reduce((a, b) => a + b, 0) / btcValues.length;
        
        return {
            labels: sortedData.map(item => this.formatChartDate(item.timestamp)),
            datasets: [
                {
                    label: 'Patrimônio Total (BTC)',
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
            labels: ['Core', 'Satélite'],
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

    prepareUsdDistributionData(usdCore, usdSatelite) {
        return {
            labels: ['Core', 'Satélite'],
            datasets: [{
                data: [usdCore, usdSatelite],
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