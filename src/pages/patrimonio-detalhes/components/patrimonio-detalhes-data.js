/* 
Arquivo: src/pages/patrimonio-detalhes/components/patrimonio-detalhes-data.js
Formatação de dados do Patrimônio Detalhes - INCLUI DISTRIBUIÇÃO USD
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
        const btcCore = response.saldo_btc_core || 0;
        
        // USAR PREÇO BTC ATUALIZADO DA API (não dos dados históricos)
        const currentBtcPrice = response.btc_price;
        const currentUsdSatelite = dados[0].valor;
        const currentBtcSatelite = currentUsdSatelite / currentBtcPrice;
        
        // INCLUIR BTC CORE no patrimônio total
        const currentBtcTotal = currentBtcSatelite + btcCore;
        const currentUsdTotal = currentBtcTotal * currentBtcPrice;
        const currentUsdCore = btcCore * currentBtcPrice;
        
        // Para variações, usar preço histórico
        const previousUsdSatelite = dados[1]?.valor;
        const previousBtcPrice = dados[1]?.btc_price;
        const previousBtcSatelite = previousUsdSatelite ? previousUsdSatelite / previousBtcPrice : 0;
        const previousBtcTotal = previousBtcSatelite + btcCore;
        const previousUsdTotal = previousBtcTotal * previousBtcPrice;

        const usdChange = previousUsdTotal ? ((currentUsdTotal - previousUsdTotal) / previousUsdTotal) * 100 : 0;
        const btcChange = previousBtcTotal ? ((currentBtcTotal - previousBtcTotal) / previousBtcTotal) * 100 : 0;
        const btcPriceChange = previousBtcPrice ? ((currentBtcPrice - previousBtcPrice) / previousBtcPrice) * 100 : 0;

        // Preparar dados para gráficos (usando totais com BTC Core)
        const patrimonioUsdChart = this.prepareUsdChartData(dados, btcCore);
        const patrimonioBtcChart = this.prepareBtcChartData(dados, btcCore);
        const btcDistributionChart = this.prepareBtcDistributionData(btcCore, currentBtcSatelite);
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

    prepareUsdChartData(dados, btcCore) {
        // Ordenar por data (mais antiga primeiro)
        const sortedData = dados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Calcular valores USD totais (satélite + core)
        const values = sortedData.map(item => {
            const btcSatelite = item.valor / item.btc_price;
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

    prepareBtcChartData(dados, btcCore) {
        const sortedData = dados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Calcular valores BTC totais (satélite + core)
        const btcValues = sortedData.map(item => {
            const btcSatelite = item.valor / item.btc_price;
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