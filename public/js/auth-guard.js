/**
 * Auth Guard - Proteção de Rotas e Gestão de Sessão
 * Verifica se o usuário está logado e tem permissão para acessar a página.
 */

import { auth, db, doc, getDoc, onAuthStateChanged, signOut } from './firebase-config.js';

// Lista de páginas públicas que não precisam de auth
const PUBLIC_PAGES = ['index.html', 'login.html', 'shop-kit.html', 'platform-dev.html'];

// Configuração de papéis permitidos para esta área (pode ser customizado por página se necessário)
const ALLOWED_ROLES = ['admin', 'teacher', 'school_admin'];
const ALLOWED_STATUS = ['approved', 'active'];

class AuthGuard {
    constructor() {
        this.init();
    }

    init() {
        // Exibir loading inicial se existir um elemento de loader na página
        this.toggleLoader(true);

        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                this.handleUnauthenticated();
                return;
            }

            try {
                // Verificar permissões no Firestore
                const hasAccess = await this.checkUserPermissions(user);

                if (hasAccess) {
                    this.handleAuthorized(user);
                } else {
                    this.handleUnauthorized();
                }
            } catch (error) {
                console.error("Erro na verificação de auth:", error);
                // Em caso de erro crítico, talvez redirecionar para login ou mostrar erro
                this.handleUnauthenticated();
            } finally {
                this.toggleLoader(false);
            }
        });
    }

    async checkUserPermissions(user) {
        // 1. Tentar buscar na coleção users (Aprovados)
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();

            // Verificar status ou role
            if (ALLOWED_STATUS.includes(userData.status) ||
                ALLOWED_ROLES.includes(userData.role)) {

                // Armazenar dados basicos na sessão para uso rápido na UI
                sessionStorage.setItem('izicode_user_role', userData.role);
                sessionStorage.setItem('izicode_user_name', userData.name);
                return true;
            }
        }

        return false;
    }

    handleUnauthenticated() {
        console.warn("Usuário não autenticado. Redirecionando...");
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (!PUBLIC_PAGES.includes(currentPage)) {
            // Salvar URL de origem para redirecionar de volta após login (futuro)
            sessionStorage.setItem('redirect_after_login', window.location.href);
            window.location.href = 'login.html';
        }
    }

    handleUnauthorized() {
        console.warn("Usuário sem permissão. Redirecionando para lista de espera...");
        window.location.href = 'platform-dev.html';
    }

    handleAuthorized(user) {
        console.log("Acesso autorizado para:", user.email);

        // Atualizar UI com dados do usuário se existirem elementos placeholders
        this.updateUserUI(user);

        // Setup Logout se existir botão
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    updateUserUI(user) {
        // Nome do usuário
        const userNameEls = document.querySelectorAll('.user-name-display');
        userNameEls.forEach(el => {
            el.textContent = user.displayName || sessionStorage.getItem('izicode_user_name') || 'Usuário';
        });

        // Foto do usuário
        const userAvatarEls = document.querySelectorAll('.user-avatar-display');
        userAvatarEls.forEach(el => {
            if (user.photoURL) el.src = user.photoURL;
        });
    }

    async logout() {
        try {
            await signOut(auth);
            sessionStorage.clear();
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    }

    toggleLoader(show) {
        const loader = document.getElementById('page-loader');
        if (loader) {
            if (show) loader.classList.remove('hidden');
            else loader.classList.add('hidden');
        }
    }
}

// Inicializar Guard globalmente
window.authGuard = new AuthGuard();
