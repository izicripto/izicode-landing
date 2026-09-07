import { useCallback, useEffect, useRef, useState } from "react"
import { askAI, getStoredApiKey, API_KEY_STORAGE, type ChatTurn, type Persona } from "@/lib/ai"

export type ChatMessage = ChatTurn

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
}

/** Mesma chave do assistente legado: quem já tinha histórico não perde
 *  nada. O tutor do aluno guarda em chave separada — são conversas de
 *  pessoas diferentes no mesmo dispositivo e não devem se misturar. */
/** Só as personas com conversa persistida entram aqui. O copiloto de
 *  gestão não guarda histórico: cada análise parte dos números do momento,
 *  e conversa antiga sobre números velhos confunde mais do que ajuda. */
const HISTORY_KEYS: Partial<Record<Persona, string>> = {
  professor: "izicode_chat_history",
  aluno: "izicode_tutor_history",
}
const MAX_SESSIONS = 10

function readSessions(storageKey: string): ChatSession[] {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as ChatSession[]) : []
  } catch {
    return []
  }
}

function writeSessions(storageKey: string, sessions: ChatSession[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(sessions.slice(0, MAX_SESSIONS)))
  } catch (error) {
    console.warn("Não foi possível salvar o histórico do chat:", error)
  }
}

export function useChat(isPro: boolean, persona: Persona = "professor") {
  const storageKey = HISTORY_KEYS[persona] ?? HISTORY_KEYS.professor!
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKeyState] = useState("")
  const sessionsRef = useRef<ChatSession[]>([])

  useEffect(() => {
    const stored = readSessions(storageKey)
    sessionsRef.current = stored
    setSessions(stored)
    setCurrentId(stored[0]?.id ?? null)
    setApiKeyState(getStoredApiKey())
  }, [storageKey])

  const current = sessions.find((s) => s.id === currentId) ?? null

  const persist = useCallback(
    (next: ChatSession[]) => {
      sessionsRef.current = next
      setSessions(next)
      writeSessions(storageKey, next)
    },
    [storageKey]
  )

  const setApiKey = useCallback((key: string) => {
    const trimmed = key.trim()
    try {
      if (trimmed) localStorage.setItem(API_KEY_STORAGE, trimmed)
      else localStorage.removeItem(API_KEY_STORAGE)
    } catch (err) {
      console.warn("Não foi possível salvar a chave:", err)
    }
    setApiKeyState(trimmed)
  }, [])

  const newChat = useCallback(() => {
    setCurrentId(null)
    setError(null)
  }, [])

  const deleteSession = useCallback(
    (id: string) => {
      const next = sessionsRef.current.filter((s) => s.id !== id)
      persist(next)
      setCurrentId((prev) => (prev === id ? (next[0]?.id ?? null) : prev))
    },
    [persist]
  )

  const send = useCallback(
    async (text: string) => {
      const message = text.trim()
      if (!message || sending) return
      setError(null)

      if (!isPro && !apiKey) {
        setError("Configure sua chave do Gemini para conversar no plano gratuito.")
        return
      }

      let sessionId = currentId
      let working = sessionsRef.current

      if (!sessionId) {
        sessionId = `s-${Date.now()}`
        working = [
          {
            id: sessionId,
            title: message.length > 32 ? `${message.slice(0, 32)}...` : message,
            messages: [],
          },
          ...working,
        ]
        setCurrentId(sessionId)
      }

      const withUser = working.map((s) =>
        s.id === sessionId ? { ...s, messages: [...s.messages, { role: "user" as const, text: message }] } : s
      )
      persist(withUser)

      const history = withUser.find((s) => s.id === sessionId)?.messages.slice(0, -1) ?? []

      setSending(true)
      try {
        const reply = await askAI({ isPro, apiKey, history, message, persona })
        persist(
          sessionsRef.current.map((s) =>
            s.id === sessionId ? { ...s, messages: [...s.messages, { role: "ai" as const, text: reply }] } : s
          )
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setSending(false)
      }
    },
    [apiKey, currentId, isPro, persist, persona, sending]
  )

  return {
    sessions,
    current,
    currentId,
    setCurrentId,
    newChat,
    deleteSession,
    send,
    sending,
    error,
    setError,
    apiKey,
    setApiKey,
  }
}
