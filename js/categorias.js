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

  const snap = await db
    .collection("categorias")
    .where("ativa", "==", true)
    .get();

  lista.innerHTML = "";

  snap.forEach(doc => {
    const cat = doc.data();

    lista.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin-bottom:8px">
        <strong>${cat.nome}</strong><br>
        Peso: ${cat.peso}
      </div>
    `;
  });
});
