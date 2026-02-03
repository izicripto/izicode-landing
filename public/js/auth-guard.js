/**
 * Auth Guard - Proteção de Rotas e Gestão de Assinatura
 * Verifica autenticação, permissões e status de assinatura do usuário.
 */

import { auth, db, doc, getDoc, onAuthStateChanged, signOut } from './firebase-config.js';

// Páginas públicas que não precisam de auth
const PUBLIC_PAGES = ['index.html', 'login.html', 'shop-kit.html', 'platform-dev.html'];

// Mapeamento de recursos por plano
const PLAN_FEATURES = {
    free: {
        maxProjects: 5,
        libraryAccess: 'limited',
        pdfExport: false,
        adminPanel: false,
        apiAccess: false,
        whiteLabel: false,
        reports: false
    },
    school: {
        maxProjects: Infinity,
        libraryAccess: 'full',
        pdfExport: true,
        adminPanel: true,
        apiAccess: false,
        whiteLabel: false,
        reports: true
    },
    enterprise: {
        maxProjects: Infinity,
        libraryAccess: 'full',
        pdfExport: true,
        adminPanel: true,
        apiAccess: true,
        whiteLabel: true,
        reports: true
    }
};

// Páginas que requerem planos específicos
const PREMIUM_PAGES = {
    'admin-panel.html': ['school', 'enterprise'],
    'reports.html': ['school', 'enterprise'],
    'api-docs.html': ['enterprise']
};

class AuthGuard {
    constructor() {
        this.currentUser = null;
        this.userData = null;
        this.subscription = null;
        this.init();
    }

    init() {
        this.toggleLoader(true);

        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                this.handleUnauthenticated();
                return;
            }

            this.currentUser = user;

