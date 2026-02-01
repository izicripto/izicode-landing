import { auth, provider, signInWithPopup, db, doc, setDoc, getDoc, onAuthStateChanged } from './firebase-config.js';

const loginBtn = document.getElementById('loginBtn');

console.log("Auth script carregado");

// Função de Login
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        console.log("Botão login clicado");
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Google Login sucesso:", user.uid);
            
            // Tentar salvar no Firestore
            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: user.uid,
                        name: user.displayName,
                        email: user.email,
                        photo: user.photoURL,
                        role: "student",
                        xp: 0,
                        level: 1,
                        createdAt: new Date()
                    });
                    console.log("Usuário salvo no Firestore");
                }
            } catch (firestoreError) {
                console.error("Erro ao salvar no Firestore (pode ser permissão):", firestoreError);
                // Não bloqueia o login se o banco falhar
            }

            window.location.href = "dashboard.html";

        } catch (error) {
            console.error("Erro geral no login:", error);
            alert("Erro ao fazer login: " + error.message);
        }
    });
}

// Monitorar estado
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Estado: Logado como", user.email);
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            if (loginBtn) {
                loginBtn.innerText = "Ir para Dashboard";
                loginBtn.onclick = () => window.location.href = "dashboard.html";
            }
        }
    } else {
        console.log("Estado: Não logado");
        if (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('student-area.html')) {
            // Comentado para facilitar testes se o redirect estiver agressivo
            // window.location.href = "index.html";
        }
    }
});
