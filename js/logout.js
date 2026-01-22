const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
});
