import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// 🔧 Configuração Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC_nj0WECPgFKM_ewW9pN6wt4cQziWyUbE",
    authDomain: "bolaotheoscargoesto.firebaseapp.com",
    projectId: "bolaotheoscargoesto",
    storageBucket: "bolaotheoscargoesto.firebasestorage.app",
    messagingSenderId: "101341541301",
    appId: "1:101341541301:web:f63ebffd5e3ef965eedffc",
    measurementId: "G-FNBVFPH74N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🏷️ Categorias do Oscar (exemplo)
const categorias = [
  { nome: "Melhor Filme", pontuacao: 10, indicados: ["Oppenheimer", "Barbie", "Assassinos da Lua das Flores", "Pobres Criaturas", "Zona de Interesse"] },
  { nome: "Melhor Diretor", pontuacao: 10, indicados: ["Christopher Nolan", "Greta Gerwig", "Martin Scorsese", "Yorgos Lanthimos", "Jonathan Glazer"] },
  { nome: "Melhor Ator", pontuacao: 10, indicados: ["Cillian Murphy", "Bradley Cooper", "Leonardo DiCaprio", "Paul Giamatti", "Colman Domingo"] },
  { nome: "Melhor Atriz", pontuacao: 10, indicados: ["Emma Stone", "Lily Gladstone", "Sandra Hüller", "Carey Mulligan", "Margot Robbie"] },
  { nome: "Melhor Fotografia", pontuacao: 5, indicados: ["Oppenheimer", "Pobres Criaturas", "Zona de Interesse", "Assassinos da Lua das Flores"] },
  { nome: "Melhores Efeitos Visuais", pontuacao: 5, indicados: ["Godzilla Minus One", "Guardiões da Galáxia 3", "Napoleão", "Oppenheimer"] },
  { nome: "Melhor Documentário", pontuacao: 2, indicados: ["20 Days in Mariupol", "Bobi Wine", "Four Daughters", "To Kill a Tiger"] },
  { nome: "Melhor Filme Internacional", pontuacao: 2, indicados: ["Zona de Interesse", "Perfect Days", "Sociedade da Neve", "Io Capitano"] }
];

// 🔄 Criar formulário dinamicamente
const form = document.getElementById("formPalpites");

categorias.forEach(cat => {
  const div = document.createElement("div");
  div.classList.add("categoria");
  div.innerHTML = `<h3>${cat.nome} (${cat.pontuacao} pts)</h3>`;

  cat.indicados.forEach(filme => {
    div.innerHTML += `
      <label>
        <input type="radio" name="${cat.nome}" value="${filme}">
        ${filme}
      </label><br>`;
  });

  form.appendChild(div);
});

// 🔑 Identificar o grupo e usuário
const params = new URLSearchParams(window.location.search);
const groupId = params.get("group");
const groupNameEl = document.getElementById("groupName");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Você precisa estar logado!");
    window.location.href = "login.html";
    return;
  }

  groupNameEl.textContent = `Grupo: ${groupId}`;

  const docRef = doc(db, "grupos", groupId, "palpites", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const palpites = docSnap.data();
    for (const [categoria, filme] of Object.entries(palpites)) {
      const input = form.querySelector(`input[name="${categoria}"][value="${filme}"]`);
      if (input) input.checked = true;
    }

    if (palpites.enviado) {
      desabilitarFormulario();
    } else {
      document.getElementById("btnEditar").disabled = false;
      document.getElementById("btnEnviar").disabled = false;
    }
  } else {
    document.getElementById("btnSalvar").disabled = false;
  }

  // 💾 Salvar palpites
  document.getElementById("btnSalvar").addEventListener("click", async (e) => {
    e.preventDefault();
    const palpites = coletarPalpites();
    await setDoc(docRef, palpites);
    alert("Palpites salvos com sucesso!");
    document.getElementById("btnEditar").disabled = false;
    document.getElementById("btnEnviar").disabled = false;
  });

  // ✏️ Editar palpites
  document.getElementById("btnEditar").addEventListener("click", () => {
    form.querySelectorAll("input").forEach(input => input.disabled = false);
  });

  // 📤 Enviar palpites (definitivo)
  document.getElementById("btnEnviar").addEventListener("click", async (e) => {
    e.preventDefault();
    const palpites = coletarPalpites();

    if (Object.keys(palpites).length < categorias.length) {
      alert("Você precisa preencher todas as categorias antes de enviar!");
      return;
    }

    palpites.enviado = true;
    await setDoc(docRef, palpites);
    alert("Palpites enviados! Agora não é mais possível editar.");
    desabilitarFormulario();
  });
});

function coletarPalpites() {
  const palpites = {};
  categorias.forEach(cat => {
    const selecionado = form.querySelector(`input[name="${cat.nome}"]:checked`);
    if (selecionado) palpites[cat.nome] = selecionado.value;
  });
  return palpites;
}

function desabilitarFormulario() {
  form.querySelectorAll("input").forEach(input => input.disabled = true);
  document.getElementById("btnSalvar").disabled = true;
  document.getElementById("btnEditar").disabled = true;
  document.getElementById("btnEnviar").disabled = true;
}

// 🔙 Voltar
document.getElementById("btnVoltar").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
