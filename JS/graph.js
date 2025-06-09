const ctx = document.getElementById('myChart');

async function alunos() {
    let response = await fetch('/JS/alunos.json');
    let data = await response.json(); // Parse JSON from the response
    console.log(data); // This will show the actual JSON object
    return data;
}

async function createChart() {
    let chartData = await alunos();
    let labels = chartData.map(i => i.curso)
    labels = labels.filter((value, index) => labels.indexOf(value) === index)

    console.log(labels);
    

    
    console.log(typeof(chartData));
    console.log(chartData);
    
    

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '# of Votes',
                data: chartData.probabilidade_evasao, // e.g., [12, 19, 3, ...]
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Call the function to create the chart
createChart();
