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
const campoBusca = document.querySelector("#busca-itens");
const filtroCategoria = document.querySelector("#filtro-categoria");
const filtroLocal = document.querySelector("#filtro-local");
const campoOrdem = document.querySelector("#ordenar-itens");
const botaoFiltrar = document.querySelector("#btn-filtrar");
const botoesAbas = document.querySelectorAll("#abas-status .nav-link");

let itens = carregarLista("ap_itens");
let indiceEdicao = null;

//aba escolhida: a tela comeca mostrando os itens aguardando
let statusAtual = "aguardando";

//preenche os dois selects de local: o do formulario e o do filtro
function carregarLocais() {
    const locais = carregarLista("ap_locais");
    locais.forEach(function (local) {
        const opcao = document.createElement("option");
        opcao.value = local.nome;
        opcao.textContent = local.nome;
        campoLocal.appendChild(opcao);

        const opcaoFiltro = document.createElement("option");
        opcaoFiltro.value = local.nome;
        opcaoFiltro.textContent = local.nome;
        filtroLocal.appendChild(opcaoFiltro);
    });
}

//preenche o filtro de categoria com as categorias dos itens, sem repetir
function carregarCategorias() {
    const escolhida = filtroCategoria.value;
    const categorias = [];

    filtroCategoria.innerHTML = "";

    const todas = document.createElement("option");
    todas.value = "";
    todas.textContent = "Todas";
    filtroCategoria.appendChild(todas);

    itens.forEach(function (item) {
        let repetida = false;

        categorias.forEach(function (categoria) {
            if (categoria === item.categoria) {
                repetida = true;
            }
        });

        if (repetida) {
            return;
        }

        categorias.push(item.categoria);

        const opcao = document.createElement("option");
        opcao.value = item.categoria;
        opcao.textContent = item.categoria;
        filtroCategoria.appendChild(opcao);
    });

    //volta para a categoria que estava escolhida antes
    filtroCategoria.value = escolhida;
}

//read: lista os itens da aba escolhida que passam na busca e nos filtros
function listarItens() {
    const busca = campoBusca.value.trim();
    const categoriaEscolhida = filtroCategoria.value;
    const localEscolhido = filtroLocal.value;
    let mostrados = 0;

    listaItens.innerHTML = "";

    itens.forEach(function (itemDaVez, posicao) {
        let indice = posicao;
        let item = itemDaVez;

        //mais recentes: comeca pelo ultimo item cadastrado
        if (campoOrdem.value === "recentes") {
            indice = itens.length - 1 - posicao;
            item = itens[indice];
        }

        const statusCerto = item.status === statusAtual;
        const temTexto = busca === "" || item.descricao === busca || item.cor === busca;
        const categoriaCerta = categoriaEscolhida === "" || item.categoria === categoriaEscolhida;
        const localCerto = localEscolhido === "" || item.local === localEscolhido;

        //pula o item que nao e da aba ou nao passa na busca e nos filtros
        if (!statusCerto || !temTexto || !categoriaCerta || !localCerto) {
            return;
        }

        mostrados++;

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

        //item aguardando pode ser doado
        if (item.status === "aguardando") {
            const botaoDoar = document.createElement("button");
            botaoDoar.textContent = "Doar";
            botaoDoar.className = "btn btn-outline-secondary botao-doar";

            botaoDoar.addEventListener("click", function () {
                doarItem(indice);
            });

            acoes.appendChild(botaoDoar);
        }

        //item reclamado espera o dono retirar
        if (item.status === "reclamado") {
            const botaoDevolver = document.createElement("button");
            botaoDevolver.textContent = "Confirmar devolução";
            botaoDevolver.className = "btn btn-success botao-confirmar-devolucao";

            botaoDevolver.addEventListener("click", function () {
                confirmarDevolucao(indice);
            });

            acoes.appendChild(botaoDevolver);
        }

        corpo.append(titulo, textoLocal, textoData, textoCategoria, status, acoes);
        card.appendChild(corpo);
        coluna.appendChild(card);
        listaItens.appendChild(coluna);
    });

    mensagemVazia.hidden = mostrados > 0;
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
    carregarCategorias();
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
    carregarCategorias();
    listarItens();
}

//muda o status do item para doado
function doarItem(indice) {
    const confirmou = confirm("Doar este item? A doação é para itens sem dono há mais de 60 dias.");

    if (confirmou) {
        itens[indice].status = "doado";
    }

    salvarLista("ap_itens", itens);
    listarItens();
}

//muda o status do item para devolvido
function confirmarDevolucao(indice) {
    const confirmou = confirm("Confirmar que o dono retirou este item?");

    if (confirmou) {
        itens[indice].status = "devolvido";
    }

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

//aplica a busca, os filtros e a ordenacao
botaoFiltrar.addEventListener("click", listarItens);

//abas de status
botoesAbas.forEach(function (botao) {
    botao.addEventListener("click", function () {
        //tira a classe active de todas as abas
        botoesAbas.forEach(function (item) {
            item.classList.remove("active");
        });

        //ativa a aba que foi clicada
        botao.classList.add("active");

        //o data-status do botao diz qual status mostrar
        statusAtual = botao.dataset.status;

        listarItens();
    });
});

carregarLocais();
carregarCategorias();
listarItens();
