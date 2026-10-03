/**
 * Cupons de desconto — regra pura, sem Firebase, para poder ser testada.
 *
 * Um cupom vive em /coupons/{CODIGO} e é escrito só pelo painel admin:
 *   { ativo, tipo: 'percentual' | 'valor', valor, planos: [] | ['pro_mensal', ...],
 *     validoAte: Timestamp | null, usosMax: number | null, usos: number }
 *
 *  - 'percentual': valor de 1 a 100 (% sobre o preço).
 *  - 'valor': valor em centavos, abatido do preço.
 *  - planos vazio = vale para todos os planos.
 *  - usos conta só pagamentos CONFIRMADOS (ver aplicarPagamento). Duas
 *    cobranças abertas ao mesmo tempo podem passar do limite por uma —
 *    aceitável para cupom promocional, e evita queimar uso com Pix abandonado.
 *
 * O preço final nunca fica abaixo de PRECO_MINIMO_CENTAVOS: um Pix de R$ 0
 * não existe, e cupom de 100% liberaria o plano sem pagamento nenhum.
 * Cortesia de verdade é feita pelo painel, não por cupom.
 */
const PRECO_MINIMO_CENTAVOS = 100;
const FORMATO_CODIGO = /^[A-Z0-9_-]{3,30}$/;

function normalizarCodigo(bruto) {
    if (typeof bruto !== 'string') return null;
    const codigo = bruto.trim().toUpperCase();
    return FORMATO_CODIGO.test(codigo) ? codigo : null;
}

/** Converte Timestamp do Firestore, Date ou número em milissegundos. */
function emMs(data) {
    if (data == null) return null;
    if (typeof data.toMillis === 'function') return data.toMillis();
    if (data instanceof Date) return data.getTime();
    if (typeof data === 'number') return data;
    return null;
}

/**
 * Avalia um cupom contra um plano e um preço. Nunca lança: devolve
 * { ok: true, descontoCentavos, precoFinalCentavos } ou { ok: false, motivo },
 * com um motivo que pode ir direto para a tela.
 */
function avaliarCupom(cupom, { plan, precoCentavos, agoraMs = Date.now() }) {
    if (!cupom || cupom.ativo !== true) {
        return { ok: false, motivo: 'Cupom inválido ou desativado.' };
    }
    const validoAte = emMs(cupom.validoAte);
    if (validoAte != null && agoraMs > validoAte) {
        return { ok: false, motivo: 'Este cupom expirou.' };
    }
    if (cupom.usosMax != null && (cupom.usos || 0) >= cupom.usosMax) {
        return { ok: false, motivo: 'Este cupom já atingiu o limite de usos.' };
    }
    const planos = Array.isArray(cupom.planos) ? cupom.planos : [];
    if (planos.length > 0 && !planos.includes(plan)) {
        return { ok: false, motivo: 'Este cupom não vale para o plano escolhido.' };
    }

    const valor = Number(cupom.valor);
    let desconto;
    if (cupom.tipo === 'percentual' && valor > 0 && valor <= 100) {
        desconto = Math.round((precoCentavos * valor) / 100);
    } else if (cupom.tipo === 'valor' && valor > 0) {
        desconto = Math.round(valor);
    } else {
        return { ok: false, motivo: 'Cupom inválido ou desativado.' };
    }

    const precoFinal = Math.max(PRECO_MINIMO_CENTAVOS, precoCentavos - desconto);
    return { ok: true, descontoCentavos: precoCentavos - precoFinal, precoFinalCentavos: precoFinal };
}

module.exports = { avaliarCupom, normalizarCodigo, PRECO_MINIMO_CENTAVOS };
