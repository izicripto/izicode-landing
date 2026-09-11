/**
 * Insere os planos de scripts/planos-professor.cjs em public/js/projects-data.js.
 *
 * Edição de texto e não de objeto: o arquivo de projetos é fonte escrita à
 * mão, com comentários e um campo `content` em template literal de muitas
 * linhas. Ler, transformar em objeto e serializar de volta destruiria tudo
 * isso e produziria um diff ilegível.
 *
 * A inserção acontece logo antes de `content:` de cada projeto, que é onde
 * os planos já existentes ficam.
 *
 * Recusa de escrever se qualquer coisa não bater: id que não existe no
 * arquivo, projeto que já tem plano, ou contagem final diferente da
 * esperada. Um gerador que aplica pela metade é pior do que um que não
 * aplica: fica um arquivo meio certo que ninguém sabe em que estado está.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)
const PLANOS = require(join(raiz, "scripts/planos-professor.cjs"))

const ALVO = join(raiz, "public/js/projects-data.js")
let texto = readFileSync(ALVO, "utf8")

const problemas = []
let aplicados = 0

for (const [id, plano] of Object.entries(PLANOS)) {
  // localiza o bloco do projeto: do `id: "..."` até o `content:` dele
  const inicio = texto.indexOf(`id: "${id}"`)
  if (inicio === -1) {
    problemas.push(`id não encontrado no arquivo: ${id}`)
    continue
  }

  const posContent = texto.indexOf("content:", inicio)
  if (posContent === -1) {
    problemas.push(`sem campo content depois de ${id}`)
    continue
  }

  const bloco = texto.slice(inicio, posContent)
  if (bloco.includes("teacherGuide")) {
    problemas.push(`já tinha plano, não sobrescrevo: ${id}`)
    continue
  }

  // a indentação do `content:` é a mesma dos irmãos dele
  const linhaInicio = texto.lastIndexOf("\n", posContent) + 1
  const recuo = texto.slice(linhaInicio, posContent)

  const habilidades = plano.skills.map((s) => JSON.stringify(s)).join(", ")
  const inserir =
    `${recuo}teacherGuide: {\n` +
    `${recuo}    objective: ${JSON.stringify(plano.objective)},\n` +
    `${recuo}    skills: [${habilidades}],\n` +
    `${recuo}    assessment: ${JSON.stringify(plano.assessment)}\n` +
    `${recuo}},\n`

  texto = texto.slice(0, linhaInicio) + inserir + texto.slice(linhaInicio)
  aplicados++
}

if (problemas.length) {
  console.error("Nada foi escrito. Problemas:")
  problemas.forEach((p) => console.error("  " + p))
  process.exit(1)
}

writeFileSync(ALVO, texto, "utf8")
console.log(`planos inseridos: ${aplicados}`)
