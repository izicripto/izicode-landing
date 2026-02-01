# 🌍 Guia: Projetos de Tecnologia Alinhados aos ODS

## Objetivos de Desenvolvimento Sustentável na Educação

Os 17 ODS da ONU são uma agenda global para 2030. Integrar tecnologia educacional aos ODS dá propósito aos projetos e conecta alunos a problemas reais do mundo.

---

## 🎯 ODS Prioritários para Escolas

### ODS 4 - Educação de Qualidade
**Meta:** Garantir educação inclusiva e equitativa de qualidade

**Projetos:**
| Projeto | Tecnologia | Descrição |
|---------|------------|-----------|
| Tutor Bot | Python/Chatbot | Assistente de estudos para colegas |
| Biblioteca Digital | Web | Plataforma de compartilhamento de resumos |
| App Acessibilidade | App Inventor | Recursos para alunos com deficiência |

---

### ODS 9 - Indústria, Inovação e Infraestrutura
**Meta:** Construir infraestruturas resilientes, promover industrialização inclusiva

**Projetos:**
| Projeto | Tecnologia | Descrição |
|---------|------------|-----------|
| Smart School | Arduino/IoT | Automação de luzes e ar-condicionado |
| Impressora 3D Social | Maker | Produção de próteses e adaptadores |
| Mapeamento Comunitário | GIS/Web | Identificar problemas do bairro |

---

### ODS 11 - Cidades e Comunidades Sustentáveis
**Meta:** Tornar cidades inclusivas, seguras, resilientes e sustentáveis

**Projetos:**
| Projeto | Tecnologia | Descrição |
|---------|------------|-----------|
| Cidade Inteligente | Scratch + Arduino | Maquete com semáforos e sensores |
| Mapeamento de Acessibilidade | App | Identificar rampas e obstáculos |
| Horta Vertical IoT | Arduino | Monitoramento de plantas urbanas |

---

### ODS 12 - Consumo e Produção Responsáveis
**Meta:** Assegurar padrões de produção e consumo sustentáveis

**Projetos:**
| Projeto | Tecnologia | Descrição |
|---------|------------|-----------|
| App Troca-Troca | App Inventor | Troca de materiais escolares |
| Rastreador de Resíduos | Planilha/Dashboard | Monitorar lixo da escola |
| Calculadora de Pegada | Web | Calcular impacto ambiental pessoal |

---

### ODS 13 - Ação Contra a Mudança do Clima
**Meta:** Tomar medidas urgentes para combater a mudança climática

**Projetos:**
| Projeto | Tecnologia | Descrição |
|---------|------------|-----------|
| Estação Meteorológica | Arduino | Monitorar clima local |
| Alerta de Enchentes | IoT + App | Sistema de early warning |
| Jogo Climático | Scratch | Simulador de decisões ambientais |

---

### ODS 17 - Parcerias e Meios de Implementação
**Meta:** Fortalecer parcerias globais para o desenvolvimento sustentável

**Projetos:**
| Projeto | Tecnologia | Descrição |
|---------|------------|-----------|
| Intercâmbio Virtual | Videoconferência | Projetos com escolas de outros países |
| Open Source Escolar | GitHub | Compartilhar códigos entre escolas |
| Rede de Soluções | Web | Plataforma de conexão de projetos |

---

## 🔧 Projetos Detalhados

### Projeto 1: Estação Meteorológica IoT
**ODS:** 13 (Clima) + 4 (Educação)
**Duração:** 8-12 semanas
**Idade:** 12-17 anos

**Descrição:**
Alunos constroem uma estação que coleta dados de temperatura, umidade, pressão e qualidade do ar. Os dados são enviados para a nuvem e visualizados em dashboard.

**Materiais:**
- Arduino Uno ou ESP32
- Sensor DHT22 (temperatura/umidade)
- Sensor BMP280 (pressão)
- Sensor MQ-135 (qualidade do ar)
- Módulo WiFi (se Arduino)
- Caixa de proteção

**Etapas:**
1. **Semana 1-2:** Fundamentos de eletrônica e sensores
2. **Semana 3-4:** Programação Arduino (leitura de sensores)
3. **Semana 5-6:** Conexão com internet (ThingSpeak ou similar)
4. **Semana 7-8:** Construção da estrutura física
5. **Semana 9-10:** Criação do dashboard
6. **Semana 11-12:** Análise de dados e apresentação

**Conexão BNCC:**
- Ciências: Clima, atmosfera, método científico
- Matemática: Estatística, gráficos, médias
- Tecnologia: Programação, IoT, análise de dados

**Código exemplo (Arduino):**
```cpp
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float temp = dht.readTemperature();
  float umid = dht.readHumidity();
  
  Serial.print("Temperatura: ");
  Serial.print(temp);
  Serial.print("°C | Umidade: ");
  Serial.print(umid);
  Serial.println("%");
  
  delay(2000);
}
```

---

### Projeto 2: App de Economia Circular
**ODS:** 12 (Consumo) + 11 (Cidades)
**Duração:** 6-8 semanas
**Idade:** 10-15 anos

**Descrição:**
Aplicativo para troca e doação de materiais escolares entre alunos, reduzindo desperdício e promovendo consumo consciente.

