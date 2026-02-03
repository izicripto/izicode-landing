/**
 * Dashboard Manager - Lógica funcional para todos os dashboards
 * Conecta com Firestore e gerencia dados reais
 */

import { auth, db, onAuthStateChanged } from './firebase-config.js';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from './firebase-config.js';
import { UserManager, ClassManager, ChallengeManager, ProgressManager, BadgeManager } from './database.js';

class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.userManager = new UserManager();
        this.classManager = new ClassManager();
        this.challengeManager = new ChallengeManager();
        this.progressManager = new ProgressManager();
        this.badgeManager = new BadgeManager();
    }

    /**
     * Inicializar dashboard baseado no role do usuário
     */
    async init() {
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    window.location.href = '/login.html';
                    return;
                }

                try {
                    // Buscar dados do usuário no Firestore
                    this.currentUser = await this.userManager.getUser(user.uid);

                    if (!this.currentUser) {
                        console.error('Usuário não encontrado no Firestore');
                        window.location.href = '/onboarding.html';
                        return;
                    }

                    // Renderizar dashboard baseado no role
                    await this.renderDashboard(this.currentUser.role);
                    resolve(this.currentUser);
                } catch (error) {
                    console.error('Erro ao inicializar dashboard:', error);
                    reject(error);
                }
            });
        });
    }

    /**
     * Renderizar dashboard específico por role
     */
    async renderDashboard(role) {
        switch (role) {
            case 'aluno':
                await this.renderStudentDashboard();
                break;
            case 'professor-autonomo':
                await this.renderAutonomousTeacherDashboard();
                break;
            case 'professor-escola':
                await this.renderSchoolTeacherDashboard();
                break;
            case 'admin':
                await this.renderAdminDashboard();
                break;
            default:
                console.error('Role desconhecido:', role);
        }
    }

    /**
     * Dashboard do Aluno
     */
    async renderStudentDashboard() {
        const userId = this.currentUser.uid;

        // Atualizar informações do usuário
        this.updateUserInfo();

        // Buscar progresso do aluno
        const progress = await this.progressManager.getStudentProgress(userId);

        // Buscar badges do aluno
        const userBadges = await this.badgeManager.getUserBadges(userId);

        // Buscar desafios disponíveis
        const challenges = await this.challengeManager.listChallenges({ isPublic: true });

        // Renderizar componentes
        this.renderStudentStats(this.currentUser, progress);
        this.renderStudentBadges(userBadges);
        this.renderStudentChallenges(challenges, progress);
        this.renderStudentRanking();
    }

    /**
     * Dashboard do Professor Autônomo
     */
    async renderAutonomousTeacherDashboard() {
        const userId = this.currentUser.uid;

        // Atualizar informações do usuário
        this.updateUserInfo();

        // Buscar cursos em andamento (simulado por enquanto)
        const ongoingCourses = await this.getOngoingCourses(userId);

        // Buscar certificados
        const certificates = await this.getCertificates(userId);

        // Buscar materiais da biblioteca
        const materials = await this.getLibraryMaterials();

        // Renderizar componentes
        this.renderTeacherProgress(this.currentUser);
        this.renderOngoingCourses(ongoingCourses);
        this.renderLibraryMaterials(materials);
        this.renderCertificates(certificates);
    }

    /**
     * Dashboard do Professor Escola
     */
    async renderSchoolTeacherDashboard() {
        const userId = this.currentUser.uid;

        // Atualizar informações do usuário
        this.updateUserInfo();

        // Buscar turmas do professor
        const classes = await this.classManager.getTeacherClasses(userId);

        // Buscar desafios criados
        const challenges = await this.challengeManager.listChallenges({ createdBy: userId });

        // Renderizar componentes
        this.renderTeacherClasses(classes);
        this.renderTeacherChallenges(challenges);
        this.renderQuickActions();
    }

    /**
     * Atualizar informações do usuário na UI
     */
    updateUserInfo() {
        const nameElement = document.querySelector('[data-user-name]');
        const roleElement = document.querySelector('[data-user-role]');
        const avatarElement = document.querySelector('[data-user-avatar]');

        if (nameElement) nameElement.textContent = this.currentUser.displayName || 'Usuário';
        if (roleElement) roleElement.textContent = this.getRoleLabel(this.currentUser.role);
        if (avatarElement) {
            if (this.currentUser.photoURL) {
                avatarElement.innerHTML = `<img src="${this.currentUser.photoURL}" class="w-full h-full rounded-full object-cover">`;
            } else {
                const initials = this.getInitials(this.currentUser.displayName);
                avatarElement.textContent = initials;
            }
        }
    }

    /**
     * Renderizar estatísticas do aluno
     */
    renderStudentStats(user, progress) {
        const xpElement = document.querySelector('[data-student-xp]');
        const levelElement = document.querySelector('[data-student-level]');
        const challengesElement = document.querySelector('[data-student-challenges]');
        const badgesElement = document.querySelector('[data-student-badges-count]');

        if (xpElement) xpElement.textContent = user.xp || 0;
        if (levelElement) levelElement.textContent = user.level || 1;
        if (challengesElement) challengesElement.textContent = user.challengesCompleted || 0;
        if (badgesElement) badgesElement.textContent = user.badges?.length || 0;

        // Atualizar barra de progresso do nível
        this.updateLevelProgress(user.xp, user.level);
    }

    /**
     * Renderizar badges do aluno
     */
    renderStudentBadges(userBadges) {
        const container = document.querySelector('[data-badges-container]');
        if (!container) return;

        if (userBadges.length === 0) {
            container.innerHTML = '<p class="text-slate-500 text-sm">Nenhum badge conquistado ainda. Complete desafios para ganhar badges!</p>';
            return;
        }

        container.innerHTML = userBadges.map(badge => `
            <div class="bg-white rounded-xl p-4 border-2 border-${this.getBadgeColor(badge.rarity)}-200 hover:shadow-lg transition-all">
                <div class="text-4xl mb-2">${badge.icon}</div>
                <h3 class="font-bold text-sm text-slate-900">${badge.name}</h3>
                <p class="text-xs text-slate-500">${badge.description}</p>
                <span class="inline-block mt-2 px-2 py-1 bg-${this.getBadgeColor(badge.rarity)}-100 text-${this.getBadgeColor(badge.rarity)}-700 text-xs font-bold rounded">${badge.rarity}</span>
            </div>
        `).join('');
    }

    /**
     * Renderizar desafios do aluno
     */
    renderStudentChallenges(challenges, progress) {
        const container = document.querySelector('[data-challenges-container]');
        if (!container) return;

        if (challenges.length === 0) {
            container.innerHTML = '<p class="text-slate-500 text-sm">Nenhum desafio disponível no momento.</p>';
            return;
        }

        container.innerHTML = challenges.slice(0, 6).map(challenge => {
            const userProgress = progress.find(p => p.challengeId === challenge.id);
            const isCompleted = userProgress?.status === 'completed';
            const progressPercent = userProgress?.progress || 0;

            return `
                <div class="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <h3 class="font-bold text-slate-900 mb-1">${challenge.title}</h3>
                            <p class="text-sm text-slate-600">${challenge.description}</p>
                        </div>
                        ${isCompleted ? '<span class="text-2xl">✅</span>' : ''}
                    </div>
                    
                    <div class="flex items-center gap-2 mb-3">
                        <span class="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">${challenge.platform}</span>
                        <span class="px-2 py-1 bg-${this.getDifficultyColor(challenge.difficulty)}-100 text-${this.getDifficultyColor(challenge.difficulty)}-700 text-xs rounded">${challenge.difficulty}</span>
                        <span class="text-xs text-slate-500">⚡ ${challenge.xpReward} XP</span>
                    </div>

                    ${!isCompleted ? `
                        <div class="mb-3">
                            <div class="w-full bg-slate-200 rounded-full h-2">
                                <div class="bg-brand-500 h-2 rounded-full" style="width: ${progressPercent}%"></div>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">${progressPercent}% concluído</p>
                        </div>
                    ` : ''}

                    <button onclick="dashboardManager.startChallenge('${challenge.id}')" 
                            class="w-full px-4 py-2 ${isCompleted ? 'bg-slate-100 text-slate-600' : 'bg-brand-500 text-white'} rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                        ${isCompleted ? 'Revisar' : 'Começar Desafio'}
                    </button>
                </div>
            `;
        }).join('');
    }

    /**
     * Renderizar turmas do professor
     */
    renderTeacherClasses(classes) {
        const container = document.querySelector('[data-classes-container]');
        if (!container) return;

        if (classes.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-slate-500 mb-4">Você ainda não tem turmas criadas.</p>
                    <button onclick="dashboardManager.createClass()" class="px-6 py-3 bg-brand-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                        Criar Primeira Turma
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = classes.map(cls => `
            <div class="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h3 class="font-bold text-lg text-slate-900">${cls.name}</h3>
                        <p class="text-sm text-slate-500">${cls.grade} • ${cls.year}</p>
                    </div>
                    <span class="px-3 py-1 bg-brand-100 text-brand-700 text-sm font-bold rounded-full">${cls.students?.length || 0} alunos</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-slate-50 rounded-lg p-3">
                        <p class="text-xs text-slate-500 mb-1">Desafios Ativos</p>
                        <p class="text-2xl font-bold text-slate-900">${cls.activeChallenges || 0}</p>
                    </div>
                    <div class="bg-slate-50 rounded-lg p-3">
                        <p class="text-xs text-slate-500 mb-1">Média de Progresso</p>
                        <p class="text-2xl font-bold text-slate-900">${cls.averageProgress || 0}%</p>
                    </div>
                </div>

                <button onclick="dashboardManager.viewClass('${cls.id}')" class="w-full px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                    Gerenciar Turma →
                </button>
            </div>
        `).join('');
    }

    /**
     * Métodos auxiliares
     */
    getRoleLabel(role) {
        const labels = {
            'aluno': 'Aluno',
            'professor-autonomo': 'Professor Autônomo',
            'professor-escola': 'Professor Escola',
            'admin': 'Administrador'
        };
        return labels[role] || role;
    }

    getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    getBadgeColor(rarity) {
        const colors = {
            'comum': 'slate',
            'raro': 'blue',
            'épico': 'purple',
            'lendário': 'yellow'
        };
        return colors[rarity] || 'slate';
    }

    getDifficultyColor(difficulty) {
        const colors = {
            'easy': 'green',
            'medium': 'yellow',
            'hard': 'red'
        };
        return colors[difficulty] || 'slate';
    }

    updateLevelProgress(xp, level) {
        const progressBar = document.querySelector('[data-level-progress]');
        if (!progressBar) return;

        const xpForNextLevel = this.getXPForLevel(level + 1);
        const xpForCurrentLevel = this.getXPForLevel(level);
        const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    getXPForLevel(level) {
        // Fórmula: XP = 100 * level^1.5
        return Math.floor(100 * Math.pow(level, 1.5));
    }

    /**
     * Métodos de ação (placeholders para implementação futura)
     */
    async startChallenge(challengeId) {
        console.log('Iniciando desafio:', challengeId);
        // TODO: Redirecionar para página do desafio
        alert('Funcionalidade em desenvolvimento!');
    }

    async createClass() {
        console.log('Criando turma');
        // TODO: Abrir modal de criação de turma
        alert('Funcionalidade em desenvolvimento!');
    }

    async viewClass(classId) {
        console.log('Visualizando turma:', classId);
        // TODO: Redirecionar para página da turma
        alert('Funcionalidade em desenvolvimento!');
    }

    /**
     * Métodos temporários (serão substituídos por dados reais)
     */
    async getOngoingCourses(userId) {
        // TODO: Implementar quando tivermos sistema de cursos
        return [];
    }

    async getCertificates(userId) {
        // TODO: Implementar quando tivermos sistema de certificados
        return [];
    }

    async getLibraryMaterials() {
        // TODO: Buscar da collection learningMaterials
        return [];
    }
}

// Instância global
window.dashboardManager = new DashboardManager();

// Auto-inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dashboardManager.init();
    });
} else {
    window.dashboardManager.init();
}

export default DashboardManager;
