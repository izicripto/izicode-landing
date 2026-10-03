"""Gera o blog estático (public/blog/) no padrão dos guias. Uso: python scripts/gerar-blog.py public
import html, json, pathlib, sys

RAIZ = pathlib.Path(sys.argv[1])  # .../izicodeeduportal/public
DOMINIO = "https://izicode.com.br"
DATA = "2026-10-03"
DATA_BR = "3 de outubro de 2026"

HEAD = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo_tag}</title>
<meta name="description" content="{descricao}">
<link rel="canonical" href="{url}">
<link rel="icon" type="image/png" href="/images/logo.png">

<meta property="og:type" content="{og_tipo}">
<meta property="og:site_name" content="Izicode Edu">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{descricao}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{DOMINIO}/hero-lab.jpg">
<meta name="twitter:card" content="summary_large_image">
{ld}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/guias.css">
<script src="/js/consentimento.js"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17924419542"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){{dataLayer.push(arguments);}}
gtag('js', new Date());
gtag('config', 'AW-17924419542');
gtag('config', 'G-7FZBXZXZ16');
</script>
</head>
<body>

<header class="gz-topo">
  <a class="gz-marca" href="/"><img src="/images/logo.png" alt="Izicode Edu" width="36" height="36"><span>Izicode Edu</span></a>
  <nav class="gz-nav">
    <a href="/blog/">Blog</a>
    <a href="/guias/">Guias</a>
    <a href="/planos">Planos</a>
    <a class="gz-botao" href="/login.html">Começar grátis</a>
  </nav>
</header>
"""

RODAPE = """
<footer class="gz-rodape">
  <p>© Izicode Edu — plataforma e consultoria em robótica educacional.</p>
  <p><a href="/contato">Fale com a gente</a> · <a href="/planos">Planos</a> · <a href="/">Início</a></p>
  <p><a href="/termos/">Termos de Uso</a> · <a href="/privacidade/">Política de Privacidade</a> · <a href="#" onclick="izicodeAbrirCookies();return false">Preferências de cookies</a></p>
</footer>

</body>
</html>
"""

CTA = """
  <aside class="gz-cta">
    <h2>Leve isso para a sua sala de aula</h2>
    <p>A plataforma da Izicode gera planos de aula com IA, alinhados à BNCC, e traz roteiros
       de projeto prontos para imprimir ou salvar em PDF. O plano gratuito não expira e não pede cartão.</p>
    <p class="gz-acoes">
      <a class="gz-botao" href="/login.html">Criar conta grátis</a>
      <a class="gz-link" href="/planos">Ver planos e preços</a>
    </p>
  </aside>
"""


def ld(dados):
    return ('<script type="application/ld+json">\n'
            + json.dumps(dados, ensure_ascii=False, indent=2) + "\n</script>\n")


ARTIGOS = []


def artigo(slug, titulo, descricao, corpo, relacionados):
    ARTIGOS.append(dict(slug=slug, titulo=titulo, descricao=descricao, corpo=corpo, rel=relacionados))


