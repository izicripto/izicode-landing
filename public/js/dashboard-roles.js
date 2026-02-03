// Dashboard Role-Based Rendering System
import { auth, db, doc, getDoc, collection, query, getDocs, orderBy, limit } from './firebase-config.js';
import { getDailyTip } from './pedagogical-tips.js';

export class DashboardRoleManager {
    constructor() {
        this.currentUser = null;
        this.userRole = null;
        this.userData = null;
    }

    async initialize() {
        return new Promise((resolve) => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    this.currentUser = user;
                    await this.loadUserData();
                    this.renderDashboard();
                    resolve(true);
                } else {
                    window.location.href = 'login.html';
                }
            });
        });
    }

    async loadUserData() {
        try {
            const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
            if (userDoc.exists()) {
                this.userData = userDoc.data();
                this.userRole = this.userData.role || 'student';
            } else {
                // Fallback: se não tem role, assume student
                this.userRole = 'student';
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            this.userRole = 'student';
        }
    }

    renderDashboard() {
        // Renderizar elementos comuns
        this.renderHeader();

        // Renderizar elementos APENAS no Dashboard
        if (window.location.pathname.includes('dashboard.html')) {
            this.renderQuickActions();
            this.renderRoleWidgets(); // Chamada inicial (pode ser async)
        }

        // Ajustar navegação lateral (Comum a todas as páginas com sidebar)
        this.adjustSidebarNavigation();
    }

    renderHeader() {
        const firstName = this.currentUser.displayName?.split(' ')[0] || 'Usuário';
        const headerElement = document.getElementById('userFirstName');
        if (headerElement) {
            headerElement.textContent = firstName;
        }

        // Atualizar saudação baseada no role
        const greetingMap = {
            'school_admin': 'Vamos gerenciar sua escola hoje?',
            'teacher': 'Vamos transformar a educação hoje?',
            'student': 'Pronto para aprender algo novo?',
            'parent': 'Vamos acompanhar o progresso?',
            'consultant': 'Vamos criar conteúdo incrível?'
        };

        const greetingElement = document.querySelector('header p');
        if (greetingElement) {
            greetingElement.textContent = greetingMap[this.userRole] || greetingMap.student;
        }
    }

    renderQuickActions() {
        const container = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        if (!container) return;

        const actionsMap = {
            'school_admin': this.getSchoolAdminActions(),
            'teacher': this.getTeacherActions(),
            'student': this.getStudentActions(),
            'parent': this.getParentActions(),
            'consultant': this.getConsultantActions()
        };

        const actions = actionsMap[this.userRole] || actionsMap.student;
        container.innerHTML = actions.map(action => this.createActionCard(action)).join('');
    }

    getSchoolAdminActions() {
        return [
            {
                title: 'Gestão Escolar',
                description: 'Gerenciar turmas, professores e alunos',
                icon: 'users',
                href: 'school-management.html',
                gradient: 'from-slate-700 to-slate-900',
                textColor: 'white'
            },
            {
                title: 'Biblioteca',
                description: 'Gerenciar projetos e materiais oficiais',
                icon: 'library',
                href: 'library.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-300'
            },
            {
                title: 'Relatórios',
                description: 'Visão geral de desempenho da escola',
                icon: 'chart',
                href: '#',
                bgColor: 'bg-white/80',
                borderColor: 'border-purple-300'
            }
        ];
    }

    getTeacherActions() {
        return [
            {
                title: 'Criar Projeto (IA)',
                description: 'Gere planos de aula e roteiros em segundos',
                icon: 'plus',
                href: 'create-project.html',
                gradient: 'from-brand-500 to-brand-600',
                textColor: 'white'
            },
            {
                title: 'Meus Projetos',
                description: 'Acesse seus roteiros salvos e editados',
                icon: 'book',
                href: 'my-projects.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-300'
            },
            {
                title: 'Biblioteca',
                description: 'Explore projetos prontos para suas aulas',
                icon: 'library',
                href: 'library.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-200'
            }
        ];
    }

    getStudentActions() {
        return [
            {
                title: 'Meus Projetos',
                description: 'Continue seus projetos em andamento',
                icon: 'book',
                href: 'my-projects.html',
                gradient: 'from-brand-500 to-brand-600',
                textColor: 'white'
            },
            {
                title: 'Área do Aluno',
                description: 'Ver meu nível, XP e conquistas',
                icon: 'award',
                href: 'student-area.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-purple-300'
            },
            {
                title: 'Biblioteca',
                description: 'Conhecer novos projetos e tutoriais',
                icon: 'library',
                href: 'library.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-300'
            }
        ];
    }

    getParentActions() {
        return [
            {
                title: 'Izicode em Casa',
                description: 'Plataforma de lógica e desafios maker',
                icon: 'home',
                href: '#',
                gradient: 'from-emerald-500 to-emerald-600',
                textColor: 'white'
            },
            {
                title: 'Quizzes e Desafios',
                description: 'Testar conhecimentos com toda a família',
                icon: 'quiz',
                href: '#',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-300'
            },
            {
                title: 'Progresso',
                description: 'Acompanhar o desenvolvimento do aluno',
                icon: 'chart',
                href: '#',
                bgColor: 'bg-white/80',
                borderColor: 'border-purple-300'
            }
        ];
    }

    getConsultantActions() {
        return [
            {
                title: 'Base de Conhecimento',
                description: 'Consultoria e materiais oficiais',
                icon: 'book',
                href: 'library.html',
                gradient: 'from-brand-500 to-brand-600',
                textColor: 'white'
            },
            {
                title: 'Criar Conteúdo',
                description: 'Desenvolver novos projetos via IA',
                icon: 'plus',
                href: 'create-project.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-300'
            }
        ];
    }

    createActionCard(action) {
        const isGradient = action.gradient;
        const baseClasses = isGradient
            ? `group bg-gradient-to-br ${action.gradient} p-8 rounded-3xl shadow-xl shadow-brand-200 hover:shadow-2xl hover:scale-105 transition-all text-white relative overflow-hidden`
            : `group ${action.bgColor} backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-slate-200 hover:border-${action.borderColor?.replace('border-', '')} hover:shadow-xl hover:scale-105 transition-all relative overflow-hidden`;

        const iconSvg = this.getIconSvg(action.icon);
        const iconBg = isGradient ? 'bg-white/20' : 'bg-brand-100';
        const iconColor = isGradient ? '' : 'text-brand-600';

        return `
            <a href="${action.href}" class="${baseClasses}">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative z-10">
                    <div class="w-14 h-14 ${iconBg} backdrop-blur rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        ${iconSvg}
                    </div>
                    <h3 class="font-display text-2xl font-bold mb-2 ${isGradient ? '' : 'text-slate-900'}">${action.title}</h3>
                    <p class="${isGradient ? 'text-brand-100' : 'text-slate-600'}">${action.description}</p>
                </div>
            </a>
        `;
    }

    getIconSvg(iconName) {
        const icons = {
            'plus': '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>',
            'library': '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>',
            'book': '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
            'users': '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
            'chart': '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>',
            'award': '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>',
            'home': '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>',
            'quiz': '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
            'tool': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>'
        };
        return icons[iconName] || icons.plus;
    }

    async renderRoleWidgets() {
        const main = document.querySelector('main');
        const quickActions = main.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        if (!quickActions) return;

        let widgetsContainer = document.getElementById('role-widgets');
        if (!widgetsContainer) {
            widgetsContainer = document.createElement('div');
            widgetsContainer.id = 'role-widgets';
            widgetsContainer.className = 'space-y-6';
            quickActions.parentNode.insertBefore(widgetsContainer, quickActions.nextSibling);
        }

        // Mostrar loading spinner enquanto carrega dados reais
        widgetsContainer.innerHTML = '<div class="flex justify-center p-12"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div></div>';

        let widgetsHtml = '';

        switch (this.userRole) {
            case 'school_admin':
                widgetsHtml = this.getSchoolAdminWidgets();
                break;
            case 'teacher':
                const projectsCount = await this.fetchProjectsCount();
                const recentProjects = await this.fetchRecentProjects();
                widgetsHtml = this.getTeacherWidgets(projectsCount, recentProjects);
                break;
            case 'student':
                widgetsHtml = this.getStudentWidgets();
                break;
            case 'parent':
                widgetsHtml = this.getParentWidgets();
                break;
            default:
                widgetsHtml = this.getStudentWidgets();
        }

        widgetsContainer.innerHTML = widgetsHtml;
    }

    async fetchRecentProjects() {
        try {
            const projectsRef = collection(db, "users", this.currentUser.uid, "projects");
            const q = query(projectsRef, orderBy("createdAt", "desc"), limit(3));
            const qSnapshot = await getDocs(q);
            return qSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error("Erro ao buscar projetos recentes:", e);
            return [];
        }
    }

    getSchoolAdminWidgets() {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Gestão de Turmas -->
                <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-200">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-2">
                            <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <h2 class="font-display text-2xl font-bold text-slate-900">Gestão de Turmas</h2>
                        </div>
                        <button class="text-brand-600 font-bold text-sm">+ Nova Turma</button>
                    </div>
                    <div class="space-y-4">
                        <div class="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                            <div>
                                <p class="font-bold text-slate-900">7º Ano A</p>
                                <p class="text-xs text-slate-500">Código: IZ7A23 • 28 Alunos</p>
                            </div>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=IZ7A23" class="w-10 h-10 rounded shadow-sm" alt="QR Login">
                        </div>
                        <div class="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                            <div>
                                <p class="font-bold text-slate-900">8º Ano B</p>
                                <p class="text-xs text-slate-500">Código: IZ8B44 • 25 Alunos</p>
                            </div>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=IZ8B44" class="w-10 h-10 rounded shadow-sm" alt="QR Login">
                        </div>
                    </div>
                </div>

                <!-- Consultoria e Materiais -->
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-xl text-white">
                    <h2 class="font-display text-2xl font-bold mb-4">Consultoria Izicode</h2>
                    <p class="text-slate-300 text-sm mb-6">Acesso exclusivo a cronogramas, planejamento anual e suporte especializado para sua escola.</p>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer">
                            <div class="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">📄</div>
                            <div>
                                <p class="font-bold text-sm">Cronograma Anual 2024</p>
                                <p class="text-xs text-slate-400">PDF • 2.4 MB</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer">
                            <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">🛠️</div>
                            <div>
                                <p class="font-bold text-sm">Guia de Implementação Maker</p>
                                <p class="text-xs text-slate-400">PDF • 5.1 MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTeacherWidgets(projectsCount = 0, recentProjects = []) {
        const recentHtml = recentProjects.length > 0
            ? recentProjects.map(p => `
                <div class="p-3 bg-slate-50 rounded-xl flex items-center justify-between group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100 cursor-pointer" onclick="window.location.href='my-projects.html'">
                    <div class="flex flex-col">
                        <span class="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">${p.title}</span>
                        <span class="text-[10px] text-slate-500 uppercase font-medium">${p.grade || 'Geral'} • ${p.createdAt ? new Date(p.createdAt.toDate()).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <svg class="w-4 h-4 text-slate-300 group-hover:text-brand-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </div>
            `).join('')
            : '<p class="text-center text-slate-400 text-sm py-4">Nenhum planejamento recente.</p>';

        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Coluna 1: Status e Dica -->
                <div class="space-y-6">
                    <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-200">
                        <div class="flex items-center gap-2 mb-6">
                            <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h2 class="font-display text-2xl font-bold text-slate-900">Resumo</h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-6 bg-brand-50 rounded-2xl border border-brand-100 cursor-pointer" onclick="window.location.href='my-projects.html'">
                                <p class="text-brand-700 font-bold mb-1">Roteiros Totais</p>
                                <p class="text-4xl font-display font-black text-brand-900">${projectsCount}</p>
                                <p class="text-[10px] text-brand-600 mt-2 uppercase font-bold tracking-wider">Ver todos →</p>
                            </div>
                            <div id="pedagogical-tip-card" class="p-6 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col">
                                <p class="text-purple-700 font-bold mb-1">Dica Pedagógica</p>
                                <div id="tip-content-container">
                                    <p class="text-slate-600 text-sm italic line-clamp-2">"${getDailyTip().content}"</p>
                                    <p class="text-[10px] font-bold text-purple-400 mt-2 uppercase tracking-widest">${getDailyTip().category}</p>
                                </div>
                                <button onclick="window.location.href='ia-assistant.html'" class="text-purple-600 font-bold text-xs mt-auto pt-3 uppercase tracking-wider text-left">Saber mais →</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Coluna 2: Planejamentos Recentes (Lista Simplificada) -->
                <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-200">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-2">
                            <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h2 class="font-display text-2xl font-bold text-slate-900">Planejamentos Recentes</h2>
                        </div>
                        <a href="create-project.html" class="bg-brand-600 hover:bg-brand-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                        </a>
                    </div>
                    <div class="space-y-3">
                        ${recentHtml}
                        <div class="pt-2">
                            <a href="my-projects.html" class="block text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors">Acessar Pasta de Projetos</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getStudentWidgets() {
        return `
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-6">
                    <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <h2 class="font-display text-2xl font-bold text-slate-900">Conquistas Recentes</h2>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <div class="text-3xl mb-1">🚀</div>
                        <p class="text-xs font-bold text-slate-900 line-clamp-1">Explorador</p>
                    </div>
                    <div class="text-center p-4 bg-brand-50 rounded-2xl border border-brand-100">
                        <div class="text-3xl mb-1">💡</div>
                        <p class="text-xs font-bold text-slate-900 line-clamp-1">Inovador</p>
                    </div>
                    <div class="text-center p-4 bg-purple-50 rounded-2xl border border-purple-100">
                        <div class="text-3xl mb-1">🔨</div>
                        <p class="text-xs font-bold text-slate-900 line-clamp-1">Maker</p>
                    </div>
                    <div class="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div class="text-3xl mb-1">🐍</div>
                        <p class="text-xs font-bold text-slate-900 line-clamp-1">Pythonista</p>
                    </div>
                </div>
            </div>
        `;
    }

    getParentWidgets() {
        return `
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-6">
                    <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h2 class="font-display text-2xl font-bold text-slate-900">Progresso dos Filhos</h2>
                </div>
                <div class="space-y-4">
                    <div class="p-6 bg-brand-50 rounded-2xl">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="font-bold text-slate-900">Maria Silva</p>
                                <p class="text-sm text-slate-600">7º Ano • Turma A</p>
                            </div>
                            <svg class="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-600">XP Total</span>
                                <span class="font-bold text-brand-600">450 XP</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-600">Projetos Concluídos</span>
                                <span class="font-bold text-brand-600">8/10</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getConsultantWidgets() {
        return `
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-6">
                    <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h2 class="font-display text-2xl font-bold text-slate-900">Seus Materiais</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-brand-50 p-6 rounded-2xl">
                        <p class="text-brand-600 font-semibold mb-2">Projetos Criados</p>
                        <p class="font-display text-4xl font-bold text-slate-900">23</p>
                    </div>
                    <div class="bg-purple-50 p-6 rounded-2xl">
                        <p class="text-purple-600 font-semibold mb-2">Escolas Atendidas</p>
                        <p class="font-display text-4xl font-bold text-slate-900">5</p>
                    </div>
                    <div class="bg-amber-50 p-6 rounded-2xl">
                        <p class="text-amber-600 font-semibold mb-2">Downloads</p>
                        <p class="font-display text-4xl font-bold text-slate-900">342</p>
                    </div>
                </div>
            </div>
        `;
    }

    adjustSidebarNavigation() {
        // Encontrar o elemento de navegação na sidebar
        const sidebarNav = document.querySelector('aside nav');
        if (!sidebarNav) return;

        // Adicionar seção de Ferramentas se não existir
        let toolsSection = document.getElementById('sidebar-tools');
        if (!toolsSection) {
            const toolsHtml = `
                <div id="sidebar-tools" class="mt-6">
                    <button id="toggleTools" class="w-full flex items-center justify-between px-4 mb-3 group">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Ferramentas</span>
                        <svg id="toolsArrow" class="w-4 h-4 text-slate-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div id="toolsList" class="space-y-1 overflow-hidden transition-all duration-300 max-h-0 opacity-0 px-1">
                        <a href="https://scratch.mit.edu/" target="_blank" class="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl font-medium transition-all group text-sm">
                            <span class="w-4 h-4 flex items-center justify-center">${this.getIconSvg('tool')}</span>
                            Scratch
                        </a>
                        <a href="https://www.tinkercad.com/" target="_blank" class="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl font-medium transition-all group text-sm">
                            <span class="w-4 h-4 flex items-center justify-center">${this.getIconSvg('tool')}</span>
                            Tinkercad
                        </a>
                        <a href="https://makecode.microbit.org/" target="_blank" class="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl font-medium transition-all group text-sm">
                            <span class="w-4 h-4 flex items-center justify-center">${this.getIconSvg('tool')}</span>
                            Micro:bit
                        </a>
                        <a href="https://lab.open-roberta.org/" target="_blank" class="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl font-medium transition-all group text-sm">
                            <span class="w-4 h-4 flex items-center justify-center">${this.getIconSvg('tool')}</span>
                            Open Roberta
                        </a>
                        <a href="https://www.arduino.cc/en/software" target="_blank" class="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl font-medium transition-all group text-sm">
                            <span class="w-4 h-4 flex items-center justify-center">${this.getIconSvg('tool')}</span>
                            Arduino
                        </a>
                        <a href="https://code.org/" target="_blank" class="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl font-medium transition-all group text-sm">
                            <span class="w-4 h-4 flex items-center justify-center">${this.getIconSvg('tool')}</span>
                            Code.org
                        </a>
                    </div>
                </div>
            `;
            sidebarNav.insertAdjacentHTML('beforeend', toolsHtml);

            // Adicionar lógica de toggle
            const toggleBtn = document.getElementById('toggleTools');
            const toolsList = document.getElementById('toolsList');
            const arrow = document.getElementById('toolsArrow');

            toggleBtn.addEventListener('click', () => {
                const isCollapsed = toolsList.style.maxHeight === '0px' || !toolsList.style.maxHeight;
                if (isCollapsed) {
                    toolsList.style.maxHeight = '300px';
                    toolsList.style.opacity = '1';
                    arrow.style.transform = 'rotate(180deg)';
                } else {
                    toolsList.style.maxHeight = '0px';
                    toolsList.style.opacity = '0';
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        }

        // Ocultar/mostrar itens de navegação baseado no role
        const navItemsMap = {
            'school_admin': ['dashboard', 'library', 'school-management'],
            'teacher': ['dashboard', 'my-projects', 'library', 'create-project'],
            'student': ['dashboard', 'my-projects', 'library', 'student-area'],
            'parent': ['dashboard', 'library'],
            'consultant': ['dashboard', 'my-projects', 'library', 'create-project']
        };

        const allowedItems = navItemsMap[this.userRole] || navItemsMap.student;

        // Ocultar itens que não pertencem ao role
        const navLinks = sidebarNav.querySelectorAll('a[href]');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('http')) return; // Pula links externos (Ferramentas)

            const pageName = href.split('.')[0];
            if (!allowedItems.includes(pageName) && pageName !== 'dashboard') {
                // Esconder fisicamente itens não permitidos para o role
                link.style.display = 'none';
            } else {
                link.style.display = 'flex'; // Garante que seja visível se permitido
            }
        });

        console.log('Navegação personalizada para:', this.userRole);
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        const roleManager = new DashboardRoleManager();
        await roleManager.initialize();
    });
} else {
    const roleManager = new DashboardRoleManager();
    roleManager.initialize();
}
