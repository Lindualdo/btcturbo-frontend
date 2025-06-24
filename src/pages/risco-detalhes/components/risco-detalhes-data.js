/* 
Arquivo: src/pages/risco-detalhes/components/risco-detalhes-data.js
Formatação de dados do Risco Detalhes
*/

import formatters from '../../../shared/formatters.js';

export class RiscoDetalhesData {
    constructor() {}

    formatRiscoDetalhesData(response) {
        console.log('🔄 RiscoDetalhes: Formatando dados:', response);

        if (!response || !response.dados || response.dados.length === 0) {
            return null;
        }

        const dados = response.dados;
        const indicador = response.indicador;
        
        // Calcular métricas atuais e variações
        const currentValue = dados[0].valor;
        const previousValue = dados[1]?.valor;
        const change = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0;

        // Preparar dados para gráficos
        const chartData = this.prepareChartData(dados, indicador);
        
        return {
            current: {
                healthFactor: formatters.decimal(currentValue),
                liquidation: this.calculateLiquidationDistance(currentValue),
                score: this.calculateRiskScore(currentValue),
                changes: {
                    healthFactor: change,
                    liquidation: this.calculateLiquidationChange(currentValue, previousValue),
                    score: this.calculateScoreChange(currentValue, previousValue)
                }
            },
            healthFactor: chartData,
            liquidation: this.prepareLiquidationChart(dados),
            metadata: {
                periodo: response.periodo,
                indicador: response.indicador,
                totalPoints: dados.length
            }
        };
    }

    prepareChartData(dados, indicador) {
        // Ordenar por data (mais antiga primeiro)
        const sortedData = dados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        return {
            labels: sortedData.map(item => this.formatChartDate(item.timestamp)),
            datasets: [{
                label: 'Health Factor',
                data: sortedData.map(item => item.valor),
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4caf50',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        };
    }

    prepareLiquidationChart(dados) {
        const sortedData = dados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        return {
            labels: sortedData.map(item => this.formatChartDate(item.timestamp)),
            datasets: [{
                label: 'Distância Liquidação (%)',
                data: sortedData.map(item => this.calculateLiquidationDistance(item.valor, false)),
                borderColor: '#ff8c42',
                backgroundColor: 'rgba(255, 140, 66, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ff8c42',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
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

    calculateLiquidationDistance(healthFactor, formatted = true) {
        // Fórmula: (HF - 1) / HF * 100
        const distance = healthFactor > 1 ? ((healthFactor - 1) / healthFactor) * 100 : 0;
        return formatted ? formatters.percent(distance) : distance;
    }

    calculateRiskScore(healthFactor) {
        // Score baseado no Health Factor (1-100)
        if (healthFactor >= 3) return 100;
        if (healthFactor >= 2) return Math.round(50 + (healthFactor - 2) * 50);
        if (healthFactor >= 1.5) return Math.round(25 + (healthFactor - 1.5) * 50);
        if (healthFactor >= 1.2) return Math.round(10 + (healthFactor - 1.2) * 50);
        return Math.round(healthFactor * 10);
    }

    calculateLiquidationChange(current, previous) {
        if (!previous) return 0;
        const currentDist = this.calculateLiquidationDistance(current, false);
        const previousDist = this.calculateLiquidationDistance(previous, false);
        return ((currentDist - previousDist) / previousDist) * 100;
    }

    calculateScoreChange(current, previous) {
        if (!previous) return 0;
        const currentScore = this.calculateRiskScore(current);
        const previousScore = this.calculateRiskScore(previous);
        return ((currentScore - previousScore) / previousScore) * 100;
    }
}

export default RiscoDetalhesData;