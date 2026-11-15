const formulario = document.querySelector("#form-item");
const campoDescricao = document.querySelector("#item-descricao");
const campoCategoria = document.querySelector("#item-categoria");
const campoCor = document.querySelector("#item-cor");
const campoLocal = document.querySelector("#item-local");
const campoData = document.querySelector("#item-data");
const listaItens = document.querySelector("#lista-itens");
const botaoSalvar = document.querySelector("#btn-salvar-item");
const botaoCancelar = document.querySelector("#btn-cancelar-item");
const mensagemVazia = document.querySelector("#mensagem-vazia-itens");
const erroDescricao = document.querySelector("#erro-item-descricao");
const erroCategoria = document.querySelector("#erro-item-categoria");
const erroLocal = document.querySelector("#erro-item-local");
const erroData = document.querySelector("#erro-item-data");

let itens = carregarLista("ap_itens");
let indiceEdicao = null;

function carregarLocais() {
    const locais = carregarLista("ap_locais");
    locais.forEach(function (local) {
        const opcao = document.createElement("option");
        opcao.value = local.nome;
        opcao.textContent = local.nome;
        campoLocal.appendChild(opcao);
    });
}

function listarItens() {
    listaItens.innerHTML = "";
    mensagemVazia.hidden = itens.length > 0;
    itens.forEach(function (item, indice) {
        const coluna = document.createElement("div");
        coluna.className = "col";

        const card = document.createElement("article");
        card.className = "card h-100";

        const corpo = document.createElement("div");
        corpo.className = "card-body";

        const titulo = document.createElement("h3");
        titulo.className = "card-title h6";
        titulo.textContent = item.descricao;

        const textoLocal = document.createElement("p");
        textoLocal.className = "card-text";
        textoLocal.textContent = "Local: " + item.local;

        const textoData = document.createElement("p");
        textoData.className = "card-text";
        textoData.textContent = "Encontrado em: " + item.data;

        const textoCategoria = document.createElement("p");
        textoCategoria.className = "card-text";
        textoCategoria.textContent = "Categoria: " + item.categoria;

        const status = document.createElement("span");
        status.className = "badge status-" + item.status;
        status.textContent = item.status;

        const acoes = document.createElement("div");
        acoes.className = "acoes mt-3";

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "btn btn-outline-primary botao-editar";

        botaoEditar.addEventListener("click", function () {
            editarItem(indice);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn btn-outline-danger botao-excluir";

        botaoExcluir.addEventListener("click", function () {
            excluirItem(indice);
        });

        acoes.append(botaoEditar, botaoExcluir);
        corpo.append(titulo, textoLocal, textoData, textoCategoria, status, acoes);
        card.appendChild(corpo);
        coluna.appendChild(card);
        listaItens.appendChild(coluna);
    });
}

//create e update
formulario.addEventListener("submit", function (evento) {
    //evita que o formulario recarregue a pagina
    evento.preventDefault();

    const descricao = campoDescricao.value.trim();
    const categoria = campoCategoria.value.trim();
    const cor = campoCor.value.trim();
    const local = campoLocal.value;
    const data = campoData.value;

    //tira os erros da tentativa anterior
    campoDescricao.classList.remove("is-invalid");
    campoCategoria.classList.remove("is-invalid");
    campoLocal.classList.remove("is-invalid");
    campoData.classList.remove("is-invalid");
    erroDescricao.textContent = "";
    erroCategoria.textContent = "";
    erroLocal.textContent = "";
    erroData.textContent = "";

    if (descricao === "") {
        campoDescricao.classList.add("is-invalid");
        erroDescricao.textContent = "Informe a descrição.";
        return;
    }

    if (categoria === "") {
        campoCategoria.classList.add("is-invalid");
        erroCategoria.textContent = "Informe a categoria.";
        return;
    }

    if (local === "") {
        campoLocal.classList.add("is-invalid");
        erroLocal.textContent = "Escolha o local.";
        return;
    }

    if (data === "") {
        campoData.classList.add("is-invalid");
        erroData.textContent = "Informe a data.";
        return;
    }

    const item = {
        descricao: descricao,
        categoria: categoria,
        cor: cor,
        local: local,
        data: data,
        status: "aguardando"
    };

    if (indiceEdicao === null) {
        //create: adiciona o item no final da lista
        itens.push(item);
    } else {
        //update: mantem o status que o item ja tinha e substitui
        item.status = itens[indiceEdicao].status;
        itens[indiceEdicao] = item;
    }

    salvarLista("ap_itens", itens);
    listarItens();
    limparFormulario();
});

//preenche o formulario com o item escolhido
function editarItem(indice) {
    campoDescricao.value = itens[indice].descricao;
    campoCategoria.value = itens[indice].categoria;
    campoCor.value = itens[indice].cor;
    campoLocal.value = itens[indice].local;
    campoData.value = itens[indice].data;

    indiceEdicao = indice;

    botaoSalvar.textContent = "Salvar alteração";
    botaoCancelar.hidden = false;

    campoDescricao.focus();
}

//delete
function excluirItem(indice) {
    const confirmou = confirm("Deseja excluir este item?");

    if (confirmou) {
        itens.splice(indice, 1);
    }

    limparFormulario();
    salvarLista("ap_itens", itens);
    listarItens();
}

//limpar o form
function limparFormulario() {
    formulario.reset();
    indiceEdicao = null;

    campoDescricao.classList.remove("is-invalid");
    campoCategoria.classList.remove("is-invalid");
    campoLocal.classList.remove("is-invalid");
    campoData.classList.remove("is-invalid");
    erroDescricao.textContent = "";
    erroCategoria.textContent = "";
    erroLocal.textContent = "";
    erroData.textContent = "";

    botaoSalvar.textContent = "Cadastrar";
    botaoCancelar.hidden = true;
}

botaoCancelar.addEventListener("click", limparFormulario);

carregarLocais();
listarItens();
