const selectSolicitacao = document.querySelector("#select-solicitacao");
const listaCorrespondencias = document.querySelector("#lista-correspondencias");
const mensagemVazia = document.querySelector("#mensagem-sem-correspondencias");

let solicitacoes = carregarLista("ap_solicitacoes");
let itens = carregarLista("ap_itens");

function carregarSolicitacoes() {
    selectSolicitacao.innerHTML = '<option value="">Selecione uma solicitação</option>';

    solicitacoes.forEach(function (solicitacao, indice) {
        if (solicitacao.status === "aberta") {
            const opcao = document.createElement("option");
            opcao.value = indice;
            opcao.textContent = solicitacao.nome + " - " + solicitacao.categoria + " (" + solicitacao.local + ")";
            selectSolicitacao.appendChild(opcao);
        }
    });
}

function listarCorrespondencias() {
    listaCorrespondencias.innerHTML = "";

    if (selectSolicitacao.value === "") {
        mensagemVazia.hidden = true;
        return;
    }

    const indiceSolicitacao = Number(selectSolicitacao.value);
    const solicitacao = solicitacoes[indiceSolicitacao];
    let encontrou = false;

    itens.forEach(function (item, indiceItem) {
        if (item.status === "aguardando" && item.categoria === solicitacao.categoria) {
            encontrou = true;

            const coluna = document.createElement("div");
            coluna.className = "col";

            const cartao = document.createElement("article");
            cartao.className = "card h-100";

            const corpo = document.createElement("div");
            corpo.className = "card-body";

            const titulo = document.createElement("h3");
            titulo.className = "h6 card-title";
            titulo.textContent = item.descricao;

            const textoCategoria = document.createElement("p");
            textoCategoria.className = "card-text mb-1";
            if (item.cor !== "") {
                textoCategoria.textContent = "Categoria: " + item.categoria + " - " + item.cor;
            } else {
                textoCategoria.textContent = "Categoria: " + item.categoria;
            }

            const textoLocal = document.createElement("p");
            textoLocal.className = "card-text mb-1";
            textoLocal.textContent = "Local: " + item.local;

            const textoData = document.createElement("p");
            textoData.className = "card-text mb-3";
            textoData.textContent = "Encontrado em: " + item.data;

            const botaoVincular = document.createElement("button");
            botaoVincular.type = "button";
            botaoVincular.textContent = "Vincular item";
            botaoVincular.className = "btn btn-primary btn-sm";
            botaoVincular.addEventListener("click", function () {
                vincularItem(indiceSolicitacao, indiceItem);
            });

            corpo.append(titulo, textoCategoria, textoLocal, textoData, botaoVincular);
            cartao.appendChild(corpo);
            coluna.appendChild(cartao);
            listaCorrespondencias.appendChild(coluna);
        }
    });

    mensagemVazia.hidden = encontrou;
}

function vincularItem(indiceSolicitacao, indiceItem) {
    const confirmou = confirm("Deseja vincular este item à solicitação?");

    if (confirmou) {
        solicitacoes[indiceSolicitacao].status = "atendida";
        solicitacoes[indiceSolicitacao].item = indiceItem;

        itens[indiceItem].status = "reclamado";

        salvarLista("ap_solicitacoes", solicitacoes);
        salvarLista("ap_itens", itens);

        alert("Correspondência registrada! O item agora aguarda retirada.");

        carregarSolicitacoes();
        listarCorrespondencias();
    }
}

selectSolicitacao.addEventListener("change", listarCorrespondencias);

carregarSolicitacoes();