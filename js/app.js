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

// ====== MENU HAMBURGUER ======
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const sidebarLinks = sidebar.querySelectorAll('li, button:not(.hamburger)');

function closeMenu() {
  sidebar.classList.remove('active');
}

// abrir/fechar ao clicar no hamburger
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// fechar automaticamente ao clicar em item ou botão
sidebarLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Ajuste do conteúdo no mobile para não ficar embaixo do menu
function ajustarConteudo() {
  const content = document.querySelector('.content');
  const sidebarHeight = sidebar.offsetHeight;
  if(window.innerWidth <= 768) {
    content.style.marginTop = sidebarHeight + 'px';
  } else {
    content.style.marginTop = '0';
  }
}

// Atualiza sempre que muda tamanho da tela
window.addEventListener('resize', ajustarConteudo);
window.addEventListener('load', ajustarConteudo);