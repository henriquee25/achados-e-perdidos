const formulario = document.querySelector("#form-local");
const campoNome = document.querySelector("#local-nome");
const campoBloco = document.querySelector("#local-bloco");
const listaLocais = document.querySelector("#lista-locais");
const botaoSalvar = document.querySelector("#btn-salvar-local");
const botaoCancelar = document.querySelector("#btn-cancelar-local");
const mensagemVazia = document.querySelector("#mensagem-vazia-locais");
const erroNome = document.querySelector("#erro-local-nome");
const erroBloco = document.querySelector("#erro-local-bloco");


let locais = carregarLista("ap_locais");

let indiceEdicao = null;

function listarLocais() {
    listaLocais.innerHTML = ""
    mensagemVazia.hidden = locais.length > 0

    locais.forEach(function (local, indice) {
        const linha = document.createElement("tr");
        
        const colunaNome = document.createElement("td");
        colunaNome.textContent = local.nome;

        const colunaBloco = document.createElement("td");
        colunaBloco.textContent = local.bloco;

        const colunaItens = document.createElement("td");
        colunaItens.textContent = 0;

        const colunaAcoes = document.createElement("td");

        const acoes = document.createElement("div")
        acoes.className = "acoes";

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "btn btn-outline-primary botao-editar";

        botaoEditar.addEventListener("click", function () {
            editarLocal(indice);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn btn-outline-danger botao-excluir";

        botaoExcluir.addEventListener("click", function () {
            excluirLocal(indice);
        });

        acoes.append(botaoEditar, botaoExcluir);
        colunaAcoes.appendChild(acoes);
        
        linha.append(colunaNome, colunaBloco, colunaItens, colunaAcoes)
        listaLocais.appendChild(linha);
    });
}

//create e update
formulario.addEventListener("submit", function (evento) {
    //evita que o formulario recarregue a pagina
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const bloco = campoBloco.value.trim();

    //tira o erro da tentativa anterior
    campoNome.classList.remove("is-invalid");
    campoBloco.classList.remove("is-invalid");
    erroNome.textContent = "";
    erroBloco.textContent = "";

    if (nome === "") {
        campoNome.classList.add("is-invalid");
        erroNome.textContent = "Informe o nome do local.";
        return;
    }

    if (bloco === "") {
        campoBloco.classList.add("is-invalid");
        erroBloco.textContent = "Informe o bloco.";
        return;
    }

    //procura outro local com o mesmo nome
    let repetido = false;

    locais.forEach(function (local, indice) {
        //pula o proprio local quando esta editando
        if (indice === indiceEdicao) {
            return;
        }

        if (local.nome === nome) {
            repetido = true;
        }
    });

    if (repetido) {
        campoNome.classList.add("is-invalid");
        erroNome.textContent = "Já existe um local com esse nome.";
        return;
    }

    const local = {
        nome: nome,
        bloco: bloco
    };

    if (indiceEdicao === null) {
        //create: adiciona o local no final da lista
        locais.push(local);
    } else {
        //update: substitui o local que esta sendo editado
        locais[indiceEdicao] = local;
    }

    salvarLista("ap_locais", locais);
    listarLocais();
    limparFormulario();
});

//preenche o formulario com o local escolhido
function editarLocal(indice) {
    campoNome.value = locais[indice].nome;
    campoBloco.value = locais[indice].bloco;

    indiceEdicao = indice;

    botaoSalvar.textContent = "Salvar alteração";
    botaoCancelar.hidden = false;

    campoNome.focus();
}

//delete
function excluirLocal(indice) {
    const confirmou = confirm("Deseja excluir este local?");

    if (confirmou) {
        locais.splice(indice, 1);
    }

    limparFormulario();
    salvarLista("ap_locais", locais);
    listarLocais();
}

//limpar o form
function limparFormulario() {
    formulario.reset();
    indiceEdicao = null;

    campoNome.classList.remove("is-invalid");
    campoBloco.classList.remove("is-invalid");
    erroNome.textContent = "";
    erroBloco.textContent = "";

    botaoSalvar.textContent = "Cadastrar";
    botaoCancelar.hidden = true;
}

botaoCancelar.addEventListener("click", limparFormulario);

listarLocais();
