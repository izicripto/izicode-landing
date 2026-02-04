
import { auth, db, doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp, orderBy, limit, signOut, arrayUnion, increment } from './firebase-config.js';

let currentSchoolId = null;
let currentUserData = null;

// valid secrets
const SECRET_IMAGES = [
    { id: 'cat', emoji: '🐱', name: 'Gato' },
    { id: 'dog', emoji: '🐶', name: 'Cachorro' },
    { id: 'wizard', emoji: '🧙‍♂️', name: 'Mago' },
    { id: 'rocket', emoji: '🚀', name: 'Foguete' },
    { id: 'robot', emoji: '🤖', name: 'Robô' },
    { id: 'sun', emoji: '☀️', name: 'Sol' }
];
const SECRET_WORDS = ['LUA', 'SOL', 'MAR', 'CEU', 'GOL', 'LUZ'];

function generateSecret(type) {
    if (type === 'word') {
        return SECRET_WORDS[Math.floor(Math.random() * SECRET_WORDS.length)];
    } else {
        // Picture
        return SECRET_IMAGES[Math.floor(Math.random() * SECRET_IMAGES.length)].id;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Auth check handled by auth-guard, but we need the user object
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            await initializeSchoolManager(user);
        }
    });
});

async function initializeSchoolManager(user) {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;
        currentUserData = { ...userSnap.data(), uid: user.uid }; // Ensure UID is present

        // 1. School Logic & Routing

        // DEV OVERRIDE or SCHOOL ADMIN
        if ((currentUserData.role === 'school_admin' || currentUserData.role === 'dev') && !currentUserData.schoolId) {
            // ... Logic to create school ...
            await createPersonalSchool(user, "Escola (Dev/Admin)");

        } else if (currentUserData.role === 'freelance_teacher') {
            // FREELANCER: No School Access
            alert("O perfil Professor Autônomo foca em conteúdo e IA. Gestão de turmas não está inclusa.");
            window.location.href = 'dashboard.html';
            return;

        } else if (currentUserData.role === 'teacher' && !currentUserData.schoolId) {
            // INSTITUTIONAL TEACHER: Strict block
            alert("Você precisa ser convidado por uma escola para acessar esta área.");
            window.location.href = 'dashboard.html';
            return;

        } else {
            // Existing School (All Roles)
            currentSchoolId = currentUserData.schoolId;
            const schoolSnap = await getDoc(doc(db, "schools", currentSchoolId));
            if (schoolSnap.exists()) {
                document.getElementById('schoolName').textContent = schoolSnap.data().name;

                // Admin Recovery for Freelancers/Devs too
                if (schoolSnap.data().adminId === user.uid) {
                    // Check if we need to set role capability locally? 
                    // Dashboard roles handles nav. Here we just ensure they can act.
                }
            }
        }

        // UI Adjustments for Teacher
        // UI Adjustments
        if (currentUserData.role === 'teacher') {
            // Hide "Invite Teacher" button - Institutional Teachers don't manage peers
            const inviteBtn = document.querySelector('button[onclick="openInviteModal()"]');
            if (inviteBtn) inviteBtn.style.display = 'none';
        }

        if (currentUserData.role === 'freelance_teacher') {
            // Freelancers work alone, so maybe hide invite teacher too?
            // Let's hide it to keep it simple "Professor Autônomo"
            const inviteBtn = document.querySelector('button[onclick="openInviteModal()"]');
            if (inviteBtn) inviteBtn.style.display = 'none';
        }

        // 2. Load Initial Data
        loadStats();
        loadTeachers();
        loadClasses(); // Populate dropdowns too
        loadStudents();

    } catch (error) {
        console.error("Erro ao inicializar gestão escolar:", error);
        alert("Erro ao carregar dados da escola. Verifique sua conexão.");
    }
}

// --- Data Loading ---

async function loadStats() {
    // Stats are updated individually by load functions. 
    // We could add a summary aggregation here if needed later.
}

function updateTeacherStats() {
    // Runs after classes are loaded to update "Count of Classes" per teacher
    const teachersList = document.getElementById('teachersList');
    if (!window.loadedClasses || teachersList.children.length === 0) return;

    // Iterate over rendered teacher rows (we need a way to link row -> teacher ID)
    // Hack: We didn't store teacher ID in the DOM easily reachable (except value of dropdown?)
    // Better: We iterate the 'window.loadedTeachers' if we stored it.
    // Let's store loadedTeachers globally too.
}

