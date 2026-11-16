const botaoTema = document.querySelector("#btn-tema");

function aplicarTema(tema) {
    document.documentElement.setAttribute("data-bs-theme", tema);
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
    const temaAtual = document.documentElement.getAttribute("data-bs-theme");

    if (temaAtual === "dark") {
        aplicarTema("light");
    } else {
        aplicarTema("dark");
    }
});