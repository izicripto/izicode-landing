import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions"

// Mesmo projeto usado pelas páginas legadas em public/js/firebase-config.js.
// A apiKey do Firebase é pública por natureza (fica exposta em qualquer
// app web); o que protege os dados são as regras do Firestore e a
// restrição de domínio configurada no console.
const firebaseConfig = {
  apiKey: "AIzaSyBhdrACOna_u_zrrqYrR3Ou5FDCO77Zp5A",
  authDomain: "izicodeedu-532ac.firebaseapp.com",
  projectId: "izicodeedu-532ac",
  storageBucket: "izicodeedu-532ac.firebasestorage.app",
  messagingSenderId: "1094181143605",
  appId: "1:1094181143605:web:cba0f1e360af9342b21d7c",
  measurementId: "G-7FZBXZXZ16",
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)
export const googleProvider = new GoogleAuthProvider()
