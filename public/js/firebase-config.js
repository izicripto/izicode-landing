// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp, writeBatch, Timestamp, orderBy, limit, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBhdrACOna_u_zrrqYrR3Ou5FDCO77Zp5A",
    authDomain: "izicodeedu-532ac.firebaseapp.com",
    projectId: "izicodeedu-532ac",
    storageBucket: "izicodeedu-532ac.firebasestorage.app",
    messagingSenderId: "1094181143605",
    appId: "1:1094181143605:web:cba0f1e360af9342b21d7c",
    measurementId: "G-7FZBXZXZ16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export {
    auth,
    db,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    provider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInAnonymously,
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    writeBatch,
    Timestamp,
    orderBy,
    limit,
    increment
};
