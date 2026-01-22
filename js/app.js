const menuItems = document.querySelectorAll(".sidebar li");
const pages = document.querySelectorAll(".page");

menuItems.forEach(item => {
  item.addEventListener("click", () => {

    // Remove ativo
    menuItems.forEach(i => i.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));

    // Ativa o clicado
    item.classList.add("active");
    document.getElementById(item.dataset.page).classList.add("active");
  });
});

window.addEventListener("beforeunload", (e) => {
  if (typeof alterado !== "undefined" && alterado) {
    e.preventDefault();
    e.returnValue = "";
  }
});