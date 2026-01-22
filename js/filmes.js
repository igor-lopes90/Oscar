const tabela = document.getElementById("filmesTabela");
const salvarBtn = document.getElementById("salvarFilmes");
const msg = document.getElementById("filmesMsg");
const vistosEl = document.getElementById("vistos");
const faltamEl = document.getElementById("faltam");
const ordemSelect = document.getElementById("ordem");

let filmesUsuario = {};
let alterado = false;

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const uid = user.uid;

  const filmesSnap = await db.collection("filmes").get();

  const userSnap = await db.collection("userMovies")
    .where("uid", "==", uid)
    .get();

  filmesUsuario = {};

  userSnap.forEach(doc => {
    filmesUsuario[doc.data().movieId] = doc.data().visto;
  });

  tabela.innerHTML = "";

  let vistos = 0;
  let total = filmesSnap.size;

  filmesSnap.forEach(doc => {
    const filme = doc.data();
    const movieId = doc.id;
    const visto = filmesUsuario[movieId] || false;

    if (visto) vistos++;

    const plataformas = filme.plataformas && filme.plataformas.length
      ? filme.plataformas.join(", ")
      : "-";

    tabela.innerHTML += `
      <tr>
        <td>${filme.titulo}</td>
        <td>${filme.categorias ? filme.categorias.length : 0}</td>
        <td>
          <select data-id="${movieId}">
            <option value="false" ${!visto ? "selected" : ""}>Não</option>
            <option value="true" ${visto ? "selected" : ""}>Sim</option>
          </select>
        </td>
        <td>${plataformas}</td>
      </tr>
    `;
  });

  atualizarContadores(vistos, total);

  document.querySelectorAll("select").forEach(select => {
    select.addEventListener("change", () => {
      alterado = true;
    });
  });
});

function atualizarContadores(vistos, total) {
  vistosEl.textContent = vistos;
  faltamEl.textContent = total - vistos;
}

// SALVAR
salvarBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  const selects = document.querySelectorAll("select");

  const batch = db.batch();
  let vistos = 0;

  selects.forEach(select => {
    const movieId = select.dataset.id;
    const visto = select.value === "true";

    if (visto) vistos++;

    const ref = db.collection("userMovies")
      .doc(`${uid}_${movieId}`);

    batch.set(ref, {
      uid,
      movieId,
      visto
    });
  });

  await batch.commit();

  atualizarContadores(vistos, selects.length);

  alterado = false;
  msg.style.color = "green";
  msg.textContent = "Filmes salvos com sucesso!";
});
