import { auth, db, getDocs, collection, query, where, updateDoc, doc, onAuthStateChanged } from './firebase-config.js';

let currentTab = 'schools';

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (!user || user.email !== 'izicripto@gmail.com') {
            alert('Acesso negado. Apenas para Super Admins.');
            window.location.href = 'dashboard.html';
        } else {
            loadData(currentTab);
        }
    });
});

window.switchTab = (tab) => {
    currentTab = tab;
    // Update Sidebar UI
    document.querySelectorAll('nav button').forEach(btn => {
        if (btn.textContent.includes(getTabTitle(tab))) {
            btn.className = "w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl font-medium text-left";
            btn.classList.remove('text-slate-400');
        } else {
            btn.className = "w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl font-medium text-left text-slate-400 hover:text-white transition-colors";
        }
    });

    document.getElementById('pageTitle').textContent = `Gestão de ${getTabTitle(tab)}`;

    // Action Button Logic
    const actionArea = document.getElementById('actionArea');
    if (tab === 'consultants') {
        actionArea.innerHTML = `<button onclick="openConsultantModal()" class="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-transform hover:scale-105">+ Novo Consultor</button>`;
    } else {
        actionArea.innerHTML = '';
    }

    loadData(tab);
};

function getTabTitle(tab) {
    const titles = { 'schools': 'Escolas', 'freelancers': 'Autônomos', 'families': 'Famílias/Maker', 'consultants': 'Consultores' };
    return titles[tab];
}

async function loadData(tab) {
    const tbody = document.getElementById('tableBody');
    const thead = document.getElementById('tableHeader');
    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-500">Carregando...</td></tr>';

    try {
        if (tab === 'schools') {
            thead.innerHTML = `
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Escola</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Admin ID</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Plano Atual</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
            `;
            const snap = await getDocs(collection(db, "schools"));
            renderTable(snap.docs.map(d => ({ id: d.id, ...d.data() })), 'schools');
        } else {
            // Users Tabs
            let roleFilter = '';
            if (tab === 'freelancers') roleFilter = 'freelance_teacher';
            if (tab === 'families') roleFilter = 'parent'; // What about students? Handled loosely
            if (tab === 'consultants') roleFilter = 'consultant';

            // Special case for Families which might show makers too
            let q = query(collection(db, "users"), where("role", "==", roleFilter));
            if (tab === 'families') {
                // Maybe filter differently later. For now just parents.
            }

            thead.innerHTML = `
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Nome</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Email</th>
                <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Data Cadastro</th>
                 <th class="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
            `;

            const snap = await getDocs(q);
            renderTable(snap.docs.map(d => ({ id: d.id, ...d.data() })), 'users');
        }
    } catch (e) {
        console.error(e);
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-red-500">Erro ao carregar: ${e.message}</td></tr>`;
    }
}

function renderTable(data, type) {
    const tbody = document.getElementById('tableBody');
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-400">Nenhum registro encontrado.</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(item => {
        if (type === 'schools') {
            const isFull = item.plan === 'full';
            return `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 font-medium text-slate-900">${item.name || 'Sem nome'}</td>
                    <td class="px-6 py-4 text-sm text-slate-500 font-mono text-xs">${item.adminId}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs font-bold ${isFull ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}">
                            ${item.plan || 'Free'}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500">${item.type || 'Standard'}</td>
                    <td class="px-6 py-4 text-right">
                        <button onclick="toggleSchoolPlan('${item.id}', '${item.plan}')" class="text-xs font-bold px-3 py-1 rounded-lg border ${isFull ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'} transition-colors">
                            ${isFull ? 'Revogar Full' : 'Liberar Full'}
                        </button>
                    </td>
                </tr>
            `;
        } else {
            return `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 flex items-center gap-3">
                        <img src="${item.photoURL || `https://ui-avatars.com/api/?name=${item.displayName}`}" class="w-8 h-8 rounded-full">
                        <span class="font-medium text-slate-900">${item.displayName || 'Sem nome'}</span>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500">${item.email}</td>
                    <td class="px-6 py-4 text-xs text-slate-400">${item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : '-'}</td>
                    <td class="px-6 py-4 text-right">
                       <button class="text-slate-400 hover:text-brand-600">Ver</button>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

// --- Action Functions ---
window.toggleSchoolPlan = async (schoolId, currentPlan) => {
    const newPlan = currentPlan === 'full' ? 'free' : 'full';
    if (!confirm(`Deseja alterar o plano desta escola para ${newPlan.toUpperCase()}?`)) return;

    try {
        await updateDoc(doc(db, "schools", schoolId), { plan: newPlan });
        loadData('schools'); // Reload
    } catch (e) {
        alert("Erro ao atualizar: " + e.message);
    }
};

window.openConsultantModal = () => {
    const modal = document.getElementById('consultantModal');
    const linkDisplay = document.getElementById('inviteLinkDisplay');
    // Generate simple link for now (User ID not needed, just the role param which is protected or hidden)
    const baseUrl = window.location.origin + window.location.pathname.replace('platform-admin.html', 'onboarding.html');
    linkDisplay.textContent = `${baseUrl}?role=consultant`; // Simplest approach.
    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeModal = () => {
    document.getElementById('consultantModal').classList.add('hidden');
    document.getElementById('consultantModal').classList.remove('flex');
};

window.copyLink = () => {
    const text = document.getElementById('inviteLinkDisplay').textContent;
    navigator.clipboard.writeText(text);
    alert('Link copiado!');
};
