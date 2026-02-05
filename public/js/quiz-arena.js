import { auth, db, doc, getDoc, updateDoc, setDoc, increment } from './firebase-config.js';
import { quizData } from './quiz-data.js';
import { generateProjectQuiz } from './ai-service-v3.js'; // V3 New File
import { getProjectById } from './projects-data.js';

let currentQuestionIndex = 0;
let currentScore = 0;
let selectedOptionIndex = null;
let isAnswerChecked = false;
let sessionQuestions = [];

// Gamification State
let userRole = 'student';
let userKeys = 0;
let currentLives = 3; // Heart System
let hasMadeMistake = false; // For Perfect Bonus

async function initQuiz() {
    console.log("Quiz Initializing... V4 (Gamification)");
    showLoadingState(true);

    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        try {
            // 1. Fetch User Data (Role & Keys)
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                userRole = data.role || 'student';
                userKeys = data.keys !== undefined ? data.keys : 10; // Default 10 keys

                // Init keys if missing in DB
                if (data.keys === undefined) {
                    await updateDoc(userRef, { keys: 10 });
                }
            } else {
                // New User Setup - Use setDoc to CREATE document
                userKeys = 10;
                await setDoc(userRef, {
                    keys: 10,
                    role: 'student',
                    createdAt: new Date(),
                    email: user.email,
                    displayName: user.displayName
                });
            }

            console.log(`User Loaded: Role=${userRole}, Keys=${userKeys}`);
            updateGamificationUI();

            // 2. Check Key Balance
            if (userKeys < 2) {
                showNoKeysModal();
                showLoadingState(false);
                return;
            }

            // 3. Deduct Entry Cost (2 Keys)
            await updateDoc(userRef, { keys: increment(-2) });
            userKeys -= 2;
            updateGamificationUI();

            // 4. Start Quiz Session
            await startQuizSession();

        } catch (e) {
            console.error("Error in Init:", e);
            showLoadingState(false); // Default to generic error or allow free play?
            // Fallback: Allow play but log error
            await startQuizSession();
        }
    });

    document.getElementById('actionBtn').addEventListener('click', handleAction);
}

async function startQuizSession() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('projectId');
    const userProjectId = params.get('userProjectId');
    const libraryProjectId = params.get('libraryProjectId');

    try {
        let project = null;

        if (projectId) {
            project = getProjectById(projectId);
        } else if (userProjectId) {
            const user = auth.currentUser;
            const docSnap = await getDoc(doc(db, `users/${user.uid}/projects/${userProjectId}`));
            if (docSnap.exists()) project = docSnap.data();
        } else if (libraryProjectId) {
            const docSnap = await getDoc(doc(db, "library", libraryProjectId));
            if (docSnap.exists()) project = docSnap.data();
        }

        if (project) {
            document.getElementById('questionText').innerText = `Gerando desafios sobre ${project.title}...`;
            sessionQuestions = await generateProjectQuiz(project.title, project.content, userRole);
        } else {
            // General Arena
            sessionQuestions = [...quizData]
                .sort(() => Math.random() - 0.5)
                .slice(0, 5);
        }

        if (!sessionQuestions || sessionQuestions.length === 0) throw new Error("No questions");

        showLoadingState(false);
        renderQuestion();
    } catch (error) {
        console.error("Session Error:", error);
        sessionQuestions = quizData.sort(() => 0.5 - Math.random()).slice(0, 3);
        showLoadingState(false);
        renderQuestion();
    }
}

function updateGamificationUI() {
    const keyEl = document.getElementById('keysCount');
    const lifeEl = document.getElementById('lives');
    if (keyEl) keyEl.innerText = userKeys;
    if (lifeEl) lifeEl.innerText = currentLives;
}

