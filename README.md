# Estatística Aplicada — Calculadora V1

Calculadora de apoio à disciplina **Estatística Aplicada — professora Andrea P. Silva**, preparada para uma apresentação em que o aluno escuta o enunciado, identifica a operação, preenche os dados e explica a resposta.

Esta é uma reconstrução da antiga calculadora, **sem o teclado científico do Windows**, com interface limpa e organizada por assunto. Não há cadastro, conexão com Firebase, armazenamento pessoal ou bibliotecas de interface.

## Abra a calculadora

- **Online:** https://77-statlab-estatistica.on7.workers.dev/
- **Offline:** abra `index.html` no Chrome ou no Edge. Os cálculos são executados no próprio navegador.
- **Testes:** `npm test` (Node 22+). A aplicação não precisa de Node para funcionar.

## As sete áreas

| Área | O que resolve | Dados que você informa |
|---|---|---|
| Tamanho da amostra | Estimativa da média ou proporção | Grau de confiança, erro máximo e desvio-padrão ou proporção |
| Intervalo da média | Limite inferior, limite superior e margem | Média, desvio e n — ou uma lista |
| Intervalo da proporção | Percentual e intervalo da população | Quantidade com a característica, total e confiança — ou lista sim/não |
| Correlação | Coeficiente de Pearson r | Valores de X e de Y |
| Regressão linear | Equação ŷ = aX + b e previsão | Valores de X e de Y; novo X opcional |
| Escore Z | Distância de um valor até a média | Valor, média e desvio — ou lista |
| Média e desvio-padrão | Média, mediana, variâncias e desvios | Lista de observações |

### Linguagem dos materiais

- **Desvio-padrão populacional (σ)** — dispersão conhecida da população.
- **Erro amostral máximo aceito (Em)** — diferença máxima permitida ao estimar uma média.
- **Erro da proporção (Ep)** — margem em porcentagem; digite `2` para 2%.
- **Grau de confiança** — escolha 90%, 95% ou 99%.
- **Tamanho da amostra (n)** — quantidade de observações analisadas.
- **População (N)** — tamanho total; só informe quando conhecido.
- **Proporção (p)** — a porcentagem com uma característica; seu complemento é `1 − p`.

### Como preencher os campos

1. Escolha o cálculo no menu à esquerda, ou no seletor do celular.
2. Se o enunciado já disser média, desvio, proporção e total, use **Valores informados**.
3. Se a questão fornecer uma coluna com os valores individuais, selecione **Lista de valores** e cole os números, um por linha ou separados por `;`.
4. Se a professora informar **margem de erro já calculada** ou **população N**, abra **Mais opções**. Esses campos não são obrigatórios.
5. Pressione **Calcular**. A resposta principal aparece imediatamente, seguida das informações calculadas automaticamente.
6. Abra **Ver resolução passo a passo** somente quando precisar explicar como a conta foi feita.

O programa entende **vírgula decimal** (`1,5`) e **ponto de milhar** (`1.250` = mil duzentos e cinquenta). Uma coluna copiada do Excel funciona com quebras de linha. Para separar números em uma mesma linha, use `;` porque a vírgula é reservada à parte decimal.

**Regra de arredondamento:** o tamanho mínimo da amostra sempre é arredondado para cima. Os cálculos internos não arredondam antes do resultado; a interface mostra até seis casas nos valores intermediários e duas casas nos limites exibidos.

## O que aparece na resposta

A resposta reúne apenas:

1. **Número ou intervalo final**, em destaque.
2. **Valores obtidos automaticamente**, como proporção, complemento, margem, limite inferior/superior e desvio.
3. **Interpretação breve**, com linguagem direta.
4. **Avisos de validade**, somente quando necessários.
5. **Passo a passo recolhido**, com a substituição e uma frase explicando cada conta.

Correlação e regressão também mostram um gráfico de dispersão simples, sem serviços externos.

## O que foi removido da V10

- Teclado científico e visor de calculadora convencional.
- Fluxograma horizontal com muitos nós.
- Histórico, memória, painéis permanentes de explicações e botões abreviados.
- Gestão de população como calculadora isolada; o tamanho N conhecido permanece como opção dentro das fórmulas.
- As áreas especializadas de histograma, boxplot, classificação automática de variáveis e tabelas de frequência, que não fazem parte do escopo essencial da primeira versão. Podem voltar em uma versão futura após validação de necessidade.