async function loadTeachers() {
    const list = document.getElementById('teachersList');
    list.innerHTML = '<div class="p-8 text-center text-slate-500">Carregando...</div>';

    try {
        // Query users where role is teacher AND schoolId is currentSchoolId
        // Query ALL users in school, then filter for "Educators"
        const q = query(collection(db, "users"), where("schoolId", "==", currentSchoolId));
        const querySnapshot = await getDocs(q);

        const teachers = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const validRoles = ['teacher', 'school_admin', 'freelance_teacher', 'dev'];
            // If they are in the school and have a teaching role
            if (validRoles.includes(data.role)) {
                teachers.push({ id: doc.id, ...data });
            }
        });
        window.loadedTeachers = teachers; // Store globally

        // Also populate the Dropdown for Class Creation
        populateTeacherDropdown(teachers);

        document.getElementById('statTeachers').textContent = teachers.length;

        renderTeacherList(teachers); // Use helper

        /* Removed inline mapping to use renderTeacherList */
    } catch (error) {
        console.error("Error loading teachers:", error);
        list.innerHTML = '<p class="text-red-500 p-4">Erro ao listar professores.</p>';
    }
}

function populateTeacherDropdown(teachers) {
    const select = document.getElementById('classTeacher');
    select.innerHTML = '<option value="" class="text-slate-500">Selecione um professor...</option>';
    teachers.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.displayName;
        option.className = "text-slate-900"; // Force visible color
        select.appendChild(option);
    });
}

