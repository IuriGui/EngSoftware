function getMatriculaFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('matricula');
}

function getInitials(nome) {
    if (!nome) return '';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

async function carregarAluno() {
    const matricula = getMatriculaFromUrl();
    if (!matricula) return;

    const response = await fetch('../JS/alunos.json');
    const alunos = await response.json();

    const aluno = alunos.find(a => String(a.matrícula) === String(matricula));
    const container = document.getElementById('detalheAluno');
    if (!aluno) {
        container.innerHTML = '<p>Aluno não encontrado.</p>';
        return;
    }

    const initials = getInitials(aluno.nome);

    container.innerHTML = `
        <div class="d-flex align-items-center bg-warning p-3 rounded shadow-sm mb-2">
            <div class="me-3">
                <div class="avatar-placeholder d-flex align-items-center justify-content-center" style="
                    width: 64px; height: 64px; border-radius: 50%; background: #198754; color: #fff; font-size: 2rem; font-weight: bold;">
                    ${initials}
                </div>
            </div>
            <div class="flex-grow-1">
                <h5 class="mb-1">${aluno.nome}</h5>
                <p class="mb-0">
                    <strong>Matrícula:</strong> ${aluno.matrícula}<br>
                    <strong>Curso:</strong> ${aluno.curso}<br>
                    <strong>Probabilidade de evasão:</strong> ${(aluno.probabilidade_evasao * 100).toFixed(1)}%<br>
                    <strong>E-mail:</strong> <span class="text-muted">exemplo@email.com</span><br>
                    <strong>Telefone:</strong> <span class="text-muted">(00) 00000-0000</span>
                </p>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', carregarAluno);