import { db, collection, addDoc, serverTimestamp } from './firebase-config.js';

window.submitForm = async () => {
    const btn = document.getElementById('submitBtn');
    const icon = document.getElementById('btnIcon');
    const originalText = btn.innerHTML;

    // Data Gathering
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Radio Groups
    const roleEl = document.querySelector('input[name="role"]:checked');
    const goalEl = document.querySelector('input[name="goal"]:checked');
    const role = roleEl ? roleEl.value : 'unknown';
    const goal = goalEl ? goalEl.value : 'general';

    // UI Loading
    btn.disabled = true;
    btn.innerHTML = 'Enviando... <div class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full ml-2"></div>';

    try {
        await addDoc(collection(db, "leads"), {
            name: name,
            email: email,
            role: role,
            goal: goal,
            message: message,
            source: 'contact_form_v1',
            status: 'new',
            createdAt: serverTimestamp()
        });

        // UI Success
        document.getElementById('successEmail').textContent = email;

        // Transition to Success Step (Same logic as internal script but manual call)
        document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
        const successStep = document.getElementById('stepSuccess');
        successStep.style.display = 'block';
        setTimeout(() => successStep.classList.add('active', 'slide-up'), 10);
        document.getElementById('progressBar').parentElement.classList.add('opacity-0'); // Hide progress

    } catch (e) {
        console.error("Erro ao enviar lead:", e);
        alert("Ops! Houve um erro ao enviar. Tente novamente ou envie email para contato@izicode.com.br");
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
