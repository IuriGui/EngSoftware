let alunosData = [];

// Carrega os alunos do JSON assim que a página carregar
async function carregarAlunos() {
    const response = await fetch('../JS/alunos.json');
    alunosData = await response.json();
    preencherSelectCursos();
    listarAlunosPorCurso(""); // mostra todos inicialmente
}

function preencherSelectCursos() {
    const select = document.getElementById('selectCurso');
    if (!select) return;
    const cursos = [...new Set(alunosData.map(aluno => aluno.curso))];
    select.innerHTML = '<option value="">Todos os cursos</option>';
    cursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso;
        option.textContent = curso;
        select.appendChild(option);
    });
}

function listarAlunosPorCurso(nomeCurso, filtroNome = "") {
    const container = document.getElementById('todosAlunos2');
    if (!container) return;

    container.innerHTML = '';

    alunosData
        .filter(aluno => (!nomeCurso || aluno.curso === nomeCurso) &&
            aluno.nome.toLowerCase().includes(filtroNome.toLowerCase()))
        .forEach(aluno => {
            const div = document.createElement('div');
            div.className = 'd-flex align-items-center bg-warning p-3 rounded shadow-sm mb-2';

            div.innerHTML = `
                <div class="me-3">
                    <div class="avatar-placeholder"></div>
                </div>
                <div class="flex-grow-1">
                    <h5 class="mb-1">${aluno.nome}</h5>
                    <p class="mb-0">
                        Curso: ${aluno.curso}<br>
                        Probabilidade de evasão: ${(aluno.probabilidade_evasao * 100).toFixed(1)}%
                    </p>
                </div>
                <div class="ms-3">
                 <a href="aluno.html?matricula=${aluno.matrícula}" class="btn btn-outline-dark btn-circle">+</a>
                 </div>
            `;

            container.appendChild(div);
        });
}

// Filtra os nomes conforme a digitação
function filtrarAlunos(nomeDigitado) {
    const lista = document.getElementById('listaAlunos');
    lista.innerHTML = ''; // limpa lista anterior

    const resultado = alunosData.filter(aluno =>
        aluno.nome.toLowerCase().includes(nomeDigitado.toLowerCase())
    );

    // Adiciona os nomes encontrados na lista
    resultado.forEach(aluno => {
        const li = document.createElement('li');
        li.textContent = aluno.nome;
        lista.appendChild(li);
    });
}

// Aguarda digitação no input
document.addEventListener('DOMContentLoaded', () => {
    carregarAlunos();

    const input = document.getElementById('pesquisaAluno');
    const select = document.getElementById('selectCurso');
    let filtroNome = "";
    let filtroCurso = "";

    if (input) {
        input.addEventListener('input', (e) => {
            filtroNome = e.target.value;
            filtroCurso = select ? select.value : "";
            listarAlunosPorCurso(filtroCurso, filtroNome);
        });
    }

    if (select) {
        select.addEventListener('change', function () {
            filtroCurso = this.value;
            filtroNome = input ? input.value : "";
            listarAlunosPorCurso(filtroCurso, filtroNome);
        });
    }
});

