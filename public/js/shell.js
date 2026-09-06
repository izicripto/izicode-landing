// Izicode Edu — Shell compartilhado
// Padroniza sidebar, topbar, toasts, modal, drawer e identidade visual.
// É carregado por todas as páginas logadas e pelo portal.

import { auth, onAuthStateChanged, signOut } from './firebase-config.js';

const ROLE_LABELS = {
    dev: 'Desenvolvedor',
    admin: 'Administrador',
    school_admin: 'Gestão Escolar',
    teacher: 'Professor(a)',
    freelance_teacher: 'Professor(a) Autônomo(a)',
    'professor-pro': 'Professor PRO',
    student: 'Aluno(a)',
    parent: 'Responsável',
    consultant: 'Consultor(a)'
};

const PLAN_LABELS = {
    free: 'Plano Gratuito',
    school: 'Plano Escola',
    enterprise: 'Plano Enterprise',
    professor_pro: 'Plano PRO'
};

// Itens de navegação por role
const NAV_ITEMS = {
    teacher: [
        { group: 'Principal', items: [
            { href: 'dashboard.html', label: 'Visão Geral', icon: 'home' },
            { href: 'my-projects.html', label: 'Meus Projetos', icon: 'folder' },
            { href: 'library.html', label: 'Biblioteca', icon: 'library' }
        ]},
        { group: 'Ferramentas', items: [
            { href: 'create-project.html', label: 'Gerador IA', icon: 'sparkle' },
            { href: 'ia-assistant.html', label: 'Assistente IA', icon: 'bot' },
            { href: 'quiz-arena.html', label: 'Arena de Quiz', icon: 'quiz' },
            { href: 'academia.html', label: 'Academia', icon: 'book' }
        ]}
    ],
    freelance_teacher: [
        { group: 'Principal', items: [
            { href: 'dashboards/professor-autonomo.html', label: 'Visão Geral', icon: 'home' },
            { href: 'library.html', label: 'Biblioteca', icon: 'library' },
            { href: 'arduino-projects.html', label: 'Hub Arduino', icon: 'bolt' }
        ]},
        { group: 'Ferramentas', items: [
            { href: 'create-project.html', label: 'Gerador IA', icon: 'sparkle' },
            { href: 'ia-assistant.html', label: 'Assistente IA', icon: 'bot' },
            { href: 'academia.html', label: 'Academia', icon: 'book' }
        ]}
    ],
    school_admin: [
        { group: 'Gestão', items: [
            { href: 'dashboards/professor-escola.html', label: 'Visão Geral', icon: 'home' },
            { href: 'school-management.html', label: 'Gestão Escolar', icon: 'school' },
            { href: 'dashboards/professor-escola.html#turmas', label: 'Minhas Turmas', icon: 'users' }
        ]},
        { group: 'Ferramentas', items: [
            { href: 'create-project.html', label: 'Gerador IA', icon: 'sparkle' },
            { href: 'ia-assistant.html', label: 'Assistente IA', icon: 'bot' },
            { href: 'library.html', label: 'Biblioteca', icon: 'library' }
        ]}
    ],
    student: [
        { group: 'Aprender', items: [
            { href: 'dashboards/aluno.html', label: 'Meu Painel', icon: 'home' },
            { href: 'dashboards/aluno.html', label: 'Área do Aluno', icon: 'gamepad' },
            { href: 'quiz-arena.html', label: 'Arena de Quiz', icon: 'quiz' },
            { href: 'ranking.html', label: 'Ranking', icon: 'trophy' }
        ]},
        { group: 'Recursos', items: [
            { href: 'library.html', label: 'Biblioteca', icon: 'library' }
        ]}
    ],
    parent: [
        { group: 'Meus Filhos', items: [
            { href: 'dashboards/aluno.html', label: 'Área do Aluno', icon: 'gamepad' },
            { href: 'quiz-arena.html', label: 'Arena de Quiz', icon: 'quiz' }
        ]},
        { group: 'Recursos', items: [
            { href: 'library.html', label: 'Biblioteca', icon: 'library' }
        ]}
    ],
    default: [
        { group: 'Principal', items: [
            { href: 'dashboard.html', label: 'Visão Geral', icon: 'home' },
            { href: 'library.html', label: 'Biblioteca', icon: 'library' }
        ]}
    ]
};

const ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>',
    library: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h.01M15 9h.01"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13M12 6.253C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253M12 6.253C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
    school: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
    gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m-7-4h2m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15a4 4 0 100-8 4 4 0 000 8zm0 0v3m-4 1h8m-9-7H5a2 2 0 01-2-2V6a2 2 0 012-2h2m10 6h2a2 2 0 002-2V6a2 2 0 00-2-2h-2"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
};

