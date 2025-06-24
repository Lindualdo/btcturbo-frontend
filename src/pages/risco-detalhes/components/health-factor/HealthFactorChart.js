/* 
Arquivo: src/pages/risco-detalhes/components/health-factor/HealthFactorChart.js
Componente de Gráfico Health Factor
*/

import Chart from 'chart.js/auto';

export class HealthFactorChart {
    constructor() {
        this.canvas = document.getElementById('chart-health-factor');
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
                            font: {
                                size: 12
                            }
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
                                return `Health Factor: ${context.parsed.y.toFixed(2)}`;
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
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        grid: {
                            color: '#404552',
                            borderColor: '#404552'
                        },
                        ticks: {
                            color: '#8b9dc3',
                            callback: function(value) {
                                return value.toFixed(1);
                            }
                        },
                        beginAtZero: false
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                elements: {
                    point: {
                        hoverRadius: 6
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

        console.log('📊 Renderizando Health Factor Chart:', data);

        // Calcular média
        const values = data.datasets[0].data;
        const average = values.reduce((a, b) => a + b, 0) / values.length;

        // Adicionar linha de média
        data.datasets.push({
            label: `Média (${average.toFixed(2)})`,
            data: new Array(values.length).fill(average),
            borderColor: '#8b9dc3',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
        });

        this.chart.data = data;
        this.chart.update('none');
        
        this.clearLoading();
    }

    updatePeriod(period) {
        this.currentPeriod = period;
        this.updatePeriodButtons('health-factor', period);
    }

    updatePeriodButtons(chartType, activePeriod) {
        // Encontrar todos os botões do gráfico
        const chartContainer = this.canvas.closest('.chart-container');
        const buttons = chartContainer.querySelectorAll('.period-btn');
        
        buttons.forEach(btn => {
            btn.classList.remove('active');
            const onclick = btn.getAttribute('onclick');
            if (onclick && onclick.includes(`'${activePeriod}'`)) {
                btn.classList.add('active');
            }
        });
    }

    showLoading() {
        if (this.chart) {
            this.chart.data = {
                labels: ['Carregando...'],
                datasets: [{
                    label: 'Health Factor',
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
                    label: 'Health Factor',
                    data: [0],
                    borderColor: '#ff4757',
                    backgroundColor: 'rgba(255, 71, 87, 0.1)'
                }]
            };
            this.chart.update('none');
        }
    }

    clearLoading() {
        // Método para limpar estado de loading se necessário
        console.log('✅ Health Factor Chart carregado');
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

export default HealthFactorChart;