import { httpsCallable } from "firebase/functions"
import { functions } from "@/lib/firebase"

/**
 * Ponto único de contato com o checkout.
 *
 * Nenhum valor sai daqui para o servidor: quem calcula o preço é a Cloud
 * Function, a partir do plano e — no caso da escola — da contagem de
 * assentos. Se o navegador pudesse mandar o valor, qualquer pessoa
 * assinaria o PRO por um centavo.
 */

export interface CheckoutResposta {
  success: boolean
  checkoutUrl: string
  paymentId: string
  amountCents: number
  tipo: "assinatura" | "escola"
}

export interface StatusPagamento {
  status: "paid" | "pending" | "failed"
  tipo: "assinatura" | "escola"
  jaLiberado?: boolean
}

/** Onde o pagamento em andamento fica guardado entre um redirecionamento e outro. */
const CHAVE_PENDENTE = "izicode_pagamento_pendente"

export function guardarPagamentoPendente(paymentId: string) {
  try {
    localStorage.setItem(CHAVE_PENDENTE, paymentId)
  } catch {
    // Navegador com armazenamento bloqueado ainda consegue concluir a
    // compra: a AbacatePay devolve o id na URL de retorno.
  }
}

export function lerPagamentoPendente(): string | null {
  try {
    return localStorage.getItem(CHAVE_PENDENTE)
  } catch {
    return null
  }
}

export function limparPagamentoPendente() {
  try {
    localStorage.removeItem(CHAVE_PENDENTE)
  } catch {
    /* nada a fazer */
  }
}

export async function criarCheckout(params: {
  plan: string
  schoolId?: string
  professores?: number
  alunos?: number
}): Promise<CheckoutResposta> {
  const fn = httpsCallable<typeof params, CheckoutResposta>(functions, "createAbacatePayCheckout")
  const { data } = await fn(params)
  return data
}

export async function confirmarPagamento(paymentId: string): Promise<StatusPagamento> {
  const fn = httpsCallable<{ paymentId: string }, StatusPagamento>(functions, "confirmPayment")
  const { data } = await fn({ paymentId })
  return data
}

/**
 * Traduz a falha da function para algo que a pessoa possa agir.
 *
 * "internal" numa tela de pagamento é a pior mensagem possível: quem acabou
 * de tentar pagar precisa saber se o dinheiro saiu, se deve tentar de novo
 * ou se o problema é do nosso lado.
 */
export function descreverFalhaCheckout(err: unknown): { titulo: string; detalhe: string } {
  const codigo = (err as { code?: string })?.code ?? ""

  if (codigo.includes("unauthenticated")) {
    return {
      titulo: "Entre na sua conta para assinar",
      detalhe: "O plano é liberado para a conta que fizer o pagamento.",
    }
  }
  if (codigo.includes("failed-precondition")) {
    return {
      titulo: "Pagamentos indisponíveis no momento",
      detalhe: "Estamos com o meio de pagamento fora do ar. Tente novamente em alguns minutos.",
    }
  }
  if (codigo.includes("not-found")) {
    return {
      titulo: "Pagamento não encontrado",
      detalhe: "Se você já pagou, aguarde um instante e atualize a página.",
    }
  }
  if (codigo.includes("permission-denied")) {
    return {
      titulo: "Este pagamento é de outra conta",
      detalhe: "Entre com a conta usada na compra para liberar o acesso.",
    }
  }
  return {
    titulo: "Não foi possível iniciar o pagamento",
    detalhe: "Nada foi cobrado. Tente novamente em instantes.",
  }
}