# ------------------------------------------------------------------ artigo 1
artigo(
    "scratch-microbit-ou-arduino",
    "Scratch, micro:bit ou Arduino: qual usar em cada etapa da escola",
    "Comparação prática entre Scratch, micro:bit e Arduino para professores: idade indicada, custo, o que cada um ensina e como montar uma progressão do Fundamental ao Médio.",
    """
    <p>Quem começa a levar tecnologia para a sala de aula costuma travar na mesma pergunta: por onde
       começo? Scratch, micro:bit e Arduino aparecem em todas as listas, mas não competem entre si.
       Cada um resolve uma etapa diferente do aprendizado — e a melhor escolha depende da idade da
       turma, do orçamento e do que você quer que os alunos sejam capazes de fazer no fim do ano.</p>

    <h2 id="resumo">Resumo em uma tabela</h2>
    <table>
    <thead><tr><th></th><th>Scratch</th><th>micro:bit</th><th>Arduino</th></tr></thead>
    <tbody>
    <tr><td><strong>Idade indicada</strong></td><td>8 a 16 anos (ScratchJr para 5 a 7)</td><td>a partir de 8 a 10 anos</td><td>a partir de 12 anos</td></tr>
    <tr><td><strong>Linguagem</strong></td><td>Blocos</td><td>Blocos (MakeCode), JavaScript e Python</td><td>C/C++ (há opções em blocos)</td></tr>
    <tr><td><strong>Custo</strong></td><td>Gratuito, roda no navegador</td><td>Uma placa por dupla ou trio</td><td>Placa + componentes avulsos</td></tr>
    <tr><td><strong>O que ensina</strong></td><td>Lógica, sequência, eventos, repetição</td><td>Programação ligada ao mundo físico, sensores embutidos</td><td>Eletrônica de verdade: circuitos, sensores, motores</td></tr>
    <tr><td><strong>Primeira aula</strong></td><td>Animação ou jogo simples</td><td>Mensagem no painel de LEDs</td><td>Piscar um LED</td></tr>
    </tbody>
    </table>

    <h2 id="scratch">Scratch: lógica de programação sem barreira</h2>
    <p>O Scratch, criado pelo MIT, é a porta de entrada mais suave: os comandos são blocos que se
       encaixam, e o erro de sintaxe simplesmente não existe. Isso libera o aluno para pensar no que
       importa — a ordem dos passos, as condições, as repetições. É o lugar certo para ensinar
       <strong>pensamento computacional</strong> antes de qualquer hardware.</p>
    <p>Funciona bem no Fundamental I e no início do Fundamental II, e precisa só de um computador
       ou tablet com navegador. Para turmas menores (5 a 7 anos), o ScratchJr usa a mesma ideia com
       blocos ainda mais simples.</p>
    <p><strong>Limite:</strong> tudo acontece na tela. Quando a turma pergunta "e como faço isso
       acender de verdade?", é hora do próximo passo.</p>

    <h2 id="microbit">micro:bit: a ponte entre a tela e o mundo físico</h2>
    <p>A micro:bit é uma placa pequena que já vem com painel de 5×5 LEDs, dois botões,
       acelerômetro, bússola e sensores de luz e temperatura — a versão 2 traz também microfone
       e alto-falante. Isso significa que o aluno faz projetos físicos <em>sem montar circuito</em>:
       um contador de passos, um dado eletrônico, um termômetro.</p>
    <p>A programação é feita no MakeCode, em blocos muito parecidos com os do Scratch, e o mesmo
       projeto pode ser visto em JavaScript ou Python. Essa transição gradual é o grande trunfo da
       placa: o aluno que começou nos blocos chega ao código escrito sem trocar de ferramenta.</p>
    <p><strong>Limite:</strong> para motores, sensores externos e projetos maiores, é preciso
       acessórios e placas de expansão.</p>

    <h2 id="arduino">Arduino: eletrônica e autonomia de projeto</h2>
    <p>O Arduino é a plataforma mais aberta das três. A placa não tem sensores embutidos: o aluno
       monta o circuito na protoboard, escolhe os componentes e programa em C/C++ na IDE do Arduino.
       É exatamente essa exigência que o torna ideal para o Fundamental II final e o Ensino Médio —
       e para feiras de ciências, olimpíadas e projetos de iniciação científica.</p>
    <p>Dois atalhos ajudam muito: o <strong>Tinkercad Circuits</strong>, simulador gratuito no
       navegador, permite montar e programar um Arduino virtual (inclusive em blocos) antes de tocar
       em componentes; e ferramentas de blocos para Arduino suavizam a primeira semana.</p>
    <p><strong>Limite:</strong> exige mais preparo do professor e organização de componentes —
       e um curto-circuito ensina, mas também queima peças.</p>

    <h2 id="progressao">Uma progressão que funciona</h2>
    <ol>
    <li><strong>Fundamental I:</strong> atividades desplugadas e Scratch (ou ScratchJr). Objetivo:
        sequência, repetição, condição e depuração.</li>
    <li><strong>6º e 7º anos:</strong> micro:bit com MakeCode. Objetivo: entrada → processamento →
        saída no mundo físico, sensores e primeiros projetos com propósito.</li>
    <li><strong>8º ano ao Médio:</strong> Tinkercad para simular e depois Arduino. Objetivo:
        circuitos, código escrito e projetos autorais.</li>
    </ol>
    <p>Não é obrigatório seguir todas as etapas. Uma escola com orçamento curto pode ir do Scratch
       direto ao Tinkercad, que é gratuito, e comprar placas só para as turmas que vão a feiras e
       competições.</p>

    <h2 id="bncc">E a BNCC?</h2>
    <p>As três ferramentas se encaixam na Competência Geral 5 (Cultura Digital) e nas normas de
       Computação na Educação Básica, complemento à BNCC homologado em 2022, que organiza o tema
       em três eixos: pensamento computacional, mundo digital e cultura digital. O Scratch cobre com
       folga o primeiro eixo; micro:bit e Arduino trazem o segundo para a mão do aluno.</p>
""",
    [("/blog/primeira-aula-de-robotica/", "Primeira aula de robótica: um roteiro de 50 minutos"),
     ("/guias/bncc-tecnologia/", "Tecnologia educacional alinhada à BNCC: guia para professores"),
     ("/guias/manual-de-implementacao/", "Manual de implementação de tecnologia educacional na escola")],
)

