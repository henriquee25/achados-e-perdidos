const formulario = document.querySelector("#form-solicitacao");
const campoNome = document.querySelector("#sol-nome");
const campoContato = document.querySelector("#sol-contato");
const campoCurso = document.querySelector("#sol-curso");
const campoFase = document.querySelector("#sol-fase");
const campoCategoria = document.querySelector("#sol-categoria");
const campoCor = document.querySelector("#sol-cor");
const campoLocal = document.querySelector("#sol-local");
const campoData = document.querySelector("#sol-data");
const listaSolicitacoes = document.querySelector("#lista-solicitacoes");
const botaoSalvar = document.querySelector("#btn-salvar-solicitacao");
const botaoCancelar = document.querySelector("#btn-cancelar-solicitacao");
const mensagemVazia = document.querySelector("#mensagem-vazia-solicitacoes");

let solicitacoes = carregarLista("ap_solicitacoes");
let indiceEdicao = null;

function carregarLocais() {
    const locaisSalvos = carregarLista("ap_locais");

    locaisSalvos.forEach(function (local) {
        const opcao = document.createElement("option");
        opcao.value = local.nome;
        opcao.textContent = local.nome;
        campoLocal.appendChild(opcao);
    });
}

// READ
function listarSolicitacoes() {
    listaSolicitacoes.innerHTML = "";
    mensagemVazia.hidden = solicitacoes.length > 0;

    solicitacoes.forEach(function (solicitacao, indice) {
        const linha = document.createElement("tr");

        const colunaNome = document.createElement("td");
        colunaNome.textContent = solicitacao.nome;

        const colunaCursoFase = document.createElement("td");
        colunaCursoFase.textContent = solicitacao.curso + " (" + solicitacao.fase + "ª)";

        const colunaProcura = document.createElement("td");
        if (solicitacao.cor === "") {
            colunaProcura.textContent = solicitacao.categoria;
        } else {
            colunaProcura.textContent = solicitacao.categoria + " - " + solicitacao.cor;
        }

        const colunaLocal = document.createElement("td");
        colunaLocal.textContent = solicitacao.local;

        const colunaStatus = document.createElement("td");
        const etiqueta = document.createElement("span");
        etiqueta.className = "badge status-" + solicitacao.status;
        etiqueta.textContent = solicitacao.status;
        colunaStatus.appendChild(etiqueta);

        const colunaAcoes = document.createElement("td");
        const acoes = document.createElement("div");
        acoes.className = "acoes";

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "btn btn-sm btn-outline-primary me-1";
        botaoEditar.addEventListener("click", function () {
            editarSolicitacao(indice);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn btn-sm btn-outline-danger";
        botaoExcluir.addEventListener("click", function () {
            excluirSolicitacao(indice);
        });

        if (solicitacao.status === "aberta") {
            acoes.appendChild(botaoEditar);
        }
        acoes.appendChild(botaoExcluir);
        colunaAcoes.appendChild(acoes);

        linha.append(colunaNome, colunaCursoFase, colunaProcura, colunaLocal, colunaStatus, colunaAcoes);
        listaSolicitacoes.appendChild(linha);
    });
}

// CREATE E UPDATE
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const contato = campoContato.value.trim();
    const curso = campoCurso.value.trim();
    const fase = Number(campoFase.value);
    const categoria = campoCategoria.value.trim();
    const cor = campoCor.value.trim();
    const local = campoLocal.value;
    const data = campoData.value;

    if (nome.length < 3) {
        alert("Informe o nome com pelo menos 3 letras!");
        campoNome.focus();
        return;
    }

    if (contato.length < 8) {
        alert("Informe um e-mail ou número de celular válido!");
        campoContato.focus();
        return;
    }

    if (curso === "") {
        alert("Informe o curso!");
        campoCurso.focus();
        return;
    }

    if (!fase) {
        alert("Escolha a fase!");
        campoFase.focus();
        return;
    }

    if (categoria === "") {
        alert("Informe a categoria do objeto!");
        campoCategoria.focus();
        return;
    }

    if (local === "") {
        alert("Escolha o local onde perdeu!");
        campoLocal.focus();
        return;
    }

    if (data === "") {
        alert("Informe a data da perda!");
        campoData.focus();
        return;
    }

    if (indiceEdicao === null) {
        // CREATE
        const solicitacao = {
            nome: nome,
            contato: contato,
            curso: curso,
            fase: fase,
            categoria: categoria,
            cor: cor,
            local: local,
            data: data,
            status: "aberta",
            item: null
        };
        solicitacoes.push(solicitacao);
        alert("Solicitação cadastrada com sucesso!");
    } else {
        // UPDATE
        const solicitacao = {
            nome: nome,
            contato: contato,
            curso: curso,
            fase: fase,
            categoria: categoria,
            cor: cor,
            local: local,
            data: data,
            status: solicitacoes[indiceEdicao].status,
            item: solicitacoes[indiceEdicao].item
        };
        solicitacoes[indiceEdicao] = solicitacao;
        alert("Solicitação atualizada com sucesso!");
    }

    salvarLista("ap_solicitacoes", solicitacoes);
    listarSolicitacoes();
    limparFormulario();
});

// PREENCHE O FORMULÁRIO COM A SOLICITAÇÃO ESCOLHIDA
function editarSolicitacao(indice) {
    campoNome.value = solicitacoes[indice].nome;
    campoContato.value = solicitacoes[indice].contato;
    campoCurso.value = solicitacoes[indice].curso;
    campoFase.value = solicitacoes[indice].fase;
    campoCategoria.value = solicitacoes[indice].categoria;
    campoCor.value = solicitacoes[indice].cor;
    campoLocal.value = solicitacoes[indice].local;
    campoData.value = solicitacoes[indice].data;

    indiceEdicao = indice;

    botaoSalvar.textContent = "Salvar Alteração";
    botaoCancelar.hidden = false;

    campoNome.focus();
}

// DELETAR
function excluirSolicitacao(indice) {
    if (solicitacoes[indice].status === "aberta") {
        const confirmou = confirm("Deseja excluir esta solicitação?");

        if (confirmou) {
            solicitacoes.splice(indice, 1);
            salvarLista("ap_solicitacoes", solicitacoes);
            listarSolicitacoes();
            limparFormulario();
            alert("Solicitação excluída.");
        }
    } else {
        alert("Esta solicitação já está vinculada a um item e não pode ser excluída!");
    }
}

// LIMPAR O FORMULÁRIO
function limparFormulario() {
    formulario.reset();
    indiceEdicao = null;

    botaoSalvar.textContent = "Cadastrar";
    botaoCancelar.hidden = true;
}

botaoCancelar.addEventListener("click", limparFormulario);

carregarLocais();
listarSolicitacoes();