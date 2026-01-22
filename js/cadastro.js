const cadastroForm = document.getElementById("cadastroForm");
const cadastroMsg = document.getElementById("cadastroMsg");

cadastroForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Enviar email de verificação
      user.sendEmailVerification();

      // Salvar usuário no Firestore
      return db.collection("users").doc(user.uid).set({
        nome: nome,
        email: email,
        criadoEm: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      cadastroMsg.style.color = "green";
      cadastroMsg.textContent =
        "Cadastro realizado! Verifique seu e-mail antes de fazer login.";
      cadastroForm.reset();
    })
    .catch((error) => {
      cadastroMsg.style.color = "red";
      cadastroMsg.textContent = error.message;
      console.error(error);
    });
});
