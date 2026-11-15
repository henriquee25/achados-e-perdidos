function carregarLista(chave) {
    return JSON.parse(localStorage.getItem(chave)) || [];
}
    

function salvarLista(chave, lista) {
    localStorage.setItem(chave, JSON.stringify(lista));
}