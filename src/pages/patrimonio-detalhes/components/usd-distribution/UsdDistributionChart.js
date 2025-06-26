/* 
Arquivo: src/pages/patrimonio-detalhes/components/usd-distribution/UsdDistributionChart.js
Componente de Gráfico de Rosca - Distribuição USD - LEGENDAS OTIMIZADAS
*/

import Chart from 'chart.js/auto';

export class UsdDistributionChart {
    constructor() {
        this.canvas = document.getElementById('chart-usd-distribution');
        this.chart = null;
        
        if (this.canvas) {
            this.initChart();
        }
    }

    initChart() {
        const ctx = this.canvas.getContext('2d');
        const isMobile = window.innerWidth <= 768;
        
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: isMobile ? 1.0 : 1.2, // PC um pouco mais largo para acomodar legenda lateral
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: isMobile ? 10 : 20 // Mais espaço à direita no PC
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: isMobile ? 'bottom' : 'right', // Lateral no PC, embaixo no mobile
                        align: isMobile ? 'center' : 'start',
                        labels: {
                            color: '#8b9dc3',
                            font: { size: isMobile ? 10 : 11 },
                            padding: isMobile ? 10 : 15,
                            usePointStyle: true,
                            boxWidth: 12,
                            boxHeight: 12,
                            generateLabels: function(chart) {
                                const data = chart.data;
                                const dataset = data.datasets[0];
                                return data.labels.map((label, i) => ({
                                    text: `${label}: $${Number(dataset.data[i].toFixed(0)).toLocaleString()}`,
                                    fillStyle: dataset.backgroundColor[i],
                                    strokeStyle: dataset.backgroundColor[i],
                                    fontColor: '#8b9dc3',
                                    pointStyle: 'circle'
                                }));
                            }
                        }
                    },
                    tooltip: {
                        enabled: !isMobile,
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
                                return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '50%',
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                },
                // Configurações específicas para mobile
                ...(isMobile && {
                    animation: {
                        duration: 300
                    },
                    interaction: {
                        mode: 'none'
                    }
                })
            }
        });
    }

    render(data) {
        if (!this.chart || !data) {
            this.showError();
            return;
        }

        console.log('💰 Renderizando USD Distribution Chart:', data);

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
        console.log('✅ USD Distribution Chart carregado');
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

export default UsdDistributionChart;