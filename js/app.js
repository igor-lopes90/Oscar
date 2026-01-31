console.log("📱 app.js carregado");

// ====== MENU LATERAL ======
const menuItems = document.querySelectorAll(".sidebar [data-page]");
const pages = document.querySelectorAll(".page");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const targetPage = item.dataset.page;
    if (!targetPage) return; // evita botões sem página

    // ativa menu
    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    // ativa página
    pages.forEach(p => p.classList.remove("active"));
    const page = document.getElementById(targetPage);
    if (page) page.classList.add("active");

    // inicializa bolão se for a página
    if (targetPage === "bolao" && window.initBolao) {
      window.initBolao();
    }

    // inicializa ranking se for a página
    if (targetPage === "ranking" && window.initRanking) {
      window.initRanking();
    }
  });
});

// ====== INICIALIZAÇÃO AUTOMÁTICA (opcional) ======
// ativa primeira página automaticamente
const primeiraPagina = document.querySelector(".sidebar [data-page]");
if (primeiraPagina) primeiraPagina.click();


document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;

    document.querySelectorAll("[data-page-content]").forEach(sec => {
      sec.style.display = sec.dataset.pageContent === page ? "block" : "none";
    });
  });
});