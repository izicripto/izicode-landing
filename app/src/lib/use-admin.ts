import { useCallback, useEffect, useMemo, useState } from "react"
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface AdminUser {
  id: string
  displayName?: string
  name?: string
  email?: string
  role?: string
  schoolId?: string | null
  subscription?: { plan?: string; provider?: string }
  xp?: number
  aiUsageCount?: number
  createdAt?: { toDate: () => Date }
}

export interface AdminSchool {
  id: string
  name?: string
  plan?: string
  adminId?: string
  studentCode?: string
  teacherCode?: string
  createdAt?: { toDate: () => Date }
}

export interface AdminLead {
  id: string
  name?: string
  email?: string
  role?: string
  goal?: string
  message?: string
  source?: string
  status?: string
  schoolName?: string
  createdAt?: { toDate: () => Date }
}

export interface AdminClass {
  id: string
  name?: string
  schoolId?: string
  studentIds?: string[]
}

/** Teto de leitura por coleção. Um painel que carrega a base inteira fica
 *  lento e caro conforme a plataforma cresce; a paginação real entra
 *  quando esses números começarem a ser atingidos de verdade. */
const TETO = 500

export function useAdminData() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [schools, setSchools] = useState<AdminSchool[]>([])
  const [leads, setLeads] = useState<AdminLead[]>([])
  const [classes, setClasses] = useState<AdminClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [uSnap, sSnap, lSnap, cSnap] = await Promise.all([
        getDocs(query(collection(db, "users"), limit(TETO))),
        getDocs(query(collection(db, "schools"), limit(TETO))),
        getDocs(query(collection(db, "leads"), orderBy("createdAt", "desc"), limit(TETO))).catch(
          // leads sem createdAt em docs antigos quebram o orderBy; nesse
          // caso vale mais listar sem ordenação do que não listar nada.
          () => getDocs(query(collection(db, "leads"), limit(TETO)))
        ),
        getDocs(query(collection(db, "classes"), limit(TETO))),
      ])

      setUsers(uSnap.docs.map((d) => ({ ...(d.data() as Omit<AdminUser, "id">), id: d.id })))
      setSchools(sSnap.docs.map((d) => ({ ...(d.data() as Omit<AdminSchool, "id">), id: d.id })))
      setLeads(lSnap.docs.map((d) => ({ ...(d.data() as Omit<AdminLead, "id">), id: d.id })))
      setClasses(cSnap.docs.map((d) => ({ ...(d.data() as Omit<AdminClass, "id">), id: d.id })))
    } catch (err) {
      console.error("Erro ao carregar dados da plataforma:", err)
      setError(
        "Não foi possível carregar os dados. Confirme que esta conta é a dona da plataforma e que as regras do Firestore estão publicadas."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  /* ---------------- ações administrativas ---------------- */

  const setUserRole = useCallback(
    async (userId: string, role: string) => {
      await updateDoc(doc(db, "users", userId), { role })
      await load()
    },
    [load]
  )

  const setUserPlan = useCallback(
    async (userId: string, plan: "free" | "pro") => {
      await updateDoc(doc(db, "users", userId), {
        "subscription.plan": plan,
        "subscription.updatedAt": new Date().toISOString(),
      })
      await load()
    },
    [load]
  )

  const setSchoolPlan = useCallback(
    async (schoolId: string, plan: "demo" | "active") => {
      await updateDoc(doc(db, "schools", schoolId), { plan })
      await load()
    },
    [load]
  )

  const setLeadStatus = useCallback(
    async (leadId: string, status: string) => {
      await updateDoc(doc(db, "leads", leadId), { status })
      await load()
    },
    [load]
  )

  const removeLead = useCallback(
    async (leadId: string) => {
      await deleteDoc(doc(db, "leads", leadId))
      await load()
    },
    [load]
  )

  /* ---------------- métricas derivadas ---------------- */

  const metricas = useMemo(() => {
    const porPapel: Record<string, number> = {}
    let pagantes = 0
    let comEscola = 0

    for (const u of users) {
      const papel = u.role ?? "sem papel"
      porPapel[papel] = (porPapel[papel] ?? 0) + 1
      if (u.subscription?.plan === "pro" || u.role === "professor-pro") pagantes += 1
      if (u.schoolId) comEscola += 1
    }

    const escolasAtivas = schools.filter((s) => s.plan === "active").length
    const leadsNovos = leads.filter((l) => (l.status ?? "new") === "new").length
    const alunosEmTurmas = classes.reduce((acc, c) => acc + (c.studentIds?.length ?? 0), 0)

    return {
      totalUsuarios: users.length,
      porPapel,
      pagantes,
      comEscola,
      totalEscolas: schools.length,
      escolasAtivas,
      escolasDemo: schools.length - escolasAtivas,
      totalTurmas: classes.length,
      alunosEmTurmas,
      totalLeads: leads.length,
      leadsNovos,
    }
  }, [users, schools, leads, classes])

  return {
    users,
    schools,
    leads,
    classes,
    metricas,
    loading,
    error,
    reload: load,
    setUserRole,
    setUserPlan,
    setSchoolPlan,
    setLeadStatus,
    removeLead,
  }
}
