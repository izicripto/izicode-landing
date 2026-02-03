/**
 * Firestore Database Manager
 * CRUD operations para todas as collections
 */

import {
    db,
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp
} from './firebase-config.js';

// ==================== USERS ====================

export class UserManager {
    /**
     * Criar ou atualizar usuário após login
     */
    static async createOrUpdateUser(uid, userData) {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // Atualizar lastLogin
            await updateDoc(userRef, {
                lastLogin: serverTimestamp()
            });
            return userSnap.data();
        } else {
            // Criar novo usuário
            const newUser = {
                uid,
                email: userData.email,
                displayName: userData.displayName || '',
                photoURL: userData.photoURL || '',
                role: userData.role || 'aluno', // Definido no onboarding
                schoolId: null,
                xp: 0,
                level: 1,
                badges: [],
                challengesCompleted: 0,
                scratchChallenges: 0,
                arduinoChallenges: 0,
                microbitChallenges: 0,
                firstTryWins: 0,
                helpCount: 0,
                loginStreak: 1,
                fastestCompletion: null,
                weekendSessions: 0,
                lateNightCompletions: 0,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                subscription: {
                    plan: 'free',
                    status: 'active',
                    startDate: serverTimestamp(),
                    endDate: null
                }
            };
            await setDoc(userRef, newUser);
            return newUser;
        }
    }

    /**
     * Buscar usuário por ID
     */
    static async getUser(uid) {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
    }

    /**
     * Atualizar XP do usuário
     */
    static async addXP(uid, xpAmount) {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const currentXP = userSnap.data().xp || 0;
            const newXP = currentXP + xpAmount;

            await updateDoc(userRef, {
                xp: newXP
            });

            return newXP;
        }
        return 0;
    }

    /**
     * Atualizar role do usuário
     */
    static async updateRole(uid, role) {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { role });
    }

    /**
     * Atualizar assinatura do usuário
     */
    static async updateSubscription(uid, subscriptionData) {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            'subscription.plan': subscriptionData.plan,
            'subscription.status': subscriptionData.status,
            'subscription.transactionId': subscriptionData.transactionId || null,
            'subscription.startDate': serverTimestamp(),
            'subscription.endDate': subscriptionData.endDate || null
        });
    }
}

// ==================== CLASSES ====================

export class ClassManager {
    /**
     * Criar nova turma
     */
    static async createClass(teacherId, classData) {
        const classRef = await addDoc(collection(db, 'classes'), {
            name: classData.name,
            schoolId: classData.schoolId || null,
            teacherId,
            studentIds: [],
            grade: classData.grade,
            shift: classData.shift || 'morning',
            active: true,
            createdAt: serverTimestamp()
        });
        return classRef.id;
    }

