/* 
Arquivo: src/pages/patrimonio-detalhes/components/patrimonio-btc/PatrimonioBtcChart.js
Componente de Gráfico Patrimônio BTC - SEM LEGENDAS NO MOBILE
*/

import Chart from 'chart.js/auto';

export class PatrimonioBtcChart {
    constructor() {
        this.canvas = document.getElementById('chart-patrimonio-btc');
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
                plugins: {
                    legend: {
                        display: !isMobile,
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
                                if (context.datasetIndex === 0) {
                                    return `Patrimônio Total: ${context.parsed.y.toFixed(4)} BTC`;
                                } else {
                                    return `Média: ${context.parsed.y.toFixed(4)} BTC`;
                                }
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
                                return value.toFixed(4) + ' BTC';
                            }
                        }
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

        console.log('📊 Renderizando Patrimônio BTC Chart:', data);
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
                    label: 'Patrimônio Total BTC',
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
                    label: 'Patrimônio Total BTC',
                    data: [0],
                    borderColor: '#ff4757',
                    backgroundColor: 'rgba(255, 71, 87, 0.1)'
                }]
            };
            this.chart.update('none');
        }
    }

    clearLoading() {
        console.log('✅ Patrimônio BTC Chart carregado');
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

export default PatrimonioBtcChart;