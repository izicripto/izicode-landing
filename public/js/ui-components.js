export function showToast(message, type = 'success') {
    // Create toast container if not exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(container); // Fix: Append to body
    }

    // Create toast element
    const toast = document.createElement('div');
    const colors = type === 'success'
        ? 'bg-green-50 text-green-800 border-green-200'
        : type === 'error'
            ? 'bg-red-50 text-red-800 border-red-200'
            : 'bg-blue-50 text-blue-800 border-blue-200';

    const icon = type === 'success'
        ? '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
        : type === 'error'
            ? '<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
            : '<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transform transition-all duration-300 translate-y-10 opacity-0 ${colors} min-w-[300px]`;
    toast.innerHTML = `
        ${icon}
        <p class="font-medium text-sm">${message}</p>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    });

    // Remove after 4s
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

export function showModal(title, message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
    return new Promise((resolve) => {
        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center opacity-0 transition-opacity duration-300';
        overlay.id = 'custom-modal';

        // Modal Content
        const modal = document.createElement('div');
        modal.className = 'bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform scale-95 transition-transform duration-300';
        modal.innerHTML = `
            <h3 class="text-xl font-bold text-slate-800 mb-2">${title}</h3>
            <p class="text-slate-600 mb-6 leading-relaxed">${message}</p>
            <div class="flex items-center justify-end gap-3">
                <button id="modalCancel" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors">
                    ${cancelText}
                </button>
                <button id="modalConfirm" class="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 shadow-lg shadow-brand-200 transition-all hover:-translate-y-0.5">
                    ${confirmText}
                </button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Animate in
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            modal.classList.remove('scale-95');
        });

        // Handlers
        const close = (confirmed) => {
            overlay.classList.add('opacity-0');
            modal.classList.add('scale-90');
            setTimeout(() => {
                overlay.remove();
                resolve(confirmed);
            }, 300);
        };

        document.getElementById('modalCancel').onclick = () => close(false);
        document.getElementById('modalConfirm').onclick = () => close(true);
        overlay.onclick = (e) => { if (e.target === overlay) close(false); };
    });
}
