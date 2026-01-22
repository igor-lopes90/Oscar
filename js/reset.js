const resetForm = document.getElementById("resetForm");
const resetMsg = document.getElementById("resetMsg");

resetForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  auth.sendPasswordResetEmail(email)
    .then(() => {
      resetMsg.style.color = "green";
      resetMsg.textContent = "E-mail enviado! Verifique sua caixa de entrada.";
      resetForm.reset();
    })
    .catch(() => {
      resetMsg.style.color = "red";
      resetMsg.textContent = "Erro ao enviar e-mail.";
    });
});