function renderTeacherList(teachers) {
    const list = document.getElementById('teachersList');
    if (teachers.length === 0) {
        list.innerHTML = `
            <div class="p-8 text-center border border-dashed border-slate-300 rounded-2xl">
                <p class="text-slate-500 mb-2">Nenhum professor encontrado.</p>
                <button onclick="openInviteModal()" class="text-brand-600 font-bold hover:underline">Convidar o primeiro</button>
            </div>`;
        return;
    }

    list.innerHTML = teachers.map(t => {
        // Calculate class count if classes loaded
        let classCount = 0;
        if (window.loadedClasses) {
            classCount = window.loadedClasses.filter(c => c.teacherId === t.id).length;
        }

        return `
            <div class="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
                <div class="flex items-center gap-3">
                    <img src="${t.photoURL || `https://ui-avatars.com/api/?name=${t.displayName || 'P'}&background=random`}" class="w-10 h-10 rounded-full border border-slate-100">
                    <div>
                        <p class="font-bold text-slate-900">${t.displayName || 'Professor'}</p>
                        <p class="text-xs text-slate-500">${t.email}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                         <span class="block text-xs font-bold text-slate-700">${classCount} Turmas</span>
                         <span class="block text-[10px] text-slate-400">Ativo</span>
                    </div>
                    <button class="text-slate-400 hover:text-brand-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                </div>
            </div>
        `;
    }).join('');
}

async function loadClasses() {
    const list = document.getElementById('classesList');

    try {
        const q = query(collection(db, "classes"), where("schoolId", "==", currentSchoolId));
        const querySnapshot = await getDocs(q);

        const classes = [];
        querySnapshot.forEach((doc) => classes.push({ id: doc.id, ...doc.data() }));
        window.loadedClasses = classes; // Store for global access (Dropdowns)

        document.getElementById('statClasses').textContent = classes.length;

        // Refresh Teacher list to show counts
        if (window.loadedTeachers) renderTeacherList(window.loadedTeachers);

        if (classes.length === 0) {
            list.innerHTML = `
                <div class="col-span-full p-8 text-center border border-dashed border-slate-300 rounded-2xl">
                    <p class="text-slate-500 mb-2">Nenhuma turma criada.</p>
                    <button onclick="openClassModal()" class="text-purple-600 font-bold hover:underline">Criar a primeira turma</button>
                </div>
            `;
            return;
        }

        list.innerHTML = classes.map(c => `
             <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl">
                        ${c.name.substring(0, 2).toUpperCase()}
                    </div>
                     <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onclick="deleteClass('${c.id}')" class="text-slate-400 hover:text-red-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                     </div>
                </div>
                <h3 class="font-bold text-lg text-slate-900 mb-1">${c.name}</h3>
                <div class="flex items-center gap-2 mb-4">
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 text-xs font-mono text-slate-600 border border-slate-200" title="Código da Turma">${c.sectionCode || '-----'}</span>
                    <p class="text-sm text-slate-500">${c.gradeName || 'Série Desconhecida'}</p>
                </div>
                
                <div class="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <div class="flex -space-x-2">
                        <!-- Mock Avatars (would be real students) -->
                        <div class="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                        <div class="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                        <span class="text-xs text-slate-400 pl-3">${c.studentCount || 0} Alunos</span>
                    </div>
                    <button onclick="manageClass('${c.id}')" class="text-brand-600 text-xs font-bold hover:underline">Gerenciar</button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error loading classes:", error);
    }
}

async function loadStudents() {
    const list = document.getElementById('studentsList');
    list.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-slate-500">Carregando...</td></tr>';

    try {
        const q = query(collection(db, "users"), where("schoolId", "==", currentSchoolId), where("role", "==", "student"), limit(50));
        const querySnapshot = await getDocs(q);

        const students = [];
        querySnapshot.forEach((doc) => students.push({ id: doc.id, ...doc.data() }));

        document.getElementById('statStudents').textContent = students.length;

        if (students.length === 0) {
            list.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-500">Nenhum aluno cadastrado nesta escola.</td></tr>';
            return;
        }

        list.innerHTML = students.map(s => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full" src="${s.photoURL || `https://ui-avatars.com/api/?name=${s.displayName}&background=random`}" alt="">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-slate-900">${s.displayName}</div>
                            <div class="text-sm text-slate-500">${s.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        ${s.className || 'Sem Turma'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <span class="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200" title="Senha do Aluno">
                        ${getSecretDisplay(s.secretValue)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" class="text-brand-600 hover:text-brand-900">Editar</a>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error("Error loading students:", error);
    }
}



async function createPersonalSchool(user, name) {
    const schoolData = {
        name: name,
        adminId: user.uid,
        createdAt: serverTimestamp(),
        size: "Personal",
        type: "freelance",
        teacherIds: [],
        studentIds: []
    };

    const schoolRef = await addDoc(collection(db, "schools"), schoolData);
    currentSchoolId = schoolRef.id;

    // Update User with School ID
    // Note: for Dev/Freelance we attach this ID.
    await updateDoc(doc(db, 'users', user.uid), { schoolId: currentSchoolId });

    // Update UI
    document.getElementById('schoolName').textContent = schoolData.name;
    console.log("School created:", currentSchoolId);
}

// --- Actions ---

window.createClass = async () => {
    const name = document.getElementById('className').value;
    const grade = document.getElementById('classGrade').value;
    const teacherId = document.getElementById('classTeacher').value;
    const loginType = document.getElementById('classLoginType').value; // New Field

    if (!name || !grade) {
        alert("Preencha o nome e a série da turma.");
        return;
    }

    const gradeSelect = document.getElementById('classGrade');
    const gradeName = gradeSelect.options[gradeSelect.selectedIndex].text;

    try {
        const btn = document.querySelector('#classModal button.bg-purple-600');
        const originalText = btn.textContent;
        btn.textContent = "Criando...";
        btn.disabled = true;

        await addDoc(collection(db, "classes"), {
            schoolId: currentSchoolId,
            name: name,
            grade: grade,
            gradeName: gradeName,
            teacherId: teacherId || null,
            sectionCode: generateSectionCode(),
            loginType: loginType || 'picture',
            studentIds: [],
            createdAt: serverTimestamp()
        });

        alert("Turma criada com sucesso!");
        closeModal('classModal');
        loadClasses(); // Reload
        loadStats(); // Update stats

        // Reset form
        document.getElementById('className').value = '';

    } catch (error) {
        console.error("Erro ao criar turma:", error);
        alert("Erro ao criar turma: " + error.message);
    } finally {
        const btn = document.querySelector('#classModal button.bg-purple-600');
        if (btn) {
            btn.textContent = "Criar Turma";
            btn.disabled = false;
        }
    }
}

// --- Class Management ---

window.manageClass = async (classId) => {
    // For now simple prompt to add student by email
    // Ideally this opens a full modal. 
    // Let's use a Prompt for "Add Student Email" to verify flow first.
    // Or better, let's just make it clear functionality is coming or simple add.

    // Simple Add Flow for MVP (as per quick fix request)
    const email = prompt("Digite o email do aluno para adicionar a esta turma:");
    if (!email) return;

    try {
        // Find User
        const q = query(collection(db, "users"), where("email", "==", email), where("schoolId", "==", currentSchoolId));
        const snap = await getDocs(q);

        if (snap.empty) {
            alert("Aluno não encontrado nesta escola.");
            return;
        }

        const student = snap.docs[0];
        const studentData = student.data();

        if (studentData.role !== 'student') {
            alert("Este usuário não é um aluno.");
            return;
        }

        if (studentData.classId) {
            alert(`Este aluno já está na turma ${studentData.className}. Remova-o antes.`);
            return;
        }

        // Add to Class
        const classRef = doc(db, "classes", classId);
        const classSnap = await getDoc(classRef);
        const className = classSnap.data().name;

        await updateDoc(classRef, {
            studentIds: arrayUnion(student.id),
            studentCount: increment(1)
        });

        // Update Student
        await updateDoc(doc(db, "users", student.id), {
            classId: classId,
            className: className
        });

        alert("Aluno adicionado!");
        loadClasses();
        loadStudents();

    } catch (e) {
        console.error(e);
        alert("Erro ao adicionar aluno: " + e.message);
    }
}

window.logout = async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
    }
}

function getSecretDisplay(val) {
    if (!val) return '---';
    const img = SECRET_IMAGES.find(i => i.id === val);
    return img ? `${img.emoji} ${img.name}` : val;
}

window.closeModal = (modalId) => {
    const m = document.getElementById(modalId);
    if (m) m.classList.add('hidden');
}

function generateSectionCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No O, 0, I, 1
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

window.openInviteModal = () => {
    document.getElementById('inviteModal').classList.remove('hidden');
    generateInviteQr();
}

function generateInviteQr() {
    const qrContainer = document.getElementById('inviteQrContainer');
    const qrImage = document.getElementById('inviteQrCode');
    const linkText = document.getElementById('inviteLinkText');

    // 1. Generate Link
    const inviteUrl = `${window.location.origin}/onboarding.html?role=teacher&schoolId=${currentSchoolId}`;

    // 2. Generate QR
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}`;

    qrImage.src = qrApi;
    linkText.textContent = inviteUrl;
    qrContainer.classList.remove('hidden');
}

window.sendInvite = async () => {
    const email = document.getElementById('inviteEmail').value;

    // If just checking QR, they can close manually. 
    // If they typed email, we pretend to send.
    if (email) {
        alert(`(Simulação) Convite enviado para ${email}`);
    }

    // Optional copy link logic could go here
    document.getElementById('inviteLinkText').select();
    document.execCommand('copy');
    alert("Link copiado para a área de transferência!");

    closeModal('inviteModal');
}

window.deleteClass = async (classId) => {
    if (!confirm("Tem certeza que deseja excluir esta turma?")) return;

    try {
        await deleteDoc(doc(db, "classes", classId));
        alert("Turma removida.");
        loadClasses();
    } catch (e) {
        console.error("Erro ao deletar turma:", e);
        alert("Erro ao deletar: " + e.message);
    }
}

// --- Student Registration ---

window.openStudentModal = () => {
    const modal = document.getElementById('studentModal');
    if (!modal) return alert("Erro: Modal de alunos não encontrado. Recarregue a página.");

    modal.classList.remove('hidden');

    try {
        populateClassSelects();
    } catch (e) {
        console.warn("Erro ao popular seletor de turmas:", e);
    }
}

window.switchStudentTab = (tab) => {
    document.querySelectorAll('[id^="studentForm-"]').forEach(el => el.classList.add('hidden'));
    document.getElementById(`studentForm-${tab}`).classList.remove('hidden');

    document.querySelectorAll('[id^="tabBtn-"]').forEach(el => el.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600'));
    document.querySelectorAll('[id^="tabBtn-"]').forEach(el => el.classList.add('text-slate-500'));

    const activeBtn = document.getElementById(`tabBtn-${tab}`);
    activeBtn.classList.remove('text-slate-500');
    activeBtn.classList.add('text-brand-600', 'border-b-2', 'border-brand-600');
}

window.handleFileSelect = (input) => {
    if (input.files && input.files[0]) {
        document.getElementById('fileName').textContent = input.files[0].name;
    }
}

function populateClassSelects() {
    // Populate the select in Student Modal with classes loaded previously
    const select = document.getElementById('studentClassSelect');
    // Using the same data source as the class list would be ideal, but for now we re-query or store global
    // Quick hack: Use the options from 'classTeacher' dropdown? No, that's teachers.

    // Better: We reload classes into a global or just rely on the existing DOM for the class list?
    // Let's re-use query since we don't have a global 'classes' array exposed easily properly.
    // Actually, let's just fetch them again or cleaner: store in global variable when loading classes.
    if (window.loadedClasses) {
        select.innerHTML = '<option value="">Selecione...</option>';
        window.loadedClasses.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name; // Storing Name as requested by simple flow? Or ID? Let's use Name for display, ID for value.
            // Wait, CSV might use Name. Let's support ID.
            opt.value = c.id;
            opt.textContent = c.name;
            select.appendChild(opt);
        });
    }
}

window.registerStudentManual = async () => {
    const name = document.getElementById('studentName').value;
    const classId = document.getElementById('studentClassSelect').value;
    const className = classId ? document.querySelector(`#studentClassSelect option[value="${classId}"]`).textContent : null;

    if (!name) return alert("Digite o nome do aluno.");

    // Determine login type and secret
    let loginType = 'picture';
    if (classId && window.loadedClasses) {
        const cls = window.loadedClasses.find(c => c.id === classId);
        if (cls && cls.loginType) loginType = cls.loginType;
    }

    const secretValue = generateSecret(loginType);
    const accessCode = generateAccessCode(name);

    try {
        await addDoc(collection(db, "users"), {
            displayName: name,
            role: 'student',
            schoolId: currentSchoolId,
            classId: classId || null,
            className: className || null,
            accessCode: accessCode, // Important for "Offline" login
            secretValue: secretValue, // The Teacher-Generated Secret
            xp: 0,
            level: 1,
            createdAt: serverTimestamp(),
            isShadow: true // Flag to indicate created by teacher, not real auth yet
        });

        const secretDisplay = getSecretDisplay(secretValue);
        alert(`Aluno cadastrado!\nSenha: ${secretDisplay}`);
        closeModal('studentModal');
        loadStudents();
    } catch (e) {
        console.error("Erro ao cadastrar:", e);
        alert("Erro ao cadastrar.");
    }
}

window.processCSV = () => {
    const input = document.getElementById('csvFile');
    if (!input.files || !input.files[0]) return alert("Selecione um arquivo CSV.");

    const reader = new FileReader();
    reader.onload = async function (e) {
        const text = e.target.result;
        const lines = text.split('\n');

        let successCount = 0;

        for (let line of lines) {
            const [name, className] = line.split(',');
            if (name && name.trim().length > 2) {
                const cleanName = name.trim();
                const accessCode = generateAccessCode(cleanName);

                // Find class ID by name if provided? Difficult without map. 
                // For MVP, we ignore class matching from CSV or strict match.

                try {
                    await addDoc(collection(db, "users"), {
                        displayName: cleanName,
                        role: 'student',
                        schoolId: currentSchoolId,
                        className: className ? className.trim() : null,
                        accessCode: accessCode,
                        xp: 0,
                        level: 1,
                        createdAt: serverTimestamp(),
                        isShadow: true
                    });
                    successCount++;
                } catch (err) {
                    console.error("Error CSV line:", line, err);
                }
            }
        }

        alert(`${successCount} alunos importados com sucesso!`);
        closeModal('studentModal');
        loadStudents();
    };
    reader.readAsText(input.files[0]);
}

function generateAccessCode(name) {
    // Generate simple code: FIRSTNAME + 4 Random Digits
    const first = name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${first}${rand}`;
}
