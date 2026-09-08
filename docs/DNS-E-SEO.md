# DNS no Registro.br e SEO orgânico

Este documento descreve o estado real do domínio `izicode.com.br` e o que
falta configurar. Os valores aqui foram lidos do DNS em produção, não
copiados de um tutorial genérico.

## Como o domínio está hoje

O domínio usa o **DNS do próprio Registro.br** (os servidores são
`d.sec.dns.br` e `f.sec.dns.br`), então os registros são editados direto no
painel deles — não há Cloudflare nem provedor externo no caminho.

| Tipo | Nome | Valor | Para que serve |
|---|---|---|---|
| A | (raiz) | `199.36.158.100` | aponta o site para o Firebase Hosting |
| TXT | (raiz) | `hosting-site=izicodeedu-532ac` | prova ao Firebase que o domínio é nosso |

E o que **não** existe:

| falta | consequência |
|---|---|
| `www` | `www.izicode.com.br` simplesmente não abre |
| MX | **nenhum e-mail chega em `@izicode.com.br`** |
| TXT do Search Console | não dá para enviar o sitemap nem acompanhar a indexação |

> O site anuncia `contato@izicode.com.br` em seis lugares diferentes, e o
> domínio não tem servidor de e-mail. Toda mensagem enviada para lá volta
> com erro, e quem escreveu conclui que a empresa não respondeu. É a falha
> mais cara desta lista, porque acontece em silêncio.

## Onde editar

1. Entre em <https://registro.br> com o CPF ou CNPJ titular do domínio.
2. **Meus Domínios** → `izicode.com.br`.
3. **Editar Zona DNS** (o painel mostra uma tabela de registros).
4. Cada linha tem três campos: **Nome**, **Tipo** e **Dados**.
5. Ao terminar, clique em **Salvar alterações**. A propagação costuma levar
   de minutos a poucas horas.

> **Não mexa** no registro `A` da raiz nem no TXT `hosting-site=...`. São
> eles que mantêm o site no ar e a posse do domínio validada no Firebase.

## 1. Fazer o `www` funcionar

O `www.izicode.com.br` já está cadastrado no Firebase, configurado para
redirecionar ao endereço sem `www` — que é o uso correto de um 301, já que
as duas formas são a mesma página e o Google precisa saber qual é a
oficial. Falta só o registro no DNS:

| Nome | Tipo | Dados |
|---|---|---|
| `www` | CNAME | `izicodeedu-532ac.web.app` |

Depois de propagar, `www.izicode.com.br` passa a levar para
`izicode.com.br` em vez de dar erro de página não encontrada.

## 2. Google Search Console

É o que faz o Google reprocessar o site. Sem isso ele pode levar semanas
para perceber que o domínio parou de redirecionar.

1. Abra <https://search.google.com/search-console> e escolha
   **Prefixo do URL** com `https://izicode.com.br` (mais simples que a
   opção "Domínio", que exige DNS e cobre subdomínios que não usamos).
2. Escolha o método **tag HTML** ou **registro TXT no DNS**. Pelo DNS:

   | Nome | Tipo | Dados |
   |---|---|---|
   | (deixe em branco, é a raiz) | TXT | `google-site-verification=XXXX` |

   O valor `XXXX` é gerado pelo Search Console na hora — copie de lá.

   > O TXT do Firebase (`hosting-site=...`) **continua**. Um domínio pode
   > ter vários registros TXT, e apagar o do Firebase invalidaria a posse
   > do domínio no Hosting.

3. Verificada a posse, vá em **Sitemaps** e envie `sitemap.xml`.
4. Em **Inspeção de URL**, cole `https://izicode.com.br/` e peça
   *Solicitar indexação*. Repita para `https://izicode.com.br/planos`.

## 3. Criar o contato@izicode.com.br

### Qual serviço usar

| opção | custo | limitação |
|---|---|---|
| **Zoho Mail (grátis)** | R$ 0 | 5 contas, 5 GB cada, **só webmail e aplicativo** — o plano gratuito não tem IMAP/POP |
| Google Workspace | ~R$ 33–42/usuário/mês | cobrado em dólar com IOF, a menos que contratado por revenda nacional |
| Encaminhamento simples | R$ 0 | recebe num Gmail existente, mas não permite *responder* como `@izicode.com.br` |

Para uma única caixa de contato, com volume baixo, o **Zoho grátis** é o
caminho: é o único serviço gratuito que aceita domínio próprio de verdade.
A falta de IMAP só atrapalha quem quer ler pelo Outlook ou Thunderbird —
pelo navegador e pelo app do celular funciona normalmente.

Se mais tarde a equipe crescer e precisar de agenda e drive compartilhados,
migrar para o Google Workspace é uma troca de registros MX, não uma
mudança de endereço.

