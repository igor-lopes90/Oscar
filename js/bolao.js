console.log("bolao.js carregado");

const grupoSelect = document.getElementById("grupoSelect");

// =============================
// CARREGAR GRUPOS DO USUÁRIO
// =============================
async function carregarGruposBolao() {
  console.log("Tentando carregar grupos...");

  const user = auth.currentUser;
  if (!user) {
    console.log("Usuário não logado");
    return;
  }

  console.log("UID:", user.uid);

  grupoSelect.innerHTML = `<option>Carregando...</option>`;

  try {
    const snap = await db
      .collection("grupos")
      .where(`membros.${user.uid}`, "==", true)
      .get();

    console.log("Quantidade de grupos encontrados:", snap.size);

    grupoSelect.innerHTML = `<option value="">Selecione o grupo</option>`;

    snap.forEach(doc => {
      console.log("Grupo encontrado:", doc.id, doc.data());

      grupoSelect.innerHTML += `
        <option value="${doc.id}">
          ${doc.data().nome}
        </option>
      `;
    });

    if (snap.empty) {
      grupoSelect.innerHTML += `<option>Nenhum grupo encontrado</option>`;
    }

  } catch (e) {
    console.error("Erro ao carregar grupos:", e);
  }
}

// =============================
// EVENTO DE SELEÇÃO DO GRUPO
// =============================
grupoSelect.addEventListener("change", () => {
  console.log("🔥 Grupo selecionado:", grupoSelect.value);

  if (grupoSelect.value) {
    document.getElementById("areaPalpites").style.display = "block";
  } else {
    document.getElementById("areaPalpites").style.display = "none";
  }
});

// =============================
// CHAMADA AUTOMÁTICA
// =============================
setTimeout(() => {
  carregarGruposBolao();
}, 2000);