function renderQuestion() {
    console.log("Rendering Question:", currentQuestionIndex);

    // Reset State
    selectedOptionIndex = null;
    isAnswerChecked = false;

    // Check End
    if (currentQuestionIndex >= sessionQuestions.length) {
        finishQuiz();
        return;
    }

    const q = sessionQuestions[currentQuestionIndex];
    document.getElementById('questionText').innerText = q.question;

    // Options
    const grid = document.getElementById('optionsGrid');
    grid.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-card w-full p-4 rounded-2xl border-2 border-slate-200 shadow-btn hover:bg-slate-50 text-left font-bold text-slate-700 text-lg transition-all group active:translate-y-1 active:shadow-none bg-white';
        btn.onclick = () => selectOption(idx, btn);
        btn.innerHTML = `
            <div class="flex items-center gap-4 pointer-events-none">
                <span class="w-8 h-8 rounded-lg border-2 border-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold group-[.selected]:border-brand-500 group-[.selected]:text-brand-500 group-[.selected]:bg-brand-50 transition-colors">
                    ${String.fromCharCode(65 + idx)}
                </span>
                <span class="flex-1">${opt}</span>
            </div>
        `;
        grid.appendChild(btn);
    });

    // Update UI
    updateProgressBar();
    updateBottomSheet('default');
}

function selectOption(index, btnElement) {
    if (isAnswerChecked) return;

    // Remove selected from all
    document.querySelectorAll('.option-card').forEach(el => {
        el.classList.remove('selected', 'border-brand-500', 'ring-2', 'ring-brand-200');
        el.querySelector('span').classList.remove('group-[.selected]:border-brand-500', 'group-[.selected]:text-brand-500', 'group-[.selected]:bg-brand-50');
    });

    // Add selected to clicked
    selectedOptionIndex = index;
    btnElement.classList.add('selected');

    // Enable Action Button
    const actionBtn = document.getElementById('actionBtn');
    actionBtn.disabled = false;
    actionBtn.classList.remove('opacity-50', 'cursor-not-allowed');
}

function handleAction() {
    const actionBtn = document.getElementById('actionBtn');

    if (!isAnswerChecked) {
        // Verify Answer
        if (selectedOptionIndex === null) return;

        checkAnswer();
    } else {
        // Next Question
        currentQuestionIndex++;
        renderQuestion();
    }
}

function checkAnswer() {
    isAnswerChecked = true;
    const q = sessionQuestions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === q.correct;

    // Select options to apply styles
    const options = document.querySelectorAll('.option-card');

    // ... Style Options ...
    options[selectedOptionIndex].classList.remove('selected', 'border-brand-500');

    if (isCorrect) {
        options[selectedOptionIndex].classList.add('bg-green-100', 'border-green-500', 'text-green-700');
        currentScore += (q.xp || 10);
        playSound('correct');
        updateBottomSheet('success', q.explanation);
    } else {
        // WRONG ANSWER Logic
        currentLives--;
        hasMadeMistake = true;
        updateGamificationUI();

        options[selectedOptionIndex].classList.add('bg-red-100', 'border-red-500', 'text-red-700');
        options[q.correct].classList.add('bg-green-100', 'border-green-500', 'text-green-700');
        playSound('wrong');

        if (currentLives <= 0) {
            // Game Over immediately
            setTimeout(gameOver, 1500); // Small delay to see the correct answer
        } else {
            updateBottomSheet('error', q.explanation);
        }
    }
}

function gameOver() {
    const dashboardUrl = ['teacher', 'freelance_teacher', 'dev'].includes(userRole) ? 'dashboard.html' : 'student-area.html';

    document.querySelector('main').innerHTML = `
        <div class="text-center mt-20 animate-bounce-in px-6">
            <div class="mb-6 flex justify-center">
                <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 border-4 border-red-200">
                    <span class="text-5xl">💔</span>
                </div>
            </div>
            <h1 class="text-3xl font-display font-bold text-slate-800 mb-2">Fim de Jogo!</h1>
            <p class="text-slate-500 text-lg mb-8">Suas vidas acabaram. Tente novamente!</p>
            <div class="flex flex-col gap-3 max-w-xs mx-auto">
                <button onclick="window.location.reload()" class="bg-brand-500 text-white px-8 py-4 rounded-2xl font-bold shadow-btn-primary hover:bg-brand-600 transition-all text-center uppercase">
                    TENTAR NOVAMENTE (2 🗝️)
                </button>
                <button onclick="window.location.replace('${dashboardUrl}')" class="text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase">
                    SAIR
                </button>
            </div>
        </div>
    `;
    document.getElementById('bottomSheet').classList.add('hidden');
}

