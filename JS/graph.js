const ctx = document.getElementById('myChart').getContext('2d');

async function alunos() {
  const response = await fetch('../JS/alunos.json');
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
          title: {
            display: true,
            text: 'Quantidade de Alunos'
          },
          ticks: {
            callback: function(value) {
              return Number.isInteger(value) ? value : '';
            }
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


let cursosData = [];

async function carregarCursos() {
  const alunosData = await alunos();
  const cursosSet = new Set(alunosData.map(a => a.curso));
  cursosData = Array.from(cursosSet).sort();
}

function filtrarCursos(textoDigitado) {
  const container = document.querySelector('.result');
  container.innerHTML = '';

  const resultado = cursosData.filter(curso =>
    curso.toLowerCase().includes(textoDigitado.toLowerCase())
  );

  if (resultado.length === 0) {
    container.innerHTML = '<p>Nenhum curso encontrado.</p>';
    return;
  }

  resultado.forEach(curso => {
    const linkCurso = document.createElement('a');
    linkCurso.classList.add('curso-item', 'mb-2', 'd-block');
    linkCurso.textContent = curso;
    linkCurso.href = `cursos.html?nome=${encodeURIComponent(curso)}`;
    container.appendChild(linkCurso);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await carregarCursos();
  createChart();

  const inputPesquisa = document.getElementById('inputPesquisa');
  

  filtrarCursos('');
  inputPesquisa.addEventListener('input', (e) => {
    filtrarCursos(e.target.value);
  });
});
