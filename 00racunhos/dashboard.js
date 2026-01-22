import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion, 
  getDoc,
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC_nj0WECPgFKM_ewW9pN6wt4cQziWyUbE",
    authDomain: "bolaotheoscargoesto.firebaseapp.com",
    projectId: "bolaotheoscargoesto",
    storageBucket: "bolaotheoscargoesto.firebasestorage.app",
    messagingSenderId: "101341541301",
    appId: "1:101341541301:web:f63ebffd5e3ef965eedffc",
    measurementId: "G-FNBVFPH74N"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Verificar login do usuário
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("user-email").textContent = `Usuário: ${user.email}`;
    carregarGrupos(user.uid);
  } else {
    window.location.href = "index.html";
  }
});

// Criar grupo
document.getElementById("create-group").addEventListener("click", async () => {
  const groupName = document.getElementById("group-name").value.trim();
  const user = auth.currentUser;
  if (!groupName) return alert("Digite um nome para o grupo.");

  try {
    const docRef = await addDoc(collection(db, "groups"), {
      name: groupName,
      owner: user.uid,
      members: [user.uid],
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date()
    });
    document.getElementById("create-message").textContent = "✅ Grupo criado com sucesso!";
    document.getElementById("group-name").value = "";
    carregarGrupos(user.uid);
  } catch (error) {
    document.getElementById("create-message").textContent = "❌ Erro: " + error.message;
  }
});

// Entrar em grupo
document.getElementById("join-group").addEventListener("click", async () => {
  const code = document.getElementById("group-code").value.trim().toUpperCase();
  const user = auth.currentUser;
  if (!code) return alert("Digite o código do grupo.");

  const q = query(collection(db, "groups"), where("code", "==", code));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    document.getElementById("join-message").textContent = "❌ Nenhum grupo encontrado com esse código.";
    return;
  }

  const groupDoc = querySnapshot.docs[0];
  const groupRef = doc(db, "groups", groupDoc.id);

  await updateDoc(groupRef, {
    members: arrayUnion(user.uid)
  });

  document.getElementById("join-message").textContent = "✅ Você entrou no grupo!";
  document.getElementById("group-code").value = "";
  carregarGrupos(user.uid);
});

// Carregar grupos do usuário
async function carregarGrupos(uid) {
  const groupsRef = collection(db, "groups");
  const querySnapshot = await getDocs(groupsRef);
  const groupList = document.getElementById("group-list");
  groupList.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const group = doc.data();
    if (group.members.includes(uid)) {
      const li = document.createElement("li");
      li.textContent = `${group.name} — Código: ${group.code}`;
      groupList.appendChild(li);
    }
  });
}

// Logout
document.getElementById("logout").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});