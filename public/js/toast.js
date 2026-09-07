/**
 * Avisos das páginas legadas.
 *
 * O alert() do navegador trava a página, ignora o design do produto e trata
 * "salvo com sucesso" e "não foi possível salvar" exatamente igual. Este
 * arquivo desenha o mesmo aviso que o app React mostra (canto inferior
 * direito, cor por severidade, some sozinho) e substitui window.alert, para
 * que as chamadas já existentes passem a usar o novo visual sem precisar
 * reescrever uma por uma.
 *
 * É autocontido de propósito: injeta o próprio CSS e não depende do
 * shell.css, porque a maioria das páginas legadas não carrega o shell.
 *
 * Uso direto (preferível em código novo):
 *   izToast.sucesso('Turma criada', 'Os alunos já podem entrar com o código.')
 *   izToast.erro('Não foi possível salvar', 'Tente novamente em instantes.')
 */
(function () {
  if (window.izToast) return;

  var CSS = [
    '.iz-toasts{position:fixed;bottom:1rem;right:1rem;z-index:9999;display:flex;',
    'flex-direction:column;gap:.5rem;width:min(calc(100vw - 2rem),380px);pointer-events:none;',
    'font-family:inherit}',
    '.iz-toast{pointer-events:auto;display:flex;align-items:flex-start;gap:.75rem;',
    'padding:1rem;border:1px solid;border-radius:1rem;background:#fff;color:#0f172a;',
    'box-shadow:0 10px 30px rgba(15,23,42,.14);opacity:0;transform:translateX(.5rem);',
    'transition:opacity .2s ease,transform .2s ease}',
    '.iz-toast.is-in{opacity:1;transform:none}',
    '.iz-toast-icon{flex:0 0 auto;width:1.25rem;height:1.25rem;margin-top:.1rem;',
    'font-weight:700;font-size:.9rem;line-height:1.25rem;text-align:center;border-radius:999px}',
    '.iz-toast-body{flex:1 1 auto;min-width:0}',
    '.iz-toast-title{margin:0;font-size:.875rem;font-weight:600;line-height:1.35}',
    '.iz-toast-desc{margin:.15rem 0 0;font-size:.875rem;line-height:1.4;color:#64748b}',
    '.iz-toast-close{flex:0 0 auto;border:0;background:none;cursor:pointer;padding:.25rem;',
    'border-radius:.5rem;color:#94a3b8;font-size:1rem;line-height:1}',
    '.iz-toast-close:hover{background:rgba(15,23,42,.06);color:#0f172a}',
    // As cores repetem as do app React para que o aviso pareça o mesmo
    // produto quando a pessoa vai e volta entre as duas partes do site.
    '.iz-toast--sucesso{border-color:#a7f3d0;background:#ecfdf5}',
    '.iz-toast--sucesso .iz-toast-icon{background:#059669;color:#fff}',
    '.iz-toast--erro{border-color:#fecaca;background:#fef2f2}',
    '.iz-toast--erro .iz-toast-icon{background:#dc2626;color:#fff}',
    '.iz-toast--aviso{border-color:#fde68a;background:#fffbeb}',
    '.iz-toast--aviso .iz-toast-icon{background:#d97706;color:#fff}',
    '.iz-toast--info{border-color:#bae6fd;background:#f0f9ff}',
    '.iz-toast--info .iz-toast-icon{background:#0284c7;color:#fff}',
    '@media (prefers-reduced-motion:reduce){.iz-toast{transition:none}}',
  ].join('');

  var ICONES = { sucesso: '✓', erro: '!', aviso: '!', info: 'i' };

  var pilha = null;

  function container() {
    if (pilha && document.body.contains(pilha)) return pilha;
    var estilo = document.createElement('style');
    estilo.textContent = CSS;
    document.head.appendChild(estilo);
    pilha = document.createElement('div');
    pilha.className = 'iz-toasts';
    document.body.appendChild(pilha);
    return pilha;
  }

  function mostrar(tom, titulo, descricao) {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', function () {
        mostrar(tom, titulo, descricao);
      });
      return;
    }

    var el = document.createElement('div');
    el.className = 'iz-toast iz-toast--' + tom;
    // Erro interrompe leitor de tela; o resto entra na fila para não
    // atropelar o que a pessoa está lendo.
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', tom === 'erro' ? 'assertive' : 'polite');

    var icone = document.createElement('span');
    icone.className = 'iz-toast-icon';
    icone.setAttribute('aria-hidden', 'true');
    icone.textContent = ICONES[tom] || ICONES.info;

    var corpo = document.createElement('div');
    corpo.className = 'iz-toast-body';
    var t = document.createElement('p');
    t.className = 'iz-toast-title';
    t.textContent = titulo;
    corpo.appendChild(t);
    if (descricao) {
      var d = document.createElement('p');
      d.className = 'iz-toast-desc';
      d.textContent = descricao;
      corpo.appendChild(d);
    }

    var fechar = document.createElement('button');
    fechar.type = 'button';
    fechar.className = 'iz-toast-close';
    fechar.setAttribute('aria-label', 'Fechar aviso');
    fechar.textContent = '×';

    el.appendChild(icone);
    el.appendChild(corpo);
    el.appendChild(fechar);

    var alvo = container();
    // Mais de três avisos empilhados viram parede: o mais antigo sai.
    while (alvo.children.length >= 3) alvo.removeChild(alvo.firstChild);
    alvo.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add('is-in');
    });

    var saiu = false;
    function sair() {
      if (saiu) return;
      saiu = true;
      el.classList.remove('is-in');
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 220);
    }
    fechar.addEventListener('click', sair);
    // Erro fica mais tempo: precisa ser lido, enquanto "salvo" só precisa
    // ser percebido de canto de olho.
    setTimeout(sair, tom === 'erro' ? 7000 : 4000);
  }

  /**
   * Divide "Título. Detalhe" em duas linhas, para o aviso ter hierarquia
   * em vez de um bloco corrido. Só divide quando a primeira frase é curta
   * o bastante para funcionar como título.
   */
  function separar(texto) {
    var limpo = String(texto == null ? '' : texto).trim();
    var corte = limpo.search(/[.!?]\s+/);
    if (corte > 0 && corte <= 60) {
      return [limpo.slice(0, corte + 1).trim(), limpo.slice(corte + 1).trim()];
    }
    var quebra = limpo.indexOf('\n');
    if (quebra > 0 && quebra <= 60) {
      return [limpo.slice(0, quebra).trim(), limpo.slice(quebra + 1).trim()];
    }
    return [limpo, ''];
  }

  /**
   * Deduz a severidade pelo texto. É uma aproximação, usada só para as
   * chamadas antigas de alert() que não informam o tom; código novo deve
   * chamar izToast.erro/sucesso diretamente.
   */
  function deduzirTom(texto) {
    var t = String(texto || '').toLowerCase();
    if (/erro|falh|n[ãa]o foi poss[ií]vel|inv[áa]lid|incorret|expirad|obrigat[óo]ri|preencha|informe|nenhum/.test(t)) {
      return 'erro';
    }
    if (/sucesso|criad|salv|enviad|conclu[íi]d|atualizad|exclu[íi]d|copiad|bem-vind/.test(t)) {
      return 'sucesso';
    }
    return 'info';
  }

  var api = {
    sucesso: function (titulo, desc) { mostrar('sucesso', titulo, desc); },
    erro: function (titulo, desc) { mostrar('erro', titulo, desc); },
    aviso: function (titulo, desc) { mostrar('aviso', titulo, desc); },
    info: function (titulo, desc) { mostrar('info', titulo, desc); },
  };
  window.izToast = api;

  // Substitui o alert() nativo. As chamadas antigas continuam funcionando,
  // mas passam a aparecer no visual do produto em vez da caixa do sistema.
  // confirm() e prompt() ficam intactos: eles devolvem uma resposta que o
  // código espera de forma síncrona, e trocá-los mudaria o comportamento.
  window.alert = function (mensagem) {
    var partes = separar(mensagem);
    mostrar(deduzirTom(mensagem), partes[0] || 'Aviso', partes[1]);
  };
})();
