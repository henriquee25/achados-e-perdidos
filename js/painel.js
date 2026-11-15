const alerta60Dias = document.querySelector("#alerta-60-dias");
const kpiAguardando = document.querySelector("#kpi-aguardando");
const kpiDevolvidosMes = document.querySelector("#kpi-devolvidos-mes");
const kpiTaxa = document.querySelector("#kpi-taxa");
const kpiTopLocal = document.querySelector("#kpi-top-local");
const tabelaUltimosItens = document.querySelector("#tabela-ultimos-itens");

const itens = carregarLista("ap_itens");

function atualizarResumo() {
    let aguardando = 0;
    let devolvidos = 0;

    itens.forEach(function (item) {
        if (item.status === "aguardando") {
            aguardando++;
        }

        if (item.status === "devolvido") {
            devolvidos++;
        }
    });

    alerta60Dias.hidden = aguardando === 0;
    kpiAguardando.textContent = aguardando;
    kpiDevolvidosMes.textContent = devolvidos;

    if (itens.length === 0) {
        kpiTaxa.textContent = "—";
        kpiTopLocal.textContent = "—";
        return;
    }

    const total = devolvidos * 100;
    const resto = total % itens.length;
    let taxa = (total - resto) / itens.length;

    if (resto * 2 >= itens.length) {
        taxa++;
    }

    kpiTaxa.textContent = taxa + "%";

    let topLocal = "—";
    let maiorQtdLocal = 0;

    itens.forEach(function (itemBase) {
        let qtdLocal = 0;

        itens.forEach(function (itemComparado) {
            if (itemComparado.local === itemBase.local) {
                qtdLocal++;
            }
        });

        if (qtdLocal > maiorQtdLocal) {
            maiorQtdLocal = qtdLocal;
            topLocal = itemBase.local;
        }
    });

    kpiTopLocal.textContent = topLocal;
}

function listarUltimosItens() {
    tabelaUltimosItens.innerHTML = "";

    if (itens.length === 0) {
        const linhaVazia = document.createElement("tr");
        const colunaVazia = document.createElement("td");
        colunaVazia.colSpan = 4;
        colunaVazia.textContent = "Nenhum item cadastrado.";
        linhaVazia.appendChild(colunaVazia);
        tabelaUltimosItens.appendChild(linhaVazia);
        return;
    }

    itens.forEach(function (itemDaVez, posicao) {
        if (posicao >= 5) {
            return;
        }

        const indice = itens.length - 1 - posicao;
        const item = itens[indice];

        const linha = document.createElement("tr");

        const colunaItem = document.createElement("td");
        colunaItem.textContent = item.descricao;

        const colunaLocal = document.createElement("td");
        colunaLocal.textContent = item.local;

        const colunaData = document.createElement("td");
        colunaData.textContent = item.data;

        const colunaStatus = document.createElement("td");
        const etiqueta = document.createElement("span");
        etiqueta.className = "badge status-" + item.status;
        etiqueta.textContent = item.status;
        colunaStatus.appendChild(etiqueta);

        linha.append(colunaItem, colunaLocal, colunaData, colunaStatus);
        tabelaUltimosItens.appendChild(linha);
    });
}

atualizarResumo();
listarUltimosItens();