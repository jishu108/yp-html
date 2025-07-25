document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('transactionChart').getContext('2d');
    
    const data = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [{
            label: 'Transaction Volume',
            data: [120, 150, 110, 180, 200, 160, 220],
            backgroundColor: '#3F9282',
            borderColor: '#3F9282',
            borderWidth: 1,
            borderRadius: 4
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#E0E0E0'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };

    new Chart(ctx, config);
});
