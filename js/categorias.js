const CATEGORIAS = {
  melhor_filme: "Melhor Filme",
  fotografia: "Fotografia",
  direcao: "Direção",
  atriz: "Atriz",
  ator: "Ator",
  efeitos_visuais: "Efeitos Visuais",
  animacao: "Animação",
  som: "Som",
  montagem: "Montagem",
  documentario: "Documentário",
  direcao_arte: "Direção de Arte",
  cancao_original: "Canção Original",
  filme_internacional: "Filme Internacional",
  figurino: "Figurino",
  selecao_elenco: "Seleção de Elenco",
  ator_coadjuvante: "Ator Coadjuvante",
  roteiro_original: "Roteiro Original",
  roteiro_adaptado: "Roteiro Adaptado",
  trilha_sonora: "Trilha Sonora Original",
  atriz_coadjuvante: "Atriz Coadjuvante",
  maquiagem_cabelo: "Maquiagem e Cabelo",
  curta_atores: "Curta-metragem com Atores",
  curta_animacao: "Animação de curta-metragem"
};

const lista = document.getElementById("listaCategorias");

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const uid = user.uid;

  try {
    // 1️⃣ Buscar categorias ativas
    const categoriasSnap = await db
      .collection("categorias")
      .where("ativa", "==", true)
      .get();

    // 2️⃣ Buscar todos os filmes ativos
    const filmesSnap = await db
      .collection("filmes")
      .where("ativo", "==", true)
      .get();

    // 3️⃣ Buscar filmes vistos pelo usuário
    const userSnap = await db
      .collection("userMovies")
      .where("uid", "==", uid)
      .get();

    // Mapear filmes vistos
    const filmesVistos = {};
    userSnap.forEach(doc => {
      filmesVistos[doc.data().movieId] = doc.data().visto;
    });

    lista.innerHTML = "";

    // 4️⃣ Para cada categoria, listar os filmes
    categoriasSnap.forEach(catDoc => {
      const categoria = catDoc.data();

      let listaFilmes = "";

      filmesSnap.forEach(filmeDoc => {
        const filme = filmeDoc.data();

        if (!filme.categorias) return;
        if (!filme.categorias.includes(categoria.nome)) return;

        const visto = filmesVistos[filmeDoc.id]
          ? "✅ Já vi"
          : "❌ Não vi";

        listaFilmes += `<li>${filme.titulo} — ${visto}</li>`;
      });

      if (!listaFilmes) {
        listaFilmes = `<li><em>Nenhum filme nesta categoria</em></li>`;
      }

      lista.innerHTML += `
        <div style="border:1px solid #ccc; padding:12px; margin-bottom:12px">
          <strong>${categoria.nome}</strong> (Peso ${categoria.peso})
          <ul style="margin-top:8px">
            ${listaFilmes}
          </ul>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    lista.innerHTML = "<p style='color:red'>Erro ao carregar categorias.</p>";
  }
});
