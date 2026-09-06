import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged, signOut as fbSignOut, type User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { UserData } from "@/lib/roles"

interface AuthState {
  user: User | null
  userData: UserData | null
  role: string
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  userData: null,
  role: "student",
  loading: true,
  signOut: async () => {},
})

// Contas de fundador mantêm o papel definido aqui mesmo sem doc no
// Firestore. Isso é conveniência de exibição — quem realmente autoriza
// leitura e escrita são as regras do Firestore, nunca este mapa.
const EMAIL_ROLE_OVERRIDES: Record<string, string> = {
  "izicripto@gmail.com": "dev",
  "izicodeedu@gmail.com": "school_admin",
  "r.berlanda04@gmail.com": "professor-pro",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)

      if (!nextUser) {
        setUserData(null)
        setLoading(false)
        return
      }

      try {
        const snap = await getDoc(doc(db, "users", nextUser.uid))
        setUserData(snap.exists() ? (snap.data() as UserData) : null)
      } catch (error) {
        console.error("Não foi possível carregar o perfil do usuário:", error)
        setUserData(null)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  const role =
    userData?.role ??
    (user?.email ? EMAIL_ROLE_OVERRIDES[user.email] : undefined) ??
    "student"

  return (
    <AuthContext.Provider
      value={{ user, userData, role, loading, signOut: () => fbSignOut(auth) }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