As **questões A–F** da lista da disciplina usam cálculos centrais presentes aqui; a parte especial de análise descritiva e gráficos G1–G5 **não tem cobertura completa nesta versão**. G6 (correlação e regressão) tem cálculo principal. A calculadora não substitui interpretação escrita nem um teste formal de hipótese.

## Arquivos: onde consertar um erro

```text
Calculadora-Estatistica/
├── index.html               # Estrutura da página: cabeçalho, menu e painéis
├── assets/styles.css        # Cores, tamanhos, espaçamentos e celular
├── src/math.js              # Todas as fórmulas e validações matemáticas
├── src/app.js               # Botões, campos, respostas e gráfico
├── tools/build-worker.mjs   # Gera a publicação Cloudflare a partir dos arquivos
├── deploy/worker.js         # Arquivo gerado para o mesmo Worker existente
├── tests/                   # Testes matemáticos, exercícios, Worker e navegador
├── STACK.md                 # Escolhas técnicas e custo operacional
├── AGENTS.md                # Regras para futuras alterações
└── docs/                    # Auditoria, diagramas, decisões e progresso RFB
```

**Se o resultado matemático estiver errado:** abra `src/math.js`, procure a seção pelo nome da fórmula. **Se faltar um campo:** abra `src/app.js`, função `montarFormulario`. **Se o menu ou texto estiver incorreto:** também `src/app.js`, objeto `ASSUNTOS`. **Se o site ficar feio no celular:** abra `assets/styles.css`, seção `RESPONSIVO`.

## Principais fórmulas

| Operação | Fórmula |
|---|---|
| Amostra da média | `n = (z × σ / Em)²` |
| Amostra da proporção | `n = z² × p × (1−p) / Ep²` |
| Intervalo da média | `E = z × desvio / √n; IC = média ± E` |
| Intervalo da proporção | `Ep = z × √(p × (1−p) / n); IC = p ± Ep` |
| Correlação | `r = Σ[(X−x̄)(Y−ȳ)] / √[Σ(X−x̄)² × Σ(Y−ȳ)²]` |
| Regressão | `a = Σ[(X−x̄)(Y−ȳ)] / Σ(X−x̄)²; b = ȳ − a×x̄; ŷ = aX+b` |
| Escore Z | `z = (x−média) / desvio` |
| Desvio amostral | `s = √[Σ(x−x̄)² / (n−1)]` |

Para os valores críticos, usa-se a tabela da aula: 90% → 1,645; 95% → 1,96; 99% → 2,575.

**Limitação estatística:** os intervalos da média usam a aproximação normal Z ensinada nos materiais. Para desvio estimado com amostra pequena, outra metodologia (t de Student) pode ser necessária. Os intervalos de proporção usam a aproximação normal de Wald, inadequada em alguns casos extremos; o programa apresenta um aviso. Intervalo de confiança e teste de hipótese são coisas distintas.

## Comandos de desenvolvimento

```bash
node --version
npm test                    # Testes matemáticos e do Worker; zero dependências
npm run build               # Reconstrói deploy/worker.js
npm run check               # Verifica sintaxe, testes e publicação
python tests/browser_smoke.py  # QA real: exige Playwright/Chromium no ambiente de QA
```

O site não precisa de `npm install`. Ele é estático e também funciona ao abrir `index.html` diretamente (sem servidor). O código gerado em `deploy/worker.js` não deve ser editado à mão; use `npm run build` depois de modificar a tela.

## Auditoria / RFB Method

- Leia `docs/AUDITORIA.md` para comparar os três projetos analisados.
- Leia `docs/DIAGRAMAS.md` para entender o fluxo e a arquitetura.
- Leia `docs/QA.md` para saber **o que foi testado** e quais limites continuam.
- Leia `docs/RFB.md` para as regras de GitHub First, Starter Pack, QA, AntiLoop e documentação de entrega.
- Leia `docs/ESTADO.md` e `docs/HANDOFF.md` antes de continuar o projeto.

## Contribuições e direitos

A implementação V1 é independente e não contém código copiado dos três repositórios de referência. Os projetos de Carlos, Kayky e Guilherme foram consultados para identificar requisitos pedagógicos, métodos e padrões de interface, mas o código desta versão foi escrito novamente. Referências em `docs/AUDITORIA.md`.

Projeto de estudo. Sem coleta de dados nem finalidade comercial.
