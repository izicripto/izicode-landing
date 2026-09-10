/**
 * Funções que vivem fora do bundle do React.
 *
 * O aviso de cookies é um script clássico (public/js/consentimento.js) que
 * roda antes do app justamente para declarar o consentimento como negado
 * antes de qualquer tag carregar. Ele expõe esta função para que o rodapé
 * consiga reabrir a escolha, como a Política de Privacidade promete.
 */
export {}

declare global {
  interface Window {
    izicodeAbrirCookies?: () => void
  }
}
