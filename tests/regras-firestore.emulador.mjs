// Testes das regras do Firestore do Portal Izicode (C:\dev\izicodeeduportal), no emulador.
// Foco: dados de crianças (palavra secreta, progresso), isolamento entre escolas e
// ninguém se vincula a uma escola sem o código.
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, limit } from "firebase/firestore";

let env;
const RULES = process.env.RULES || "C:/dev/izicodeeduportal/firestore.rules";

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-testes",
    firestore: { rules: readFileSync(RULES, "utf8"), host: "127.0.0.1", port: 8085 },
  });
});
afterAll(async () => env?.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    const s = (p, d) => setDoc(doc(db, p), d);
    await s("schools/SC1", { name: "Escola Um", adminId: "SA1", plan: "active", studentCode: "ALU123", teacherCode: "PRO456" });
    await s("schools/SC2", { name: "Escola Dois", adminId: "SA2", plan: "active", studentCode: "ALU999", teacherCode: "PRO999" });
    await s("codigosEscola/ALU123", { schoolId: "SC1", tipo: "student", nome: "Escola Um" });
    await s("codigosEscola/PRO456", { schoolId: "SC1", tipo: "teacher", nome: "Escola Um" });
    await s("codigosEscola/PRO999", { schoolId: "SC2", tipo: "teacher", nome: "Escola Dois" });
    await s("users/SA1", { role: "school_admin", schoolId: "SC1", displayName: "Gestora Um" });
    await s("users/T1", { role: "teacher", schoolId: "SC1", displayName: "Prof Um", email: "t1@e1.com" });
    await s("users/U1", { role: "student", schoolId: "SC1", displayName: "Aluno Um" });
    await s("users/SA2", { role: "school_admin", schoolId: "SC2" });
    await s("users/T2", { role: "teacher", schoolId: "SC2" });
    await s("users/X", { role: "teacher", schoolId: null, displayName: "Qualquer" });
    await s("classes/C1", { name: "5º A", schoolId: "SC1", teacherId: "T1", code: "TURMA1" });
    await s("classes/C2", { name: "6º B", schoolId: "SC2", teacherId: "T2", code: "TURMA2" });
    await s("classes/C1/students/S1", { name: "Ana", avatar: "gato", secret: "banana" });
    await s("classes/C2/students/S2", { name: "Beto", avatar: "cão", secret: "maçã" });
    await s("studentProgress/P1", { studentId: "student_C1_S1", challengeId: "ch1", score: 10 });
    await s("studentProgress/P2", { studentId: "student_C2_S2", challengeId: "ch1", score: 5 });
    await s("payments/PAY1", { uid: "U1", status: "paid" });
    await s("coupons/PROMO10", { desconto: 10 });
  });
});

const como = (uid, claims = {}) => (uid ? env.authenticatedContext(uid, claims).firestore() : env.unauthenticatedContext().firestore());

describe("conta qualquer que se declara professor (X)", () => {
  const X = () => como("X", { email: "x@evil.com" });
  it("não lê nem altera os alunos (palavra secreta) de nenhuma turma", async () => {
    await assertFails(getDoc(doc(X(), "classes/C1/students/S1")));
    await assertFails(getDocs(collection(X(), "classes/C1/students")));
    await assertFails(setDoc(doc(X(), "classes/C1/students/S1"), { name: "Ana", secret: "trocada" }));
  });
  it("não lista escolas, turmas e seus códigos", async () => {
    await assertFails(getDocs(collection(X(), "schools")));
    await assertFails(getDocs(query(collection(X(), "schools"), where("teacherCode", "==", "PRO456"), limit(1))));
    await assertFails(getDoc(doc(X(), "schools/SC1")));
    await assertFails(getDocs(collection(X(), "classes")));
    await assertFails(getDoc(doc(X(), "classes/C1")));
  });
  it("confere um código que conhece, mas não enumera os códigos", async () => {
    await assertSucceeds(getDoc(doc(X(), "codigosEscola/PRO456")));
    await assertFails(getDocs(collection(X(), "codigosEscola")));
  });
  it("só se vincula a uma escola com o código certo para o papel", async () => {
    await assertFails(updateDoc(doc(X(), "users/X"), { schoolId: "SC1" }));
    await assertFails(updateDoc(doc(X(), "users/X"), { schoolId: "SC1", codigoEscola: "ALU123" }));
    await assertFails(updateDoc(doc(X(), "users/X"), { schoolId: "SC2", codigoEscola: "PRO456" }));
    await assertSucceeds(updateDoc(doc(X(), "users/X"), { schoolId: "SC1", codigoEscola: "PRO456" }));
  });
  it("não lê pessoas, progresso, pagamentos nem cupons", async () => {
    await assertFails(getDoc(doc(X(), "users/T1")));
    await assertFails(getDoc(doc(X(), "studentProgress/P1")));
    await assertFails(getDoc(doc(X(), "payments/PAY1")));
    await assertFails(getDocs(collection(X(), "coupons")));
  });
  it("não se promove nem se dá plano pago", async () => {
    await assertFails(updateDoc(doc(X(), "users/X"), { role: "admin" }));
    await assertFails(updateDoc(doc(X(), "users/X"), { subscription: { plan: "pro" } }));
  });
  it("não cria turma em escola alheia", async () => {
    await assertFails(setDoc(doc(X(), "classes/CX"), { name: "x", schoolId: "SC1", teacherId: "X" }));
  });
});

