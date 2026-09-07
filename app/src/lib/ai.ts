import { httpsCallable } from "firebase/functions"
import { functions } from "@/lib/firebase"

export interface ChatTurn {
  role: "user" | "ai"
  text: string
}

export const API_KEY_STORAGE = "gemini_api_key"

/** Mesmos modelos e ordem de fallback usados na Cloud Function. */
const MODELS = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-1.5-flash"]

export type Persona = "professor" | "aluno"

/**
 * Espelha as personas da Cloud Function. Aqui elas valem só para o caminho
 * BYOK (chave pessoal, plano gratuito) — no caminho PRO quem monta o
 * prompt é o servidor, justamente para o cliente não conseguir reescrever
 * as regras de segurança do tutor infantil.
 */
export const PERSONAS: Record<Persona, string> = {
  professor:
    "Você é o assistente pedagógico da Izicode Edu, especialista em robótica " +
    "educacional, cultura maker, BNCC e ensino de programação. Responda em " +
    "português do Brasil, de forma prática, pensando em como o professor vai " +
    "aplicar aquilo em sala de aula.",
  aluno:
    "Você é o 'Tutor Izicode', um assistente amigável para crianças e adolescentes. " +
    "REGRAS: 1) Você SÓ responde sobre Programação, Robótica, Lógica, Matemática e " +
    "Ciências. 2) Se perguntarem sobre qualquer outro assunto (violência, política, " +
    "relacionamentos, conteúdo adulto, fofoca), recuse gentilmente e convide de volta: " +
    "'Eu sou um robô de programação, só sei falar de código! Que tal criarmos um jogo?'. " +
    "3) Use linguagem simples, exemplos divertidos e emojis com moderação. " +
    "4) Nunca entregue a resposta pronta do dever de casa — dê pistas para o aluno chegar lá. " +
    "5) Seja sempre encorajador e nunca peça dados pessoais da criança.",
}

export const SYSTEM_PROMPT = PERSONAS.professor

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE) ?? ""
  } catch {
    return ""
  }
}

/** Chamada direta ao Gemini com a chave pessoal do professor (plano gratuito). */
async function askWithOwnKey(
  apiKey: string,
  history: ChatTurn[],
  message: string,
  persona: Persona
): Promise<string> {
  const contents = [
    { role: "user", parts: [{ text: PERSONAS[persona] }] },
    { role: "model", parts: [{ text: "Entendido. Como posso ajudar?" }] },
    ...history.slice(-12).map((m) => ({
      role: m.role === "ai" ? "model" : "user",
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ]

  let lastError: string | null = null
  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        }
      )

      if (!res.ok) {
        const body = await res.text()
        // Chave inválida não melhora tentando outro modelo — aborta já.
        if (body.includes("API_KEY") || body.includes("API key")) {
          throw new Error("Chave API inválida. Confira a chave nas configurações.")
        }
        lastError = `status ${res.status}`
        continue
      }

      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return text as string
      lastError = "resposta vazia"
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Chave API inválida")) throw error
      lastError = error instanceof Error ? error.message : String(error)
    }
  }

  throw new Error(`A IA não respondeu (${lastError ?? "erro desconhecido"}).`)
}

/**
 * Ponto único de acesso à IA no app.
 *
 * PRO passa pela Cloud Function, que usa a chave gerenciada da Izicode e
 * nunca expõe o segredo no navegador. Plano gratuito usa a chave pessoal
 * do professor, direto do navegador (BYOK) — é ele quem paga o uso.
 */
export async function askAI({
  isPro,
  apiKey,
  history = [],
  message,
  persona = "professor",
}: {
  isPro: boolean
  apiKey: string
  history?: ChatTurn[]
  message: string
  persona?: Persona
}): Promise<string> {
  if (isPro) {
    try {
      const call = httpsCallable<
        { message: string; history: ChatTurn[]; persona: Persona },
        { success: boolean; text: string }
      >(functions, "aiChat")
      const result = await call({ message, history, persona })
      if (result.data?.text) return result.data.text
      throw new Error("A IA não retornou resposta.")
    } catch (error) {
      const raw = error instanceof Error ? error.message : String(error)
      // Se a conta perdeu o PRO (ou a function não está publicada) e o
      // professor tem chave própria, seguimos por ela em vez de travar.
      if (apiKey) return askWithOwnKey(apiKey, history, message, persona)
      throw new Error(
        raw.includes("permission-denied")
          ? "O assistente com a chave da Izicode é exclusivo do plano PRO. Configure sua chave pessoal para usar no gratuito."
          : raw
      )
    }
  }

  if (!apiKey) {
    throw new Error("Configure sua chave do Gemini para usar a IA no plano gratuito.")
  }
  return askWithOwnKey(apiKey, history, message, persona)
}
