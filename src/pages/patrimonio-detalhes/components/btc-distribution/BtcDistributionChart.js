/* 
Arquivo: src/pages/patrimonio-detalhes/components/btc-distribution/BtcDistributionChart.js
Componente de Gráfico de Rosca - Distribuição BTC
*/

import Chart from 'chart.js/auto';

export class BtcDistributionChart {
    constructor() {
        this.canvas = document.getElementById('chart-btc-distribution');
        this.chart = null;
        
        if (this.canvas) {
            this.initChart();
        }
    }

    initChart() {
        const ctx = this.canvas.getContext('2d');
        
        // Definir tamanho do canvas
        this.canvas.width = 300;
        this.canvas.height = 230;
        
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.3,
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            color: '#8b9dc3',
                            font: { size: 12 },
                            padding: 15,
                            usePointStyle: true,
                            generateLabels: function(chart) {
                                const data = chart.data;
                                const dataset = data.datasets[0];
                                return data.labels.map((label, i) => ({
                                    text: `${label}: ${dataset.data[i].toFixed(4)} BTC`,
                                    fillStyle: dataset.backgroundColor[i],
                                    strokeStyle: dataset.backgroundColor[i],
                                    pointStyle: 'circle'
                                }));
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#2a2f3e',
                        titleColor: '#ffffff',
                        bodyColor: '#8b9dc3',
                        borderColor: '#3a3f4e',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value.toFixed(4)} BTC (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '50%',
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                }
            }
        });
    }

    render(data) {
        if (!this.chart || !data) {
            this.showError();
            return;
        }

        console.log('🍩 Renderizando BTC Distribution Chart:', data);

        this.chart.data = data;
        this.chart.update('none');
        
        this.clearLoading();
    }

    showLoading() {
        if (this.chart) {
            this.chart.data = {
                labels: ['Carregando...'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#8b9dc3'],
                    borderWidth: 0
                }]
            };
            this.chart.update('none');
        }
    }

    showError() {
        if (this.chart) {
            this.chart.data = {
                labels: ['Erro'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#ff4757'],
                    borderWidth: 0
                }]
            };
            this.chart.update('none');
        }
    }

    clearLoading() {
        console.log('✅ BTC Distribution Chart carregado');
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

export default BtcDistributionChart;