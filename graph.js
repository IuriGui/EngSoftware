const ctx = document.getElementById('myChart');


async function alunos() {
    let data = await fetch('alunos.json');
    console.log(data);
    
    return data;
}


let data = alunos();

console.log(alunos())


    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
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