/* 
Arquivo: src/pages/patrimonio-detalhes/components/usd-distribution/UsdDistributionChart.js
Componente de Gráfico de Rosca - Distribuição USD - RESPONSIVO
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
        
        // NÃO definir tamanho fixo - deixar responsivo
        // this.canvas.width = 300;
        // this.canvas.height = 230;
        
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: !isMobile, // Só manter aspecto no desktop
                aspectRatio: isMobile ? 1.2 : 1.3, // Aspecto diferente mobile/desktop
                layout: {
                    padding: {
                        top: isMobile ? 5 : 10,
                        bottom: isMobile ? 10 : 10,
                        left: isMobile ? 5 : 10,
                        right: isMobile ? 5 : 10
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: '#8b9dc3',
                            font: { size: isMobile ? 10 : 12 },
                            padding: isMobile ? 10 : 15,
                            usePointStyle: true,
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
                        enabled: !isMobile, // Desabilita tooltip no mobile
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
                cutout: isMobile ? '45%' : '50%', // Cutout menor no mobile
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                },
                // Configurações específicas para mobile
                ...(isMobile && {
                    animation: {
                        duration: 0 // Sem animação no mobile
                    },
                    interaction: {
                        mode: 'none' // Sem interação no mobile
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