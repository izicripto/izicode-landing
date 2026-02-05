/**
 * Sistema de Gamificação - Izicode Edu
 * Gerencia XP, níveis, badges e ranking de alunos
 */

export const gamificationSystem = {
    // Regras de pontuação
    points: {
        completeChallenge: {
            easy: 10,
            medium: 15,
            hard: 25
        },
        firstTry: 5,        // Bônus por acertar de primeira
        perfectScore: 10,   // Bônus por 100% de acerto
        helpPeer: 3,        // Ajudar colega no fórum
        dailyLogin: 1,      // Login diário
        weekStreak: 5       // 7 dias seguidos
    },

    // Sistema de níveis
    levels: [
        { level: 1, name: "Iniciante Curioso", minXP: 0, icon: "🌱", color: "green" },
        { level: 2, name: "Explorador Digital", minXP: 50, icon: "🔍", color: "blue" },
        { level: 3, name: "Programador Júnior", minXP: 150, icon: "💻", color: "purple" },
        { level: 4, name: "Maker em Treinamento", minXP: 300, icon: "🔧", color: "orange" },
        { level: 5, name: "Maker Júnior", minXP: 500, icon: "🤖", color: "cyan" },
        { level: 6, name: "Inventor Criativo", minXP: 800, icon: "💡", color: "yellow" },
        { level: 7, name: "Mestre dos Códigos", minXP: 1200, icon: "🧙", color: "indigo" },
        { level: 8, name: "Arquiteto de Soluções", minXP: 1800, icon: "🏗️", color: "pink" },
        { level: 9, name: "Inovador Tech", minXP: 2500, icon: "🚀", color: "red" },
        { level: 10, name: "Lenda Maker", minXP: 3500, icon: "👑", color: "gold" }
    ],

    // Sistema de badges/conquistas
    badges: [
        // Badges de Início
        {
            id: "first-steps",
            name: "Primeiros Passos",
            description: "Complete seu primeiro desafio",
            icon: "🎯",
            rarity: "common",
            condition: (user) => user.challengesCompleted >= 1
        },
        {
            id: "early-bird",
            name: "Madrugador",
            description: "Faça login 3 dias seguidos",
            icon: "🌅",
            rarity: "common",
            condition: (user) => user.loginStreak >= 3
        },

        // Badges por Plataforma
        {
            id: "scratch-novice",
            name: "Aprendiz Scratch",
            description: "Complete 3 desafios de Scratch",
            icon: "🐱",
            rarity: "common",
            condition: (user) => user.scratchChallenges >= 3
        },
        {
            id: "scratch-master",
            name: "Mestre do Scratch",
            description: "Complete 10 desafios de Scratch",
            icon: "🐱‍👤",
            rarity: "rare",
            condition: (user) => user.scratchChallenges >= 10
        },
        {
            id: "arduino-wizard",
            name: "Mago do Arduino",
            description: "Complete 5 desafios de Arduino",
            icon: "⚡",
            rarity: "rare",
            condition: (user) => user.arduinoChallenges >= 5
        },
        {
            id: "microbit-hero",
            name: "Herói do Micro:bit",
            description: "Complete 5 desafios de Micro:bit",
            icon: "🤖",
            rarity: "rare",
            condition: (user) => user.microbitChallenges >= 5
        },

        // Badges de Desempenho
        {
            id: "perfectionist",
            name: "Perfeccionista",
            description: "Acerte 5 desafios de primeira",
            icon: "💯",
            rarity: "epic",
            condition: (user) => user.firstTryWins >= 5
        },
        {
            id: "speed-demon",
            name: "Velocista",
            description: "Complete um desafio em menos de 5 minutos",
            icon: "⚡",
            rarity: "rare",
            condition: (user) => user.fastestCompletion <= 300
        },

        // Badges Sociais
        {
            id: "helpful-hand",
            name: "Mão Amiga",
            description: "Ajude 5 colegas no fórum",
            icon: "🤝",
            rarity: "rare",
            condition: (user) => user.helpCount >= 5
        },

        // Badges Especiais
        {
            id: "weekend-warrior",
            name: "Guerreiro de Fim de Semana",
            description: "Complete desafios em 4 fins de semana",
            icon: "🎮",
            rarity: "epic",
            condition: (user) => user.weekendSessions >= 4
        },
        {
            id: "night-owl",
            name: "Coruja Noturna",
            description: "Complete um desafio após 22h",
            icon: "🦉",
            rarity: "uncommon",
            condition: (user) => user.lateNightCompletions >= 1
        },
        {
            id: "legend",
            name: "Lenda Viva",
            description: "Alcance o nível 10",
            icon: "👑",
            rarity: "legendary",
            condition: (user) => user.level >= 10
        }
    ],

    // Calcular nível baseado em XP
    calculateLevel(xp) {
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (xp >= this.levels[i].minXP) {
                return this.levels[i];
            }
        }
        return this.levels[0];
    },

    // Calcular progresso para próximo nível
    calculateProgress(xp) {
        const currentLevel = this.calculateLevel(xp);
        const currentLevelIndex = this.levels.findIndex(l => l.level === currentLevel.level);

        if (currentLevelIndex === this.levels.length - 1) {
            return 100; // Nível máximo
        }

        const nextLevel = this.levels[currentLevelIndex + 1];
        const xpInCurrentLevel = xp - currentLevel.minXP;
        const xpNeededForNext = nextLevel.minXP - currentLevel.minXP;

        return Math.floor((xpInCurrentLevel / xpNeededForNext) * 100);
    },

    // Verificar badges conquistados
    checkBadges(user) {
        return this.badges.filter(badge => {
            // Verifica se já tem o badge
            if (user.badges && user.badges.includes(badge.id)) {
                return false;
            }
            // Verifica condição
            return badge.condition(user);
        });
    },

    // Adicionar XP e retornar se subiu de nível
    addXP(currentXP, points) {
        const oldLevel = this.calculateLevel(currentXP);
        const newXP = currentXP + points;
        const newLevel = this.calculateLevel(newXP);

        return {
            newXP,
            leveledUp: newLevel.level > oldLevel.level,
            oldLevel,
            newLevel
        };
    },

    dailyMissions: [
        {
            id: 'daily-login',
            name: 'Explorador Diário',
            description: 'Entre na plataforma hoje',
            xp: 5,
            keys: 1, // Reward 1 key
            icon: 'check',
            type: 'login'
        },
        {
            id: 'quiz-master',
            name: 'Mestre dos Quizzes',
            description: 'Acerte 3 perguntas no Quiz',
            xp: 20,
            keys: 2, // Reward 2 keys
            icon: 'quiz',
            type: 'quiz',
            target: 3
        },
        {
            id: 'project-builder',
            name: 'Construtor',
            description: 'Avance 10% em qualquer projeto',
            xp: 30,
            icon: 'build',
            type: 'project',
            target: 10
        }
    ],

    // Cores de raridade
    rarityColors: {
        common: "text-slate-600 bg-slate-100",
        uncommon: "text-green-600 bg-green-100",
        rare: "text-blue-600 bg-blue-100",
        epic: "text-purple-600 bg-purple-100",
        legendary: "text-yellow-600 bg-yellow-100"
    }
};

// Dados de exemplo de usuário
export const mockUserData = {
    id: "student-001",
    name: "João Silva",
    email: "joao@escola.com",
    role: "aluno",
    xp: 245,
    level: 3,
    badges: ["first-steps", "early-bird", "scratch-novice"],
    challengesCompleted: 8,
    scratchChallenges: 4,
    arduinoChallenges: 2,
    microbitChallenges: 2,
    firstTryWins: 2,
    helpCount: 1,
    loginStreak: 5,
    fastestCompletion: 420,
    weekendSessions: 1,
    lateNightCompletions: 0,
    joinedAt: "2024-01-15"
};

// Exportar funções auxiliares
export function getUserLevel(xp) {
    return gamificationSystem.calculateLevel(xp);
}

export function getUserProgress(xp) {
    return gamificationSystem.calculateProgress(xp);
}

export function getNewBadges(user) {
    return gamificationSystem.checkBadges(user);
}