            try {
                // Carregar dados do usuário e assinatura
                await this.loadUserData();

                // Verificar se tem permissão para acessar esta página
                const hasAccess = this.checkPageAccess();

                if (hasAccess) {
                    this.handleAuthorized();
                } else {
                    this.handleUnauthorized();
                }
            } catch (error) {
                console.error("Erro na verificação de auth:", error);
                this.handleUnauthenticated();
            } finally {
                this.toggleLoader(false);
            }
        });
    }

    async loadUserData() {
        try {
            const userRef = doc(db, "users", this.currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                this.userData = userSnap.data();
                this.subscription = this.userData.subscription || {
                    plan: 'free',
                    status: 'active'
                };

                // Verificar se trial expirou
                if (this.subscription.trialEndsAt) {
                    const trialEnd = new Date(this.subscription.trialEndsAt);
                    const now = new Date();

                    if (now > trialEnd && this.subscription.status === 'trial') {
                        // Trial expirado, downgrade para free
                        this.subscription.plan = 'free';
                        this.subscription.status = 'active';

                        // Atualizar no Firestore
                        await this.updateSubscription('free', 'active');
                    }
                }

                // Armazenar na sessão
                sessionStorage.setItem('izicode_user_role', this.userData.role || 'student');
                sessionStorage.setItem('izicode_user_plan', this.subscription.plan);
                sessionStorage.setItem('izicode_user_name', this.userData.name || this.currentUser.displayName);
            } else {
                // Usuário não tem documento no Firestore, criar um básico
                this.userData = {
                    name: this.currentUser.displayName,
                    email: this.currentUser.email,
                    role: 'student'
                };
                this.subscription = {
                    plan: 'free',
                    status: 'active'
                };
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
            // Fallback para dados básicos
            this.subscription = { plan: 'free', status: 'active' };
        }
    }

    async updateSubscription(plan, status) {
        try {
            const userRef = doc(db, "users", this.currentUser.uid);
            await updateDoc(userRef, {
                'subscription.plan': plan,
                'subscription.status': status,
                'subscription.updatedAt': new Date().toISOString()
            });
        } catch (error) {
            console.error("Erro ao atualizar assinatura:", error);
        }
    }

    checkPageAccess() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Páginas públicas sempre permitidas
        if (PUBLIC_PAGES.includes(currentPage)) {
            return true;
        }

        // Verificar se a página requer plano premium
        if (PREMIUM_PAGES[currentPage]) {
            const requiredPlans = PREMIUM_PAGES[currentPage];
            const userPlan = this.subscription?.plan || 'free';

            if (!requiredPlans.includes(userPlan)) {
                console.warn(`Acesso negado: ${currentPage} requer plano ${requiredPlans.join(' ou ')}`);
                return false;
            }
        }

        return true;
    }

    handleUnauthenticated() {
        console.warn("Usuário não autenticado. Redirecionando...");
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (!PUBLIC_PAGES.includes(currentPage)) {
            sessionStorage.setItem('redirect_after_login', window.location.href);
            window.location.href = 'login.html';
        }
    }

    handleUnauthorized() {
        console.warn("Usuário sem permissão para esta página.");

        // Mostrar modal de upgrade em vez de redirecionar
        this.showUpgradeModal();
    }

    handleAuthorized() {
        console.log("Acesso autorizado para:", this.currentUser.email);
        console.log("Plano:", this.subscription?.plan || 'free');

        // Atualizar UI com dados do usuário
        this.updateUserUI();

        // Injetar badge de plano
        this.injectPlanBadge();

        // Setup Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Expor funções globalmente para uso em outras páginas
        window.getUserPlan = () => this.subscription?.plan || 'free';
        window.getFeatures = () => this.getFeatures();
        window.hasFeature = (feature) => this.hasFeature(feature);
    }

    updateUserUI() {
        // Nome do usuário
        const userNameEls = document.querySelectorAll('.user-name-display');
        userNameEls.forEach(el => {
            el.textContent = this.currentUser.displayName || this.userData?.name || 'Usuário';
        });

        // Foto do usuário
        const userAvatarEls = document.querySelectorAll('.user-avatar-display');
        userAvatarEls.forEach(el => {
            if (this.currentUser.photoURL) el.src = this.currentUser.photoURL;
        });

        // Primeiro nome (para saudações)
        const firstNameEls = document.querySelectorAll('.user-first-name-display');
        const firstName = (this.currentUser.displayName || 'Usuário').split(' ')[0];
        firstNameEls.forEach(el => {
            el.textContent = firstName;
        });
    }

    injectPlanBadge() {
        const plan = this.subscription?.plan || 'free';
        const planNames = {
            free: 'Free',
            school: 'School',
            enterprise: 'Enterprise'
        };

        const planColors = {
            free: 'bg-slate-100 text-slate-700',
            school: 'bg-brand-100 text-brand-700',
            enterprise: 'bg-purple-100 text-purple-700'
        };

        // Procurar por elemento de badge de plano
        const planBadgeEl = document.getElementById('user-plan-badge');
        if (planBadgeEl) {
            planBadgeEl.textContent = planNames[plan];
            planBadgeEl.className = `text-xs px-2 py-0.5 rounded-full font-medium ${planColors[plan]}`;
        }
    }

    showUpgradeModal() {
        // Criar modal de upgrade dinamicamente
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 class="font-display text-2xl font-bold text-slate-900 mb-2">Recurso Premium</h2>
                    <p class="text-slate-600">Esta funcionalidade está disponível apenas nos planos School e Enterprise.</p>
                </div>
                <div class="space-y-3">
                    <a href="pricing.html" class="block w-full bg-brand-600 text-white text-center px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">
                        Ver Planos
                    </a>
                    <button onclick="history.back()" class="block w-full bg-slate-100 text-slate-700 text-center px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                        Voltar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    getFeatures() {
        const plan = this.subscription?.plan || 'free';
        return PLAN_FEATURES[plan] || PLAN_FEATURES.free;
    }

    hasFeature(feature) {
        const features = this.getFeatures();
        return features[feature] === true || features[feature] === 'full' || features[feature] === Infinity;
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
