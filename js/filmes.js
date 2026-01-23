const tabela = document.getElementById("filmesTabela");
const salvarBtn = document.getElementById("salvarFilmes");
const msg = document.getElementById("filmesMsg");
const vistosEl = document.getElementById("vistos");
const faltamEl = document.getElementById("faltam");
const ordemSelect = document.getElementById("ordem");

let filmesUsuario = {};
let filmesArray = [];
let alterado = false;

auth.onAuthStateChanged(async (user) => {
  if (!user) return;
  const uid = user.uid;

  try {
    // 1️⃣ Pega todos os filmes
    const filmesSnap = await db.collection("filmes").get();
    filmesArray = filmesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 2️⃣ Inicializa userMovies se não existir
    const userSnap = await db.collection("userMovies").where("uid", "==", uid).get();
    if (userSnap.empty) {
      const batch = db.batch();
      filmesArray.forEach(filme => {
        const ref = db.collection("userMovies").doc(`${uid}_${filme.id}`);
        batch.set(ref, { uid, movieId: filme.id, visto: false });
      });
      await batch.commit();
    }

    // 3️⃣ Carrega filmes vistos
    const userSnapAtual = await db.collection("userMovies").where("uid", "==", uid).get();
    filmesUsuario = {};
    userSnapAtual.forEach(doc => filmesUsuario[doc.data().movieId] = doc.data().visto);

    // 4️⃣ Renderiza tabela
    renderizarTabela();

  } catch (err) {
    console.error("Erro ao carregar filmes:", err);
    tabela.innerHTML = `<tr><td colspan="4" style="color:red;">Erro ao carregar filmes: ${err}</td></tr>`;
  }
});

function renderizarTabela() {
  tabela.innerHTML = "";
  let vistos = 0;

  // Ordena
  let filmesOrdenados = [...filmesArray];
  const criterio = ordemSelect.value;
  if (criterio === "alfabetica") filmesOrdenados.sort((a,b)=> a.titulo.localeCompare(b.titulo));
  if (criterio === "indicacoes") filmesOrdenados.sort((a,b)=> (b.categorias?.length || 0) - (a.categorias?.length || 0));

  filmesOrdenados.forEach(filme => {
    const movieId = filme.id;
    const visto = filmesUsuario[movieId] || false;
    if (visto) vistos++;

    tabela.innerHTML += `
      <tr class="${visto ? 'visto' : ''}">
        <td>${filme.titulo}</td>
        <td>${filme.categorias?.length || 0}</td>
        <td>
          <select data-id="${movieId}">
            <option value="false" ${!visto ? "selected" : ""}>Não</option>
            <option value="true" ${visto ? "selected" : ""}>Sim</option>
          </select>
        </td>
        <td>${filme.plataformas?.join(", ") || ""}</td>
      </tr>
    `;
  });

  atualizarContadores(vistos, filmesOrdenados.length);

  // 🔹 EVENTO de mudança do select
  document.querySelectorAll("select[data-id]").forEach(select => {
    select.addEventListener("change", (e) => {
      const movieId = e.target.dataset.id;
      filmesUsuario[movieId] = e.target.value === "true";
      atualizarContadores(Object.values(filmesUsuario).filter(v=>v).length, filmesArray.length);
      alterado = true;
    });
  });
}

function atualizarContadores(vistos, total) {
  vistosEl.textContent = vistos;
  faltamEl.textContent = total - vistos;
}

ordemSelect.addEventListener("change", renderizarTabela);

salvarBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  const uid = user.uid;

  const batch = db.batch();
  Object.entries(filmesUsuario).forEach(([movieId, visto]) => {
    const ref = db.collection("userMovies").doc(`${uid}_${movieId}`);
    batch.set(ref, { uid, movieId, visto });
  });

  await batch.commit();
  alterado = false;
  msg.style.color = "green";
  msg.textContent = "Filmes salvos com sucesso!";
});
