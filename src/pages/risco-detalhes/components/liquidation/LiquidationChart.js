/* 
Arquivo: src/pages/risco-detalhes/components/liquidation/LiquidationChart.js
Componente de Gráfico Distância Liquidação
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
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#8b9dc3',
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
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
                        grid: { color: '#404552', borderColor: '#404552' },
                        ticks: { color: '#8b9dc3', maxTicksLimit: 10 }
                    },
                    y: {
                        grid: { color: '#404552', borderColor: '#404552' },
                        ticks: {
                            color: '#8b9dc3',
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            }
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
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
                    backgroundColor: 'rgba(139, 157, 195, 0.1)'
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
                    backgroundColor: 'rgba(255, 71, 87, 0.1)'
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