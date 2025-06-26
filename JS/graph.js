const ctx = document.getElementById('myChart').getContext('2d');

async function alunos() {
  const response = await fetch('../JS/alunos.json');
  const data = await response.json();
  return data;
}

// Mapeamento curso → área
function getAreaDoCurso(nome) {
  nome = nome.toLowerCase();

  // Saúde
  if (
    nome.includes('enfermagem') ||
    nome.includes('biologia') ||
    nome.includes('química') ||
    nome.includes('medicina')
  ) return 'Saúde';

  // Exatas e Engenharias
  if (
    nome.includes('engenharia') ||
    nome.includes('matemática') ||
    nome.includes('física') ||
    nome.includes('ciência da computação') ||
    nome.includes('computação') ||
    nome.includes('administração') || // administração pode entrar nas sociais aplicadas, mas aqui deixo como exatas por ter gestão e negócios
    nome.includes('economia') ||
    nome.includes('contabilidade') ||
    nome.includes('design') ||
    nome.includes('arquitetura') ||
    nome.includes('engenharia elétrica')
  ) return 'Exatas';

  if (
    nome.includes('direito') ||
    nome.includes('filosofia') ||
    nome.includes('letras') ||
    nome.includes('história') ||
    nome.includes('geografia') ||
    nome.includes('sociologia') ||
    nome.includes('psicologia')
  ) return 'Humanas';

  if (
    nome.includes('jornalismo') ||
    nome.includes('publicidade') ||
    nome.includes('artes visuais') ||
    nome.includes('arte') ||
    nome.includes('design') ||
    nome.includes('publicidade e propaganda')
  ) return 'Comunicação e Artes';

  // Educação Física fica separado ou em Humanas
  if (nome.includes('educação física')) return 'Educação Física';

  // Se não cair em nenhum acima
  return 'Outros';
}

// Agrupar por curso com área
function contarAlunosPorCurso(data) {
  const cursos = {};

  data.forEach(aluno => {
    if (aluno.probabilidade_evasao > 0.5) {
      const curso = aluno.curso;
      const area = getAreaDoCurso(curso);

      if (!cursos[curso]) {
        cursos[curso] = { quantidade: 0, area };
      }

      cursos[curso].quantidade++;
    }
  });

  return cursos;
}

async function createChart() {
  const data = await alunos();
  const cursosObj = contarAlunosPorCurso(data);

  const cursosOrdenados = Object.entries(cursosObj)
    .map(([curso, info]) => ({ curso, quantidade: info.quantidade, area: info.area }))
    .sort((a, b) => b.quantidade - a.quantidade);

  const labels = cursosOrdenados.map(c => c.curso);
  const areasUnicas = [...new Set(cursosOrdenados.map(c => c.area))];

  const coresPorArea = {
    'Saúde': '#25A667',
    'Exatas': '#007bff',
    'Humanas': '#6f42c1',
    'Sociais Aplicadas': '#fd7e14',
    'Comunicação': '#dc3545',
    'Outros': '#75a9d9'
  };

  const datasets = areasUnicas.map(area => {
    const data = cursosOrdenados.map(c => c.area === area ? c.quantidade : null);

    return {
      label: area,
      data,
      backgroundColor: coresPorArea[area] || '#7ca9d6',
      borderColor: '#343a40',
      borderWidth: 1
    };
  });

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets
    },
    options: {
  indexAxis: 'y',
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 20,
        padding: 15,
        font: {
          size: 14
        }
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${context.raw}`;
        }
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      stacked: true, // <--- ATIVAR STACK
      title: {
        display: true,
        text: 'Quantidade de Alunos'
      },
      ticks: {
        precision: 0
      }
    },
    y: {
      stacked: true, // <--- ATIVAR STACK
      title: {
        display: true,
        text: 'Cursos'
      },
      ticks: {
        font: {
          size: 12
        }
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
