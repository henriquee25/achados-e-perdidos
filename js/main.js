function aplicarTema(tema) {
    document.documentElement.setAttribute("data-bs-theme", tema);
    localStorage.setItem("ap_tema", tema);
}

aplicarTema(localStorage.getItem("ap_tema") || "light");

document.getElementById("btn-tema").addEventListener("click", function () {
    const atual = document.documentElement.getAttribute("data-bs-theme");
    aplicarTema(atual === "dark" ? "light" : "dark");
});