function showNoKeysModal() {
    const dashboardUrl = ['teacher', 'freelance_teacher', 'dev'].includes(userRole) ? 'dashboard.html' : 'student-area.html';

    document.querySelector('main').innerHTML = `
        <div class="text-center mt-20 animate-bounce-in px-6">
            <div class="mb-6 flex justify-center">
                <div class="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 border-4 border-amber-200">
                    <span class="text-5xl">🔒</span>
                </div>
            </div>
            <h1 class="text-3xl font-display font-bold text-slate-800 mb-2">Sem Chaves!</h1>
            <p class="text-slate-500 text-lg mb-8">Você precisa de 2 chaves para jogar. Aguarde recarregar ou adquira mais.</p>
            <div class="flex flex-col gap-3 max-w-xs mx-auto">
                <button onclick="window.location.replace('${dashboardUrl}')" class="bg-slate-500 text-white px-8 py-4 rounded-2xl font-bold shadow-btn hover:bg-slate-600 transition-all text-center uppercase">
                    VOLTAR
                </button>
            </div>
        </div>
    `;
    document.getElementById('bottomSheet').classList.add('hidden');
}

function updateBottomSheet(state, message = "") {
    const sheet = document.getElementById('bottomSheet');
    const feedbackArea = document.getElementById('feedbackArea');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackText = document.getElementById('feedbackText');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const actionBtn = document.getElementById('actionBtn');

    sheet.classList.remove('hidden', 'border-green-200', 'bg-green-50', 'border-red-200', 'bg-red-50');
    feedbackArea.classList.add('hidden');
    actionBtn.disabled = false;

    if (state === 'default') {
        actionBtn.innerText = "VERIFICAR";
        actionBtn.className = "w-full md:w-48 py-3.5 rounded-2xl font-display font-bold text-lg uppercase tracking-wide text-white shadow-btn-primary bg-brand-500 hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
        actionBtn.disabled = true; // Wait for selection
    } else if (state === 'success') {
        sheet.classList.add('border-green-200', 'bg-green-50');
        feedbackArea.classList.remove('hidden');
        feedbackIcon.innerText = "🎉";
        feedbackIcon.className = "w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 bg-white shadow-sm text-green-500";
        feedbackTitle.innerText = "Mandou bem!";
        feedbackTitle.className = "font-display font-bold text-2xl mb-1 text-green-700";
        feedbackText.innerText = message || "Resposta correta.";
        feedbackText.className = "text-sm font-medium opacity-90 text-green-800";

        actionBtn.innerText = "CONTINUAR";
        actionBtn.className = "w-full md:w-auto px-8 py-3.5 rounded-2xl font-display font-bold text-lg uppercase tracking-wide text-white shadow-btn-success bg-green-600 hover:bg-green-700 transition-all";
    } else if (state === 'error') {
        sheet.classList.add('border-red-200', 'bg-red-50');
        feedbackArea.classList.remove('hidden');
        feedbackIcon.innerText = "😢";
        feedbackIcon.className = "w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 bg-white shadow-sm text-red-500";
        feedbackTitle.innerText = "Ops, não foi dessa vez...";
        feedbackTitle.className = "font-display font-bold text-2xl mb-1 text-red-700";
        feedbackText.innerText = message || "Resposta incorreta.";
        feedbackText.className = "text-sm font-medium opacity-90 text-red-800";

        actionBtn.innerText = "CONTINUAR";
        actionBtn.className = "w-full md:w-auto px-8 py-3.5 rounded-2xl font-display font-bold text-lg uppercase tracking-wide text-white shadow-btn-error bg-red-600 hover:bg-red-700 transition-all";
    }
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex) / sessionQuestions.length) * 100;
    document.getElementById('quizProgress').style.width = `${progress}%`;
}

// ... existing code ...

