const categoriasTabela = document.getElementById("categoriasTabela");
const categoriaFiltro = document.getElementById("categoriaFiltro");

let filmesSnap = [];      // todos os filmes ativos
let filmesUsuario = {};   // filmes já vistos do usuário
let categoriasDB = [];    // categorias carregadas do Firebase

auth.onAuthStateChanged(async (user) => {
  if (!user) return;
  const uid = user.uid;

  try {
    // 1️⃣ Buscar categorias do Firebase e popular o select
    const categoriasSnap = await db.collection("categorias").get();
    categoriasDB = categoriasSnap.docs.map(doc => doc.data().nome);

    categoriaFiltro.innerHTML = `<option value="">Todas</option>` +
      categoriasDB.map(cat => `<option value="${cat}">${cat}</option>`).join("");

    // 2️⃣ Buscar filmes ativos
    const filmesSnapshot = await db.collection("filmes")
      .where("ativo", "==", true)
      .get();
    filmesSnap = filmesSnapshot.docs;

    // 3️⃣ Buscar filmes vistos pelo usuário
    const userSnap = await db.collection("userMovies")
      .where("uid", "==", uid)
      .get();
    filmesUsuario = {};
    userSnap.forEach(doc => filmesUsuario[doc.data().movieId] = doc.data().visto);

    // 4️⃣ Renderizar tabela
    atualizarTabela();

  } catch (err) {
    categoriasTabela.innerHTML = `<tr><td colspan="3" style="color:red;">Erro: ${err}</td></tr>`;
    console.error(err);
  }
});

categoriaFiltro.addEventListener("change", atualizarTabela);

function atualizarTabela() {
  const selecionada = categoriaFiltro.value;
  categoriasTabela.innerHTML = "";
  let temFilme = false;

  filmesSnap.forEach(filmeDoc => {
    const filme = filmeDoc.data();
    const visto = filmesUsuario[filmeDoc.id] || false;

    // só exibe se a categoria do select estiver dentro do array de categorias do filme
    if (selecionada !== "" && !filme.categorias.includes(selecionada)) return;

    categoriasTabela.innerHTML += `
      <tr>
        <td>${filme.titulo}</td>
        <td>${visto ? "Sim" : "Não"}</td>
        <td>Não Ganha</td>
      </tr>
    `;
    temFilme = true;
  });

  if (!temFilme) {
    categoriasTabela.innerHTML = `<tr><td colspan="3">Nenhum filme nesta categoria.</td></tr>`;
  }
}
