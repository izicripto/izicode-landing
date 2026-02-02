/**
 * PWA Install Manager
 * Gerencia instalação e registro do Service Worker
 */

class PWAInstallManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    async init() {
        // Registrar Service Worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service Worker registrado:', registration.scope);

                // Verificar atualizações
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('❌ Erro ao registrar Service Worker:', error);
            }
        }

        // Capturar evento de instalação
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Detectar quando o app foi instalado
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA instalado com sucesso!');
            this.hideInstallButton();
            this.showInstalledNotification();
        });
    }

    showInstallButton() {
        // Criar botão de instalação flutuante
        const installBtn = document.createElement('div');
        installBtn.id = 'pwa-install-prompt';
        installBtn.className = 'fixed bottom-6 right-6 z-50 animate-bounce';
        installBtn.innerHTML = `
      <div class="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <div>
          <div class="font-bold">Instalar App</div>
          <div class="text-xs opacity-90">Use offline e acesse mais rápido</div>
        </div>
        <button class="ml-2 hover:bg-white/20 rounded-full p-1" onclick="this.closest('#pwa-install-prompt').remove()">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    `;

        installBtn.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                this.promptInstall();
            }
        });

        document.body.appendChild(installBtn);

        // Auto-hide após 10 segundos
        setTimeout(() => {
            const prompt = document.getElementById('pwa-install-prompt');
            if (prompt) {
                prompt.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => prompt.remove(), 500);
            }
        }, 10000);
    }

    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-prompt');
        if (installBtn) {
            installBtn.remove();
        }
    }

    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('Prompt de instalação não disponível');
            return;
        }

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;

        console.log(`Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} a instalação`);

        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-6 right-6 z-50 bg-blue-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4';
        notification.innerHTML = `
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <div>
        <div class="font-bold">Atualização disponível!</div>
        <div class="text-sm">Recarregue para obter a versão mais recente</div>
      </div>
      <button onclick="location.reload()" class="ml-2 bg-white text-blue-500 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition">
        Atualizar
      </button>
    `;

        document.body.appendChild(notification);
    }

    showInstalledNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4';
        notification.innerHTML = `
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <div>
        <div class="font-bold">App instalado com sucesso!</div>
        <div class="text-sm">Agora você pode usar offline</div>
      </div>
    `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // Verificar se está rodando como PWA
    static isRunningAsPWA() {
        return window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
    }

    // Verificar suporte a PWA
    static isPWASupported() {
        return 'serviceWorker' in navigator && 'PushManager' in window;
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PWAInstallManager();
    });
} else {
    new PWAInstallManager();
}

// Exportar para uso global
window.PWAInstallManager = PWAInstallManager;

// Adicionar estilos para animações
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(20px); }
  }
  
  .brand-600 { background-color: #0284c7; }
  .brand-700 { background-color: #0369a1; }
`;
document.head.appendChild(style);
