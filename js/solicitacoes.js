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


function buscarNomeLocal(id) {
    const locaisSalvos = carregarLista("ap_locais");
    const localEncontrado = locaisSalvos.find(function (local) {
        return local.id === id;
    });

    if (localEncontrado) {
        return localEncontrado.nome;
    }
    return "-";
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
        if (solicitacao.cor !== "") {
            colunaProcura.textContent = solicitacao.categoria + " - " + solicitacao.cor;
        } else {
            colunaProcura.textContent = solicitacao.categoria;
        }

        const colunaLocal = document.createElement("td");
        colunaLocal.textContent = solicitacao.local;

        const colunaStatus = document.createElement("td");
        colunaStatus.textContent = solicitacao.status;

        const colunaAcoes = document.createElement("td");
        const acoes = document.createElement("div");
        acoes.className = "acoes";

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "btn btn-sm btn-outline-primary me-1";
        botaoEditar.addEventListener("click", function () {
            editarSolicitacao(indice);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn btn-sm btn-outline-danger";
        botaoExcluir.addEventListener("click", function () {
            excluirSolicitacao(indice);
        });

        if (solicitacao.status === "Aberta" && solicitacao.itemId === null) {
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
    const dataHoje = new Date().toLocaleDateString("sv-SE");

    if (nome.length < 3) {
        alert("Informe o nome com pelo menos 3 letras!");
        campoNome.focus();
        return;
    }

    if (contato.length < 8) {
        alert("Informe um e-mail ou celular com DDD!");
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

    if (data === "" || data > dataHoje) {
        alert("Informe uma data válida (não pode ser no futuro)!");
        campoData.focus();
        return;
    }

    if (indiceEdicao === null) {
        // CREATE
        const solicitacao = {
            id: Date.now(),
            nome: nome,
            contato: contato,
            curso: curso,
            fase: fase,
            categoria: categoria,
            cor: cor,
            local: local,
            data: data,
            status: "Aberta",
            itemId: null
        };
        solicitacoes.push(solicitacao);
    } else {
        // UPDATE
        const solicitacao = {
            id: solicitacoes[indiceEdicao].id,
            nome: nome,
            contato: contato,
            curso: curso,
            fase: fase,
            categoria: categoria,
            cor: cor,
            local: local,
            data: data,
            status: solicitacoes[indiceEdicao].status,
            itemId: solicitacoes[indiceEdicao].itemId
        };
        solicitacoes[indiceEdicao] = solicitacao;
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
    if (solicitacoes[indice].itemId !== null) {
        alert("Esta solicitação já está vinculada a um item e não pode ser excluída!");
        return;
    }

    const confirmou = confirm("Deseja excluir esta solicitação?");

    if (confirmou) {
        solicitacoes.splice(indice, 1);
        salvarLista("ap_solicitacoes", solicitacoes);
        listarSolicitacoes();
        limparFormulario();
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