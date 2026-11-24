# Calculadora de Estatística Aplicada — V1

Site de estudo para os **cinco assuntos** presentes no `index.html` de referência da disciplina. Recriado em HTML, CSS e JavaScript puro, em português brasileiro, com foco em alunos iniciantes.

## O que a V1 faz

| Aba | Entradas que o exercício informa | Resultado |
|---|---|---|
| Tamanho da amostra — média | Confiança, desvio-padrão populacional σ, erro máximo Em | Tamanho mínimo n |
| Tamanho da amostra — proporção | Confiança, proporção p (%), erro Ep (%); opção p desconhecido | Tamanho mínimo n |
| Intervalo de confiança — média | Confiança, média x̄, desvio σ ou s, n | Margem Em, limites do intervalo |
| Intervalo de confiança — proporção | Confiança, quantidade com a característica, total n, padrão aceitável opcional | Proporção, complemento, margem Ep, limites, comparação opcional |
| Diminuir o erro | Confiança, desvio σ ou s, amostra atual n, fator de redução k | Erro atual, novo erro, nova amostra e observações adicionais |

**Não inclui:** correlação, regressão, escore Z, histograma, quartis, boxplot, base de planilhas ou testes formais de hipótese. Isso é uma escolha consciente de escopo, não um erro. Logo, a V1 não resolve todos os 44 exercícios que haviam sido mapeados na versão antiga.

## Como usar

Abra `index.html` num navegador moderno. O site funciona offline, não exige instalação, conta, dados pessoais nem internet. Escolha uma das cinco abas, digite os valores no mesmo formato dos PDFs, clique em **Calcular** e, se precisar, abra **Ver resolução passo a passo**.

A vírgula é decimal (`1,25`). `1.250` é lido como mil duzentos e cinquenta, e `1.250,50` como mil duzentos e cinquenta e cinquenta centésimos. Para evitar dúvida, digite o número de milhar sem ponto (`1250`).

No caso de proporção, os campos que pedem **%** recebem valores como `30` para 30%, e `2` para erro de 2%. A calculadora transforma esses valores em decimais para usar nas fórmulas. O complemento aparece automaticamente e não pode ser alterado. Se a proporção for desconhecida, marque o campo e será utilizado 50%, como no material da aula.

## Onde corrigir algo durante a apresentação

- `index.html`: nome de botão, texto de campo e estrutura das cinco telas.
- `assets/style.css`: cores, espaços, tamanho dos campos e organização no celular.
- `src/calculos.js`: fórmulas matemáticas, validações e tabela dos valores críticos.
- `src/app.js`: navegação das abas, leitura dos campos, respostas e explicações passo a passo.
- `tests/calculos.test.mjs`: testes das fórmulas e dos dados incorretos.
- `tests/navegador.py`: testes com cliques no PC e celular.
- `tools/gerar-worker.mjs`: montagem do único Worker da Cloudflare a partir dos arquivos acima.

**Nunca altere `deploy/worker.js` manualmente:** é gerado pelo comando `npm run build` e contém o site inteiro.

## Matemática utilizada

Os níveis de confiança são **90% (Z = 1,645)**, **95% (Z = 1,960)** e **99% (Z = 2,575)**, da tabela utilizada na disciplina.

- Média, tamanho da amostra: `n = (Z × σ / Em)²`. Arredondar `n` sempre para cima.
- Proporção, tamanho da amostra: `n = Z² × p(1 − p) / Ep²`. Se `p` for desconhecido, usar `p = 0,5`.
- IC da média: `Em = Z × σ / √n`; `IC = (x̄ − Em ; x̄ + Em)`.
- IC da proporção: `p = sucessos/n`; `Ep = Z × √(p(1 − p) / n)`; `IC = (p − Ep ; p + Ep)`.
- Redução do erro: `Em atual = Z × desvio / √n`; `Novo Em = Em atual / k`; `Novo n = (Z × desvio / Novo Em)²`.

**Limitações:** o IC da média utiliza o método Z dos PDFs, não a distribuição t de Student; se o desvio for amostral e n for pequeno, esse método pode não ser adequado. O IC da proporção usa a aproximação normal de Wald, que pode falhar com poucas ocorrências ou proporções extremas. Se a comparação opcional com um padrão for preenchida, ela avalia o intervalo; não substitui teste formal de hipótese. Não se deve alterar os limites que ficarem fora de 0%–100% sem avisar.

## Desenvolvimento e testes

A única dependência para executar testes automáticos é o Node.js. **Para abrir a calculadora não é necessário Node.js**.

```sh
npm run build   # atualiza deploy/worker.js
npm test        # testa as cinco fórmulas e o Worker
npm run check   # checa sintaxe e roda testes
```

Para testes visuais com Playwright e Chromium, execute `python tests/navegador.py` em ambiente que tenha ambos instalados.

## Por que a stack é tão pequena?

Não há backend nem banco de dados. As cinco contas são puramente matemáticas e podem ser feitas no próprio navegador. A Cloudflare só distribui o HTML, o CSS e o JavaScript. Esse desenho evita dependências, reduz pontos de falha e facilita entender o código.

## Referência funcional

A organização por abas e os cinco temas foram estudados no repositório [GuilhermeOliveira0/calculadora-estatistica](https://github.com/GuilhermeOliveira0/calculadora-estatistica). Código e layout desta V1 foram redigidos novamente, sem copiar o projeto original.

## Exemplos para praticar
A aba Exemplos contém 18 adaptações dos exercícios A1–A4, B1–B7 e C1–C7 dos três PDFs, mais um treino extra de redução de erro (19 enunciados). Os 23 botões preenchem os dados sem calcular automaticamente. Para editar os exemplos, abra `src/exemplos.js`.

## Casas decimais

Os resultados exibem duas casas decimais por padrão. O botão **Mostrar mais casas decimais** mostra até dez casas e permite voltar a duas. Contagens inteiras continuam inteiras. O botão não refaz a conta: apenas apresenta os números já calculados. O valor Z e os dados originais permanecem com a precisão necessária à resolução.

Os comentários em português explicam as partes do HTML, CSS, funções matemáticas, interface, exemplos e geração do Worker. Comece por index.html (campos), src/calculos.js (contas), src/app.js (botões e respostas), assets/style.css (aparência) e src/exemplos.js (enunciados).

### Visualização do intervalo

Os intervalos da média e da proporção mostram uma régua com os dois limites e a estimativa amostral. O botão de precisão atualiza também os números do gráfico. Não existe dependência de biblioteca gráfica nem cálculo novo. Quando os limites coincidem, é mostrado apenas um ponto.

### Quantidade ou porcentagem

No intervalo de confiança da proporção, digite uma quantidade inteira (por exemplo, 922) ou uma porcentagem com o símbolo % (por exemplo, 40%). O total da amostra é obrigatório nos dois casos. A entrada percentual entra diretamente como p na fórmula; não arredondamos uma quantidade de pessoas. O campo aceita 0% a 100% e mantém os avisos sobre aproximação normal.