function getRoleFromEmail(email) {
    if (!email) return null;
    if (email === 'izicripto@gmail.com') return 'dev';
    if (email === 'izicodeedu@gmail.com') return 'school_admin';
    if (email === 'r.berlanda04@gmail.com') return 'professor-pro';
    return null;
}

function resolveRole(user, userData) {
    if (userData?.role) return userData.role;
    return getRoleFromEmail(user?.email) || 'student';
}

function resolvePath(href) {
    if (!href) return '#';
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return href;
    const inSubfolder = window.location.pathname.includes('/dashboards/');
    if (inSubfolder && !href.startsWith('../') && !href.startsWith('/') && !href.startsWith('dashboards/')) {
        return '../' + href;
    }
    return href;
}

function getCurrentPath() {
    const file = window.location.pathname.split('/').pop() || 'dashboard.html';
    return file.replace('.html', '');
}

function buildSidebar(role, user, userData) {
    const groups = NAV_ITEMS[role] || NAV_ITEMS.default;
    const currentPath = getCurrentPath();
    const displayName = userData?.displayName || user?.displayName || user?.email || 'Usuário';
    const photo = userData?.photoURL || user?.photoURL;
    const planLabel = PLAN_LABELS[userData?.subscription?.plan] || ROLE_LABELS[role] || 'Plano Gratuito';

    const profilePhoto = photo
        ? `<img src="${escapeAttr(photo)}" alt="">`
        : `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0ea5e9&color=fff" alt="">`;

    const navHtml = groups.map(group => `
        <div class="iz-nav__group">${escapeHtml(group.group)}</div>
        ${group.items.map(item => {
            const itemPath = item.href.split('/').pop().replace('.html', '').split('?')[0].split('#')[0];
            const isActive = itemPath === currentPath;
            return `
                <a href="${escapeAttr(resolvePath(item.href))}" class="iz-nav__item ${isActive ? 'is-active' : ''}">
                    ${ICONS[item.icon] || ICONS.home}
                    <span>${escapeHtml(item.label)}</span>
                </a>
            `;
        }).join('')}
    `).join('');

    return `
        <aside class="iz-sidebar" aria-label="Navegação principal">
            <a href="${resolvePath('dashboard.html')}" class="iz-sidebar__brand">
                <img src="${resolvePath('images/logo.png')}" alt="Izicode Edu">
                <div class="iz-sidebar__brand-text">
                    <strong>Izicode</strong>
                    <small>Edu Platform</small>
                </div>
            </a>

            <div class="iz-sidebar__profile">
                ${profilePhoto}
                <div class="iz-sidebar__profile-info">
                    <div class="iz-sidebar__profile-name">${escapeHtml(displayName)}</div>
                    <div class="iz-sidebar__profile-meta">${escapeHtml(planLabel)}</div>
                </div>
            </div>

            <nav class="iz-nav" id="izNav">${navHtml}</nav>

            <div class="iz-sidebar__footer">
                <button type="button" class="iz-nav__item" data-iz-logout style="width:100%;background:transparent;border:none;text-align:left;color:#dc2626;">
                    ${ICONS.logout}
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    `;
}

function buildTopbar() {
    return `
        <header class="iz-topbar">
            <button type="button" class="iz-topbar__menu" data-iz-menu aria-label="Abrir menu">
                ${ICONS.menu}
            </button>
            <div class="iz-topbar__brand">
                <img src="${resolvePath('images/logo.png')}" alt="Izicode">
                <strong>Izicode Edu</strong>
            </div>
            <button type="button" class="iz-topbar__menu" data-iz-logout aria-label="Sair">
                ${ICONS.logout}
            </button>
        </header>
    `;
}

function buildDrawer(sidebarHtml) {
    return `
        <div class="iz-drawer" data-iz-drawer aria-hidden="true">
            <div class="iz-drawer__panel">${sidebarHtml}</div>
        </div>
    `;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
}
function escapeAttr(value) { return escapeHtml(value); }

function ensureToastContainer() {
    let stack = document.getElementById('iz-toast-stack');
    if (!stack) {
        stack = document.createElement('div');
        stack.id = 'iz-toast-stack';
        document.body.appendChild(stack);
    }
    return stack;
}