    /**
     * Buscar turmas de um professor
     */
    static async getTeacherClasses(teacherId) {
        const q = query(
            collection(db, 'classes'),
            where('teacherId', '==', teacherId),
            where('active', '==', true)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    /**
     * Buscar turma por ID
     */
    static async getClass(classId) {
        const classRef = doc(db, 'classes', classId);
        const classSnap = await getDoc(classRef);
        return classSnap.exists() ? { id: classSnap.id, ...classSnap.data() } : null;
    }

    /**
     * Adicionar aluno à turma
     */
    static async addStudent(classId, studentId) {
        const classRef = doc(db, 'classes', classId);
        await updateDoc(classRef, {
            studentIds: arrayUnion(studentId)
        });
    }

    /**
     * Remover aluno da turma
     */
    static async removeStudent(classId, studentId) {
        const classRef = doc(db, 'classes', classId);
        await updateDoc(classRef, {
            studentIds: arrayRemove(studentId)
        });
    }

    /**
     * Atualizar turma
     */
    static async updateClass(classId, updates) {
        const classRef = doc(db, 'classes', classId);
        await updateDoc(classRef, updates);
    }

    /**
     * Arquivar turma
     */
    static async archiveClass(classId) {
        const classRef = doc(db, 'classes', classId);
        await updateDoc(classRef, { active: false });
    }
}

// ==================== CHALLENGES ====================

export class ChallengeManager {
    /**
     * Criar novo desafio
     */
    static async createChallenge(creatorId, challengeData) {
        const challengeRef = await addDoc(collection(db, 'challenges'), {
            title: challengeData.title,
            description: challengeData.description,
            difficulty: challengeData.difficulty,
            xpReward: challengeData.xpReward,
            platform: challengeData.platform,
            content: challengeData.content,
            duration: challengeData.duration,
            grade: challengeData.grade || '',
            tools: challengeData.tools || [],
            createdBy: creatorId,
            isPublic: challengeData.isPublic || false,
            createdAt: serverTimestamp()
        });
        return challengeRef.id;
    }

    /**
     * Buscar desafios públicos
     */
    static async getPublicChallenges() {
        const q = query(
            collection(db, 'challenges'),
            where('isPublic', '==', true)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    /**
     * Buscar desafios por plataforma
     */
    static async getChallengesByPlatform(platform) {
        const q = query(
            collection(db, 'challenges'),
            where('platform', '==', platform),
            where('isPublic', '==', true)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    /**
     * Buscar desafio por ID
     */
    static async getChallenge(challengeId) {
        const challengeRef = doc(db, 'challenges', challengeId);
        const challengeSnap = await getDoc(challengeRef);
        return challengeSnap.exists() ? { id: challengeSnap.id, ...challengeSnap.data() } : null;
    }

    /**
     * Atribuir desafio para turma
     */
    static async assignToClass(challengeId, classId) {
        // Buscar alunos da turma
        const classData = await ClassManager.getClass(classId);
        if (!classData) return;

        // Criar progresso para cada aluno
        const promises = classData.studentIds.map(studentId =>
            ProgressManager.createProgress(studentId, challengeId)
        );
        await Promise.all(promises);
    }
}

// ==================== STUDENT PROGRESS ====================

export class ProgressManager {
    /**
     * Criar progresso para aluno
     */
    static async createProgress(studentId, challengeId) {
        // Verificar se já existe
        const q = query(
            collection(db, 'studentProgress'),
            where('studentId', '==', studentId),
            where('challengeId', '==', challengeId)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return snapshot.docs[0].id; // Já existe
        }

        const progressRef = await addDoc(collection(db, 'studentProgress'), {
            studentId,
            challengeId,
            status: 'not_started',
            startedAt: serverTimestamp(),
            completedAt: null,
            attempts: 0,
            score: 0,
            xpEarned: 0
        });
        return progressRef.id;
    }

    /**
     * Atualizar status do desafio
     */
    static async updateProgress(progressId, updates) {
        const progressRef = doc(db, 'studentProgress', progressId);
        await updateDoc(progressRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }

    /**
     * Marcar desafio como completo
     */
    static async completeChallenge(progressId, score = 100) {
        const progressRef = doc(db, 'studentProgress', progressId);
        const progressSnap = await getDoc(progressRef);

        if (progressSnap.exists()) {
            const progressData = progressSnap.data();
            const challenge = await ChallengeManager.getChallenge(progressData.challengeId);
            const xpEarned = challenge.xpReward;

            // Atualizar progresso
            await updateDoc(progressRef, {
                status: 'completed',
                completedAt: serverTimestamp(),
                score,
                xpEarned
            });

            // Adicionar XP ao usuário
            await UserManager.addXP(progressData.studentId, xpEarned);

            // Incrementar contador de desafios
            const userRef = doc(db, 'users', progressData.studentId);
            await updateDoc(userRef, {
                challengesCompleted: arrayUnion(progressData.challengeId),
                [`${challenge.platform}Challenges`]: arrayUnion(progressData.challengeId)
            });

            return xpEarned;
        }
        return 0;
    }

    /**
     * Buscar progresso do aluno
     */
    static async getStudentProgress(studentId) {
        const q = query(
            collection(db, 'studentProgress'),
            where('studentId', '==', studentId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    /**
     * Buscar progresso de um desafio específico
     */
    static async getChallengeProgress(studentId, challengeId) {
        const q = query(
            collection(db, 'studentProgress'),
            where('studentId', '==', studentId),
            where('challengeId', '==', challengeId)
        );
        const snapshot = await getDocs(q);
        return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
}

// ==================== BADGES ====================

export class BadgeManager {
    /**
     * Conceder badge ao usuário
     */
    static async awardBadge(userId, badgeId) {
        // Verificar se já tem o badge
        const q = query(
            collection(db, 'userBadges'),
            where('userId', '==', userId),
            where('badgeId', '==', badgeId)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return false; // Já tem o badge
        }

        // Conceder badge
        await addDoc(collection(db, 'userBadges'), {
            userId,
            badgeId,
            earnedAt: serverTimestamp()
        });

        // Adicionar ao array de badges do usuário
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            badges: arrayUnion(badgeId)
        });

        return true;
    }

    /**
     * Buscar badges do usuário
     */
    static async getUserBadges(userId) {
        const q = query(
            collection(db, 'userBadges'),
            where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}

// Exportar tudo
export default {
    UserManager,
    ClassManager,
    ChallengeManager,
    ProgressManager,
    BadgeManager
};
