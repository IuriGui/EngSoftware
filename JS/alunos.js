
    let alunosData = [];

    // Carrega os alunos do JSON assim que a página carregar
    async function carregarAlunos() {
        const response = await fetch('/js/alunos.json');
        alunosData = await response.json();
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
        input.addEventListener('input', (e) => {
            filtrarAlunos(e.target.value);
        });
    });

