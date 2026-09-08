/**
 * Instalação da plataforma como aplicativo.
 *
 * O manifest, o service worker e um script de instalação já existiam no
 * repositório e respondiam 200 em produção — só que nenhuma página os
 * referenciava. Na prática a plataforma nunca foi instalável. Aqui o
 * service worker passa a ser registrado e o convite de instalação ganha um
 * estado que a interface consegue ler.
 *
 * Há dois caminhos, porque os navegadores discordam:
 *
 *  - Chrome, Edge e Android disparam `beforeinstallprompt`. Guardamos o
 *    evento e chamamos `prompt()` quando a pessoa clicar. Só funciona
 *    dentro do clique — guardar para depois é a única forma de oferecer a
 *    instalação num momento que faça sentido, em vez de no primeiro
 *    segundo da visita.
 *  - Safari no iPhone não tem esse evento e nunca terá. Lá a instalação é
 *    manual, pelo menu Compartilhar, e a única coisa útil é ensinar o
 *    caminho.
 */

/** O evento não está nos tipos padrão do DOM. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

let convitePendente: BeforeInstallPromptEvent | null = null
const ouvintes = new Set<() => void>()

function avisar() {
  ouvintes.forEach((f) => f())
}

/** Já está aberto como aplicativo instalado? */
export function rodandoInstalado(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari no iOS usa uma propriedade própria, fora do padrão
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

/** iPhone ou iPad, onde a instalação é manual. */
export function ehIOS(): boolean {
  if (typeof window === "undefined") return false
  const ua = window.navigator.userAgent
  const iPadModerno = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
  return /iPad|iPhone|iPod/.test(ua) || iPadModerno
}

export function temConvitePendente(): boolean {
  return convitePendente !== null
}

export function assinar(f: () => void): () => void {
  ouvintes.add(f)
  return () => ouvintes.delete(f)
}

/**
 * Abre o diálogo de instalação do navegador.
 * Devolve o que a pessoa escolheu, ou null se não havia convite guardado.
 */
export async function instalar(): Promise<"accepted" | "dismissed" | null> {
  if (!convitePendente) return null
  const evento = convitePendente
  await evento.prompt()
  const { outcome } = await evento.userChoice
  // O evento é de uso único: depois de consumido o navegador não o
  // dispara de novo na mesma sessão.
  convitePendente = null
  avisar()
  return outcome
}

let iniciado = false

export function iniciarInstalacao() {
  if (iniciado || typeof window === "undefined") return
  iniciado = true

  window.addEventListener("beforeinstallprompt", (e) => {
    // Sem isto o Chrome mostra o próprio aviso, no canto, sem contexto.
    e.preventDefault()
    convitePendente = e as BeforeInstallPromptEvent
    avisar()
  })

  window.addEventListener("appinstalled", () => {
    convitePendente = null
    avisar()
  })

  // O service worker é Network First e busca documento e script com
  // cache 'no-store' (public/sw.js), então um deploy novo continua
  // chegando na hora: o cache só entra quando a rede falha. Registrar
  // depois do load para não disputar banda com a primeira pintura.
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Falha de registro não pode quebrar o site: sem service worker a
        // plataforma funciona igual, só não abre offline.
      })
    })
  }
}