# ------------------------------------------------------------------ artigo 2
artigo(
    "primeira-aula-de-robotica",
    "Primeira aula de robótica: um roteiro de 50 minutos (sem kit)",
    "Plano de aula pronto para a primeira aula de robótica: atividade desplugada de algoritmos, LED piscando no simulador Tinkercad e desafio do semáforo, em 50 minutos e sem comprar nada.",
    """
    <p>A primeira aula de robótica define o tom do ano inteiro. Se ela for uma palestra sobre
       componentes, a turma desliga; se for um caos de peças, ninguém aprende. O roteiro abaixo cabe
       em uma aula de 50 minutos, funciona do 6º ano ao Ensino Médio e <strong>não exige kit</strong>:
       só computadores com navegador e uma conta gratuita no Tinkercad.</p>

    <h2 id="objetivos">Objetivos da aula</h2>
    <ul>
    <li>Entender que um robô executa <strong>exatamente</strong> as instruções que recebe — nem mais, nem menos.</li>
    <li>Escrever, testar e corrigir um algoritmo simples.</li>
    <li>Programar um LED em um Arduino simulado e adaptar o código para um semáforo.</li>
    </ul>

    <h2 id="preparacao">Preparação (antes da aula)</h2>
    <ul>
    <li>Crie uma turma no Tinkercad e gere o código de acesso — assim os alunos entram sem e-mail.</li>
    <li>Teste o computador da sala: o simulador roda no navegador, sem instalar nada.</li>
    <li>Separe 3 objetos para a atividade desplugada (por exemplo, uma garrafa, um livro e um estojo).</li>
    </ul>

    <h2 id="roteiro">Roteiro minuto a minuto</h2>
    <table>
    <thead><tr><th>Tempo</th><th>Etapa</th><th>O que acontece</th></tr></thead>
    <tbody>
    <tr><td>0–5 min</td><td>Abertura</td><td>Pergunte: "o que um robô precisa para buscar uma garrafa do outro lado da sala?". Anote as respostas: sensores, motor, instruções.</td></tr>
    <tr><td>5–15 min</td><td>Robô humano</td><td>Um aluno é o robô; a turma dita instruções para ele pegar a garrafa ("dê 3 passos", "vire 90° à direita"). O robô só obedece ao pé da letra. Os erros aparecem sozinhos.</td></tr>
    <tr><td>15–20 min</td><td>Conceitos</td><td>Nomeie o que surgiu: <em>algoritmo</em> (a sequência), <em>bug</em> (a instrução errada) e <em>depuração</em> (achar e corrigir).</td></tr>
    <tr><td>20–35 min</td><td>LED no simulador</td><td>No Tinkercad Circuits, cada dupla arrasta um Arduino Uno, um LED e um resistor, e usa os blocos para ligar e desligar o LED a cada segundo.</td></tr>
    <tr><td>35–45 min</td><td>Desafio do semáforo</td><td>Três LEDs (verde, amarelo e vermelho) com tempos diferentes. Quem terminar adiciona um botão de pedestre.</td></tr>
    <tr><td>45–50 min</td><td>Fechamento</td><td>Cada dupla responde em uma frase: "qual foi o bug mais difícil e como vocês acharam?".</td></tr>
    </tbody>
    </table>

    <h2 id="dicas">Dicas que fazem diferença</h2>
    <ul>
    <li><strong>Trabalhe em duplas com papéis:</strong> um opera o mouse, o outro lê e confere o
        circuito. Troquem a cada 10 minutos.</li>
    <li><strong>Não corrija o código pelo aluno.</strong> Pergunte "o que você esperava que
        acontecesse?" e "o que aconteceu?". A diferença entre as duas respostas é o bug.</li>
    <li><strong>Resistor sempre:</strong> o simulador avisa quando o LED queima sem resistor. Use
        isso — é a lição de eletrônica mais barata que existe.</li>
    <li><strong>Salve o semáforo.</strong> Ele vira a base da aula seguinte, quando dá para
        trocar os blocos pelo código em texto.</li>
    </ul>

    <h2 id="avaliacao">Como avaliar esta aula</h2>
    <p>Não dê nota ao circuito pronto. Observe três coisas: se a dupla conseguiu descrever o
       algoritmo antes de programar, se testou e corrigiu sozinha, e se a resposta do fechamento
       mostra que entendeu o que é depuração. Para os projetos que vêm depois, uma rubrica ajuda a
       manter a avaliação justa — veja o modelo no artigo sobre avaliação de projetos maker.</p>

    <h2 id="proxima">E na próxima aula?</h2>
    <p>Com o semáforo salvo, o caminho natural é ver o mesmo projeto em código escrito, entender
       as funções <code>setup()</code> e <code>loop()</code> e, se a escola tiver placas, montar
       o circuito de verdade. Se não tiver, o Tinkercad sustenta várias semanas de aulas com
       sensores, motores e displays.</p>
""",
    [("/blog/scratch-microbit-ou-arduino/", "Scratch, micro:bit ou Arduino: qual usar em cada etapa da escola"),
     ("/blog/rubrica-avaliacao-projetos-maker/", "Como avaliar projetos maker: rubrica pronta para usar"),
     ("/guias/hackathon-escolar/", "Como organizar um hackathon escolar: guia completo")],
)

