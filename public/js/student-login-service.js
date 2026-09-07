import { app, auth } from './firebase-config.js';
import {
    getFunctions,
    httpsCallable,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js";
import {
    signInWithCustomToken,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/**
 * Entrada do aluno pelo código da turma.
 *
 * Toda a consulta acontece em Cloud Functions, por dois motivos que não
 * dá para resolver no navegador:
 *
 * 1. A regra de /classes no Firestore exige usuário autenticado, e aqui o
 *    aluno ainda não entrou — a busca direta nunca funcionaria.
 * 2. Buscar a turma pelo cliente trazia o documento de cada aluno inteiro,
 *    palavra secreta incluída. Quem tivesse o código da turma — que fica
 *    num cartaz na parede — lia a senha de todos os colegas no painel do
 *    navegador. A palavra secreta agora só existe no servidor.
 *
 * O login devolve um token assinado e chama signInWithCustomToken, então a
 * sessão do aluno vale para as regras do Firestore como qualquer outra. A
 * versão anterior apenas gravava em localStorage, o que qualquer pessoa
 * podia escrever no console para virar outro aluno.
 */
const fns = getFunctions(app);
const lookupClassFn = httpsCallable(fns, 'lookupClass');
const studentLoginFn = httpsCallable(fns, 'studentLogin');

/** Mensagem para a criança, não para o desenvolvedor. */
function mensagemDe(error, padrao) {
    const codigo = (error && error.code) || '';
    if (codigo.includes('not-found')) return error.message || 'Turma não encontrada.';
    if (codigo.includes('permission-denied')) return error.message || 'Palavra secreta incorreta.';
    if (codigo.includes('invalid-argument')) return error.message || 'Confira os dados e tente de novo.';
    return padrao;
}

export const studentLoginService = {
    /**
     * Busca a turma pelo código de acesso.
     * @param {string} code Código de 6 caracteres do cartaz da turma.
     * @returns {Promise<Object|null>} Turma com os alunos (sem palavras
     *          secretas), ou null quando o código não existe.
     */
    async findClassByCode(code) {
        try {
            const resposta = await lookupClassFn({ code });
            return resposta.data;
        } catch (error) {
            // Código inexistente é resposta esperada, não falha: devolve
            // null para a tela poder dizer "confira o código" em vez de
            // "erro ao carregar".
            if (error && String(error.code).includes('not-found')) return null;
            console.error('Erro ao buscar turma:', error);
            throw new Error(mensagemDe(error, 'Não foi possível carregar a turma agora.'));
        }
    },

    /**
     * Confere a palavra secreta no servidor e autentica o aluno.
     * @returns {Promise<Object>} Dados da sessão já gravada.
     */
    async login(code, studentId, secret) {
        let dados;
        try {
            const resposta = await studentLoginFn({ code, studentId, secret });
            dados = resposta.data;
        } catch (error) {
            throw new Error(mensagemDe(error, 'Não foi possível entrar agora. Tente novamente.'));
        }

        await signInWithCustomToken(auth, dados.token);

        const sessionData = {
            studentId: dados.student.id,
            name: dados.student.name,
            avatar: dados.student.avatar || '🎓',
            classId: dados.classId,
            className: dados.className,
            loginTime: new Date().toISOString(),
        };
        // Cache de exibição para a interface não piscar enquanto o Firebase
        // restaura a sessão. Quem autoriza é o token, nunca este objeto.
        localStorage.setItem('izicode_student_session', JSON.stringify(sessionData));
        return sessionData;
    },

    /** Sessão em cache, só para desenhar a tela. */
    getSession() {
        const data = localStorage.getItem('izicode_student_session');
        try {
            return data ? JSON.parse(data) : null;
        } catch {
            localStorage.removeItem('izicode_student_session');
            return null;
        }
    },

    async logout() {
        localStorage.removeItem('izicode_student_session');
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Erro ao encerrar a sessão:', error);
        }
        window.location.href = 'join.html';
    },
};
