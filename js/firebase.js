// firebase.js — COMPAT (v10)

const firebaseConfig = {
  apiKey: "AIzaSyD8Y8OnwYUt9eKjl-LMqlJqGzUOHZMV-I8",
  authDomain: "bolao-the-oscar-goes-to.firebaseapp.com",
  projectId: "bolao-the-oscar-goes-to",
  storageBucket: "bolao-the-oscar-goes-to.firebasestorage.app",
  messagingSenderId: "891811504511",
  appId: "1:891811504511:web:30c37a80b57befe88b3a4a"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Serviços globais
const auth = firebase.auth();
const db = firebase.firestore();

// 🔥 deixa GLOBAL
window.auth = auth;
window.db = db;
window.firebase = firebase;

console.log("🔥 Firebase COMPAT inicializado com sucesso");