# ------------------------------------------------------------------ artigo 3
artigo(
    "rubrica-avaliacao-projetos-maker",
    "Como avaliar projetos maker: rubrica pronta para usar",
    "Rubrica de avaliação para projetos maker e de robótica com cinco critérios e quatro níveis, mais dicas para avaliar o processo, usar diário de bordo e autoavaliação.",
    """
    <p>Avaliar um projeto maker só pelo resultado final é injusto com quem aprendeu muito e não
       chegou lá — e generoso demais com quem copiou um tutorial. Uma <strong>rubrica</strong>
       resolve isso: ela torna os critérios visíveis antes do projeto começar e transforma a nota
       em uma conversa sobre o que melhorar.</p>

    <h2 id="principios">Três princípios antes da rubrica</h2>
    <ol>
    <li><strong>Avalie o processo, não só o produto.</strong> Protótipos que falharam e foram
        refeitos mostram mais aprendizado do que um projeto que funcionou de primeira.</li>
    <li><strong>Entregue a rubrica no primeiro dia.</strong> Quem sabe como será avaliado
        direciona o próprio esforço.</li>
    <li><strong>Peça evidências.</strong> Diário de bordo, fotos das versões e o código comentado
        são o que permite avaliar processo com justiça.</li>
    </ol>

    <h2 id="rubrica">A rubrica</h2>
    <p>Cinco critérios, quatro níveis. Some os pontos (máximo de 20) ou use os níveis apenas como
       devolutiva, sem nota.</p>
    <table>
    <thead><tr><th>Critério</th><th>1 · Inicial</th><th>2 · Em desenvolvimento</th><th>3 · Proficiente</th><th>4 · Avançado</th></tr></thead>
    <tbody>
    <tr><td><strong>Problema e propósito</strong></td><td>Não há problema definido; o projeto é uma demonstração.</td><td>O problema existe, mas é vago ou genérico.</td><td>O problema é claro e o projeto responde a ele.</td><td>O problema é real, foi investigado com usuários e o projeto mostra impacto.</td></tr>
    <tr><td><strong>Processo e iteração</strong></td><td>Uma única versão, sem testes registrados.</td><td>Houve testes, mas sem mudanças a partir deles.</td><td>Pelo menos duas versões, com melhorias justificadas.</td><td>Iterações documentadas, com o que falhou, por que e como foi resolvido.</td></tr>
    <tr><td><strong>Funcionamento técnico</strong></td><td>Não funciona ou funciona só com ajuda.</td><td>Funciona parcialmente ou de forma instável.</td><td>Funciona como planejado.</td><td>Funciona, é robusto e vai além do que foi pedido.</td></tr>
    <tr><td><strong>Colaboração</strong></td><td>Trabalho concentrado em uma pessoa.</td><td>Divisão de tarefas sem integração.</td><td>Todos contribuem e sabem explicar o projeto inteiro.</td><td>Papéis claros, decisões em conjunto e apoio a outras equipes.</td></tr>
    <tr><td><strong>Comunicação</strong></td><td>Não consegue explicar o que fez.</td><td>Explica o "o quê", mas não o "porquê".</td><td>Apresentação clara, com registro organizado.</td><td>Apresentação envolvente e documentação que outra turma conseguiria reproduzir.</td></tr>
    </tbody>
    </table>

    <h2 id="como-usar">Como usar no dia a dia</h2>
    <ul>
    <li><strong>Diário de bordo:</strong> ao fim de cada aula, a equipe registra em três linhas o
        que fez, o que deu errado e o que vai tentar na próxima. Vira a evidência do critério
        "processo".</li>
    <li><strong>Autoavaliação no meio do caminho:</strong> peça para a equipe se posicionar na
        rubrica na metade do projeto. A diferença entre a percepção dela e a sua é o ponto de
        conversa mais produtivo do bimestre.</li>
    <li><strong>Avaliação entre pares:</strong> na apresentação, outras equipes avaliam só o
        critério "comunicação". Isso mantém a plateia atenta e ensina a dar devolutiva.</li>
    <li><strong>Ajuste os pesos ao objetivo:</strong> numa feira de ciências, "problema e
        propósito" pode valer o dobro; numa aula de eletrônica, "funcionamento técnico".</li>
    </ul>

    <h2 id="erros">Erros comuns</h2>
    <ul>
    <li>Dar nota máxima a todos os projetos que funcionam — o critério técnico é só um de cinco.</li>
    <li>Avaliar a equipe só pela apresentação final, sem olhar o diário de bordo.</li>
    <li>Criar critérios tão detalhados que ninguém lê. Cinco critérios bem escritos bastam.</li>
    </ul>

    <h2 id="bncc">Conexão com a BNCC</h2>
    <p>A rubrica dialoga diretamente com competências gerais da BNCC: pensamento científico,
       crítico e criativo (2), cultura digital (5), argumentação (7) e responsabilidade e cidadania
       (10). Ao registrar no planejamento qual critério se liga a qual competência, a avaliação dos
       projetos maker passa a compor o currículo, e não a correr por fora dele.</p>
""",
    [("/blog/primeira-aula-de-robotica/", "Primeira aula de robótica: um roteiro de 50 minutos"),
     ("/guias/hackathon-escolar/", "Como organizar um hackathon escolar: guia completo"),
     ("/guias/olimpiadas-e-competicoes/", "Olimpíadas e competições de tecnologia para escolas")],
)


