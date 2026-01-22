
const firebaseConfig = {
    apiKey: "AIzaSyC_nj0WECPgFKM_ewW9pN6wt4cQziWyUbE",
    authDomain: "bolaotheoscargoesto.firebaseapp.com",
    projectId: "bolaotheoscargoesto",
    storageBucket: "bolaotheoscargoesto.firebasestorage.app",
    messagingSenderId: "101341541301",
    appId: "1:101341541301:web:f63ebffd5e3ef965eedffc",
    measurementId: "G-FNBVFPH74N"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);


// Exportar os serviços
const auth = firebase.auth();
const db = firebase.firestore();

 console.log("Firebase v10 conectado!");