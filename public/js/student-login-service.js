import { db, collection, query, where, getDocs, doc, getDoc } from './firebase-config.js';

export const studentLoginService = {
    /**
     * Finds a class by its 6-character section code.
     * @param {string} code - The 6-character code (e.g., 'ABCDEF').
     * @returns {Promise<Object|null>} - The class data or null if not found.
     */
    async findClassByCode(code) {
        try {
            // Note: In production, ensure 'sectionCode' index exists.
            const q = query(collection(db, "classes"), where("sectionCode", "==", code));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const classDoc = querySnapshot.docs[0];
            const classData = classDoc.data();

            // Also fetch students subcollection if it exists, or array from doc
            // Assuming for now students might be stored in a 'students' subcollection
            // or we might mock it if the schema isn't fully migrated yet.

            let students = [];
            try {
                const studentsRef = collection(db, `classes/${classDoc.id}/students`);
                const studentsSnap = await getDocs(studentsRef);
                students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (e) {
                console.warn("Could not fetch students subcollection", e);
                // Fallback if students are in the class doc (deprecated approach but possible)
                if (classData.students && Array.isArray(classData.students)) {
                    students = classData.students;
                }
            }

            return {
                id: classDoc.id,
                ...classData,
                students: students
            };
        } catch (error) {
            console.error("Error finding class:", error);
            throw error;
        }
    },

    /**
     * Validates the student's secret word/icon.
     * @param {string} studentId 
     * @param {string} secretInput 
     * @param {string} correctSecret (In a real app, this wouldn't be passed client-side ideally)
     * @returns {boolean}
     */
    async validateSecret(studentId, secretInput, correctSecret) {
        // Simple comparison for MVP
        // In robust auth, we'd send this to a Cloud Function to verify hash
        return secretInput.toLowerCase().trim() === correctSecret.toLowerCase().trim();
    },

    /**
     * Logs the student in by saving session state.
     * @param {Object} student 
     * @param {Object} classData 
     */
    login(student, classData) {
        const sessionData = {
            studentId: student.id,
            name: student.name,
            avatar: student.avatar || '🎓',
            classId: classData.id,
            className: classData.name,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('izicode_student_session', JSON.stringify(sessionData));
        return true;
    },

    /**
     * Checks if a student is logged in.
     * @returns {Object|null}
     */
    getSession() {
        const data = localStorage.getItem('izicode_student_session');
        return data ? JSON.parse(data) : null;
    },

    logout() {
        localStorage.removeItem('izicode_student_session');
        window.location.href = 'join.html';
    }
};
