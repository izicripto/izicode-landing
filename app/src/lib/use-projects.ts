import { useEffect, useState } from "react"
import { collection, onSnapshot, orderBy, query, doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

export interface Project {
  id: string
  title: string
  content?: string
  type?: string
  target?: string
  objective?: string
  createdAt?: { toDate: () => Date }
}

/**
 * Assina a subcoleção users/{uid}/projects em tempo real. Como é um
 * onSnapshot, qualquer projeto gerado pelo Estúdio IA aparece na lista
 * sem precisar recarregar nada.
 */
export function useProjects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProjects([])
      setLoading(false)
      return
    }

    const q = query(collection(db, "users", user.uid, "projects"), orderBy("createdAt", "desc"))

    return onSnapshot(
      q,
      (snap) => {
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Project))
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error("Erro ao carregar projetos:", err)
        setError("Não foi possível carregar seus projetos agora.")
        setLoading(false)
      }
    )
  }, [user])

  async function removeProject(id: string) {
    if (!user) return
    await deleteDoc(doc(db, "users", user.uid, "projects", id))
  }

  return { projects, loading, error, removeProject }
}
