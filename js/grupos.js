console.log("🔥 grupos.js carregado");

const btnCriarGrupo = document.getElementById("btnCriarGrupo");
const btnEntrarGrupo = document.getElementById("btnEntrarGrupo");
const erroGrupo = document.getElementById("erroGrupo");
const listaGrupos = document.getElementById("listaGrupos");

/* =========================
   🔹 BUSCAR NOMES DE USUÁRIOS
========================= */
async function buscarNomesUsuarios(uids) {
  const nomes = {};
  const promises = uids.map(async uid => {
    const snap = await db.collection("users").doc(uid).get();
    nomes[uid] = snap.exists ? snap.data().nome : uid;
  });
  await Promise.all(promises);
  return nomes;
}

/* =========================
   🔹 CARREGAR GRUPOS DO USUÁRIO
========================= */
async function carregarGrupos() {
  const user = auth.currentUser;
  if (!user) return;

  listaGrupos.innerHTML = "";

  try {
    const snap = await db
      .collection("grupos")
      .where(`membros.${user.uid}`, "==", true)
      .get();

    if (snap.empty) {
      listaGrupos.innerHTML = "<p>Você não participa de nenhum grupo.</p>";
      return;
    }

    for (const doc of snap.docs) {
      const grupo = doc.data();
      const isGestor = grupo.criador === user.uid;

      const nomesUsuarios = await buscarNomesUsuarios(Object.keys(grupo.membros));

      listaGrupos.innerHTML += `
        <div class="card">
          <strong>${grupo.nome}</strong><br>
          Código: ${doc.id}<br><br>

          <button onclick="sairDoGrupo('${doc.id}', ${isGestor})">
            Sair do grupo
          </button>

          ${isGestor ? `
            <hr>
            <strong>Membros</strong>
            <ul>
              ${Object.keys(grupo.membros).map(uid => `
                <li>
                  ${nomesUsuarios[uid]} ${uid === user.uid ? "(você)" : `<button onclick="removerMembro('${doc.id}', '${uid}')">Remover</button>`}
                </li>
              `).join("")}
            </ul>
          ` : ""}
        </div>
      `;
    }

  } catch (e) {
    console.error("❌ Erro ao carregar grupos:", e);
    listaGrupos.innerHTML = "<p>Erro ao carregar grupos.</p>";
  }
}

/* =========================
   🔹 CRIAR GRUPO
========================= */
btnCriarGrupo.addEventListener("click", async () => {
  const nome = document.getElementById("nomeGrupo").value.trim();
  if (!nome) return alert("Informe o nome do grupo");

  const user = auth.currentUser;
  if (!user) return;

  try {
    const ref = await db.collection("grupos").add({
      nome,
      criador: user.uid,
      membros: { [user.uid]: true },
      criadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert(`Grupo criado!\nCódigo: ${ref.id}`);
    document.getElementById("nomeGrupo").value = "";
    carregarGrupos();
  } catch (e) {
    console.error("❌ Erro ao criar grupo:", e);
  }
});

/* =========================
   🔹 ENTRAR EM GRUPO
========================= */
btnEntrarGrupo.addEventListener("click", async () => {
  const codigo = document.getElementById("codigoGrupo").value.trim();
  erroGrupo.textContent = "";

  if (!codigo) {
    erroGrupo.textContent = "Informe o código do grupo.";
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  try {
    const ref = db.collection("grupos").doc(codigo);
    const snap = await ref.get();

    if (!snap.exists) {
      erroGrupo.textContent = "Grupo não encontrado.";
      return;
    }

    const grupo = snap.data();

    if (grupo.membros[user.uid]) {
      erroGrupo.textContent = "Você já está nesse grupo.";
      return;
    }

    await ref.update({
      [`membros.${user.uid}`]: true
    });

    alert("Você entrou no grupo!");
    document.getElementById("codigoGrupo").value = "";
    carregarGrupos();

  } catch (e) {
    console.error("❌ Erro ao entrar no grupo:", e);
    erroGrupo.textContent = "Erro ao entrar no grupo.";
  }
});

/* =========================
   🔹 SAIR DO GRUPO
========================= */
window.sairDoGrupo = async function(grupoId, isGestor) {
  const user = auth.currentUser;
  if (!user) return;

  if (isGestor) {
    alert("O gestor não pode sair do grupo.");
    return;
  }

  const confirmar = confirm("Tem certeza que deseja sair do grupo?");
  if (!confirmar) return;

  try {
    await db.collection("grupos").doc(grupoId).update({
      [`membros.${user.uid}`]: firebase.firestore.FieldValue.delete()
    });
    carregarGrupos();
  } catch (e) {
    console.error("❌ Erro ao sair do grupo:", e);
  }
};

/* =========================
   🔹 REMOVER MEMBRO (GESTOR)
========================= */
window.removerMembro = async function(grupoId, membroId) {
  const confirmar = confirm("Remover este membro do grupo?");
  if (!confirmar) return;

  try {
    await db.collection("grupos").doc(grupoId).update({
      [`membros.${membroId}`]: firebase.firestore.FieldValue.delete()
    });
    carregarGrupos();
  } catch (e) {
    console.error("❌ Erro ao remover membro:", e);
  }
};

/* =========================
   🔹 INICIALIZAÇÃO
========================= */
auth.onAuthStateChanged(user => {
  if (user) carregarGrupos();
});
