console.log("🏆 ranking.js carregado");

let rankingInicializado = false;

// ===== CRITÉRIOS DE DESEMPATE =====
const CRITERIOS_DESEMPATE = [
  "Melhor Filme",
  "Direção",
  "Atriz",
  "Ator",
  "Atriz Coadjuvante",
  "Ator Coadjuvante",
  "Animação",
  "Roteiro Original",
  "Roteiro Adaptado",
  "Canção Original",
  "Trilha Sonora Original",
  "Filme Internacional",
  "Seleção de Elenco",
  "Direção de Arte",
  "Efeitos Visuais",
  "Fotografia",
  "Figurino",
  "Maquiagem e Cabelo",
  "Montagem",
  "Som",
  "Documentário",
  "Curta-metragem com Atores",
  "Documentário em Curta-Metragem",
  "Animação de curta-metragem"
];

// ===== FUNÇÃO DE COMPARAÇÃO =====
function compararRanking(a, b) {
  // 1️⃣ Pontuação total
  if (b.pontos !== a.pontos) {
    return b.pontos - a.pontos;
  }

  // 2️⃣ Critérios de desempate
  for (const categoria of CRITERIOS_DESEMPATE) {
    const aAcertou = a.detalhamento?.[categoria] > 0 ? 1 : 0;
    const bAcertou = b.detalhamento?.[categoria] > 0 ? 1 : 0;

    if (aAcertou !== bAcertou) {
      return bAcertou - aAcertou;
    }
  }

  // 3️⃣ Empate total
  return 0;
}

function initRanking() {
  if (rankingInicializado) return;
  rankingInicializado = true;

  const grupoRanking = document.getElementById("grupoRanking");
  const listaRanking = document.getElementById("listaRanking");

  let unsubscribePontuacoes = null;

  async function carregarGruposRanking() {
    const user = auth.currentUser;
    if (!user) return;

    grupoRanking.innerHTML = `<option>Carregando...</option>`;

    const snap = await db
      .collection("grupos")
      .where(`membros.${user.uid}`, "==", true)
      .get();

    grupoRanking.innerHTML = `<option value="">Selecione o grupo</option>`;
    snap.forEach(doc => {
      grupoRanking.innerHTML += `<option value="${doc.id}">${doc.data().nome}</option>`;
    });
  }

  async function carregarUsuarios() {
    const usuarios = {};
    const snap = await db.collection("users").get();
    snap.forEach(doc => usuarios[doc.id] = doc.data().nome || "Usuário");
    return usuarios;
  }

  async function atualizarRanking(grupoId) {
    if (unsubscribePontuacoes) unsubscribePontuacoes();
    if (!grupoId) {
      listaRanking.innerHTML = "";
      return;
    }

    listaRanking.innerHTML = `<p>Carregando ranking...</p>`;

    const usuarios = await carregarUsuarios();
    const resultadosSnap = await db.collection("resultados").doc("oscar2026").get();
    const resultados = resultadosSnap.exists ? resultadosSnap.data() : {};

    const pontuacoesRef = db
      .collection("pontuacoes")
      .where("grupoId", "==", grupoId);

    unsubscribePontuacoes = pontuacoesRef.onSnapshot(async snapshot => {
      if (snapshot.empty) {
        listaRanking.innerHTML = "<p>Nenhuma pontuação encontrada.</p>";
        return;
      }

      // 🔥 MONTA ARRAY E ORDENA
      const ranking = snapshot.docs.map(doc => doc.data());
      ranking.sort(compararRanking);

      let htmlRanking = "";
      let pos = 1;

      ranking.forEach(item => {
        const nome = usuarios[item.userId] || "Usuário";
        const pontos = item.pontos;

        let classe = "ranking-default";
        if (pos === 1) classe = "ranking-1";
        else if (pos === 2) classe = "ranking-2";
        else if (pos === 3) classe = "ranking-3";

        htmlRanking += `
          <div class="ranking-card ${classe}">
            <span>${pos}º</span>
            <span>${nome}</span>
            <span>${pontos} pts</span>
          </div>
        `;
        pos++;
      });

      const comparativoHTML = await montarComparativo(grupoId, usuarios, resultados);
      listaRanking.innerHTML = htmlRanking + comparativoHTML;
    });
  }

  async function montarComparativo(grupoId, usuarios, resultados) {
    if (!Object.keys(resultados).length) return "";

    const palpitesSnap = await db
      .collection("palpites")
      .where("grupoId", "==", grupoId)
      .get();

    let html = `<div class="comparativo"><h3>🎬 Comparativo de Palpites</h3>`;

    for (const categoria in resultados) {
      const vencedor = resultados[categoria];

      html += `
        <div class="comparativo-item">
          <strong>
            ${categoria} (${PESOS[categoria] || 0} pts):
            <span class="vencedor-oficial">${vencedor}</span>
          </strong>
          <ul>
      `;

      palpitesSnap.docs.forEach(doc => {
        const { userId, palpites } = doc.data();
        const nome = usuarios[userId] || "Usuário";
        const escolha = palpites[categoria];
        if (!escolha) return;

        const acertou = escolha === vencedor;
        html += `
          <li class="${acertou ? "acerto" : "erro"}">
            ${nome} — ${escolha}
          </li>
        `;
      });

      html += `</ul></div>`;
    }

    html += `</div>`;
    return html;
  }

  grupoRanking.addEventListener("change", e => {
    atualizarRanking(e.target.value);
  });

  auth.onAuthStateChanged(user => {
    if (user) carregarGruposRanking();
  });

  window.initRanking = initRanking;
}

// ===== PESOS =====
const PESOS = {
  "Animação de curta-metragem": 2,
  "Animação": 10,
  "Ator Coadjuvante": 10,
  "Ator": 10,
  "Atriz Coadjuvante": 10,
  "Atriz": 10,
  "Canção Original": 10,
  "Curta-metragem com Atores": 2,
  "Direção de Arte": 5,
  "Direção": 10,
  "Documentário": 2,
  "Efeitos Visuais": 5,
  "Figurino": 5,
  "Filme Internacional": 5,
  "Fotografia": 5,
  "Maquiagem e Cabelo": 5,
  "Melhor Filme": 10,
  "Montagem": 5,
  "Roteiro Adaptado": 10,
  "Roteiro Original": 10,
  "Seleção de Elenco": 5,
  "Som": 5,
  "Trilha Sonora Original": 10,
  "Documentário em Curta-Metragem": 2
};
