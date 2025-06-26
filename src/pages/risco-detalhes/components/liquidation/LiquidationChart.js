/* 
Arquivo: src/pages/risco-detalhes/components/liquidation/LiquidationChart.js
Componente de Gráfico Distância Liquidação - CORRIGIDO (sem pontos + mobile otimizado)
*/

import Chart from 'chart.js/auto';

export class LiquidationChart {
    constructor() {
        this.canvas = document.getElementById('chart-liquidation');
        this.chart = null;
        this.currentPeriod = '30d';
        
        if (this.canvas) {
            this.initChart();
        }
    }

    initChart() {
        const ctx = this.canvas.getContext('2d');
        const isMobile = window.innerWidth <= 768;
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20,
                        left: 10,
                        right: 10
                    }
                },
                elements: {
                    point: {
                        radius: 0, // Remove os pontos
                        hoverRadius: isMobile ? 0 : 6
                    },
                    line: {
                        tension: 0.1
                    }
                },
                plugins: {
                    legend: {
                        display: !isMobile,
                        labels: {
                            color: '#8b9dc3',
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        enabled: !isMobile, // Desabilita tooltip no mobile
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#2a2f3e',
                        titleColor: '#ffffff',
                        bodyColor: '#8b9dc3',
                        borderColor: '#3a3f4e',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `Distância: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { 
                            color: '#404552', 
                            borderColor: '#404552' 
                        },
                        ticks: { 
                            color: '#8b9dc3', 
                            maxTicksLimit: isMobile ? 6 : 10,
                            padding: 10
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grace: '10%', // Adiciona 10% de folga superior e inferior
                        grid: { 
                            color: '#404552', 
                            borderColor: '#404552' 
                        },
                        ticks: {
                            color: '#8b9dc3',
                            padding: 15,
                            maxTicksLimit: 8,
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            }
                        }
                    }
                },
                interaction: {
                    mode: isMobile ? 'none' : 'nearest', // Desabilita interação no mobile
                    axis: 'x',
                    intersect: false
                },
                hover: {
                    mode: isMobile ? null : 'nearest' // Desabilita hover no mobile
                }
            }
        });
    }

    render(data) {
        if (!this.chart || !data) {
            this.showError();
            return;
        }

        console.log('📊 Renderizando Liquidation Chart:', data);

        // Calcular média
        const values = data.datasets[0].data;
        const average = values.reduce((a, b) => a + b, 0) / values.length;

        // Adicionar linha de média
        data.datasets.push({
            label: `Média (${average.toFixed(1)}%)`,
            data: new Array(values.length).fill(average),
            borderColor: '#8b9dc3',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
        });

        // Garante que os datasets tenham pointRadius = 0
        if (data.datasets) {
            data.datasets.forEach(dataset => {
                dataset.pointRadius = 0;
                dataset.pointHoverRadius = window.innerWidth <= 768 ? 0 : 6;
            });
        }

        this.chart.data = data;
        this.chart.update('none');
        this.clearLoading();
    }

    updatePeriod(period) {
        this.currentPeriod = period;
        this.updatePeriodButtons(period);
    }

    updatePeriodButtons(activePeriod) {
        const chartContainer = this.canvas.closest('.chart-container');
        const buttons = chartContainer.querySelectorAll('.period-btn');
        
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('onclick')?.includes(`'${activePeriod}'`)) {
                btn.classList.add('active');
            }
        });
    }

    showLoading() {
        if (this.chart) {
            this.chart.data = {
                labels: ['Carregando...'],
                datasets: [{
                    label: 'Distância Liquidação',
                    data: [0],
                    borderColor: '#8b9dc3',
                    backgroundColor: 'rgba(139, 157, 195, 0.1)',
                    pointRadius: 0
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
                    label: 'Distância Liquidação',
                    data: [0],
                    borderColor: '#ff4757',
                    backgroundColor: 'rgba(255, 71, 87, 0.1)',
                    pointRadius: 0
                }]
            };
            this.chart.update('none');
        }
    }

    clearLoading() {
        console.log('✅ Liquidation Chart carregado');
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

export default LiquidationChart;