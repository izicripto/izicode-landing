// Dashboard Role-Based Rendering System
import { auth, db, doc, getDoc } from './firebase-config.js';

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
        // Renderizar header personalizado
        this.renderHeader();

        // Renderizar cards de ação rápida
        this.renderQuickActions();

        // Renderizar widgets específicos do role
        this.renderRoleWidgets();

        // Ajustar navegação lateral
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
                title: 'Gerenciar Professores',
                description: 'Adicionar e gerenciar equipe docente',
                icon: 'users',
                href: '#',
                gradient: 'from-brand-500 to-brand-600',
                textColor: 'white'
            },
            {
                title: 'Métricas da Escola',
                description: 'Visualizar estatísticas e relatórios',
                icon: 'chart',
                href: '#',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-300'
            },
            {
                title: 'Biblioteca',
                description: 'Gerenciar projetos e materiais',
                icon: 'library',
                href: 'library.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-purple-300'
            }
        ];
    }

    getTeacherActions() {
        return [
            {
                title: 'Criar Projeto',
                description: 'Use IA para gerar projetos completos em minutos',
                icon: 'plus',
                href: 'create-project.html',
                gradient: 'from-brand-500 to-brand-600',
                textColor: 'white'
            },
            {
                title: 'Biblioteca',
                description: 'Explore projetos prontos e inspiradores',
                icon: 'library',
                href: 'library.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-300'
            },
            {
                title: 'Minhas Turmas',
                description: 'Acompanhe o progresso dos alunos',
                icon: 'users',
                href: '#',
                bgColor: 'bg-white/80',
                borderColor: 'border-purple-300'
            }
        ];
    }

    getStudentActions() {
        return [
            {
                title: 'Criar Projeto',
                description: 'Use IA para gerar projetos completos em minutos',
                icon: 'plus',
                href: 'create-project.html',
                gradient: 'from-brand-500 to-brand-600',
                textColor: 'white'
            },
            {
                title: 'Biblioteca',
                description: 'Explore projetos prontos e inspiradores',
                icon: 'library',
                href: 'library.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-300'
            },
            {
                title: 'Área do Aluno',
                description: 'Gamificação e acompanhamento de progresso',
                icon: 'book',
                href: 'student-area.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-purple-300'
            }
        ];
    }

    getParentActions() {
        return [
            {
                title: 'Progresso dos Filhos',
                description: 'Acompanhe o desempenho e conquistas',
                icon: 'chart',
                href: '#',
                gradient: 'from-brand-500 to-brand-600',
                textColor: 'white'
            },
            {
                title: 'Biblioteca',
                description: 'Veja os projetos disponíveis',
                icon: 'library',
                href: 'library.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-300'
            },
            {
                title: 'Notificações',
                description: 'Avisos e atualizações da escola',
                icon: 'bell',
                href: '#',
                bgColor: 'bg-white/80',
                borderColor: 'border-purple-300'
            }
        ];
    }

    getConsultantActions() {
        return [
            {
                title: 'Criar Material',
                description: 'Desenvolva novos projetos e tutoriais',
                icon: 'plus',
                href: 'create-project.html',
                gradient: 'from-brand-500 to-brand-600',
                textColor: 'white'
            },
            {
                title: 'Meus Materiais',
                description: 'Gerencie conteúdo criado',
                icon: 'library',
                href: 'my-projects.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-300'
            },
            {
                title: 'Escolas Atendidas',
                description: 'Visualize suas parcerias',
                icon: 'users',
                href: '#',
                bgColor: 'bg-white/80',
                borderColor: 'border-purple-300'
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
            'bell': '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>'
        };
        return icons[iconName] || icons.plus;
    }

    renderRoleWidgets() {
        // Encontrar container de widgets (após quick actions)
        const main = document.querySelector('main');
        const quickActions = main.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');

        // Criar container de widgets se não existir
        let widgetsContainer = document.getElementById('role-widgets');
        if (!widgetsContainer) {
            widgetsContainer = document.createElement('div');
            widgetsContainer.id = 'role-widgets';
            widgetsContainer.className = 'space-y-6';
            quickActions.parentNode.insertBefore(widgetsContainer, quickActions.nextSibling);
        }

        const widgetsMap = {
            'school_admin': this.getSchoolAdminWidgets(),
            'teacher': this.getTeacherWidgets(),
            'student': this.getStudentWidgets(),
            'parent': this.getParentWidgets(),
            'consultant': this.getConsultantWidgets()
        };

        const widgets = widgetsMap[this.userRole] || widgetsMap.student;
        widgetsContainer.innerHTML = widgets;
    }

    getSchoolAdminWidgets() {
        return `
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-200">
                <h2 class="font-display text-2xl font-bold text-slate-900 mb-6">📊 Estatísticas da Escola</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-brand-50 p-6 rounded-2xl">
                        <p class="text-brand-600 font-semibold mb-2">Total de Alunos</p>
                        <p class="font-display text-4xl font-bold text-slate-900">127</p>
                    </div>
                    <div class="bg-purple-50 p-6 rounded-2xl">
                        <p class="text-purple-600 font-semibold mb-2">Professores Ativos</p>
                        <p class="font-display text-4xl font-bold text-slate-900">12</p>
                    </div>
                    <div class="bg-amber-50 p-6 rounded-2xl">
                        <p class="text-amber-600 font-semibold mb-2">Projetos Criados</p>
                        <p class="font-display text-4xl font-bold text-slate-900">45</p>
                    </div>
                </div>
            </div>
        `;
    }

    getTeacherWidgets() {
        return `
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-200">
                <h2 class="font-display text-2xl font-bold text-slate-900 mb-6">👥 Minhas Turmas</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                        <div>
                            <p class="font-bold text-slate-900">Turma 7º A - Robótica</p>
                            <p class="text-sm text-slate-600">28 alunos • 85% de conclusão média</p>
                        </div>
                        <span class="text-brand-600 font-bold">→</span>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                        <div>
                            <p class="font-bold text-slate-900">Turma 8º B - Programação</p>
                            <p class="text-sm text-slate-600">25 alunos • 72% de conclusão média</p>
                        </div>
                        <span class="text-brand-600 font-bold">→</span>
                    </div>
                </div>
            </div>
        `;
    }

    getStudentWidgets() {
        return `
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-200">
                <h2 class="font-display text-2xl font-bold text-slate-900 mb-6">🏆 Suas Conquistas</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-amber-50 rounded-2xl">
                        <div class="text-4xl mb-2">🥇</div>
                        <p class="text-sm font-bold text-slate-900">Primeiro Projeto</p>
                    </div>
                    <div class="text-center p-4 bg-brand-50 rounded-2xl">
                        <div class="text-4xl mb-2">💡</div>
                        <p class="text-sm font-bold text-slate-900">Criativo</p>
                    </div>
                    <div class="text-center p-4 bg-purple-50 rounded-2xl">
                        <div class="text-4xl mb-2">⚡</div>
                        <p class="text-sm font-bold text-slate-900">Rápido</p>
                    </div>
                    <div class="text-center p-4 bg-slate-100 rounded-2xl opacity-50">
                        <div class="text-4xl mb-2">🔒</div>
                        <p class="text-sm font-bold text-slate-600">Bloqueado</p>
                    </div>
                </div>
            </div>
        `;
    }

    getParentWidgets() {
        return `
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-200">
                <h2 class="font-display text-2xl font-bold text-slate-900 mb-6">👨‍👩‍👧 Progresso dos Filhos</h2>
                <div class="space-y-4">
                    <div class="p-6 bg-brand-50 rounded-2xl">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="font-bold text-slate-900">Maria Silva</p>
                                <p class="text-sm text-slate-600">7º Ano • Turma A</p>
                            </div>
                            <span class="text-2xl">⭐</span>
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
                <h2 class="font-display text-2xl font-bold text-slate-900 mb-6">📚 Seus Materiais</h2>
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
        // Ocultar/mostrar itens de navegação baseado no role
        const navItems = {
            'school_admin': ['dashboard', 'library', 'admin'],
            'teacher': ['dashboard', 'my-projects', 'library', 'create-project'],
            'student': ['dashboard', 'my-projects', 'library', 'create-project', 'student-area'],
            'parent': ['dashboard', 'library'],
            'consultant': ['dashboard', 'my-projects', 'library', 'create-project']
        };

        const allowedItems = navItems[this.userRole] || navItems.student;

        // Esta lógica pode ser expandida para ocultar/mostrar itens específicos
        console.log('Navegação permitida:', allowedItems);
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
