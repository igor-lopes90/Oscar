console.log("🔥 bolao.js carregado");

// ====== ELEMENTOS ======
const grupoSelect = document.getElementById("grupoSelect");
const areaPalpites = document.getElementById("areaPalpites");
const salvarBtn = document.getElementById("salvarPalpites");
const msgPalpite = document.getElementById("msgPalpite");

let grupoAtual = null;
let palpites = {};

// ====== DATA LIMITE ======
const DATA_LIMITE = new Date("2026-03-15T15:00:00-03:00");

function prazoEncerrado() {
  return new Date() >= DATA_LIMITE;
}

// ====== CATEGORIAS FIXAS ======
const categoriasFixas = [
  "Melhor Filme",
  "Ator",
  "Atriz",
  "Direção",
  "Canção Original",
  "Fotografia",
  "Efeitos Visuais",
  "Animação",
  "Som",
  "Montagem",
  "Documentário",
  "Direção de Arte",
  "Filme Internacional",
  "Figurino",
  "Seleção de Elenco",
  "Ator Coadjuvante",
  "Roteiro Original",
  "Roteiro Adaptado",
  "Trilha Sonora Original",
  "Atriz Coadjuvante",
  "Maquiagem e Cabelo",
  "Curta-metragem com Atores",
  "Animação de curta-metragem"
];

// categorias com pessoas
const categoriasPessoa = [
  "Ator",
  "Atriz",
  "Ator Coadjuvante",
  "Atriz Coadjuvante",
  "Direção",
  "Canção Original"
];

// ====== GRUPOS ======
async function carregarGruposBolao() {
  const user = auth.currentUser;
  if (!user) return;

  grupoSelect.innerHTML = `<option>Carregando...</option>`;

  const snap = await db
    .collection("grupos")
    .where(`membros.${user.uid}`, "==", true)
    .get();

  grupoSelect.innerHTML = `<option value="">Selecione o grupo</option>`;

  snap.forEach(doc => {
    grupoSelect.innerHTML += `<option value="${doc.id}">${doc.data().nome}</option>`;
  });
}

document.querySelector('[data-page="bolao"]').addEventListener("click", carregarGruposBolao);

// ====== SELEÇÃO DE GRUPO ======
grupoSelect.addEventListener("change", async e => {
  grupoAtual = e.target.value;
  areaPalpites.innerHTML = "";
  palpites = {};
  msgPalpite.textContent = "";

  if (!grupoAtual) return;

  const user = auth.currentUser;

  const filmesSnap = await db
    .collection("filmes")
    .where("ativo", "==", true)
    .get();

  const palpiteRef = db.collection("palpites").doc(`${grupoAtual}_${user.uid}`);
  const palpiteSnap = await palpiteRef.get();
  if (palpiteSnap.exists) palpites = palpiteSnap.data().palpites || {};

  categoriasFixas.forEach(categoriaNome => {
    let options = `<option value="">Selecione</option>`;

    filmesSnap.forEach(filmeDoc => {
      const filme = filmeDoc.data();
      if (!filme.categorias) return;

      filme.categorias.forEach(cat => {

        const nomeCategoria =
          typeof cat === "string" ? cat : cat.nome;

        // ===== CATEGORIAS COM PESSOAS =====
        if (
          nomeCategoria === categoriaNome &&
          categoriasPessoa.includes(categoriaNome)
        ) {

          // múltiplos indicados (ator coadjuvante etc)
          if (cat.indicados && Array.isArray(cat.indicados)) {
            cat.indicados.forEach(pessoa => {
              const value = `${pessoa.nome}|||${pessoa.filme}`;
              const selected = palpites[categoriaNome] === value ? "selected" : "";
              options += `<option value="${value}" ${selected}>
          ${pessoa.nome} - ${pessoa.filme}
        </option>`;
            });
          }

          // indicado único
          if (cat.indicado) {
            const value = `${cat.indicado}|||${filme.titulo}`;
            const selected = palpites[categoriaNome] === value ? "selected" : "";
            options += `<option value="${value}" ${selected}>
        ${cat.indicado} - ${filme.titulo}
      </option>`;
          }
        }

        // ===== CATEGORIAS SIMPLES (FILME PURO) =====
        if (
          nomeCategoria === categoriaNome &&
          !categoriasPessoa.includes(categoriaNome)
        ) {
          const selected =
            palpites[categoriaNome] === filme.titulo ? "selected" : "";

          options += `<option value="${filme.titulo}" ${selected}>
      ${filme.titulo}
    </option>`;
        }

      });

    });

    areaPalpites.innerHTML += `
      <div class="card">
        <strong>${categoriaNome}</strong><br>
        <select data-categoria="${categoriaNome}">
          ${options}
        </select>
      </div>
    `;
  });

  if (prazoEncerrado()) {
    msgPalpite.textContent = "⛔ Prazo encerrado";
    salvarBtn.disabled = true;
    document.querySelectorAll("select").forEach(s => s.disabled = true);
  }

  document.querySelectorAll("[data-categoria]").forEach(select => {
    select.addEventListener("change", e => {
      palpites[e.target.dataset.categoria] = e.target.value;
    });
  });
});

// ====== SALVAR ======
salvarBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user || !grupoAtual) return;

  await db.collection("palpites").doc(`${grupoAtual}_${user.uid}`).set({
    grupoId: grupoAtual,
    userId: user.uid,
    palpites,
    atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
  });

  msgPalpite.textContent = "✅ Palpites salvos com sucesso!";
});

// ====== INIT ======
auth.onAuthStateChanged(user => {
  if (user) carregarGruposBolao();
});
