import { auth, db, doc, getDoc, updateDoc, increment } from './firebase-config.js';
import { quizData } from './quiz-data.js';
import { generateProjectQuiz } from './ai-service.js';
import { getProjectById } from './projects-data.js';

let currentQuestionIndex = 0;
let currentScore = 0;
let selectedOptionIndex = null;
let isAnswerChecked = false;
let sessionQuestions = [];

async function initQuiz() {
    console.log("Quiz Initializing...");
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('projectId');

    showLoadingState(true);

    try {
        if (projectId) {
            console.log("Mode: AI Project Quiz for ID:", projectId);
            const project = getProjectById(projectId);
            if (project) {
                document.getElementById('questionText').innerText = `Gerando desafios sobre ${project.title}...`;
                sessionQuestions = await generateProjectQuiz(project.title, project.content);
                console.log("AI Questions received:", sessionQuestions);
            } else {
                console.warn("Project not found, falling back to bank.");
                throw new Error("Projeto não encontrado");
            }
        } else {
            console.log("Mode: General Arena");
            sessionQuestions = quizData.sort(() => 0.5 - Math.random()).slice(0, 5);
        }

        if (!sessionQuestions || sessionQuestions.length === 0) {
            console.error("No questions found.");
            throw new Error("Falha ao carregar questões.");
        }

        showLoadingState(false);
        renderQuestion();
    } catch (error) {
        console.error("Init Error:", error);
        // Fallback to general bank if AI fails or project not found
        sessionQuestions = quizData.sort(() => 0.5 - Math.random()).slice(0, 3);
        showLoadingState(false);
        renderQuestion();
    }

    document.getElementById('actionBtn').addEventListener('click', handleAction);
}

function showLoadingState(show) {
    const grid = document.getElementById('optionsGrid');
    if (show) {
        grid.innerHTML = '<div class="col-span-full flex flex-col items-center py-10"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mb-4"></div><p class="text-slate-500 font-medium text-center">Buscando seus desafios...<br><span class="text-xs text-slate-400">Preparando IA do Izicode</span></p></div>';
    }
}

