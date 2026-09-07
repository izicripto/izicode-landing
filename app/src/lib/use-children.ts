import { useCallback, useEffect, useState } from "react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

export interface ChildProfile {
  id: string
  name?: string
  age?: string | number | null
  xp?: number
  badges?: string[]
  challengesCompleted?: number
}

/** Qual filho está ativo no painel. Fica no dispositivo, não na conta:
 *  é preferência de uso, não dado da criança. */
const ACTIVE_CHILD_KEY = "izicode_active_child"

export function useChildren() {
  const { user, role } = useAuth()
  const isParent = role === "parent"

  const [children, setChildren] = useState<ChildProfile[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user || !isParent) {
      setChildren([])
      setLoading(false)
      return
    }
    try {
      const snap = await getDocs(collection(db, "users", user.uid, "children"))
      const list = snap.docs.map((d) => ({ ...(d.data() as Omit<ChildProfile, "id">), id: d.id }))
      setChildren(list)

      // Se o filho ativo foi removido (ou nunca foi escolhido), cai no
      // primeiro da lista em vez de deixar o painel sem perfil.
      const stored = localStorage.getItem(ACTIVE_CHILD_KEY)
      const valid = stored && list.some((c) => c.id === stored) ? stored : (list[0]?.id ?? null)
      setActiveId(valid)
      if (valid) localStorage.setItem(ACTIVE_CHILD_KEY, valid)
      else localStorage.removeItem(ACTIVE_CHILD_KEY)

      setError(null)
    } catch (err) {
      console.error("Erro ao carregar perfis das crianças:", err)
      setError("Não foi possível carregar os perfis agora.")
    } finally {
      setLoading(false)
    }
  }, [user, isParent])

  useEffect(() => {
    load()
  }, [load])

  const selectChild = useCallback((childId: string) => {
    setActiveId(childId)
    try {
      localStorage.setItem(ACTIVE_CHILD_KEY, childId)
    } catch (err) {
      console.warn("Não foi possível lembrar o perfil ativo:", err)
    }
  }, [])

  const addChild = useCallback(
    async (data: { name: string; age?: string }) => {
      if (!user) throw new Error("Sessão não identificada.")
      const ref = await addDoc(collection(db, "users", user.uid, "children"), {
        name: data.name.trim(),
        age: data.age?.trim() || null,
        xp: 0,
        badges: [],
        challengesCompleted: 0,
        createdAt: serverTimestamp(),
      })
      await load()
      selectChild(ref.id)
    },
    [user, load, selectChild]
  )

  const renameChild = useCallback(
    async (childId: string, data: { name: string; age?: string }) => {
      if (!user) return
      await updateDoc(doc(db, "users", user.uid, "children", childId), {
        name: data.name.trim(),
        age: data.age?.trim() || null,
      })
      await load()
    },
    [user, load]
  )

  /**
   * Exclusão definitiva do perfil da criança. É o responsável exercendo
   * o direito de eliminação previsto na LGPD sobre os dados de quem ele
   * representa — por isso precisa existir na interface, e não só no banco.
   */
  const removeChild = useCallback(
    async (childId: string) => {
      if (!user) return
      await deleteDoc(doc(db, "users", user.uid, "children", childId))
      if (activeId === childId) localStorage.removeItem(ACTIVE_CHILD_KEY)
      await load()
    },
    [user, activeId, load]
  )

  const activeChild = children.find((c) => c.id === activeId) ?? null

  return {
    isParent,
    children,
    activeChild,
    activeId,
    loading,
    error,
    selectChild,
    addChild,
    renameChild,
    removeChild,
    reload: load,
  }
}
