console.log("🔥 bolao.js carregado");

let bolaoInicializado = false;

function initBolao() {
  if (!document.getElementById("grupoSelect")) {
    console.warn("Bolão ainda não disponível no DOM");
    return;
  }

  if (bolaoInicializado) return;
  bolaoInicializado = true;

  console.log("🚀 Inicializando Bolão");

  // ====== ELEMENTOS ======
  const grupoSelect = document.getElementById("grupoSelect");
  const areaPalpites = document.getElementById("areaPalpites");
  const salvarBtn = document.getElementById("salvarPalpites");
  const msgPalpite = document.getElementById("msgPalpite");
  let grupoAtual = null;
  let palpites = {};

  // ====== DATA LIMITE ======
  // 15/03/2026 às 17h (Brasil UTC-3) = 20h UTC
  const DATA_LIMITE = new Date(Date.UTC(2026, 2, 15, 20, 0, 0));

  function prazoEncerrado() {
    return new Date() >= DATA_LIMITE;
  }

  // ====== CATEGORIAS FIXAS ======
  const categoriasFixas = [
    "Animação", "Animação de curta-metragem", "Ator", "Ator Coadjuvante", "Atriz", "Atriz Coadjuvante",
    "Canção Original", "Curta-metragem com Atores", "Direção", "Direção de Arte", "Documentário",
    "Documentário em Curta-Metragem", "Efeitos Visuais", "Figurino", "Filme Internacional", "Fotografia",
    "Maquiagem e Cabelo", "Melhor Filme", "Montagem", "Roteiro Adaptado", "Roteiro Original",
    "Seleção de Elenco", "Som", "Trilha Sonora Original"
  ];

  const categoriasPessoa = [
    "Ator", "Atriz", "Ator Coadjuvante", "Atriz Coadjuvante", "Direção", "Canção Original"
  ];

  // ====== CARREGAR GRUPOS ======
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

  document.querySelector('[data-page="bolao"]')?.addEventListener("click", carregarGruposBolao);

  // ====== SELEÇÃO DE GRUPO ======
  let palpiteUnsubscribe = null;

  grupoSelect.addEventListener("change", async e => {
    grupoAtual = e.target.value;
    areaPalpites.innerHTML = "";
    palpites = {};
    msgPalpite.textContent = "";

    if (palpiteUnsubscribe) palpiteUnsubscribe(); // remove listener anterior
    if (!grupoAtual) return;

    const user = auth.currentUser;

    const filmesSnap = await db.collection("filmes").where("ativo", "==", true).get();

    categoriasFixas.forEach(categoriaNome => {
      let options = `<option value="">Selecione</option>`;

      filmesSnap.forEach(filmeDoc => {
        const filme = filmeDoc.data();
        if (!filme.categorias) return;

        filme.categorias.forEach(cat => {
          const nomeCategoria = typeof cat === "string" ? cat : cat.nome;

          // ===== CATEGORIAS COM PESSOAS =====
          if (nomeCategoria === categoriaNome && categoriasPessoa.includes(categoriaNome)) {
            if (cat.indicados && Array.isArray(cat.indicados)) {
              cat.indicados.forEach(pessoa => {
                const value = `${pessoa.nome}|||${pessoa.filme}`;
                options += `<option value="${value}">${pessoa.nome} - ${pessoa.filme}</option>`;
              });
            }
            if (cat.indicado) {
              const value = `${cat.indicado}|||${filme.titulo}`;
              options += `<option value="${value}">${cat.indicado} - ${filme.titulo}</option>`;
            }
          }

          // ===== CATEGORIAS SIMPLES =====
          if (nomeCategoria === categoriaNome && !categoriasPessoa.includes(categoriaNome)) {
            options += `<option value="${filme.titulo}">${filme.titulo}</option>`;
          }
        });
      });

      const peso = PESOS[categoriaNome] || 0;

      areaPalpites.innerHTML += `
        <div class="card">
          <strong>
            ${categoriaNome} <span class="peso">(Peso ${peso})</span>
          </strong><br>
          <select data-categoria="${categoriaNome}">${options}</select>
        </div>
      `;

    });

    if (prazoEncerrado()) {
      msgPalpite.textContent =
        "⛔ Prazo encerrado em " + DATA_LIMITE.toLocaleString();

      salvarBtn.disabled = true;
      document.querySelectorAll("select").forEach(s => s.disabled = true);
    }

    // ====== LISTENER FIRESTORE ======
    const palpiteRef = db.collection("palpites").doc(`${grupoAtual}_${user.uid}`);
    palpiteUnsubscribe = palpiteRef.onSnapshot(snapshot => {
      palpites = snapshot.exists ? snapshot.data().palpites || {} : {};
      document.querySelectorAll("[data-categoria]").forEach(select => {
        const cat = select.dataset.categoria;
        if (palpites[cat] !== undefined) select.value = palpites[cat];
      });
    });

    // ====== ALTERAÇÃO LOCAL ======
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
    if (!user) return;
    carregarGruposBolao();

    if (user.uid === "83DYQaAtxaMgxznS5WDuv4xxIL23") {
      document.getElementById("processarResultados").style.display = "block";
    }
  });

  const PESOS = {
    "Animação de curta-metragem": 2, "Animação": 10, "Ator Coadjuvante": 10, "Ator": 10, "Atriz Coadjuvante": 10,
    "Atriz": 10, "Canção Original": 10, "Curta-metragem com Atores": 2, "Direção de Arte": 5, "Direção": 10,
    "Documentário": 2, "Efeitos Visuais": 5, "Figurino": 5, "Filme Internacional": 5, "Fotografia": 5,
    "Maquiagem e Cabelo": 5, "Melhor Filme": 10, "Montagem": 5, "Roteiro Adaptado": 10, "Roteiro Original": 10,
    "Seleção de Elenco": 5, "Som": 5, "Trilha Sonora Original": 10, "Documentário em Curta-Metragem": 2
  };

  document.getElementById("processarResultados")?.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;
    if (user.uid !== "83DYQaAtxaMgxznS5WDuv4xxIL23") { alert("Apenas o administrador"); return; }

    const resultadoSnap = await db.collection("resultados").doc("oscar2026").get();
    if (!resultadoSnap.exists) { alert("Resultados não encontrados"); return; }
    const resultados = resultadoSnap.data();

    const palpitesSnap = await db.collection("palpites").get();
    for (const doc of palpitesSnap.docs) {
      const { grupoId, userId, palpites } = doc.data();
      let total = 0; let detalhamento = {};

      for (const categoria in resultados) {
        const pontos = (palpites[categoria] && palpites[categoria] === resultados[categoria]) ? PESOS[categoria] || 0 : 0;
        total += pontos;
        detalhamento[categoria] = pontos;
      }

      await db.collection("pontuacoes").doc(`${grupoId}_${userId}`).set({
        grupoId, userId, pontos: total, detalhamento,
        processadoEm: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    alert("✅ Pontuações processadas!");
  });

  window.initBolao = initBolao;

}