def gerar():
    destino = RAIZ / "blog"
    for a in ARTIGOS:
        url = f"{DOMINIO}/blog/{a['slug']}/"
        dados = {
            "@context": "https://schema.org", "@type": "BlogPosting",
            "headline": a["titulo"], "description": a["descricao"], "inLanguage": "pt-BR",
            "datePublished": DATA, "dateModified": DATA,
            "image": f"{DOMINIO}/hero-lab.jpg",
            "author": {"@type": "Organization", "name": "Izicode Edu", "url": DOMINIO},
            "publisher": {"@type": "Organization", "name": "Izicode Edu",
                          "logo": {"@type": "ImageObject", "url": f"{DOMINIO}/images/logo.png"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        }
        corpo = a["corpo"].rstrip().replace("<table>", '<table class="gz-tabela-texto">')
        rel = "\n".join(f'      <li><a href="{h}">{html.escape(t)}</a></li>' for h, t in a["rel"])
        pagina = HEAD.format(titulo_tag=f"{html.escape(a['titulo'])} — Blog Izicode Edu",
                             titulo=html.escape(a["titulo"]), descricao=html.escape(a["descricao"]),
                             url=url, og_tipo="article", ld=ld(dados), DOMINIO=DOMINIO) + f"""
<main class="gz-pagina">
  <nav class="gz-trilha" aria-label="Você está aqui">
    <a href="/">Início</a> <span aria-hidden="true">›</span>
    <a href="/blog/">Blog</a> <span aria-hidden="true">›</span>
    <span>{html.escape(a['titulo'])}</span>
  </nav>

  <article class="gz-artigo">
    <h1>{html.escape(a['titulo'])}</h1>
    <p><small>Publicado em <time datetime="{DATA}">{DATA_BR}</time> · Izicode Edu</small></p>
{corpo}
  </article>
{CTA}
  <section class="gz-relacionados">
    <h2>Continue lendo</h2>
    <ul>
{rel}
    </ul>
  </section>
</main>
""" + RODAPE
        (destino / a["slug"]).mkdir(parents=True, exist_ok=True)
        (destino / a["slug"] / "index.html").write_text(pagina, encoding="utf-8", newline="\n")

    itens = "\n".join(f"""    <li>
      <a href="/blog/{a['slug']}/">
        <h2>{html.escape(a['titulo'])}</h2>
        <p>{html.escape(a['descricao'])}</p>
      </a>
    </li>""" for a in ARTIGOS)
    dados = {"@context": "https://schema.org", "@type": "Blog", "name": "Blog Izicode Edu",
             "url": f"{DOMINIO}/blog/", "inLanguage": "pt-BR",
             "publisher": {"@type": "Organization", "name": "Izicode Edu", "url": DOMINIO}}
    desc = "Artigos práticos para professores sobre robótica educacional, programação e cultura maker: planos de aula, comparações de ferramentas e avaliação de projetos."
    indice = HEAD.format(titulo_tag="Blog para professores — robótica e cultura maker | Izicode Edu",
                         titulo="Blog Izicode Edu", descricao=desc, url=f"{DOMINIO}/blog/",
                         og_tipo="website", ld=ld(dados), DOMINIO=DOMINIO) + f"""
<main class="gz-pagina">
  <header class="gz-capa">
    <h1>Blog para professores</h1>
    <p>Artigos curtos e práticos sobre robótica educacional e cultura maker — para quem vai dar
       a aula na semana que vem. Quer ir mais fundo? Veja também os <a href="/guias/">guias</a>.</p>
  </header>

  <ul class="gz-lista">
{itens}
  </ul>
{CTA}</main>
""" + RODAPE
    destino.mkdir(exist_ok=True)
    (destino / "index.html").write_text(indice, encoding="utf-8", newline="\n")
    print("gerado:", [str(p.relative_to(RAIZ)) for p in sorted(destino.rglob("index.html"))])


gerar()