**Ferramenta:** MIT App Inventor

**Funcionalidades:**
- Cadastro de itens para troca/doação
- Busca por categoria
- Chat entre usuários
- Histórico de trocas
- Ranking de participação

**Etapas:**
1. **Semana 1:** Pesquisa sobre economia circular
2. **Semana 2:** Design das telas (papel)
3. **Semana 3-4:** Construção no App Inventor
4. **Semana 5:** Testes com colegas
5. **Semana 6:** Ajustes e lançamento
6. **Semana 7-8:** Campanha de divulgação

**Conexão com currículo:**
- Ciências: Ciclo de materiais, sustentabilidade
- Matemática: Estatísticas de trocas
- Português: Comunicação, argumentação
- Arte: Design de interface

---

### Projeto 3: Smart City - Maquete Inteligente
**ODS:** 11 (Cidades) + 9 (Inovação)
**Duração:** 10-14 semanas
**Idade:** 11-16 anos

**Descrição:**
Maquete de cidade com elementos automatizados: semáforos inteligentes, iluminação por presença, cancela de estacionamento, etc.

**Materiais:**
- Base de madeira/papelão (60x80cm)
- Arduino Mega
- LEDs (semáforos, postes)
- Servo motores (cancelas)
- Sensores de presença (PIR)
- Sensores de luz (LDR)
- Materiais de maquete (casas, carros)

**Sistemas para implementar:**
1. **Semáforo inteligente:** Temporização automática
2. **Iluminação pública:** Liga com pouca luz
3. **Estacionamento:** Conta vagas disponíveis
4. **Passagem de nível:** Cancela com trem
5. **Casa inteligente:** Luz por presença

**Conexão interdisciplinar:**
- Geografia: Urbanismo, planejamento
- Física: Circuitos, energia
- Matemática: Geometria, proporção
- Sociologia: Mobilidade urbana

---

### Projeto 4: Jogo Educativo sobre Mudanças Climáticas
**ODS:** 13 (Clima) + 4 (Educação)
**Duração:** 6-8 semanas
**Idade:** 8-14 anos

**Descrição:**
Jogo no Scratch onde o jogador toma decisões sobre uma cidade/país e vê os impactos ambientais de longo prazo.

**Mecânicas:**
- Escolhas sobre energia (renovável vs fóssil)
- Gestão de recursos naturais
- Políticas de transporte
- Indicadores de CO2, temperatura, biodiversidade

**Etapas:**
1. **Semana 1:** Pesquisa sobre mudanças climáticas
2. **Semana 2:** Game design (papel)
3. **Semana 3-4:** Programação básica no Scratch
4. **Semana 5-6:** Arte e sons
5. **Semana 7:** Testes e balanceamento
6. **Semana 8:** Publicação e divulgação

---

## 📊 Matriz ODS x Tecnologia

| ODS | Scratch | Arduino | App Inventor | Python | Web |
|-----|---------|---------|--------------|--------|-----|
| 4 - Educação | ⭐⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 6 - Água | ⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐ |
| 7 - Energia | ⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐ |
| 9 - Inovação | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 11 - Cidades | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| 12 - Consumo | ⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 13 - Clima | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 14 - Oceanos | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 15 - Terra | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

---

## 📝 Template de Projeto ODS

```markdown
# [NOME DO PROJETO]

## Identificação
- **ODS Principal:** 
- **ODS Secundários:**
- **Turma/Idade:**
- **Duração:**

## Problema
[Qual problema real este projeto resolve?]

## Solução
[Como a tecnologia vai ajudar?]

## Tecnologias
- [ ] Hardware: 
- [ ] Software:
- [ ] Plataformas:

## Cronograma
| Semana | Atividade | Entregável |
|--------|-----------|------------|
| 1 | | |
| 2 | | |

## Conexão Curricular
- **Ciências:**
- **Matemática:**
- **Linguagens:**
- **Humanas:**

## Indicadores de Sucesso
- [ ] 
- [ ] 

## Recursos Necessários
- Materiais:
- Espaço:
- Apoio:

## Próximos Passos
1. 
2. 
```

---

## 🌱 Dicas de Implementação

### Começando pequeno
1. Escolha UM ODS para focar
2. Comece com projeto simples (4 semanas)
3. Conecte com problemas LOCAIS
4. Envolva a comunidade escolar

### Escalando
1. Documente tudo (fotos, vídeos, código)
2. Compartilhe com outras escolas
3. Participe de mostras e feiras
4. Busque parcerias externas

### Sustentabilidade do projeto
1. Crie equipes de manutenção
2. Documente para turmas futuras
3. Integre ao currículo formal
4. Celebre resultados publicamente

---

## 📞 Suporte Izicode

**Consultoria de projetos ODS:**
- Diagnóstico da realidade local
- Seleção de ODS e projetos
- Planejamento e materiais
- Acompanhamento da execução

**Formação de professores:**
- Workshop ODS + Tecnologia (8h)
- Curso de Arduino para ODS (16h)
- Mentoria de projetos

📧 contato@izicode.com.br
📱 WhatsApp: (41) 99999-9999

---

*Documento produzido por Izicode Edu*
*Versão 1.0 - Fevereiro 2026*
