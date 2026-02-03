/**
 * Checkout Module - Integração com Hotmart
 * Gerencia o fluxo de checkout e trial de assinaturas
 */

import { auth, db, doc, setDoc, updateDoc, serverTimestamp } from './firebase-config.js';

export class CheckoutManager {
    constructor() {
        this.hotmartUrls = {
            school: 'https://pay.hotmart.com/XXXXXXX?off=izicode-school',
            enterprise: 'https://pay.hotmart.com/XXXXXXX?off=izicode-enterprise'
        };
    }

    /**
     * Inicia trial de 14 dias para o plano especificado
     */
    async startTrial(plan) {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('Usuário não autenticado');
        }

        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 14);

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                'subscription.plan': plan,
                'subscription.status': 'trial',
                'subscription.trialStartedAt': new Date().toISOString(),
                'subscription.trialEndsAt': trialEndsAt.toISOString(),
                'subscription.updatedAt': serverTimestamp()
            });

            console.log(`Trial de 14 dias iniciado para o plano ${plan}`);
            return true;
        } catch (error) {
            console.error('Erro ao iniciar trial:', error);
            throw error;
        }
    }

    /**
     * Redireciona para checkout do Hotmart
     */
    redirectToCheckout(plan) {
        const user = auth.currentUser;
        if (!user) {
            alert('Você precisa estar logado para continuar.');
            window.location.href = 'login.html';
            return;
        }

        // Construir URL com parâmetros do usuário
        const checkoutUrl = new URL(this.hotmartUrls[plan]);
        checkoutUrl.searchParams.append('email', user.email);
        checkoutUrl.searchParams.append('name', user.displayName || '');
        checkoutUrl.searchParams.append('uid', user.uid);

        // Redirecionar
        window.location.href = checkoutUrl.toString();
    }

    /**
     * Inicia trial e mostra confirmação
     */
    async startTrialWithConfirmation(plan) {
        try {
            await this.startTrial(plan);

            // Mostrar modal de sucesso
            this.showTrialSuccessModal(plan);
        } catch (error) {
            alert('Erro ao iniciar trial. Tente novamente.');
        }
    }

    showTrialSuccessModal(plan) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
                <div class="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 class="font-display text-3xl font-bold text-slate-900 mb-4">Trial Ativado! 🎉</h2>
                <p class="text-slate-600 mb-6">
                    Você tem <strong>14 dias grátis</strong> para explorar todos os recursos do plano <strong>${plan.toUpperCase()}</strong>.
                </p>
                <p class="text-sm text-slate-500 mb-8">
                    Após o período de trial, você poderá adicionar um método de pagamento ou continuar no plano Free.
                </p>
                <button onclick="window.location.href='dashboard.html'" class="w-full bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">
                    Ir para Dashboard
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /**
     * Verifica status da assinatura e mostra alertas se necessário
     */
    async checkSubscriptionStatus() {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return;

            const subscription = userSnap.data().subscription;
            if (!subscription) return;

            // Verificar se trial está próximo do fim (3 dias)
            if (subscription.status === 'trial' && subscription.trialEndsAt) {
                const trialEnd = new Date(subscription.trialEndsAt);
                const now = new Date();
                const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));

                if (daysLeft <= 3 && daysLeft > 0) {
                    this.showTrialEndingWarning(daysLeft, subscription.plan);
                }
            }
        } catch (error) {
            console.error('Erro ao verificar status da assinatura:', error);
        }
    }

    showTrialEndingWarning(daysLeft, plan) {
        const banner = document.createElement('div');
        banner.className = 'fixed top-20 left-0 right-0 bg-amber-500 text-white px-4 py-3 shadow-lg z-40';
        banner.innerHTML = `
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <p class="font-medium">
                    ⏰ Seu trial termina em <strong>${daysLeft} dia${daysLeft > 1 ? 's' : ''}</strong>. 
                    Adicione um método de pagamento para continuar com o plano ${plan.toUpperCase()}.
                </p>
                <button onclick="window.location.href='pricing.html'" class="bg-white text-amber-600 px-4 py-2 rounded-lg font-bold hover:bg-amber-50 transition-colors">
                    Assinar Agora
                </button>
            </div>
        `;
        document.body.appendChild(banner);
    }
}

// Expor globalmente
window.checkoutManager = new CheckoutManager();

// Verificar status ao carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.checkoutManager.checkSubscriptionStatus();
    });
} else {
    window.checkoutManager.checkSubscriptionStatus();
}
