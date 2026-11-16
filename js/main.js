const botaoTema = document.querySelector("#btn-tema");

function aplicarTema(tema) {
    //o data-bs-theme no body liga o modo escuro do Bootstrap
    document.body.dataset.bsTheme = tema;
    localStorage.setItem("ap_tema", tema);

    if (tema === "dark") {
        botaoTema.textContent = "Modo claro";
    } else {
        botaoTema.textContent = "Modo escuro";
    }
}

let temaSalvo = localStorage.getItem("ap_tema");
if (temaSalvo === null) {
    temaSalvo = "light";
}
aplicarTema(temaSalvo);

botaoTema.addEventListener("click", function () {
    const temaAtual = document.body.dataset.bsTheme;

    if (temaAtual === "dark") {
        aplicarTema("light");
    } else {
        aplicarTema("dark");
    }
});