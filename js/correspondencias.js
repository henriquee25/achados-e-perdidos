const selectSolicitacao = document.querySelector("#select-solicitacao");
const botaoVer = document.querySelector("#btn-ver-correspondencias");
const listaCorrespondencias = document.querySelector("#lista-correspondencias");
const mensagemVazia = document.querySelector("#mensagem-sem-correspondencias");

let solicitacoes = carregarLista("ap_solicitacoes");
let itens = carregarLista("ap_itens");

//pontuacoes possiveis, da maior para a menor
const pontuacoes = [7, 5, 4, 3, 2];

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

//soma os pontos de um item para a solicitacao escolhida
function calcularPontos(item, solicitacao) {
    let pontos = 0;

    if (item.categoria === solicitacao.categoria) {
        pontos = pontos + 3;
    }

    if (item.cor !== "" && item.cor === solicitacao.cor) {
        pontos = pontos + 2;
    }

    if (item.local === solicitacao.local) {
        pontos = pontos + 2;
    }

    return pontos;
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

    //passa pela lista uma vez para cada pontuacao, da maior para a menor
    pontuacoes.forEach(function (pontuacaoDaVez) {
        itens.forEach(function (item, indiceItem) {
            if (item.status === "aguardando" && calcularPontos(item, solicitacao) === pontuacaoDaVez) {
                encontrou = true;

                const coluna = document.createElement("div");
                coluna.className = "col";

                const cartao = document.createElement("article");
                cartao.className = "card h-100";

                const corpo = document.createElement("div");
                corpo.className = "card-body";

                const etiquetaPontos = document.createElement("span");
                etiquetaPontos.className = "pontos d-inline-block mb-2";
                etiquetaPontos.textContent = pontuacaoDaVez + " pts";

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
                botaoVincular.textContent = "Vincular item";
                botaoVincular.className = "btn btn-primary btn-sm";
                botaoVincular.addEventListener("click", function () {
                    vincularItem(indiceSolicitacao, indiceItem);
                });

                corpo.append(etiquetaPontos, titulo, textoCategoria, textoLocal, textoData, botaoVincular);
                cartao.appendChild(corpo);
                coluna.appendChild(cartao);
                listaCorrespondencias.appendChild(coluna);
            }
        });
    });

    mensagemVazia.hidden = encontrou;
}

function vincularItem(indiceSolicitacao, indiceItem) {
    const confirmou = confirm("Deseja vincular este item à solicitação?");

    if (confirmou) {
        solicitacoes[indiceSolicitacao].status = "atendida";

        //guarda a descricao do item, que nao muda quando outro item e excluido
        solicitacoes[indiceSolicitacao].item = itens[indiceItem].descricao;

        itens[indiceItem].status = "reclamado";

        salvarLista("ap_solicitacoes", solicitacoes);
        salvarLista("ap_itens", itens);

        alert("Correspondência registrada! O item agora aguarda retirada.");

        carregarSolicitacoes();
        listarCorrespondencias();
    }
}

botaoVer.addEventListener("click", listarCorrespondencias);

carregarSolicitacoes();
