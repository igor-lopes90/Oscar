
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportar os serviços
const auth = firebase.auth();
const db = firebase.firestore();