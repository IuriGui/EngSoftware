const ctx = document.getElementById('myChart').getContext('2d');

async function alunos() {
    const response = await fetch('/EngSoftware/JS/alunos.json');
    const data = await response.json();
    return data;
}

function contarAlunosComAltaEvasao(data) {
    const evasaoPorCurso = {};

    data.forEach(aluno => {
        if (aluno.probabilidade_evasao > 0.5) {
            const curso = aluno.curso;
            if (!evasaoPorCurso[curso]) {
                evasaoPorCurso[curso] = 0;
            }
            evasaoPorCurso[curso]++;
        }
    });

    const cursos = Object.keys(evasaoPorCurso);
    const quantidades = cursos.map(curso => evasaoPorCurso[curso]);

    return { cursos, quantidades };
}

async function createChart() {
    const data = await alunos();
    const { cursos, quantidades } = contarAlunosComAltaEvasao(data);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cursos,
            datasets: [{
                label: 'Alunos com risco de evasão',
                data: quantidades,
                backgroundColor: 'rgba(255, 0, 55, 0.86)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 1,
                    title: {
                        display: true,
                        text: 'Quantidade de Alunos'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Cursos'
                    }
                }
            }
        }
    });
}

createChart();