describe("professor de outra escola (T2)", () => {
  const T2 = () => como("T2");
  it("não vê alunos, turma, escola, pessoas e progresso da Escola Um", async () => {
    await assertFails(getDoc(doc(T2(), "classes/C1/students/S1")));
    await assertFails(getDoc(doc(T2(), "classes/C1")));
    await assertFails(getDoc(doc(T2(), "schools/SC1")));
    await assertFails(getDoc(doc(T2(), "users/T1")));
    await assertFails(getDocs(query(collection(T2(), "users"), where("schoolId", "==", "SC1"))));
    await assertFails(getDoc(doc(T2(), "studentProgress/P1")));
  });
  it("vê a própria turma, escola e o progresso dos próprios alunos", async () => {
    await assertSucceeds(getDoc(doc(T2(), "classes/C2/students/S2")));
    await assertSucceeds(getDoc(doc(T2(), "schools/SC2")));
    await assertSucceeds(getDoc(doc(T2(), "studentProgress/P2")));
    await assertSucceeds(getDocs(query(collection(T2(), "users"), where("schoolId", "==", "SC2"))));
  });
});

describe("professor da turma (T1) e gestora da escola (SA1)", () => {
  it("professor vê e cuida dos alunos da própria turma", async () => {
    const T1 = como("T1");
    await assertSucceeds(getDocs(collection(T1, "classes/C1/students")));
    await assertSucceeds(setDoc(doc(T1, "classes/C1/students/S3"), { name: "Caio", secret: "uva" }));
    await assertSucceeds(getDoc(doc(T1, "studentProgress/P1")));
    await assertSucceeds(getDocs(query(collection(T1, "studentProgress"), where("studentId", "==", "student_C1_S1"))));
    await assertSucceeds(getDocs(query(collection(T1, "classes"), where("schoolId", "==", "SC1"))));
  });
  it("gestora vê alunos das turmas da escola e cria turma só na própria escola", async () => {
    const SA1 = como("SA1");
    await assertSucceeds(getDoc(doc(SA1, "classes/C1/students/S1")));
    await assertSucceeds(getDocs(query(collection(SA1, "users"), where("schoolId", "==", "SC1"))));
    await assertSucceeds(getDoc(doc(SA1, "schools/SC1")));
    await assertSucceeds(setDoc(doc(SA1, "classes/C9"), { name: "Nova", schoolId: "SC1", teacherId: "T1" }));
    await assertFails(setDoc(doc(SA1, "classes/C8"), { name: "Invasão", schoolId: "SC2", teacherId: "T1" }));
    await assertFails(getDoc(doc(SA1, "classes/C2/students/S2")));
  });
});

describe("aluno com token da turma", () => {
  it("vê a própria turma, não a lista de alunos com as palavras", async () => {
    const A = como("student_C1_S1", { role: "student", classId: "C1", studentId: "S1" });
    await assertSucceeds(getDoc(doc(A, "classes/C1")));
    await assertFails(getDoc(doc(A, "classes/C2")));
    await assertFails(getDocs(collection(A, "classes/C1/students")));
  });
});

describe("dono da plataforma", () => {
  it("vê e administra tudo, inclusive o índice de códigos", async () => {
    const O = como("OWN", { email: "izicripto@gmail.com" });
    await assertSucceeds(getDocs(collection(O, "schools")));
    await assertSucceeds(getDocs(collection(O, "classes")));
    await assertSucceeds(getDoc(doc(O, "classes/C2/students/S2")));
    await assertSucceeds(setDoc(doc(O, "codigosEscola/NOVO11"), { schoolId: "SC2", tipo: "student", nome: "Escola Dois" }));
    await assertSucceeds(getDocs(collection(O, "coupons")));
  });
  it("aluno lê o próprio pagamento", async () => {
    await assertSucceeds(getDoc(doc(como("U1"), "payments/PAY1")));
  });
});
