import { useCallback, useEffect, useState } from "react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

export interface SchoolDoc {
  name?: string
  plan?: string
  adminId?: string
  studentCode?: string
  teacherCode?: string
  type?: string
}

export interface SchoolClass {
  id: string
  name?: string
  grade?: string
  gradeName?: string
  teacherId?: string
  studentIds?: string[]
}

export interface Member {
  id: string
  displayName?: string
  name?: string
  email?: string
  role?: string
  xp?: number
}

export function useSchool() {
  const { user, userData } = useAuth()
  const schoolId = userData?.schoolId ?? null

  const [school, setSchool] = useState<SchoolDoc | null>(null)
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user || !schoolId) {
      setLoading(false)
      return
    }
    setError(null)
    try {
      const [schoolSnap, classesSnap, membersSnap] = await Promise.all([
        getDoc(doc(db, "schools", schoolId)),
        getDocs(query(collection(db, "classes"), where("schoolId", "==", schoolId))),
        getDocs(query(collection(db, "users"), where("schoolId", "==", schoolId))),
      ])

      setSchool(schoolSnap.exists() ? (schoolSnap.data() as SchoolDoc) : null)
      setClasses(classesSnap.docs.map((d) => ({ ...(d.data() as Omit<SchoolClass, "id">), id: d.id })))
      setMembers(membersSnap.docs.map((d) => ({ ...(d.data() as Omit<Member, "id">), id: d.id })))
    } catch (err) {
      console.error("Erro ao carregar dados da escola:", err)
      setError("Não foi possível carregar os dados da escola agora.")
    } finally {
      setLoading(false)
    }
  }, [user, schoolId])

  useEffect(() => {
    load()
  }, [load])

  /**
   * As regras do Firestore só liberam criar/editar turma quando a escola
   * tem plano 'active'. O botão fica desabilitado no modo demonstração,
   * mas a checagem que vale é a do servidor — esta aqui só evita que o
   * usuário descubra o bloqueio depois de preencher o formulário.
   */
  const canManageClasses = school?.plan === "active"

  const createClass = useCallback(
    async (data: { name: string; grade: string; teacherId?: string }) => {
      if (!schoolId) throw new Error("Escola não identificada.")
      await addDoc(collection(db, "classes"), {
        schoolId,
        name: data.name.trim(),
        grade: data.grade.trim(),
        gradeName: data.grade.trim(),
        teacherId: data.teacherId || null,
        studentIds: [],
        createdAt: serverTimestamp(),
      })
      await load()
    },
    [schoolId, load]
  )

  const removeClass = useCallback(
    async (classId: string) => {
      await deleteDoc(doc(db, "classes", classId))
      await load()
    },
    [load]
  )

  const teachers = members.filter((m) => m.role === "teacher" || m.role === "school_admin")
  const students = members.filter((m) => m.role === "student")

  return {
    schoolId,
    school,
    classes,
    members,
    teachers,
    students,
    loading,
    error,
    canManageClasses,
    createClass,
    removeClass,
    reload: load,
  }
}