async function finishQuiz() {
    // 1. Show Saving/Calculating State
    document.querySelector('main').innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
            <div class="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-6">
                <svg class="w-10 h-10 text-brand-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <h2 class="text-2xl font-display font-bold text-slate-700">Calculando XP...</h2>
        </div>
    `;

    // 2. Save XP and Check Bonus (Await this!)
    const user = auth.currentUser;
    let earnedKeys = 0;

    if (user && currentScore > 0) {
        try {
            const updates = {
                xp: increment(currentScore),
                dailyQuizCount: increment(1)
            };

            // Perfect Run Bonus
            if (!hasMadeMistake) {
                earnedKeys = 1;
                updates.keys = increment(1);
            }

            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, updates);
            console.log("XP & Keys Saved");
        } catch (e) {
            console.error("Error saving XP:", e);
        }
    }

    // 3. Refresh Role for Redirect using Business Rules (DB + Overrides)
    let finalRedirectUrl = 'student-area.html'; // Default fallback
    if (user) {
        try {
            console.log("Checking role rules...");
            const email = (user.email || '').toLowerCase().trim();
            let resolvedRole = 'student'; // Start with default

            // A. Check Hardcoded Overrides First (Business Rules)
            if (email === 'izicripto@gmail.com') {
                resolvedRole = 'dev';
            } else if (email === 'izicodeedu@gmail.com') {
                resolvedRole = 'school_admin';
            } else if (email === 'r.berlanda04@gmail.com') {
                resolvedRole = 'freelance_teacher';
            } else {
                // B. Fallback to DB if no override
                const uDoc = await getDoc(doc(db, "users", user.uid));
                if (uDoc.exists()) {
                    resolvedRole = uDoc.data().role || 'student';
                }
            }

            console.log(`Role Resolved: ${resolvedRole} (Email: ${email})`);

            // Teacher Logic (Any role that is NOT a basic student)
            const teacherRoles = ['teacher', 'freelance_teacher', 'school_admin', 'dev', 'consultant'];
            if (teacherRoles.includes(resolvedRole)) {
                finalRedirectUrl = 'dashboard.html';
            }

        } catch (e) {
            console.error("Role resolution error", e);
        }
    }

    console.log(`Final Redirect Check: URL=${finalRedirectUrl}`);

    // 5. Render Success Screen
    const bonusHtml = earnedKeys > 0
        ? `<div class="bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold text-sm inline-flex items-center gap-2 mb-4 animate-bounce">
             <span>🏆 PERFECT: +1 CHAVE!</span>
           </div>`
        : '';

    document.querySelector('main').innerHTML = `
        <div class="text-center mt-20 animate-bounce-in">
            <div class="mb-6 flex justify-center">
                <div class="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 border-4 border-yellow-200">
                    <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
            </div>
            <h1 class="text-3xl font-display font-bold text-slate-800 mb-2">Lição Completa!</h1>
            
            ${bonusHtml}

            <p class="text-slate-500 text-lg mb-8">Você arrasou e ganhou <b>${currentScore} XP</b></p>
            <div class="flex flex-col gap-3 max-w-xs mx-auto">
                <button onclick="window.location.replace('${finalRedirectUrl}')" class="bg-brand-500 text-white px-8 py-4 rounded-2xl font-bold shadow-btn-primary hover:bg-brand-600 transition-all text-center uppercase">
                    VOLTAR AO DASHBOARD
                </button>
                <button onclick="window.location.reload()" class="text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase">
                    JOGAR NOVAMENTE
                </button>
            </div>
        </div>
    `;

    updateBottomSheet('default');
    document.getElementById('bottomSheet').classList.add('hidden');
    document.getElementById('quizProgress').style.width = '100%';

    triggerConfetti();
}

function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
    });
}

function playSound(type) {
    const audioId = type === 'correct' ? 'sndCorrect' : 'sndWrong';
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.play().catch(e => console.warn(`Audio play failed (${type}):`, e));
    }
}

// Loading State Helper
function showLoadingState(isLoading) {
    let loader = document.getElementById('quizLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'quizLoader';
        loader.className = 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center hidden';
        loader.innerHTML = `
            <div class="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
            <p class="text-brand-600 font-bold text-lg animate-pulse" id="loadingText">Preparando Desafios...</p>
        `;
        document.body.appendChild(loader);
    }

    if (isLoading) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

// Start
document.addEventListener('DOMContentLoaded', initQuiz);
