// Dashboard Role-Based Rendering System
import { auth, db, doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, limit, getCountFromServer } from './firebase-config.js';
import { getDailyTip } from './pedagogical-tips.js';
import { gamificationSystem } from './gamification.js';

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
            // 1. Load DB Data
            const userRef = doc(db, 'users', this.currentUser.uid);
            const userDoc = await getDoc(userRef);
            let dbRole = 'student';

            if (userDoc.exists()) {
                this.userData = userDoc.data();
                dbRole = this.userData.role || 'student';

                // --- KEY RECHARGE LOGIC ---
                let currentKeys = this.userData.keys !== undefined ? this.userData.keys : 10;
                let lastRefill = this.userData.lastKeyRefill ? this.userData.lastKeyRefill.toDate() : new Date();
                const now = new Date();
                let needsUpdate = false;
                let updates = {};

                if (this.userData.keys === undefined) {
                    currentKeys = 10;
                    updates.keys = 10;
                    needsUpdate = true;
                }

                if (currentKeys < 10) {
                    const timeDiff = now - lastRefill;
                    const hoursPassed = Math.floor(timeDiff / (1000 * 60 * 60));

                    if (hoursPassed >= 1) {
                        const keysToAdd = Math.min(hoursPassed, 10 - currentKeys);
                        if (keysToAdd > 0) {
                            currentKeys += keysToAdd;
                            updates.keys = currentKeys;
                            updates.lastKeyRefill = now;
                            needsUpdate = true;
                            console.log(`Recharged ${keysToAdd} keys!`);
                        }
                    }
                }

                if (needsUpdate) {
                    await updateDoc(userRef, updates);
                    this.userData = { ...this.userData, ...updates };
                }
                // --------------------------
            }

            // 2. APPLY BUSINESS RULES (Hardcoded Overrides)
            const email = this.currentUser.email;
            if (email === 'izicripto@gmail.com') {
                this.userRole = 'dev';
            } else if (email === 'izicodeedu@gmail.com') {
                this.userRole = 'school_admin';
            } else if (email === 'r.berlanda04@gmail.com') {
                this.userRole = 'professor-pro';
            } else {
                this.userRole = dbRole;
            }

            console.log(`Role Resolved: ${this.userRole} (Email: ${email})`);

            // 3. DAILY MISSIONS LOGIC
            await this.handleDailyMissions();

        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            this.userRole = 'student';
        }
    }

    async handleDailyMissions() {
        if (!this.userData) return;

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const lastReset = this.userData.lastMissionReset || '';

        // Reset if it's a new day
        if (lastReset !== todayStr) {
            console.log("Resetting daily missions for a new day...");
            const initialMissions = {};
            gamificationSystem.dailyMissions.forEach(m => {
                initialMissions[m.id] = {
                    progress: 0,
                    completed: false,
                    lastUpdated: todayStr
                };
            });

            const updates = {
                lastMissionReset: todayStr,
                missionsProgress: initialMissions
            };

            await updateDoc(doc(db, 'users', this.currentUser.uid), updates);
            this.userData = { ...this.userData, ...updates };
        }

        // Auto-complete 'login' mission
        await this.recordMissionProgress('daily-login', 1);
    }

    async recordMissionProgress(missionId, amount = 1) {
        if (!this.userData || !this.userData.missionsProgress) return;

        const progress = this.userData.missionsProgress[missionId];
        if (!progress || progress.completed) return;

        const missionDef = gamificationSystem.dailyMissions.find(m => m.id === missionId);
        if (!missionDef) return;

        const target = missionDef.target || 1;
        const newProgressValue = Math.min(progress.progress + amount, target);
        const isNowCompleted = newProgressValue >= target;

        const updates = {};
        updates[`missionsProgress.${missionId}.progress`] = newProgressValue;

        if (isNowCompleted) {
            updates[`missionsProgress.${missionId}.completed`] = true;
            updates[`missionsProgress.${missionId}.completedAt`] = new Date();

            // Award Rewards
            updates.xp = (this.userData.xp || 0) + missionDef.xp;
            if (missionDef.keys) {
                updates.keys = (this.userData.keys || 0) + missionDef.keys;
            }

            console.log(`Mission Completed: ${missionDef.name}! +${missionDef.xp} XP awarded.`);
        }

        await updateDoc(doc(db, 'users', this.currentUser.uid), updates);

        // Update local state
        this.userData.missionsProgress[missionId].progress = newProgressValue;
        if (isNowCompleted) {
            this.userData.missionsProgress[missionId].completed = true;
            this.userData.xp = (this.userData.xp || 0) + missionDef.xp;
            if (missionDef.keys) this.userData.keys = (this.userData.keys || 0) + missionDef.keys;
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
        // Atualizar saudação baseada no role
        const greetingMap = {
            'dev': 'Modo Desenvolvedor Ativo',
            'school_admin': 'Vamos gerenciar sua escola hoje?',
            'freelance_teacher': 'Suas aulas, suas regras!',
            'teacher': 'Vamos transformar a educação hoje?',
            'student': 'Pronto para aprender algo novo?',
            'parent': 'Vamos acompanhar o progresso?',
            'consultant': 'Vamos criar conteúdo incrível?'
        };

        const greetingElement = document.querySelector('header p');
        if (greetingElement) {
            greetingElement.textContent = greetingMap[this.userRole] || greetingMap.student;
        }

        // Update Sidebar/Header Stats (XP, Level, Keys)
        if (this.userData) {
            const xp = this.userData.xp || 0;
            const levelInfo = gamificationSystem.calculateLevel(xp);

            const levelEl = document.getElementById('userLevel');
            const xpEl = document.getElementById('userXP');
            const keysEl = document.getElementById('userKeys');

            if (levelEl) levelEl.textContent = levelInfo.level;
            if (xpEl) xpEl.textContent = xp;
            if (keysEl) keysEl.textContent = this.userData.keys || 0;
        }

        const planLabelMap = {
            'professor-pro': 'Professor PRO',
            'admin': 'Administrador',
            'dev': 'Desenvolvedor',
            'school_admin': 'Gestão Escolar'
        };
        const planEl = document.getElementById('userPlanLabel');
        if (planEl) {
            planEl.textContent = planLabelMap[this.userRole]
                || (this.userData?.subscription?.plan === 'free' || !this.userData?.subscription?.plan ? 'Plano Gratuito' : this.userData.subscription.plan);
        }
    }


    renderQuickActions() {
        const container = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        if (!container) return;

        const actionsMap = {
            'dev': this.getDevActions(),
            'school_admin': this.getSchoolAdminActions(),
            'freelance_teacher': this.getFreelanceActions(), // New Role
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
                title: 'Estúdio de Criação IA',
                description: 'Gere planos de aula e roteiros Arduino com Gemini 2.0 Pro.',
                icon: 'plus',
                href: 'create-project.html',
                gradient: 'from-brand-600 to-brand-700',
                textColor: 'white'
            },
            {
                title: 'Meu Arsenal Maker',
                description: 'Acesse e gerencie seus projetos, códigos e materiais salvos.',
                icon: 'book',
                href: 'my-projects.html',
                bgColor: 'bg-white',
                borderColor: 'border-brand-200'
            },
            {
                title: 'Assistente Pedagógico',
                description: 'Consultoria instantânea para metodologias STEAM e BNCC.',
                icon: 'tool',
                href: 'ia-assistant.html',
                bgColor: 'bg-white',
                borderColor: 'border-purple-200'
            },
            {
                title: 'Academia do Professor',
                description: 'Trilhas práticas de Arduino, Scratch e mais — primeiro módulo grátis.',
                icon: 'book-open',
                href: 'academia.html',
                bgColor: 'bg-white',
                borderColor: 'border-amber-200'
            }
        ];
    }

    getFreelanceActions() {
        return [
            {
                title: 'Estúdio de Projetos IA',
                description: 'Crie roteiros de elite para suas aulas particulares.',
                icon: 'plus',
                href: 'create-project.html',
                gradient: 'from-brand-600 to-brand-700',
                textColor: 'white'
            },
            {
                title: 'Hub de Projetos Arduino',
                description: 'Explore a biblioteca oficial de roteiros prontos Izicode.',
                icon: 'library',
                href: 'arduino-projects.html',
                bgColor: 'bg-white',
                borderColor: 'border-amber-200'
            },
            {
                title: 'Consultoria IA',
                description: 'Tire dúvidas técnicas e pedagógicas em tempo real.',
                icon: 'tool',
                href: 'ia-assistant.html',
                bgColor: 'bg-white',
                borderColor: 'border-emerald-200'
            },
            {
                title: 'Academia do Professor',
                description: 'Trilhas práticas de Arduino, Scratch e mais — primeiro módulo grátis.',
                icon: 'book-open',
                href: 'academia.html',
                bgColor: 'bg-white',
                borderColor: 'border-amber-200'
            }
        ];
    }

    getStudentActions() {
        return [
            {
                title: 'Arena de Quiz',
                description: 'Desafie seus conhecimentos e suba no ranking.',
                icon: 'quiz',
                href: 'quiz-arena.html',
                gradient: 'from-brand-600 to-indigo-600',
                textColor: 'white'
            },
            {
                title: 'Meus Projetos',
                description: 'Continue seus projetos em andamento',
                icon: 'book',
                href: 'my-projects.html',
                bgColor: 'bg-white',
                borderColor: 'border-brand-200'
            },
            {
                title: 'Biblioteca',
                description: 'Conhecer novos projetos e tutoriais',
                icon: 'library',
                href: 'library.html',
                bgColor: 'bg-white',
                borderColor: 'border-brand-100'
            }
        ];
    }

    getParentActions() {
        return [
            {
                title: 'Izicode em Casa',
                description: 'Plataforma de lógica e desafios maker',
                icon: 'home',
                href: 'student-area.html',
                gradient: 'from-emerald-500 to-emerald-600',
                textColor: 'white'
            },
            {
                title: 'Quizzes e Desafios',
                description: 'Testar conhecimentos com toda a família',
                icon: 'quiz',
                href: 'quiz-arena.html',
                bgColor: 'bg-white/80',
                borderColor: 'border-brand-300'
            },
            {
                title: 'Progresso',
                description: 'Acompanhar o desenvolvimento do aluno',
                icon: 'chart',
                href: 'student-area.html',
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

    getDevActions() {
        // Dev sees ONLY Admin Panel + Data
        return [
            {
                title: 'Painel Administrativo',
                description: 'Gerenciar escolas, acessos e usuários',
                icon: 'tool',
                href: 'platform-admin.html',
                gradient: 'from-slate-900 to-red-900',
                textColor: 'white'
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
                    <h3 class="font-display text-2xl font-bold mb-2 ${isGradient ? '' : 'text-slate-900'}">${action.title}</h3>
                    <p class="${isGradient ? 'text-brand-100' : 'text-slate-600'}">${action.description}</p>
                </div>
            </a>
        `;
    }

    getIconSvg(iconName) {
        const icons = {
            'plus': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>',
            'library': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
            'book': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
            'users': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
            'chart': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>',
            'award': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>',
            'home': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>',
            'quiz': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
            'tool': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>',
            'file': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
            'sparkle': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>',
            'target': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>',
            'sun': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>',
            'code': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>',
            'star': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>',
            'bolt': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
            'bot': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>',
            'check-circle': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
            'clock': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
            'gamepad': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m-7-4h2m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>',
            'moon': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>',
            'crown': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>',
            'file-text': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
            'brain': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>',
            'medal': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" /></svg>',
            'zap': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
            'level-1': '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>',
            'level-2': '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>',
            'level-3': '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>',
            'level-4': '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>',
            'level-5': '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>',
            'level-6': '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>',
            'level-7': '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>',
            'level-8': '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>',
            'level-9': '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
            'level-10': '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>',
            'check': '<svg class="w-6 h-6 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>',
            'ai': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
            'build': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>',
            'folder': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>',
            'book-open': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
            'key': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m-2 4a2 2 0 012 2m-2-4a2 2 0 012-2m-2 4h.01M17 7h.01M13 5H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-3.586A1 1 0 0113.293 11l-1.293-1.293a1 1 0 00-.707-.293H11V8a1 1 0 00-1-1H9a1 1 0 00-1 1v1h1V8h1v1h1c.552 0 1 .448 1 1v1.293l1.293 1.293a1 1 0 00.707.293H15V7h.01z" /></svg>'
        };
        return icons[iconName] || icons.plus;
    }

    async renderRoleWidgets() {
        const widgetsContainer = document.getElementById('role-widgets');
        if (!widgetsContainer) {
            console.warn("Dashboard container #role-widgets not found");
            return;
        }

        let widgetsHtml = '';

        try {
            switch (this.userRole) {
                case 'dev':
                    const stats = await this.fetchPlatformStats();
                    widgetsHtml = this.getDevWidgets(stats);
                    break;
                case 'school_admin':
                    const sStats = await this.fetchSchoolStats();
                    widgetsHtml = this.getSchoolAdminWidgets(sStats);
                    break;
                case 'freelance_teacher':
                case 'teacher':
                case 'professor-pro':
                    const projectsCount = await this.fetchProjectsCount();
                    const recentProjects = await this.fetchRecentProjects();
                    // Widget mostra "TOP Global Alunos" — o filtro precisa ser de papéis de aluno, não de professor.
                    const leaderboard = await this.fetchLeaderboard(['student', 'maker']);
                    widgetsHtml = this.getTeacherWidgets(projectsCount, recentProjects, leaderboard, this.userData);
                    break;
                case 'consultant':
                    widgetsHtml = this.getConsultantWidgets();
                    break;
                case 'student':
                    const sLeaderboard = await this.fetchLeaderboard(['student']);
                    widgetsHtml = this.getStudentWidgets(this.userData, sLeaderboard);
                    break;
                case 'parent':
                    widgetsHtml = this.getParentWidgets();
                    break;
                default:
                    widgetsHtml = this.getStudentWidgets();
            }
        } catch (e) {
            console.error("Error rendering dashboard:", e);
            widgetsHtml = `<div class="p-4 text-red-500 bg-red-50 rounded-lg">Erro ao carregar dashboard: ${e.message}</div>`;
        }

        widgetsContainer.innerHTML = widgetsHtml;
    }

    async fetchRecentProjects() {
        try {
            const projectsRef = collection(db, "users", this.currentUser.uid, "projects");
            const q = query(projectsRef, orderBy("createdAt", "desc"), limit(5));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error("Erro ao buscar projetos recentes:", e);
            return [];
        }
    }

    async fetchProjectsCount() {
        try {
            const projectsRef = collection(db, "users", this.currentUser.uid, "projects");
            const snapshot = await getCountFromServer(projectsRef);
            return snapshot.data().count;
        } catch (e) {
            console.error("Erro ao contar projetos:", e);
            // Fallback if getCountFromServer (aggregation) fails or is not available in this SDK version, 
            // though it should be. If not, we can just get docs.
            try {
                const snapshot = await getDocs(query(projectsRef));
                return snapshot.size;
            } catch (err) {
                return 0;
            }
        }
    }

    async fetchLeaderboard(targetRoles) {
        // Firestore now scopes cross-user reads to the requester's own
        // school (see firestore.rules), so there is no valid query for a
        // user with no schoolId (e.g. an independent freelance teacher).
        const schoolId = this.userData?.schoolId;
        if (!schoolId) return [];

        try {
            const roles = Array.isArray(targetRoles) ? targetRoles : [targetRoles];
            const usersRef = collection(db, "users");

            // Using "in" operator for roles
            const q = query(
                usersRef,
                where("schoolId", "==", schoolId),
                where("role", "in", roles),
                orderBy("xp", "desc"),
                limit(10)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => d.data());
        } catch (e) {
            console.warn("Leaderboard index missing or 'in' query failed, falling back to client-side filter:", e);
            try {
                const roles = Array.isArray(targetRoles) ? targetRoles : [targetRoles];
                const usersRef = collection(db, "users");
                const qFallback = query(usersRef, where("schoolId", "==", schoolId), orderBy("xp", "desc"), limit(500)); // Increase fallback limit
                const snapshot = await getDocs(qFallback);
                return snapshot.docs
                    .map(d => d.data())
                    .filter(u => roles.includes(u.role))
                    .slice(0, 10);
            } catch (err) {
                console.error("Deep Leaderboard Failure:", err);
                return [];
            }
        }
    }

    getTeacherWidgets(projectsCount = 0, recentProjects = [], leaderboard = [], userData = {}) {
        const safeData = userData || {};
        const xp = safeData.xp || 0;
        const level = Math.floor(xp / 1000) + 1;
        const nextLevelXp = level * 1000;
        const progressPct = ((xp % 1000) / 1000) * 100;

        // Dynamic Quick Actions
        const actionsData = this.userRole === 'freelance_teacher' ? this.getFreelanceActions() : this.getTeacherActions();
        const actionsHtml = actionsData.map(action => this.createActionCard(action)).join('');

        const recentHtml = recentProjects.length > 0
            ? recentProjects.map(p => `
                <div class="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-500 cursor-pointer overflow-hidden mb-3" onclick="window.location.href='project-view.html?userProject=${p.id}'">
                    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-400 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-5">
                            <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-50 transition-colors">
                                ${this.getIconSvg('file')}
                            </div>
                            <div class="flex flex-col">
                                <span class="font-display font-black text-slate-800 text-lg group-hover:text-brand-600 transition-colors tracking-tight">${p.title}</span>
                                <div class="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span class="bg-slate-100 px-2.5 py-1 rounded-lg font-bold text-slate-600 uppercase tracking-tighter">${p.grade || 'Geral'}</span>
                                    <span class="flex items-center gap-1">
                                        ${this.getIconSvg('clock').replace('w-6 h-6', 'w-3 h-3')}
                                        ${p.createdAt ? new Date(p.createdAt.toDate()).toLocaleDateString('pt-BR') : 'Hoje'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </div>
                    </div>
                </div>
            `).join('')
            : `
            <div class="text-center py-16 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-brand-600 shadow-inner mx-auto mb-6">
                    ${this.getIconSvg('sparkle').replace('w-6 h-6', 'w-10 h-10')}
                </div>
                <h3 class="font-display text-xl font-bold text-slate-700 mb-2">Seu arsenal está vazio</h3>
                <p class="text-slate-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">Crie planos de aula profissionais e roteiros Arduino com o poder da nossa Inteligência Artificial.</p>
                <a href="create-project.html" class="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-200">
                    Começar Agora
                </a>
            </div>`;

        const leaderboardHtml = leaderboard.length > 0 ? leaderboard.map((u, i) => {
            const medal = i === 0 ? 'crown' : i === 1 ? 'award' : i === 2 ? 'star' : null;
            const medalColor = i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-700' : 'text-slate-300';
            return `
                <div class="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-all mb-1 group">
                    <div class="flex items-center gap-4">
                        <span class="font-black text-sm w-6 text-center ${medalColor} group-hover:scale-110 transition-transform">
                            ${medal ? this.getIconSvg(medal).replace('w-6 h-6', 'w-5 h-5') : `${i + 1}º`}
                        </span>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full ring-2 ring-white shadow-sm flex items-center justify-center overflow-hidden bg-slate-100">
                                 ${u.photoURL ? `<img src="${u.photoURL}" class="w-full h-full object-cover">` : `<span class="text-xs font-black text-brand-600">${(u.displayName || 'U').charAt(0)}</span>`}
                            </div>
                            <div class="flex flex-col">
                                <span class="font-bold text-sm text-slate-800 truncate max-w-[120px]">${(u.displayName || 'Mestre').split(' ')[0]}</span>
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${u.role === 'professor-pro' ? 'PRO' : 'Elite'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="block font-black text-xs text-brand-600">${u.xp || 0}</span>
                        <span class="block text-[8px] font-black text-slate-400 uppercase tracking-tighter">XP TOTAL</span>
                    </div>
                </div>
            `;
        }).join('') : '<div class="text-center py-8 text-slate-400 text-sm">Aguardando rankings...</div>';

        return `
            <!-- Analytics Summary -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div class="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                        ${this.getIconSvg('folder')}
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Meus Roteiros</p>
                        <p class="text-3xl font-black text-slate-900 leading-none">${projectsCount}</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div class="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        ${this.getIconSvg('bot')}
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aulas Geradas (IA)</p>
                        <p class="text-3xl font-black text-slate-900 leading-none">${Math.min(projectsCount, 12)}</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        ${this.getIconSvg('book-open')}
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Matérias Oficiais</p>
                        <p class="text-3xl font-black text-slate-900 leading-none">8</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        ${this.getIconSvg('key')}
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tokens Disponíveis</p>
                        <p class="text-3xl font-black text-slate-900 leading-none">${userData.keys || 10}</p>
                    </div>
                </div>
            </div>

            <!-- Hero Progress Banner -->
            <div class="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden mb-12 border border-white/5">
                <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-600/30 blur-[150px] rounded-full -mr-48 -mt-48"></div>
                <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full -ml-40 -mb-40"></div>
                
                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div class="flex items-center gap-8">
                        <div class="relative group">
                            <div class="w-32 h-32 rounded-[2.5rem] gradient-brand flex items-center justify-center text-6xl font-black shadow-2xl group-hover:rotate-6 transition-all duration-700">
                                <span>${level}</span>
                            </div>
                            <div class="absolute -bottom-3 -right-3 bg-white text-brand-600 text-[10px] font-black px-4 py-1.5 rounded-full border-4 border-slate-900 shadow-xl">NÍVEL</div>
                        </div>
                        <div class="text-center md:text-left">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-4">
                                <span class="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
                                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-brand-100">Status: Educator Elite</span>
                            </div>
                            <h2 class="text-4xl md:text-6xl font-black mb-2 font-display tracking-tighter leading-tight">Mestre da Inovação</h2>
                            <p class="text-slate-400 text-lg md:text-xl font-medium">Você tem <span class="text-brand-400">${xp} XP</span>. Faltam <span class="text-white">${nextLevelXp - xp} XP</span> para o próximo nível.</p>
                        </div>
                    </div>
                    <div class="w-full md:w-[320px]">
                        <div class="flex justify-between items-end mb-4 font-display">
                            <div class="flex flex-col">
                                <span class="text-[10px] font-black text-brand-300 uppercase tracking-widest">Seu Progresso</span>
                                <span class="text-3xl font-black">${Math.round(progressPct)}%</span>
                            </div>
                            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nível ${level + 1}</span>
                        </div>
                        <div class="w-full bg-white/5 rounded-full h-4 backdrop-blur-xl p-1 border border-white/10">
                            <div class="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 h-2 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(14,165,233,0.5)]" style="width: ${progressPct}%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Actions Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                ${actionsHtml}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <!-- Primary View: Recent Projects & Tools -->
                <div class="lg:col-span-2 space-y-12">
                    <!-- Recent Creative Arsenal -->
                    <div class="animate-in fade-in slide-in-from-bottom duration-700">
                        <div class="flex items-center justify-between mb-8">
                            <div>
                                <h3 class="font-display text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <span class="w-1.5 h-8 bg-brand-600 rounded-full"></span>
                                    Planejamentos Recentes
                                </h3>
                                <p class="text-slate-500 text-sm mt-1">Gere novos roteiros para suas aulas de amanhã.</p>
                            </div>
                            <a href="my-projects.html" class="px-5 py-2.5 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-slate-900 hover:text-white transition-all">Ver Histórico</a>
                        </div>
                        <div class="space-y-4">
                            ${recentHtml}
                        </div>
                    </div>

                    <!-- Hub Arduino Promo Card -->
                    <div class="relative overflow-hidden rounded-[3rem] bg-indigo-600 text-white p-10 md:p-14 group shadow-2xl shadow-indigo-100 cursor-pointer border border-indigo-400/20" onclick="window.location.href='arduino-projects.html'">
                        <div class="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-600 to-brand-600 group-hover:scale-105 transition-transform duration-1000"></div>
                        <div class="absolute -right-20 -bottom-20 opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                           <img src="/images/logo.png" class="w-[500px]">
                        </div>
                        <div class="relative z-10">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-6 uppercase text-[10px] font-black tracking-widest">Novos Projetos Disponíveis</div>
                            <h3 class="text-4xl md:text-5xl font-black mb-6 font-display tracking-tighter leading-[1.1]">Biblioteca Oficial<br>Arduino Izicode</h3>
                            <p class="text-indigo-100 text-lg md:text-xl max-w-lg mb-8 leading-relaxed font-medium">Acesse esquemas reais, códigos prontos e roteiros pedagógicos alinhados à BNCC para seus alunos.</p>
                            <span class="inline-flex items-center gap-3 bg-white text-indigo-700 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:shadow-2xl transition-all">
                                Explorar Biblioteca
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Secondary View: Leaderboard & Stats -->
                <div class="space-y-10">
                    <!-- Ranking of Masters -->
                    <div class="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-brand-50 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand-100 transition-colors"></div>
                        <div class="flex items-center justify-between mb-8 relative z-10">
                            <h3 class="font-display font-black text-xl text-slate-800 tracking-tight">Mestres de Elite</h3>
                            <div class="flex items-center gap-1.5 py-1 px-3 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Ao Vivo
                            </div>
                        </div>
                        <div class="space-y-2 relative z-10">
                             ${leaderboardHtml}
                        </div>
                        <div class="mt-8 pt-6 border-t border-slate-50 text-center relative z-10">
                            <button class="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-600 transition-colors">Global Ranking</button>
                        </div>
                    </div>

                    <!-- Pedagogical Tip of the Day -->
                    <div id="sidebarTip" class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3rem] p-10 border border-amber-100 shadow-sm relative overflow-hidden">
                        <div class="absolute top-0 right-0 p-8 text-amber-400 opacity-10">${this.getIconSvg('sparkle').replace('w-6 h-6', 'w-24 h-24')}</div>
                        <span class="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] block mb-4">Insight Maker</span>
                        <p class="text-amber-900 font-bold leading-relaxed text-lg italic mb-6">"Use o Erro como Ferramenta: Na robótica, um motor que não gira é uma oportunidade de ensinar sobre circuitos, não uma falha."</p>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-500">${this.getIconSvg('sparkle')}</div>
                            <span class="text-amber-700/60 text-xs font-black uppercase tracking-widest">#DicaIzicode</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getStudentWidgets(userData = {}, leaderboard = []) {
        const safeData = userData || {};
        const missions = safeData.missionsProgress || {};
        const xp = safeData.xp || 0;
        const levelInfo = gamificationSystem.calculateLevel(xp);
        const progress = gamificationSystem.calculateProgress(xp);
        const earnedBadgesIds = safeData.badges || [];

        // Map badges
        const badgesHtml = gamificationSystem.badges.map(badge => {
            const isEarned = earnedBadgesIds.includes(badge.id);
            const opacity = isEarned ? 'opacity-100 scale-100' : 'opacity-20 scale-90 grayscale';
            return `
                <div class="flex flex-col items-center group relative cursor-help">
                    <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-50 flex items-center justify-center transition-all duration-500 ${opacity} group-hover:scale-110 shadow-sm border border-slate-100 ${isEarned ? 'text-brand-600' : 'text-slate-300'}">
                        ${this.getIconSvg(badge.icon)}
                    </div>
                    <span class="text-[9px] font-black text-slate-400 mt-2 uppercase tracking-tighter text-center">${badge.name}</span>
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-white text-[10px] rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        ${badge.description}
                        <div class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <!-- Student Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                    <div class="relative z-10 flex items-center justify-between">
                        <div>
                            <p class="text-[10px] font-black text-brand-300 uppercase tracking-widest mb-1">Nível Atual</p>
                            <h3 class="text-5xl font-black font-display tracking-tighter">${levelInfo.level}</h3>
                            <p class="text-sm font-medium text-slate-400 mt-2">${levelInfo.name}</p>
                        </div>
                        <div class="text-brand-500 opacity-40 group-hover:scale-110 transition-transform duration-500">
                            ${this.getIconSvg(levelInfo.icon)}
                        </div>
                    </div>
                    <div class="mt-8">
                        <div class="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">
                            <span>Progresso</span>
                            <span>${progress}%</span>
                        </div>
                        <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div class="bg-brand-500 h-full rounded-full transition-all duration-1000" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Experiência Total</p>
                        <h3 class="text-4xl font-black text-slate-900">${xp} XP</h3>
                    </div>
                    <div class="flex gap-2 mt-6">
                        <span class="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full border border-green-100 uppercase tracking-tighter">Ativo Hoje</span>
                        <span class="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-black rounded-full border border-brand-100 uppercase tracking-tighter">${earnedBadgesIds.length} Conquistas</span>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-indigo-600 to-brand-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-brand-200 transition-all border border-white/10" onclick="window.location.href='quiz-arena.html'">
                    <div class="relative z-10">
                        <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                            ${this.getIconSvg('award')}
                        </div>
                        <h4 class="text-2xl font-black font-display tracking-tight leading-tight mb-2">Arena de Quiz<br>Desafio Semanal</h4>
                        <p class="text-brand-100 text-sm font-medium">Ganhe XP dobrado hoje!</p>
                    </div>
                    <div class="absolute -right-8 -bottom-8 text-9xl opacity-10 font-black">?</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <!-- Conquistas Section -->
                <div class="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm self-start">
                    <div class="flex items-center justify-between mb-8">
                        <h3 class="font-display text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span class="w-1.5 h-8 bg-brand-600 rounded-full"></span>
                            Minhas Insígnias
                        </h3>
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${earnedBadgesIds.length} / ${gamificationSystem.badges.length}</span>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        ${badgesHtml}
                    </div>
                </div>

                <!-- Daily Missions -->
                <div class="space-y-8">
                    <h3 class="font-display text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span class="w-1.5 h-8 bg-purple-600 rounded-full"></span>
                        Missões Diárias
                    </h3>
                    <div class="space-y-4">
                        ${gamificationSystem.dailyMissions.map(mission => {
            const mProgress = missions[mission.id] || { progress: 0, completed: false };
            const isDone = mProgress.completed;
            const target = mission.target || 1;
            const progressPct = (mProgress.progress / target) * 100;

            return `
                                <div class="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-200 transition-all">
                                    <div class="flex items-center gap-4 relative z-10">
                                        <div class="w-12 h-12 rounded-xl ${isDone ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'} flex items-center justify-center group-hover:scale-110 transition-transform">
                                            ${this.getIconSvg(isDone ? 'check' : (mission.icon || 'star'))}
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-black text-slate-900 mb-0.5">${mission.name}</p>
                                            <p class="text-[10px] font-medium text-slate-500">${mission.description}</p>
                                            ${!isDone && target > 1 ? `
                                                <div class="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                                    <div class="bg-brand-500 h-full transition-all duration-500" style="width: ${progressPct}%"></div>
                                                </div>
                                            ` : ''}
                                        </div>
                                        <div class="text-right">
                                            <span class="block text-xs font-black text-brand-600">+${mission.xp} XP</span>
                                            ${mission.keys ? `<span class="block text-[8px] font-black text-amber-500 uppercase flex items-center gap-1 justify-end">${this.getIconSvg('key').replace('w-6 h-6', 'w-3 h-3')} +${mission.keys}</span>` : ''}
                                        </div>
                                    </div>
                                    ${isDone ? '<div class="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span class="bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-full">CONCLUÍDO</span></div>' : ''}
                                </div>
                            `;
        }).join('')}
                    </div>

                    <!-- Ranking Preview -->
                    <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div class="absolute top-0 right-0 p-6 text-amber-400 opacity-10 rotate-12">${this.getIconSvg('award').replace('w-6 h-6', 'w-14 h-14')}</div>
                        <h4 class="text-xl font-black mb-4 font-display tracking-tight uppercase tracking-widest text-[10px] text-brand-400">TOP Global Alunos</h4>
                        <div class="space-y-4">
                            ${leaderboard.length > 0 ? leaderboard.slice(0, 3).map((u, i) => `
                                <div class="flex items-center gap-4 group">
                                    <span class="text-lg font-black ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : 'text-amber-700'} w-6">${i + 1}º</span>
                                    <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs uppercase">${u.name?.[0] || 'U'}</div>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-bold truncate max-w-[120px]">${u.name || 'Anônimo'}</span>
                                        <span class="text-[8px] uppercase tracking-widest opacity-50">Lvl ${Math.floor((u.xp || 0) / 1000) + 1}</span>
                                    </div>
                                    <span class="ml-auto text-xs font-black text-brand-400">${((u.xp || 0) / 1000).toFixed(1)}k XP</span>
                                </div>
                            `).join('') : '<p class="text-xs text-slate-500">Nenhum dado no ranking ainda.</p>'}
                        </div>
                        <button onclick="window.location.href='ranking.html'" class="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Ver Ranking Completo</button>
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

    async fetchPlatformStats() {
        try {
            // Parallel Fetch for speed
            const [usersSnap, schoolsSnap] = await Promise.all([
                getDocs(collection(db, "users")),
                getDocs(collection(db, "schools"))
            ]);

            const users = usersSnap.docs.map(d => d.data());
            const schools = schoolsSnap.docs.map(d => d.data());

            // Aggregation
            return {
                totalSchools: schools.length,
                fullSchools: schools.filter(s => s.plan === 'full').length,
                totalUsers: users.length,
                teachers: users.filter(u => u.role === 'teacher').length,
                students: users.filter(u => u.role === 'student').length,
                freelancers: users.filter(u => u.role === 'freelance_teacher').length,
                consultants: users.filter(u => u.role === 'consultant').length
            };
        } catch (e) {
            console.error("Stats Error:", e);
            return null;
        }
    }

    // Same shape as fetchPlatformStats() but scoped to the admin's own
    // school, since Firestore rules only let a school_admin read users
    // that share their schoolId (see firestore.rules).
    async fetchSchoolStats() {
        const schoolId = this.userData?.schoolId;
        if (!schoolId) return null;

        try {
            const usersSnap = await getDocs(query(collection(db, "users"), where("schoolId", "==", schoolId)));
            const users = usersSnap.docs.map(d => d.data());

            return {
                totalUsers: users.length,
                teachers: users.filter(u => u.role === 'teacher').length,
                students: users.filter(u => u.role === 'student').length
            };
        } catch (e) {
            console.error("School Stats Error:", e);
            return null;
        }
    }

    getDevWidgets(stats) {
        if (!stats) return '<div class="text-center">Erro ao carregar dados.</div>';

        // Calc Percentages for Bar Chart
        const total = stats.totalUsers || 1; // avoid zero div
        const tPct = (stats.teachers / total) * 100;
        const sPct = (stats.students / total) * 100;
        const fPct = (stats.freelancers / total) * 100;

        return `
            <div class="space-y-6">
                <!-- KPI Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200">
                        <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Escolas</p>
                        <div class="flex items-end gap-3">
                            <span class="text-4xl font-display font-bold text-slate-900">${stats.totalSchools}</span>
                            <span class="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full mb-1">
                                ${stats.fullSchools} PRO
                            </span>
                        </div>
                    </div>
                    
                    <div class="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200">
                        <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Usuários</p>
                        <span class="text-4xl font-display font-bold text-slate-900">${stats.totalUsers}</span>
                    </div>

                    <div class="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200">
                        <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Consultores</p>
                        <span class="text-4xl font-display font-bold text-purple-600">${stats.consultants}</span>
                    </div>
                    
                    <div class="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200">
                        <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Autônomos</p>
                        <span class="text-4xl font-display font-bold text-brand-600">${stats.freelancers}</span>
                    </div>
                </div>

                <!-- Distribution Chart -->
                <div class="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-slate-200">
                    <h3 class="font-display text-xl font-bold text-slate-900 mb-6">Distribuição de Usuários</h3>
                    
                    <div class="space-y-4">
                        <!-- Teachers -->
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="font-bold text-slate-600">Professores (Inst.)</span>
                                <span class="text-slate-500">${stats.teachers} (${tPct.toFixed(1)}%)</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div class="bg-brand-500 h-3 rounded-full transition-all duration-1000" style="width: ${tPct}%"></div>
                            </div>
                        </div>

                        <!-- Students -->
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="font-bold text-slate-600">Alunos</span>
                                <span class="text-slate-500">${stats.students} (${sPct.toFixed(1)}%)</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div class="bg-green-500 h-3 rounded-full transition-all duration-1000" style="width: ${sPct}%"></div>
                            </div>
                        </div>

                        <!-- Freelancers -->
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="font-bold text-slate-600">Autônomos</span>
                                <span class="text-slate-500">${stats.freelancers} (${fPct.toFixed(1)}%)</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div class="bg-purple-500 h-3 rounded-full transition-all duration-1000" style="width: ${fPct}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSchoolAdminWidgets(stats) {
        if (!stats) return '<div class="text-center">Erro ao carregar dados da escola.</div>';

        const studentsPerTeacher = stats.teachers > 0 ? Math.round(stats.students / stats.teachers) : null;

        return `
            <!-- School Overview Hero -->
            <div class="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden mb-12 border border-white/5">
                <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-600/30 blur-[150px] rounded-full -mr-48 -mt-48"></div>
                <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full -ml-40 -mb-40"></div>
                
                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div class="flex items-center gap-8">
                        <div class="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-2xl">
                            ${this.getIconSvg('home').replace('w-6 h-6', 'w-10 h-10')}
                        </div>
                        <div class="text-center md:text-left">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-4">
                                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-brand-100">${stats.totalUsers} membros na plataforma</span>
                            </div>
                            <h2 class="text-4xl md:text-6xl font-black mb-2 font-display tracking-tighter leading-tight">Gestão Escolar</h2>
                            <p class="text-slate-400 text-lg md:text-xl font-medium">Monitorando a evolução tecnológica da sua escola.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div class="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">${this.getIconSvg('users').replace('w-6 h-6', 'w-8 h-8')}</div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Corpo Docente</p>
                    <p class="text-4xl font-black text-slate-900">${stats.teachers || 0} Professores</p>
                </div>
                <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div class="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">${this.getIconSvg('book-open').replace('w-6 h-6', 'w-8 h-8')}</div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Engajamento Alunos</p>
                    <p class="text-4xl font-black text-slate-900">${stats.students || 0} Alunos Ativos</p>
                </div>
                <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">${this.getIconSvg('chart').replace('w-6 h-6', 'w-8 h-8')}</div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Comunidade Total</p>
                    <p class="text-4xl font-black text-slate-900">${stats.totalUsers || 0} Membros</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Management Shortcuts -->
                <div class="space-y-8">
                    <h3 class="font-display text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span class="w-1.5 h-8 bg-slate-900 rounded-full"></span>
                        Ações Administrativas
                    </h3>
                    <div class="grid grid-cols-1 gap-4">
                        <a href="school-management.html" class="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 hover:border-brand-300 hover:shadow-lg transition-all group">
                            <div class="flex items-center gap-5">
                                <div class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600">${this.getIconSvg('users').replace('w-6 h-6', 'w-5 h-5')}</div>
                                <span class="font-black text-slate-800">Gerenciar Professores e Turmas</span>
                            </div>
                            <svg class="w-5 h-5 text-slate-400 group-hover:text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </a>
                        <a href="library.html" class="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 hover:border-purple-300 hover:shadow-lg transition-all group">
                            <div class="flex items-center gap-5">
                                <div class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-purple-50 group-hover:text-purple-600">${this.getIconSvg('book-open').replace('w-6 h-6', 'w-5 h-5')}</div>
                                <span class="font-black text-slate-800">Biblioteca Currículo Oficial</span>
                            </div>
                            <svg class="w-5 h-5 text-slate-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Growth Insight -->
                <div class="bg-gradient-to-br from-indigo-50 to-brand-50 rounded-[3rem] p-10 border border-indigo-100 shadow-sm relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-8 text-indigo-400 opacity-10">${this.getIconSvg('chart').replace('w-6 h-6', 'w-24 h-24')}</div>
                    <span class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] block mb-4">Panorama da Escola</span>
                    <h4 class="text-2xl font-black text-slate-900 mb-4">Corpo Docente e Discente</h4>
                    <p class="text-slate-600 font-medium leading-relaxed mb-4">${stats.totalUsers} pessoas cadastradas na plataforma: ${stats.teachers} professor(es) e ${stats.students} aluno(s).</p>
                    ${studentsPerTeacher !== null
                    ? `<p class="text-indigo-700 font-black">${studentsPerTeacher} aluno(s) por professor em média.</p>`
                    : `<p class="text-slate-500 text-sm">Cadastre professores para ver a proporção aluno/professor.</p>`}
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
            'dev': ['dashboard', 'library', 'school-management', 'create-project', 'my-projects', 'quiz-arena', 'student-area'],
            'school_admin': ['dashboard', 'library', 'school-management'],
            'freelance_teacher': ['dashboard', 'library', 'create-project', 'my-projects', 'quiz-arena', 'ia-assistant'],
            'teacher': ['dashboard', 'my-projects', 'library', 'create-project', 'quiz-arena', 'school-management', 'ia-assistant'],
            'professor-pro': ['dashboard', 'my-projects', 'library', 'create-project', 'quiz-arena', 'school-management', 'ia-assistant'],
            'student': ['dashboard', 'my-projects', 'library', 'student-area', 'quiz-arena'],
            'parent': ['dashboard', 'library', 'quiz-arena', 'student-area'],
            'consultant': ['dashboard', 'my-projects', 'library', 'create-project', 'ia-assistant']
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
