const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (!user.emailVerified) {
        auth.signOut();
        loginError.textContent =
          "Confirme seu e-mail antes de fazer login.";
        return;
      }

      window.location.href = "app.html";
    })
    .catch(() => {
      loginError.textContent = "Email ou senha inválidos.";
    });
});
