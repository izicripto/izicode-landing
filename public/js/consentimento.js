/**
 * Consentimento de cookies (Consent Mode v2 do Google).
 *
 * POR QUE ISSO PRECISA EXISTIR
 *
 * A tag do Google Ads grava cookie de publicidade. Sob a LGPD, cookie de
 * publicidade e de medição depende de consentimento — diferente do cookie
 * necessário, que mantém a pessoa conectada e não pode ser recusado sem
 * quebrar o serviço.
 *
 * ORDEM IMPORTA
 *
 * Este arquivo precisa carregar de forma SÍNCRONA e ANTES do gtag.js. Ele
 * declara o estado padrão como negado; só depois o gtag entra. Se a ordem
 * inverter, a tag grava o cookie antes de perguntar, e o aviso vira
 * enfeite. Por isso ele não é `defer` nem `async` em lugar nenhum.
 *
 * O QUE O CONSENT MODE FAZ
 *
 * Com o consentimento negado, o Google não grava cookie e envia apenas um
 * ping sem identificador. Aceito, passa a medir normalmente. É o caminho
 * que preserva alguma medição sem desrespeitar a escolha — melhor do que
 * simplesmente não carregar a tag, que perderia até a contagem agregada.
 *
 * Vale para as páginas estáticas (guias, termos, privacidade) e para o
 * app React, que inclui este mesmo arquivo.
 */
(function () {
  "use strict"

  var CHAVE = "izicode:consentimento-cookies"

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = window.gtag || gtag

  function ler() {
    try { return window.localStorage.getItem(CHAVE) } catch (e) { return null }
  }
  function gravar(valor) {
    try { window.localStorage.setItem(CHAVE, valor) } catch (e) { /* sem armazenamento */ }
  }

  var escolha = ler()

  // Estado padrão, antes de qualquer tag: negado.
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  })

  if (escolha === "aceito") {
    gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    })
  }

  function aplicar(aceitou) {
    gravar(aceitou ? "aceito" : "recusado")
    if (aceitou) {
      gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      })
    }
    fechar()
  }

  /**
   * Tira a caixa e devolve o espaco que ela ocupava.
   *
   * Ela e fixa no rodape, entao cobre o que estiver embaixo — e, pior,
   * intercepta o clique. Num guia isso pode cair em cima do botao de ver
   * planos, e a pessoa clica achando que o site nao responde. Enquanto a
   * caixa esta na tela, o corpo da pagina ganha um espaco do tamanho dela
   * no fim; quando ela sai, o espaco sai junto.
   */
  function fechar() {
    var caixa = document.getElementById("izicode-cookies")
    if (caixa) caixa.remove()
    document.body.style.paddingBottom = anterior || ""
    window.removeEventListener("resize", medir)
  }

  var anterior = null

  function medir() {
    var caixa = document.getElementById("izicode-cookies")
    if (!caixa) return
    // 16px da margem de baixo da propria caixa
    document.body.style.paddingBottom = caixa.offsetHeight + 32 + "px"
  }

  // Deixa a decisão acessível ao rodapé ("Preferências de cookies"), que a
  // Política de Privacidade promete que existe.
  window.izicodeAbrirCookies = function () {
    var atual = document.getElementById("izicode-cookies")
    if (atual) atual.remove()
    montar()
  }

  function montar() {
    if (document.getElementById("izicode-cookies")) return

    var estilo = document.getElementById("izicode-cookies-estilo")
    if (!estilo) {
      estilo = document.createElement("style")
      estilo.id = "izicode-cookies-estilo"
      estilo.textContent = [
        "#izicode-cookies{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:2147483000;",
        "max-width:44rem;margin:0 auto;background:#0f172a;color:#f8fafc;border-radius:1rem;",
        "padding:1.15rem 1.25rem;box-shadow:0 12px 40px rgba(15,23,42,.35);",
        "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;",
        "font-size:.9375rem;line-height:1.55;display:flex;gap:1rem;align-items:flex-start;",
        "flex-wrap:wrap}",
        "#izicode-cookies p{margin:0;flex:1 1 18rem;min-width:0}",
        "#izicode-cookies a{color:#7dd3fc;text-decoration:underline}",
        "#izicode-cookies .iz-acoes{display:flex;gap:.5rem;flex:0 0 auto;margin-left:auto}",
        "#izicode-cookies button{font:inherit;font-weight:600;border-radius:.6rem;",
        "padding:.55rem 1.1rem;cursor:pointer;border:1px solid transparent}",
        "#izicode-cookies .iz-sim{background:#0284c7;color:#fff}",
        "#izicode-cookies .iz-sim:hover{background:#0369a1}",
        "#izicode-cookies .iz-nao{background:transparent;color:#cbd5e1;border-color:#334155}",
        "#izicode-cookies .iz-nao:hover{background:#1e293b;color:#f8fafc}",
        "#izicode-cookies button:focus-visible{outline:2px solid #7dd3fc;outline-offset:2px}",
        "@media (max-width:30rem){#izicode-cookies .iz-acoes{margin-left:0;width:100%}",
        "#izicode-cookies button{flex:1}}",
      ].join("")
      document.head.appendChild(estilo)
    }

    var caixa = document.createElement("div")
    caixa.id = "izicode-cookies"
    caixa.setAttribute("role", "dialog")
    caixa.setAttribute("aria-label", "Preferências de cookies")
    caixa.innerHTML =
      "<p>Usamos cookies para medir de onde vêm as visitas e avaliar nossas campanhas. " +
      "Os cookies necessários para a plataforma funcionar continuam ativos de qualquer forma. " +
      'Detalhes na <a href="/privacidade/">Política de Privacidade</a>.</p>' +
      '<div class="iz-acoes">' +
      '<button type="button" class="iz-nao">Só os necessários</button>' +
      '<button type="button" class="iz-sim">Aceitar</button>' +
      "</div>"

    caixa.querySelector(".iz-sim").addEventListener("click", function () { aplicar(true) })
    caixa.querySelector(".iz-nao").addEventListener("click", function () { aplicar(false) })
    document.body.appendChild(caixa)

    anterior = document.body.style.paddingBottom
    medir()
    // o texto quebra em mais linhas no celular, e a altura muda ao girar
    window.addEventListener("resize", medir)
  }

  if (!escolha) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", montar)
    } else {
      montar()
    }
  }
})()