function renderQuestion() {
    if (currentQuestionIndex >= sessionQuestions.length) {
        finishQuiz();
        return;
    }

    const q = sessionQuestions[currentQuestionIndex];
    document.getElementById('questionText').innerText = q.question;

    // Update Progress
    const progress = (currentQuestionIndex / sessionQuestions.length) * 100;
    document.getElementById('quizProgress').style.width = `${progress}%`;

    // Reset UI
    isAnswerChecked = false;
    selectedOptionIndex = null;
    updateBottomSheet('default');

    // Render Options
    const grid = document.getElementById('optionsGrid');
    grid.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = `option-card w-full p-4 rounded-2xl border-2 border-slate-200 shadow-btn hover:bg-slate-50 text-left font-bold text-slate-600 text-lg transition-all group active:translate-y-1 active:shadow-none mb-2 md:mb-0`;
        btn.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="w-8 h-8 rounded-lg border-2 border-slate-200 flex items-center justify-center text-slate-400 text-sm group-[.selected]:border-blue-500 group-[.selected]:text-blue-500 group-[.selected]:bg-blue-50">${idx + 1}</span>
                <span>${opt}</span>
            </div>
        `;

        btn.onclick = () => selectOption(idx, btn);
        grid.appendChild(btn);
    });

    // Reset verify button state
    const actionBtn = document.getElementById('actionBtn');
    actionBtn.innerText = "Verificar";
    actionBtn.disabled = true;
    actionBtn.className = "w-full md:w-48 py-3.5 rounded-2xl font-display font-bold text-lg uppercase tracking-wide text-white bg-slate-200 cursor-not-allowed transition-all";
}

function selectOption(index, btnElement) {
    if (isAnswerChecked) return;

    // Remove selected from all
    document.querySelectorAll('.option-card').forEach(b => {
        b.classList.remove('selected', 'border-blue-500', 'bg-blue-50');
    });

    // Add to current
    selectedOptionIndex = index;
    btnElement.classList.add('selected', 'border-blue-500', 'bg-blue-50');

    // Enable Verify Button
    const actionBtn = document.getElementById('actionBtn');
    actionBtn.disabled = false;
    actionBtn.className = "w-full md:w-48 py-3.5 rounded-2xl font-display font-bold text-lg uppercase tracking-wide text-white shadow-btn-primary bg-brand-500 hover:bg-brand-600 active:shadow-btn-primary-active active:translate-y-1 transition-all";
}

function handleAction() {
    if (!isAnswerChecked) {
        checkAnswer();
    } else {
        currentQuestionIndex++;
        renderQuestion();
    }
}

function checkAnswer() {
    isAnswerChecked = true;
    const q = sessionQuestions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === q.correct;

    const options = document.querySelectorAll('.option-card');

    if (isCorrect) {
        currentScore += q.xp || 10;
        updateBottomSheet('success', q.explanation);
        triggerConfetti();
    } else {
        updateBottomSheet('error', `Ops! A resposta certa era: ${q.options[q.correct]}`);

        // Lives
        const livesEl = document.getElementById('lives');
        let lives = parseInt(livesEl.innerText);
        if (lives > 0) livesEl.innerText = lives - 1;
    }

    // Highlight Correct/Wrong
    options[selectedOptionIndex].classList.add(isCorrect ? 'bg-green-50' : 'bg-red-50', isCorrect ? 'border-green-500' : 'border-red-500');
    if (!isCorrect) options[q.correct].classList.add('bg-green-50', 'border-green-500');

    // Change Button to "Continue"
    const actionBtn = document.getElementById('actionBtn');
    actionBtn.innerText = "Continuar";
    actionBtn.className = `w-full md:w-48 py-3.5 rounded-2xl font-display font-bold text-lg uppercase tracking-wide text-white shadow-btn ${isCorrect ? 'bg-green-600 shadow-btn-success' : 'bg-red-600 shadow-btn-error'} active:translate-y-1 active:shadow-none transition-all`;
}

function updateBottomSheet(state, message = "") {
    const sheet = document.getElementById('bottomSheet');
    const feedbackArea = document.getElementById('feedbackArea');
    const title = document.getElementById('feedbackTitle');
    const text = document.getElementById('feedbackText');
    const icon = document.getElementById('feedbackIcon');

    if (state === 'default') {
        sheet.className = "fixed bottom-0 left-0 right-0 p-6 border-t-2 border-slate-100 bg-white transition-all duration-300 z-50";
        feedbackArea.classList.add('hidden');
    } else if (state === 'success') {
        sheet.className = "fixed bottom-0 left-0 right-0 p-6 border-t-2 border-transparent bg-green-100 transition-all duration-300 z-50";
        feedbackArea.classList.remove('hidden');
        title.innerText = "Incrível!";
        title.className = "font-display font-bold text-2xl mb-1 text-green-700";
        text.innerText = message;
        text.className = "text-sm font-medium text-green-700";
        icon.innerHTML = '<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>';
    } else if (state === 'error') {
        sheet.className = "fixed bottom-0 left-0 right-0 p-6 border-t-2 border-transparent bg-red-100 transition-all duration-300 z-50";
        feedbackArea.classList.remove('hidden');
        title.innerText = "Ops, quase lá!";
        title.className = "font-display font-bold text-2xl mb-1 text-red-700";
        text.innerText = message;
        text.className = "text-sm font-medium text-red-700";
        icon.innerHTML = '<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>';
    }
}

async function finishQuiz() {
    document.querySelector('main').innerHTML = `
        <div class="text-center mt-20 animate-bounce-in">
            <div class="mb-6 flex justify-center">
                <div class="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 border-4 border-yellow-200">
                    <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
            </div>
            <h1 class="text-3xl font-display font-bold text-slate-800 mb-2">Lição Completa!</h1>
            <p class="text-slate-500 text-lg mb-8">Você arrasou e ganhou <b>${currentScore} XP</b></p>
            <div class="flex flex-col gap-3 max-w-xs mx-auto">
                <a href="student-area.html" class="bg-brand-500 text-white px-8 py-4 rounded-2xl font-bold shadow-btn-primary hover:bg-brand-600 transition-all text-center">
                    FINALIZAR
                </a>
                <button onclick="window.location.reload()" class="text-slate-400 font-bold hover:text-slate-600 transition-colors">
                    REFAZER
                </button>
            </div>
        </div>
    `;

    updateBottomSheet('default');
    document.getElementById('bottomSheet').classList.add('hidden');
    document.getElementById('quizProgress').style.width = '100%';

    // Save XP
    const user = auth.currentUser;
    if (user && currentScore > 0) {
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                xp: increment(currentScore)
            });
            console.log("XP Saved successfully");
        } catch (e) {
            console.error("Error saving XP:", e);
        }
    }

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
    console.log(`Playing sound: ${type}`);
}

// Start
document.addEventListener('DOMContentLoaded', initQuiz);
