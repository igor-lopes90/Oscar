const btnCriarGrupo = document.getElementById("btnCriarGrupo");
const btnEntrarGrupo = document.getElementById("btnEntrarGrupo");
const erroGrupo = document.getElementById("erroGrupo");
const listaGrupos = document.getElementById("listaGrupos");

/* =========================
   🔹 CRIAR GRUPO
========================= */
btnCriarGrupo.addEventListener("click", async () => {
  const nome = document.getElementById("nomeGrupo").value.trim();
  if (!nome) return alert("Informe o nome do grupo");

  const user = auth.currentUser;
  if (!user) return;

  try {
    await db.collection("grupos").add({
      nome: nome,
      criador: user.uid,
      membros: {
        [user.uid]: true
      },
      criadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });

    document.getElementById("nomeGrupo").value = "";
    carregarGrupos();
    alert("Grupo criado com sucesso!");
  } catch (e) {
    console.error(e);
    alert("Erro ao criar grupo");
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

  const ref = db.collection("grupos").doc(codigo);
  const snap = await ref.get();

  if (!snap.exists) {
    erroGrupo.textContent = "Grupo não encontrado.";
    return;
  }

  const grupo = snap.data();

  if (grupo.membros && grupo.membros[user.uid]) {
    erroGrupo.textContent = "Você já está nesse grupo.";
    return;
  }

  await ref.update({
    [`membros.${user.uid}`]: true
  });

  document.getElementById("codigoGrupo").value = "";
  carregarGrupos();
  alert("Você entrou no grupo!");
});

/* =========================
   🔹 LISTAR GRUPOS
========================= */
async function carregarGrupos() {
  const user = auth.currentUser;
  if (!user) return;

  listaGrupos.innerHTML = "";

  const snap = await db
    .collection("grupos")
    .where(`membros.${user.uid}`, "==", true)
    .get();

  if (snap.empty) {
    listaGrupos.innerHTML = "<p>Você não participa de nenhum grupo.</p>";
    return;
  }

  snap.forEach(doc => {
    const grupo = doc.data();
    const isGestor = grupo.criador === user.uid;

    listaGrupos.innerHTML += `
      <div class="card">
        <strong>${grupo.nome}</strong><br>
        Código: ${doc.id}<br><br>

        <button onclick="sairDoGrupo('${doc.id}', ${isGestor})">
          Sair do grupo
        </button>

        ${isGestor ? renderMembros(grupo.membros, doc.id) : ""}
      </div>
    `;
  });
}

/* =========================
   🔹 RENDER MEMBROS
========================= */
function renderMembros(membros, grupoId) {
  const user = auth.currentUser;

  return `
    <hr>
    <strong>Membros</strong>
    <ul>
      ${Object.keys(membros).map(uid => `
        <li>
          ${uid === user.uid ? "Você" : uid}
          ${uid !== user.uid ? `
            <button onclick="removerMembro('${grupoId}', '${uid}')">
              Remover
            </button>
          ` : ""}
        </li>
      `).join("")}
    </ul>
  `;
}

/* =========================
   🔹 SAIR DO GRUPO
========================= */
async function sairDoGrupo(grupoId, isGestor) {
  const user = auth.currentUser;
  if (!user) return;

  if (isGestor) {
    alert("O gestor não pode sair do grupo.");
    return;
  }

  const confirmar = confirm("Deseja sair do grupo?");
  if (!confirmar) return;

  await db.collection("grupos").doc(grupoId).update({
    [`membros.${user.uid}`]: firebase.firestore.FieldValue.delete()
  });

  carregarGrupos();
}

/* =========================
   🔹 REMOVER MEMBRO
========================= */
async function removerMembro(grupoId, membroId) {
  const confirmar = confirm("Remover este membro?");
  if (!confirmar) return;

  await db.collection("grupos").doc(grupoId).update({
    [`membros.${membroId}`]: firebase.firestore.FieldValue.delete()
  });

  carregarGrupos();
}

/* =========================
   🔹 INIT
========================= */
auth.onAuthStateChanged(user => {
  if (user) carregarGrupos();
});
