/**
 * Motor de Recomendação de Projetos — Izicode Edu
 *
 * Recomenda os próximos projetos da Biblioteca a partir de regras sobre o
 * catálogo real (ferramentas, BNCC, dificuldade) em vez de uma chamada de
 * IA — sem custo de API, sem chave, sem depender de rede externa. Mesmo
 * princípio do motor de missões do Izicode Maker RPG (questEngine.ts):
 * nunca inventa conteúdo, só escolhe o melhor próximo passo dentro do que
 * já existe.
 */

const TIER_RANK = {
    'iniciante': 0,
    'básico': 0,
    'basico': 0,
    'intermediário': 1,
    'intermediario': 1,
    'avançado': 2,
    'avancado': 2,
    'muito difícil': 3,
    'muito dificil': 3
};

function tierRank(difficulty) {
    const key = (difficulty || '').toLowerCase().trim();
    return key in TIER_RANK ? TIER_RANK[key] : 1; // desconhecido -> assume intermediário
}

/**
 * @param {Array} allProjects - catálogo completo (getAllProjects())
 * @param {string[]} viewedIds - ids de projetos já vistos pelo professor (localStorage)
 * @param {number} count - quantas recomendações retornar
 */
export function recommendProjects(allProjects, viewedIds, count = 3) {
    const viewedSet = new Set(viewedIds);
    const viewed = allProjects.filter(p => viewedSet.has(p.id));
    const unseen = allProjects.filter(p => !viewedSet.has(p.id));

    if (unseen.length === 0) return [];

    // Primeira visita: sem histórico, sugerir um "kit de início" diverso —
    // uma ferramenta diferente por card, priorizando dificuldade iniciante.
    if (viewed.length === 0) {
        const seenTools = new Set();
        const starter = [];
        const sorted = [...unseen].sort((a, b) => tierRank(a.difficulty) - tierRank(b.difficulty));
        for (const p of sorted) {
            const primaryTool = p.tools?.[0] || 'Geral';
            if (seenTools.has(primaryTool)) continue;
            seenTools.add(primaryTool);
            starter.push(p);
            if (starter.length >= count) break;
        }
        return starter;
    }

    // Com histórico: priorizar ferramentas ainda não exploradas e códigos
    // BNCC ainda não cobertos, com leve empurrão de dificuldade para o
    // próximo nível.
    const exploredTools = new Set(viewed.flatMap(p => p.tools || []));
    const coveredBncc = new Set(viewed.flatMap(p => p.bncc || []));
    const avgViewedTier = viewed.reduce((sum, p) => sum + tierRank(p.difficulty), 0) / viewed.length;
    const targetTier = Math.min(3, Math.round(avgViewedTier + 0.5));

    const scored = unseen.map(p => {
        let score = 0;
        const introducesNewTool = (p.tools || []).some(t => !exploredTools.has(t));
        const introducesNewBncc = (p.bncc || []).some(c => !coveredBncc.has(c));
        if (introducesNewTool) score += 2;
        if (introducesNewBncc) score += 1;
        if (tierRank(p.difficulty) === targetTier) score += 1;
        return { project: p, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // Entre os empates do topo, embaralha para a sugestão variar a cada visita.
    const topScore = scored[0]?.score ?? 0;
    const topPool = scored.filter(s => s.score === topScore);
    const rest = scored.filter(s => s.score !== topScore);
    for (let i = topPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [topPool[i], topPool[j]] = [topPool[j], topPool[i]];
    }

    return [...topPool, ...rest].slice(0, count).map(s => s.project);
}

export function getViewedProjectIds() {
    try {
        return JSON.parse(localStorage.getItem('izicode_viewed_projects') || '[]');
    } catch (e) {
        return [];
    }
}
