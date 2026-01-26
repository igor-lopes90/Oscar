const menuItems = document.querySelectorAll(".sidebar li");
const pages = document.querySelectorAll(".page");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    menuItems.forEach(i => i.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));

    item.classList.add("active");
    document.getElementById(item.dataset.page).classList.add("active");
  });
});
