/**
 * Checkout Module - Integração com AbacatePay
 * Gerencia o fluxo de checkout de assinaturas (PIX via AbacatePay)
 */

import { auth, db, doc, setDoc, updateDoc, getDoc, serverTimestamp } from './firebase-config.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';

export class CheckoutManager {

    /**
     * Cria uma cobrança PIX na AbacatePay (via Cloud Function, que guarda a
     * API key no servidor) e redireciona o usuário para o checkout.
     * `plan` deve ser 'professor_pro' ou 'escola'; `schoolId` é obrigatório
     * apenas para o plano escola.
     */
    async redirectToCheckout(plan, schoolId = null) {
        const user = auth.currentUser;
        if (!user) {
            alert('Você precisa estar logado para continuar.');
            window.location.href = 'login.html';
            return;
        }

        try {
            const functionsInstance = getFunctions();
            const createCheckout = httpsCallable(functionsInstance, 'createAbacatePayCheckout');
            const result = await createCheckout({ plan, schoolId });
            if (result.data?.checkoutUrl) {
                window.location.href = result.data.checkoutUrl;
            } else {
                throw new Error('URL de checkout não recebida.');
            }
        } catch (error) {
            console.error('Erro ao iniciar checkout AbacatePay:', error);
            alert('Não foi possível iniciar o pagamento agora. Tente novamente em instantes.');
        }
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
