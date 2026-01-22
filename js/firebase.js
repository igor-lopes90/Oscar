// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD8Y8OnwYUt9eKjl-LMqlJqGzUOHZMV-I8",
  authDomain: "bolao-the-oscar-goes-to.firebaseapp.com",
  projectId: "bolao-the-oscar-goes-to",
  storageBucket: "bolao-the-oscar-goes-to.firebasestorage.app",
  messagingSenderId: "891811504511",
  appId: "1:891811504511:web:30c37a80b57befe88b3a4a"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Serviços que vamos usar no projeto
const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase inicializado com sucesso 🔥");