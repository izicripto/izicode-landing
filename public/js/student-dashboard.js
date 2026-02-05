import { auth, db, doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, limit } from './firebase-config.js';
import { gamificationSystem } from './gamification.js';
import { getTechCuriosity } from './pedagogical-tips.js';

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

        let userData = userSnap.exists() ? userSnap.data() : { xp: 0, level: 1, name: user.displayName };

        // --- KEY RECHARGE LOGIC ---
        let currentKeys = userData.keys !== undefined ? userData.keys : 10;
        let lastRefill = userData.lastKeyRefill ? userData.lastKeyRefill.toDate() : new Date();
        const now = new Date();
        let needsUpdate = false;
        let updates = {};

        // Initializes keys if missing
        if (userData.keys === undefined) {
            currentKeys = 10;
            updates.keys = 10;
            needsUpdate = true;
        }

        // Refill check (only if < 10)
        if (currentKeys < 10) {
            const timeDiff = now - lastRefill;
            const hoursPassed = Math.floor(timeDiff / (1000 * 60 * 60)); // Milliseconds to Hours

            if (hoursPassed >= 1) {
                const keysToAdd = Math.min(hoursPassed, 10 - currentKeys);
                if (keysToAdd > 0) {
                    currentKeys += keysToAdd;
                    updates.keys = currentKeys;
                    updates.lastKeyRefill = now;
                    needsUpdate = true;
                    console.log(`Recharged ${keysToAdd} keys! New balance: ${currentKeys}`);
                }
            }
        }

        if (needsUpdate) {
            await updateDoc(userRef, updates);
            userData = { ...userData, ...updates }; // Update local state
        }

        // Update Keys UI
        const keysEl = document.getElementById('keysCountDashboard');
        if (keysEl) keysEl.innerText = currentKeys;
        // --------------------------

        // Update Header Elements
        const nameEl = document.getElementById('studentName');
        if (nameEl) nameEl.innerText = userData.displayName || user.displayName;

        const avatarEl = document.getElementById('studentAvatar');
        if (avatarEl) avatarEl.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`;

        // Update Gamification UI
        updateXPBar(userData.xp || 0);

        // Greet based on time and name
        const greetingGet = new Date().getHours() < 12 ? "Bom dia" : new Date().getHours() < 18 ? "Boa tarde" : "Boa noite";
        const firstName = (userData.displayName || user.displayName || "Explorador").split(' ')[0];

        const greetingEl = document.getElementById('greeting');
        if (greetingEl) {
            greetingEl.innerText = `${greetingGet}, ${firstName}!`;
        }

        // Show Tech Curiosity
        const curiosity = getTechCuriosity();
        const subtitleEl = document.querySelector('header p');
        if (subtitleEl && curiosity) {
            subtitleEl.innerHTML = `Running Quiz <b>Curiosidade:</b> <span class="italic text-slate-600">"${curiosity.text}"</span>`;
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
    if (!missionsContainer) return;

    // Defined missions
    const today = new Date().toDateString();

    // Check/Reset Daily Progress
    const userRef = doc(db, "users", user.uid);
    // Ideally we fetch this with the profile, but for safety:
    const snap = await getDoc(userRef);
    const data = snap.data();

    // Logic: If lastLogin != today, reset daily counters (handled by backend usually, but here client-side lazy reset)
    // For simplicity, we just check data.

    const loginDone = true; // They are here
    const quizCount = data.dailyQuizCount || 0;

    // Render
    missionsContainer.innerHTML = '';

    const missions = [
        {
            title: "Explorador Diário",
            desc: "Faça login na plataforma",
            progress: 1,
            target: 1,
            xp: 50,
            keys: 1,
            icon: "🚀",
            done: true
        },
        {
            title: "Mestre dos Quizzes",
            desc: "Complete 2 quizzes hoje",
            progress: quizCount,
            target: 2,
            xp: 100,
            keys: 2,
            icon: "🧠",
            done: quizCount >= 2
        },
        {
            title: "Mão na Massa",
            desc: "Inicie ou continue um projeto",
            progress: data.projectsStartedToday || 0,
            target: 1,
            xp: 150,
            icon: "🛠️",
            done: (data.projectsStartedToday || 0) >= 1
        }
    ];

    missions.forEach(m => {
        const width = Math.min((m.progress / m.target) * 100, 100);
        const color = m.done ? 'green' : 'blue';
        const keyReward = m.keys ? `<span class="block text-xs font-bold text-amber-600">🗝️ +${m.keys} Chaves</span>` : '';

        missionsContainer.innerHTML += `
            <div class="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center text-2xl">
                        ${m.icon}
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-700">${m.title}</h4>
                        <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <span>${m.desc}</span>
                            <span class="font-bold text-${color}-600">${m.progress}/${m.target}</span>
                        </div>
                        <div class="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-${color}-500 rounded-full transition-all" style="width: ${width}%"></div>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <span class="block font-display font-bold text-${color}-600 text-lg">+${m.xp} XP</span>
                    ${keyReward}
                    ${m.done ? '<span class="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">Completo</span>' : ''}
                </div>
            </div>
        `;
    });
}

async function loadLeaderboard() {
    const list = document.querySelector('#leaderboardList');
    if (!list) return;

    try {
        // Query users sorted by XP
        // In a real app, ideally filter by role in the query like: where("role", "in", ["student", "maker"])
        // But for now we might fetch top 20 and filter client side if the filtered set is small, 
        // or just add the where clause if the index exists.
        // Let's try client-side filtering for simplicity on small datasets, 
        // OR add a basic where clause if we assume all students are 'student'.

        const q = query(
            collection(db, "users"),
            orderBy("xp", "desc"),
            limit(100) // Fetch more to allow filtering
        );

        const snapshot = await getDocs(q);

        // Filter: Exclude teachers/admins
        const users = snapshot.docs
            .map(d => d.data())
            .filter(u => !u.role || ['student', 'maker', 'teacher', 'freelance_teacher', 'dev'].includes(u.role))
            .slice(0, 5); // Take top 5 after filter

        list.innerHTML = '';
        users.forEach((u, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`;
            const name = u.displayName || "Sem Nome"; // Changed from u.name to u.displayName
            const shortName = name.split(' ')[0]; // First name only

            list.innerHTML += `
               <div class="flex items-center justify-between p-3 ${index === 0 ? 'bg-yellow-50 border border-yellow-100 rounded-xl' : ''}">
                   <div class="flex items-center gap-3">
                       <span class="font-bold text-slate-400 w-6">${medal}</span>
                       <div class="flex items-center gap-2">
                           <div class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs">
                               ${name.charAt(0)}
                           </div>
                           <span class="font-bold text-slate-700 text-sm">${shortName}</span>
                       </div>
                   </div>
                   <span class="font-bold text-brand-600 text-sm">${u.xp || 0} XP</span>
               </div>
            `;
        });

        if (users.length === 0) { // Check if any users were found after filtering
            list.innerHTML = '<div class="text-center py-6 text-slate-400">Nenhum explorador no ranking ainda!</div>';
        }

    } catch (e) {
        console.error("Leaderboard error:", e);
        if (e.code === 'permission-denied') {
            list.innerHTML = `
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
    const badgesContainer = document.getElementById('recentBadges');
    if (!badgesContainer) return;

    // Calculate simple badges based on XP or Levels
    // In a real app, we would query a 'badges' subcollection
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const data = snap.data();
    const xp = data.xp || 0;

    const allBadges = [
        { id: 'newbie', name: 'Novato', icon: '🌱', minXp: 0, desc: 'Começou a jornada' },
        { id: 'explorer', name: 'Explorador', icon: '🔭', minXp: 100, desc: 'Alcançou 100 XP' },
        { id: 'maker', name: 'Maker', icon: '🛠️', minXp: 500, desc: 'Alcançou 500 XP' },
        { id: 'pro', name: 'Pro', icon: '⚡', minXp: 1000, desc: 'Alcançou 1000 XP' },
        { id: 'master', name: 'Mestre', icon: '👑', minXp: 2500, desc: 'Alcançou 2500 XP' }
    ];

    // Filter earned (reversed to show highest first or just recent)
    const earned = allBadges.filter(b => xp >= b.minXp).reverse().slice(0, 3);

    badgesContainer.innerHTML = '';

    if (earned.length === 0) {
        badgesContainer.innerHTML = '<span class="text-sm text-slate-400">Jogue para ganhar medalhas!</span>';
        return;
    }

    earned.forEach(badge => {
        badgesContainer.innerHTML += `
            <div title="${badge.desc}" class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl border-2 border-yellow-200 cursor-help hover:scale-110 transition-transform">
                ${badge.icon}
            </div>
        `;
    });
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