### Passo a passo no Zoho

1. Abra <https://www.zoho.com/pt-br/mail/zohomail-pricing.html> e desça até
   o **Plano Gratuito Para Sempre** (ele não aparece no topo da página, que
   mostra só os planos pagos). Clique em *Inscrever-se*.
2. Escolha **"Cadastrar-se com um domínio que já possuo"** e informe
   `izicode.com.br`.
3. O Zoho pede para **provar a posse do domínio**. Escolha o método TXT e
   ele mostra um valor único. No Registro.br, adicione:

   | Nome | Tipo | Dados |
   |---|---|---|
   | (em branco, é a raiz) | TXT | `zoho-verification=zbXXXXXXXX.zmverify.zoho.com` |

   Volte ao Zoho e clique em *Verificar*. Pode levar alguns minutos.
4. Crie a caixa `contato` — o endereço vira `contato@izicode.com.br`.
   Esta primeira conta é também a administradora.
5. O Zoho então mostra os **registros MX**. No Registro.br, adicione as
   três linhas (o número antes do host é a prioridade; o painel do
   Registro.br tem um campo separado para ela):

   | Nome | Tipo | Prioridade | Dados |
   |---|---|---|---|
   | (raiz) | MX | 10 | `mx.zoho.com` |
   | (raiz) | MX | 20 | `mx2.zoho.com` |
   | (raiz) | MX | 50 | `mx3.zoho.com` |

   > Confira os hosts na tela do Zoho antes de colar. Contas criadas em
   > outras regiões usam `mx.zoho.eu` ou `mx.zoho.in`, e um host errado faz
   > o e-mail sumir sem aviso.

6. Adicione o **SPF**, que diz aos outros servidores que o Zoho tem
   permissão de enviar em nome do domínio. Sem ele, boa parte das mensagens
   cai em spam:

   | Nome | Tipo | Dados |
   |---|---|---|
   | (raiz) | TXT | `v=spf1 include:zoho.com ~all` |

7. Ative o **DKIM** no painel do Zoho (*Configuração de e-mail → DKIM*).
   Ele gera um TXT com nome parecido com `zmail._domainkey`. Copie nome e
   valor exatamente como aparecem.

> **Atenção aos TXT que já existem.** O domínio já tem
> `hosting-site=izicodeedu-532ac` (Firebase) e vai ganhar o do Search
> Console. Todos convivem: são registros TXT separados, e apagar um para
> criar outro quebraria o que ele sustentava. A **única** exceção é o SPF —
> desse pode existir só um por domínio. Se um dia houver outro serviço
> enviando e-mail, junte tudo numa linha só, em vez de criar um segundo:
> `v=spf1 include:zoho.com include:outroservico.com ~all`

### Conferir se funcionou

```bash
# os MX aparecem?
nslookup -type=MX izicode.com.br 8.8.8.8

# o SPF esta publicado?
nslookup -type=TXT izicode.com.br 8.8.8.8 | grep spf
```

E o teste que realmente importa: mandar um e-mail de fora (de um Gmail
pessoal, por exemplo) para `contato@izicode.com.br` e confirmar que ele
chega. Depois responder por lá e ver se a resposta sai com o endereço
certo — receber e enviar são coisas separadas, e o SPF só afeta a segunda.

## 4. Depois da configuração: o SEO orgânico

O que já foi resolvido no código: o domínio parou de redirecionar (um 301
mandava toda a autoridade para o `web.app`), existe tag canonical apontando
para `izicode.com.br`, cada rota tem título e descrição próprios, e o
sitemap lista só URLs que respondem 200.

O que falta é conteúdo. O site hoje responde por buscas de marca
("izicode"), mas não por buscas de problema — que é de onde vem professor
novo:

- "plano de aula de robótica BNCC"
- "projeto de Arduino para ensino fundamental"
- "como montar laboratório maker na escola"
- "atividade de robótica sem kit"

Cada uma dessas é uma página que responde a pergunta de verdade e leva ao
cadastro no fim. Os guias em `/guia.html?doc=...` já são material desse
tipo, mas estão numa URL com parâmetro de query, que ranqueia pior do que
um caminho limpo como `/guias/bncc-tecnologia`.

## Como conferir se deu certo

```bash
# o www responde?
curl -sI https://www.izicode.com.br | head -3

# o dominio serve o site (200) em vez de redirecionar (301)?
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -I https://izicode.com.br

# existe servidor de e-mail?
nslookup -type=MX izicode.com.br 8.8.8.8

# o Search Console enxerga a verificacao?
nslookup -type=TXT izicode.com.br 8.8.8.8
```
