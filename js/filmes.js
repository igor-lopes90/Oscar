const tabela = document.getElementById("filmesTabela");
const salvarBtn = document.getElementById("salvarFilmes");
const msg = document.getElementById("filmesMsg");
const vistosEl = document.getElementById("vistos");
const faltamEl = document.getElementById("faltam");
const ordemSelect = document.getElementById("ordem");

let filmesUsuario = {};
let filmesArray = [];
let alterado = false;

/* =========================
   🔹 AUTH
========================= */
auth.onAuthStateChanged(async (user) => {
  if (!user) return;
  const uid = user.uid;

  try {
    const filmesSnap = await db.collection("filmes").get();
    filmesArray = filmesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const userSnap = await db
      .collection("userMovies")
      .where("uid", "==", uid)
      .get();

    if (userSnap.empty) {
      const batch = db.batch();

      filmesArray.forEach(filme => {
        const ref = db
          .collection("userMovies")
          .doc(`${uid}_${filme.id}`);

        batch.set(ref, {
          uid,
          movieId: filme.id,
          visto: false
        });
      });

      await batch.commit();
    }

    const userSnapAtual = await db
      .collection("userMovies")
      .where("uid", "==", uid)
      .get();

    filmesUsuario = {};
    userSnapAtual.forEach(doc => {
      filmesUsuario[doc.data().movieId] = doc.data().visto;
    });

    renderizarTabela();

  } catch (err) {
    console.error(err);
  }
});

/* =========================
   🔹 AUXILIARES
========================= */

function contarVistos() {
  return Object.values(filmesUsuario).filter(v => v).length;
}

function atualizarContadores(vistos, total) {
  vistosEl.textContent = vistos;
  faltamEl.textContent = total - vistos;
}

/* =========================
   🔹 TABELA
========================= */
function renderizarTabela() {
  tabela.innerHTML = "";

  let filmesOrdenados = [...filmesArray];
  const criterio = ordemSelect.value;

  if (criterio === "alfabetica") {
    filmesOrdenados.sort((a, b) =>
      a.titulo.localeCompare(b.titulo)
    );
  }

  if (criterio === "indicacoes") {
    filmesOrdenados.sort(
      (a, b) =>
        (b.categorias?.length || 0) -
        (a.categorias?.length || 0)
    );
  }

  // 🎨 CORES DAS PLATAFORMAS
  const cores = {
    "Netflix": "#e50914",
    "YouTube": "#88040b",
    "Prime": "#00a8e1",
    "Disney+": "#113ccf",
    "Apple TV": "#000000",
    "HBO Max": "#6a00ff",
    "Mubi": "#111111",
    "Cinema": "#ff8800",
    "Stremio": "#750087",
    "N/A": "#777777"
  };

  filmesOrdenados.forEach(filme => {
    const movieId = filme.id;
    const visto = filmesUsuario[movieId] || false;

    const plataforma = filme.plataforma || "N/A";
    const cor = cores[plataforma] || "#999";

    tabela.innerHTML += `
      <tr class="${visto ? "visto" : ""}" data-row="${movieId}">
        <td>${filme.titulo}</td>
        <td>${filme.categorias?.length || 0}</td>
        <td>
          <select data-id="${movieId}">
            <option value="false" ${!visto ? "selected" : ""}>Não</option>
            <option value="true" ${visto ? "selected" : ""}>Sim</option>
          </select>
        </td>
        <td style="
          background:${cor};
          color:white;
          font-weight:600;
          text-align:center;
          vertical-align:middle;
        ">
          ${plataforma}
        </td>
      </tr>
    `;
  });

  atualizarContadores(contarVistos(), filmesOrdenados.length);

  document.querySelectorAll("select[data-id]").forEach(select => {
    select.addEventListener("change", e => {
      const movieId = e.target.dataset.id;
      const vistoAgora = e.target.value === "true";
      filmesUsuario[movieId] = vistoAgora;

      const row = document.querySelector(`tr[data-row="${movieId}"]`);

      if (vistoAgora) {
        row.classList.add("visto", "novo");
        setTimeout(() => row.classList.remove("novo"), 400);
      } else {
        row.classList.remove("visto");
      }

      atualizarContadores(
        contarVistos(),
        filmesArray.length
      );

      alterado = true;
    });
  });
}

/* =========================
   🔹 EVENTOS
========================= */
ordemSelect.addEventListener("change", renderizarTabela);

salvarBtn.addEventListener("click", async () => {
  if (!alterado) return;

  const user = auth.currentUser;
  if (!user) return;
  const uid = user.uid;

  try {
    const batch = db.batch();

    Object.entries(filmesUsuario).forEach(([movieId, visto]) => {
      const ref = db
        .collection("userMovies")
        .doc(`${uid}_${movieId}`);

      batch.set(ref, {
        uid,
        movieId,
        visto
      });
    });

    await batch.commit();

    msg.style.color = "green";
    msg.textContent = "Filmes salvos com sucesso!";

    setTimeout(() => {
      location.reload();
    }, 600);

  } catch (e) {
    console.error(e);
    msg.style.color = "red";
    msg.textContent = "Erro ao salvar.";
  }
});