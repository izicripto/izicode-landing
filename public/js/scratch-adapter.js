/**
 * Scratch API Adapter
 * Integra com a API do Scratch para buscar projetos open-source
 */

export class ScratchAdapter {
    constructor() {
        this.baseURL = 'https://api.scratch.mit.edu';
        this.cache = new Map();
    }

    /**
     * Busca projetos por query
     * @param {string} query - Termo de busca (ex: "robotics", "arduino")
     * @param {number} limit - Número de resultados (padrão: 20)
     * @param {string} mode - Modo de busca: "trending", "popular", "recent"
     */
    async searchProjects(query = 'robotics', limit = 20, mode = 'trending') {
        const cacheKey = `search_${query}_${limit}_${mode}`;

        // Verificar cache
        if (this.cache.has(cacheKey)) {
            console.log('Retornando do cache:', cacheKey);
            return this.cache.get(cacheKey);
        }

        try {
            const url = `${this.baseURL}/explore/projects?q=${encodeURIComponent(query)}&mode=${mode}&limit=${limit}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro na API Scratch: ${response.status}`);
            }

            const projects = await response.json();
            const formattedProjects = this.formatProjects(projects);

            // Salvar no cache
            this.cache.set(cacheKey, formattedProjects);

            return formattedProjects;
        } catch (error) {
            console.error('Erro ao buscar projetos do Scratch:', error);
            return [];
        }
    }

    /**
     * Busca detalhes de um projeto específico
     * @param {number} projectId - ID do projeto no Scratch
     */
    async getProjectDetails(projectId) {
        try {
            const url = `${this.baseURL}/projects/${projectId}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Projeto não encontrado: ${projectId}`);
            }

            const project = await response.json();
            return this.formatProject(project);
        } catch (error) {
            console.error('Erro ao buscar detalhes do projeto:', error);
            return null;
        }
    }

    /**
     * Busca projetos de um usuário específico
     * @param {string} username - Nome de usuário no Scratch
     */
    async getUserProjects(username, limit = 20) {
        try {
            const url = `${this.baseURL}/users/${username}/projects?limit=${limit}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Usuário não encontrado: ${username}`);
            }

            const projects = await response.json();
            return this.formatProjects(projects);
        } catch (error) {
            console.error('Erro ao buscar projetos do usuário:', error);
            return [];
        }
    }

    /**
     * Formata array de projetos para o padrão Izicode
     */
    formatProjects(projects) {
        return projects.map(project => this.formatProject(project));
    }

    /**
     * Formata um projeto individual para o padrão Izicode
     */
    formatProject(project) {
        return {
            id: project.id,
            title: project.title || 'Projeto sem título',
            description: project.description || project.instructions || 'Sem descrição',
            author: project.author?.username || 'Desconhecido',
            thumbnail: project.image || `https://cdn2.scratch.mit.edu/get_image/project/${project.id}_480x360.png`,
            views: project.stats?.views || 0,
            loves: project.stats?.loves || 0,
            favorites: project.stats?.favorites || 0,
            remixes: project.stats?.remixes || 0,
            createdAt: project.history?.created || null,
            modifiedAt: project.history?.modified || null,
            url: `https://scratch.mit.edu/projects/${project.id}`,
            embedUrl: `https://scratch.mit.edu/projects/${project.id}/embed`,
            platform: 'scratch',
            difficulty: this.estimateDifficulty(project),
            tags: this.extractTags(project)
        };
    }

    /**
     * Estima dificuldade baseado em estatísticas
     */
    estimateDifficulty(project) {
        const views = project.stats?.views || 0;
        const loves = project.stats?.loves || 0;

        // Projetos populares tendem a ser mais elaborados
        if (loves > 100 || views > 1000) return 'advanced';
        if (loves > 20 || views > 200) return 'intermediate';
        return 'beginner';
    }

    /**
     * Extrai tags do título e descrição
     */
    extractTags(project) {
        const text = `${project.title} ${project.description}`.toLowerCase();
        const tags = [];

        // Tags de plataforma
        if (text.includes('arduino')) tags.push('arduino');
        if (text.includes('microbit') || text.includes('micro:bit')) tags.push('microbit');
        if (text.includes('robot')) tags.push('robotics');

        // Tags de categoria
        if (text.includes('game')) tags.push('game');
        if (text.includes('animation')) tags.push('animation');
        if (text.includes('story')) tags.push('story');
        if (text.includes('music')) tags.push('music');
        if (text.includes('art')) tags.push('art');

        return tags;
    }

    /**
     * Busca projetos por categoria predefinida
     */
    async getProjectsByCategory(category) {
        const categoryQueries = {
            robotics: 'robot OR robotics OR automation',
            arduino: 'arduino OR maker OR electronics',
            microbit: 'microbit OR micro:bit',
            games: 'game OR platformer OR maze',
            animations: 'animation OR cartoon OR story',
            music: 'music OR sound OR instrument',
            art: 'art OR drawing OR paint'
        };

        const query = categoryQueries[category] || category;
        return await this.searchProjects(query, 20, 'popular');
    }

    /**
     * Retorna projetos mockados para demonstração
     */
    getMockProjects(query, limit) {
        const mockProjects = [
            {
                id: 1001,
                title: 'Robô Seguidor de Linha com Arduino',
                description: 'Aprenda a construir um robô que segue linhas pretas usando sensores infravermelhos e Arduino.',
                author: 'MakerBrasil',
                thumbnail: 'https://via.placeholder.com/480x360/0ea5e9/ffffff?text=Rob%C3%B4+Seguidor',
                views: 1250,
                loves: 89,
                favorites: 45,
                remixes: 12,
                url: 'https://scratch.mit.edu/projects/1001',
                embedUrl: 'https://scratch.mit.edu/projects/1001/embed',
                platform: 'scratch',
                difficulty: 'intermediate',
                tags: ['arduino', 'robotics']
            },
            {
                id: 1002,
                title: 'Jogo de Labirinto com Scratch',
                description: 'Crie um jogo divertido onde o jogador precisa escapar de um labirinto usando as setas do teclado.',
                author: 'ScratchMaster',
                thumbnail: 'https://via.placeholder.com/480x360/f97316/ffffff?text=Labirinto',
                views: 3400,
                loves: 234,
                favorites: 156,
                remixes: 67,
                url: 'https://scratch.mit.edu/projects/1002',
                embedUrl: 'https://scratch.mit.edu/projects/1002/embed',
                platform: 'scratch',
                difficulty: 'beginner',
                tags: ['game', 'scratch']
            },
            {
                id: 1003,
                title: 'Semáforo Inteligente com Micro:bit',
                description: 'Construa um semáforo que muda de cor automaticamente usando LEDs e programação em blocos.',
                author: 'TechKids',
                thumbnail: 'https://via.placeholder.com/480x360/10b981/ffffff?text=Sem%C3%A1foro',
                views: 890,
                loves: 56,
                favorites: 28,
                remixes: 8,
                url: 'https://scratch.mit.edu/projects/1003',
                embedUrl: 'https://scratch.mit.edu/projects/1003/embed',
                platform: 'scratch',
                difficulty: 'beginner',
                tags: ['microbit', 'electronics']
            },
            {
                id: 1004,
                title: 'Braço Robótico Controlado por Servo',
                description: 'Monte um braço robótico usando servomotores e controle-o com Arduino e joystick.',
                author: 'RoboticaEdu',
                thumbnail: 'https://via.placeholder.com/480x360/8b5cf6/ffffff?text=Bra%C3%A7o+Rob%C3%B3tico',
                views: 2100,
                loves: 145,
                favorites: 89,
                remixes: 34,
                url: 'https://scratch.mit.edu/projects/1004',
                embedUrl: 'https://scratch.mit.edu/projects/1004/embed',
                platform: 'scratch',
                difficulty: 'advanced',
                tags: ['arduino', 'robotics']
            },
            {
                id: 1005,
                title: 'Animação de História Interativa',
                description: 'Crie uma história animada onde o usuário pode escolher diferentes caminhos e finais.',
                author: 'StoryTeller',
                thumbnail: 'https://via.placeholder.com/480x360/ec4899/ffffff?text=Hist%C3%B3ria',
                views: 1680,
                loves: 98,
                favorites: 67,
                remixes: 23,
                url: 'https://scratch.mit.edu/projects/1005',
                embedUrl: 'https://scratch.mit.edu/projects/1005/embed',
                platform: 'scratch',
                difficulty: 'intermediate',
                tags: ['animation', 'story']
            },
            {
                id: 1006,
                title: 'Sensor de Distância Ultrassônico',
                description: 'Aprenda a usar sensor ultrassônico para medir distâncias e criar alarmes de proximidade.',
                author: 'SensorLab',
                thumbnail: 'https://via.placeholder.com/480x360/06b6d4/ffffff?text=Sensor',
                views: 1340,
                loves: 76,
                favorites: 42,
                remixes: 15,
                url: 'https://scratch.mit.edu/projects/1006',
                embedUrl: 'https://scratch.mit.edu/projects/1006/embed',
                platform: 'scratch',
                difficulty: 'intermediate',
                tags: ['arduino', 'electronics']
            }
        ];

        // Filtrar por query se necessário
        const filtered = mockProjects.filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.tags.some(tag => tag.includes(query.toLowerCase()))
        );

        return filtered.length > 0 ? filtered.slice(0, limit) : mockProjects.slice(0, limit);
    }

    /**
     * Limpa cache (útil para forçar atualização)
     */
    clearCache() {
        this.cache.clear();
        console.log('Cache do Scratch limpo');
    }
}

// Exportar instância singleton
export const scratchAPI = new ScratchAdapter();