export function showToast({ title = '', message = '', type = 'info', duration = 3800 } = {}) {
    const stack = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `iz-toast iz-toast--${type}`;
    toast.innerHTML = `
        <div style="flex:1;">
            ${title ? `<strong>${escapeHtml(title)}</strong>` : ''}
            <p>${escapeHtml(message)}</p>
        </div>
        <button type="button" aria-label="Fechar" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;">${ICONS.close}</button>
    `;
    const dismiss = () => {
        toast.classList.add('is-leaving');
        setTimeout(() => toast.remove(), 220);
    };
    toast.querySelector('button').addEventListener('click', dismiss);
    stack.appendChild(toast);
    setTimeout(dismiss, duration);
}

export function openModal({ title, body, actions = [], onClose } = {}) {
    const backdrop = document.createElement('div');
    backdrop.className = 'iz-modal-backdrop';
    backdrop.innerHTML = `
        <div class="iz-modal" role="dialog" aria-modal="true">
            <button type="button" class="iz-modal__close" aria-label="Fechar">${ICONS.close}</button>
            ${title ? `<h2>${escapeHtml(title)}</h2>` : ''}
            <div class="iz-modal__body">${typeof body === 'string' ? body : ''}</div>
            <div class="iz-row" style="justify-content:flex-end;gap:8px;margin-top:8px;">
                ${actions.map((a, i) => `
                    <button type="button" class="iz-btn ${a.variant ? 'iz-btn--' + a.variant : 'iz-btn--ghost'}" data-iz-modal-action="${i}">
                        ${escapeHtml(a.label)}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    if (body instanceof HTMLElement) {
        backdrop.querySelector('.iz-modal__body').replaceWith(body);
    }
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => backdrop.classList.add('is-open'));

    const close = () => {
        backdrop.classList.remove('is-open');
        setTimeout(() => {
            backdrop.remove();
            onClose?.();
        }, 180);
    };
    backdrop.querySelector('.iz-modal__close').addEventListener('click', close);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
    actions.forEach((a, i) => {
        backdrop.querySelector(`[data-iz-modal-action="${i}"]`).addEventListener('click', () => {
            a.onClick?.(close);
        });
    });
    return { close };
}

function attachShellEvents() {
    document.querySelectorAll('[data-iz-logout]').forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = resolvePath('index.html');
            } catch (e) {
                showToast({ title: 'Erro', message: 'Não foi possível sair agora.', type: 'error' });
            }
        });
    });

    const drawer = document.querySelector('[data-iz-drawer]');
    const menuBtn = document.querySelector('[data-iz-menu]');
    menuBtn?.addEventListener('click', () => {
        drawer?.classList.add('is-open');
        drawer?.setAttribute('aria-hidden', 'false');
    });
    drawer?.addEventListener('click', e => {
        if (e.target === drawer) {
            drawer.classList.remove('is-open');
            drawer.setAttribute('aria-hidden', 'true');
        }
    });
}

async function getUserData(user) {
    if (!user) return null;
    try {
        const { doc, getDoc, db } = await import('./firebase-config.js');
        const snap = await getDoc(doc(db, 'users', user.uid));
        return snap.exists() ? snap.data() : null;
    } catch (e) {
        console.warn('shell: não foi possível carregar userData', e);
        return null;
    }
}

export async function initShell({ requireAuth = true } = {}) {
    return new Promise(resolve => {
        if (requireAuth) {
            onAuthStateChanged(auth, async user => {
                if (!user) {
                    const ret = resolvePath('login.html');
                    window.location.href = ret;
                    return;
                }
                const userData = await getUserData(user);
                const role = resolveRole(user, userData);
                const sidebar = buildSidebar(role, user, userData);
                document.querySelectorAll('[data-iz-sidebar]').forEach(el => el.innerHTML = sidebar);
                document.querySelectorAll('[data-iz-topbar]').forEach(el => el.innerHTML = buildTopbar());
                document.querySelectorAll('[data-iz-drawer]').forEach(el => el.innerHTML = buildDrawer(sidebar));
                attachShellEvents();
                document.body.dataset.izRole = role;
                document.body.dataset.izReady = '1';
                resolve({ user, userData, role });
            });
        } else {
            const sidebar = buildSidebar('default', null, null);
            document.querySelectorAll('[data-iz-sidebar]').forEach(el => el.innerHTML = sidebar);
            document.querySelectorAll('[data-iz-topbar]').forEach(el => el.innerHTML = buildTopbar());
            document.querySelectorAll('[data-iz-drawer]').forEach(el => el.innerHTML = buildDrawer(sidebar));
            attachShellEvents();
            document.body.dataset.izReady = '1';
            resolve({ role: 'default' });
        }
    });
}

export const Shell = { initShell, showToast, openModal, ICONS };
window.Shell = Shell;
window.IzToast = showToast;
window.IzModal = openModal;
