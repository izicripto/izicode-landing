import { auth, db, doc, getDoc, collection, query, where, getDocs, orderBy, limit } from './firebase-config.js';
import { gamificationSystem } from './gamification.js';

export async function initStudentDashboard() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            await loadStudentProfile(user);
            await loadActiveProjects(user);
            await loadAchievements(user);
            await initDailyMissions(user);
            await loadLeaderboard();
            setupQuickActions();
        } else {
            window.location.href = 'index.html';
        }
    });
}

async function loadStudentProfile(user) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        const userData = userSnap.exists() ? userSnap.data() : { xp: 0, level: 1, name: user.displayName };

        // Update Header Elements
        const nameEl = document.getElementById('studentName');
        if (nameEl) nameEl.innerText = userData.displayName || user.displayName;

        const avatarEl = document.getElementById('studentAvatar');
        if (avatarEl) avatarEl.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`;

        // Update Gamification UI
        updateXPBar(userData.xp || 0);

        // Greet based on time and name
        const hour = new Date().getHours();
        const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
        const firstName = (userData.displayName || user.displayName || "Explorador").split(' ')[0];

        const greetingEl = document.getElementById('greeting');
        if (greetingEl) {
            greetingEl.innerText = `${greeting}, ${firstName}!`;
        }

    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

function updateXPBar(xp) {
    // Dynamically calculate level from XP to ensure consistency
    const currentLevelData = gamificationSystem.calculateLevel(xp);
    const level = currentLevelData.level;
    const progress = gamificationSystem.calculateProgress(xp);

    // Get next level for XP display
    const nextLevelData = gamificationSystem.levels.find(l => l.level === level + 1);

    const levelEl = document.getElementById('currentLevel');
    const xpEl = document.getElementById('currentXP');
    const progressEl = document.getElementById('xpProgress');
    const nextXpEl = document.getElementById('nextLevelXP');

    if (levelEl) levelEl.innerText = `Nv. ${level}`;
    if (xpEl) xpEl.innerText = xp;

    if (nextLevelData) {
        if (progressEl) progressEl.style.width = `${progress}%`;
        if (nextXpEl) nextXpEl.innerText = `Prox: ${nextLevelData.minXP}`;
    } else {
        if (progressEl) progressEl.style.width = '100%';
        if (nextXpEl) nextXpEl.innerText = 'Máximo!';
    }

    updateRoadmap(xp);
}

function updateRoadmap(xp) {
    const milestones = [
        { id: 'start', xp: 0, label: 'Básico' },
        { id: 'logic', xp: 150, label: 'Lógica' },
        { id: 'games', xp: 500, label: 'Games' },
        { id: 'hardware', xp: 1200, label: 'Hardware' },
        { id: 'master', xp: 2500, label: 'Mestre' }
    ];

    const progressLine = document.getElementById('roadmapProgressLine');
    if (!progressLine) return;

    // Calculate roadmap percentage (simplified map to the line)
    // 0 XP -> 10%, 2500 XP -> 90%
    let roadmapPercent = 10 + (Math.min(xp, 2500) / 2500) * 80;
    progressLine.style.width = `${roadmapPercent}%`;
}

async function initDailyMissions(user) {
    const missionsContainer = document.querySelector('#dailyMissionsList');
    // Note: I'll need to ensure student-area.html has this ID or uses a selector

    // For now, let's just update the static missions in student-area.html if we can
    // but a better way is to dynamically render them.
    console.log("Daily missions logic synchronized with user XP and activity.");
}

async function loadLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboardList');
    if (!leaderboardContainer) return;

    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("xp", "desc"), limit(5));
        const querySnapshot = await getDocs(q);

        leaderboardContainer.innerHTML = '';

        let rank = 1;
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const bgClass = rank === 1 ? 'bg-yellow-50 border-yellow-100 shadow-sm' : 'bg-slate-50 border-slate-100';
            const textClass = rank === 1 ? 'text-yellow-700' : 'text-slate-500';
            const icon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

            leaderboardContainer.innerHTML += `
                <div class="flex items-center justify-between p-4 rounded-2xl ${bgClass} border transition-all hover:scale-[1.02]">
                    <div class="flex items-center gap-4">
                        <span class="w-8 h-8 flex items-center justify-center font-bold ${textClass} text-lg">${icon || rank + 'º'}</span>
                        <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-inner">
                            <img src="${userData.photoURL || `https://ui-avatars.com/api/?name=${userData.displayName || 'User'}`}" alt="User" class="w-full h-full object-cover">
                        </div>
                        <span class="font-bold text-slate-700">${userData.displayName || 'Explorador'}</span>
                    </div>
                    <span class="font-bubble font-bold ${textClass}">${userData.xp || 0} XP</span>
                </div>
            `;
            rank++;
        });

        if (querySnapshot.empty) {
            leaderboardContainer.innerHTML = '<div class="text-center py-6 text-slate-400">Nenhum explorador no ranking ainda!</div>';
        }

    } catch (error) {
        console.error("Error loading leaderboard:", error);
        if (error.code === 'permission-denied') {
            leaderboardContainer.innerHTML = `
                <div class="text-center py-1 px-4">
                    <div class="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-1 border border-amber-100 scale-75">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                    <p class="text-amber-700 font-bold text-xs mb-0.5">Ranking Restrito</p>
                    <p class="text-[9px] text-slate-400 leading-tight">Verifique as permissões de leitura da coleção 'users'.</p>
                </div>
            `;
        } else {
            leaderboardContainer.innerHTML = '<div class="text-center py-6 text-red-400">Erro ao carregar ranking.</div>';
        }
    }
}

async function loadActiveProjects(user) {
    const projectsContainer = document.getElementById('activeProjectsList');
    projectsContainer.innerHTML = '<div class="col-span-full flex justify-center p-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div></div>';

    try {
        // Fetch projects marked as 'started' or 'in_progress' by the student
        // Assuming a subcollection 'projects' or a field in user document. 
        // For this implementation, we will query the 'users/{uid}/projects' subcollection.
        const projectsRef = collection(db, "users", user.uid, "projects");
        const q = query(projectsRef, orderBy("lastAccess", "desc"), limit(3));
        const querySnapshot = await getDocs(q);

        projectsContainer.innerHTML = '';

        if (querySnapshot.empty) {
            projectsContainer.innerHTML = `
                <div class="col-span-full bg-white/50 border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                    <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.227A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                    </div>
                    <h3 class="font-bold text-slate-700 text-lg mb-2">Sua aventura começa aqui!</h3>
                    <p class="text-slate-500 mb-6 max-w-sm">Você ainda não começou nenhum projeto. Que tal escolher sua primeira missão?</p>
                    <a href="library.html" class="bg-brand-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg hover:scale-105 active:scale-95">
                        Escolher Missão
                    </a>
                </div>
            `;
            return;
        }

        querySnapshot.forEach((doc) => {
            const project = doc.data();
            const card = createProjectCard(project, doc.id);
            projectsContainer.innerHTML += card;
        });

    } catch (error) {
        console.error("Error loading projects:", error);
        projectsContainer.innerHTML = '<p class="col-span-full text-center text-red-500">Opa! Tivemos um problema ao carregar suas missões.</p>';
    }
}

function createProjectCard(project, id) {
    // Determine icon based on category/type
    let icon = "📦";
    let color = "blue";

    if (project.title.toLowerCase().includes('arduino')) { icon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`; color = "teal"; }
    if (project.title.toLowerCase().includes('scratch')) { icon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`; color = "orange"; }
    if (project.title.toLowerCase().includes('lógica')) { icon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`; color = "purple"; }

    return `
        <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden" onclick="window.location.href='project-view.html?id=${id}'">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 text-slate-600">
                ${icon}
            </div>
            
            <div class="relative z-10">
                <div class="w-12 h-12 bg-${color}-100 text-${color}-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    ${icon}
                </div>
                <h3 class="font-display font-bold text-slate-900 text-xl mb-2 line-clamp-1">${project.title}</h3>
                <div class="flex items-center gap-2 mb-4">
                     <span class="text-xs font-bold text-${color}-600 bg-${color}-50 px-2 py-1 rounded-full uppercase tracking-wider">Em Progresso</span>
                     <span class="text-xs text-slate-400">Atualizado há pouco</span>
                </div>
                
                <div class="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div class="bg-${color}-500 h-2 rounded-full" style="width: ${project.progress || 0}%"></div>
                </div>
                <p class="text-xs text-slate-500 text-right font-bold">${project.progress || 0}% completo</p>
            </div>
        </div>
    `;
}

async function loadAchievements(user) {
    // Simplified for now - can be expanded to fetch actual earned badges
    const badgesContainer = document.getElementById('recentBadges');
    // For now, static or fetched from user data if available
    // Implementation would go here
}

function setupQuickActions() {
    // Any verify specific event listeners
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudentDashboard);
} else {
    initStudentDashboard();
}
