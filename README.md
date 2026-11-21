# Calculadora de Estatística Aplicada

**Manual de uso e de manutenção para quem está começando a programar.**

Esta calculadora foi preparada para a apresentação de Estatística Aplicada na Fatec. Seu objetivo é permitir que o aluno ouça o enunciado da professora, escolha uma operação, digite somente os dados disponíveis e explique o resultado.

O projeto prioriza **Python simples**, interface próxima da Calculadora do Windows, organização em linhas coloridas como no Excel e um fluxograma inspirado no Node-RED. Não exige Flask, bibliotecas matemáticas externas, banco de dados nem serviços pagos para funcionar no computador.

> **Onde corrigir erros durante a apresentação?** Abra primeiro `calculos.py` se a conta estiver errada; `web/app.js` se os campos ou botões falharem; `web/styles.css` se a disposição visual estiver errada; `app.py` se o navegador não conseguir falar com o Python.

---

## Guia dos 44 enunciados recebidos (revisão de novembro de 2026)

**Primeiro abra [`GUIA_44_QUESTOES.md`](GUIA_44_QUESTOES.md).**
O guia lista cada exercício A1–G6, indica o botão e os valores que devem
ser informados. Ele também explica quais questões exigem interpretação, não
somente uma resposta numérica. A base `Tabela Slide.xlsx` não tinha enunciados,
mas seus 31 registros estão disponíveis em `dados/trabalhadores.csv`.

### Os novos cálculos

Para não aumentar demais a calculadora, abra **Análise de dados e gráficos**
na coluna esquerda. Os quatro botões novos são:

| Botão | Para que serve | Dados necessários |
|---|---|---|
| Medidas descritivas | Média, mediana, moda, variância, desvio e amplitude | Uma coluna numérica |
| Frequências e gráfico | fi, fr, Fi, percentual acumulado e barras/histograma | Uma coluna com categorias ou números |
| Quartis e boxplot | Q1, Q2, Q3, AIQ, outliers e escore Z por valor | Uma coluna numérica |
| Classificar variável | Qualitativa/quantitativa; nominal/ordinal; discreta/contínua | Escolher a variável das planilhas |

A tabela e o gráfico aparecem apenas **depois de Calcular**. Os gráficos são
SVG nativos e podem ser abertos offline; o JavaScript só os desenha com os
valores já calculados pelo Python.

### Comparar situações presentes nos exercícios

- **A2:** em *Tamanho da amostra*, selecione **Comparar 90%, 95% e 99%**.
  O Python calcula três n para a mesma margem.
- **B4:** em *IC da média*, use o campo opcional **Comparar com outra amostra n**.
- **C5, E5–E9, F4–F6:** digite o **Valor de referência**. Só então aparecerá
  o campo **Como comparar?**, com mínimo, máximo, diferença ou pertence ao intervalo.
- **D1–D3 e G6:** a regressão mostra o gráfico de dispersão com a reta.
  Aceita novo X para prever Y e, opcionalmente, Y para inferir X.
  O programa avisa quando a operação implica extrapolação.
- **G1–G6:** use `dados/usuarios_internet.csv` (30 observações originais).
  Para copiar corretamente, selecione uma coluna por vez, sem o cabeçalho.
- **Tabela Slide.xlsx:** use `dados/trabalhadores.csv` (31 observações).

**Atenção:** “Escore Z de uma lista” mostra a distância da média em desvios
amostrais. Outlier pelo AIQ é outro critério; o programa mostra os dois,
mas não confunde suas definições. Os quartis seguem a fórmula `QUARTIL.INC`
do Excel (outros métodos podem arredondar/diferir).

### Digitação no padrão brasileiro

- `1.250` significa **mil duzentos e cinquenta**.
- `1,25` significa **um inteiro e vinte e cinco centésimos**.
- `1.250,50` significa **mil duzentos e cinquenta e cinquenta centavos**.
- Ao colar uma coluna, use **um valor por linha** ou o separador `;`.
  O ponto e vírgula evita confundir separação com a vírgula decimal.

### Se der defeito na apresentação

1. **Número errado:** procure a seção com o nome da fórmula em `calculos.py`.
2. **Campo errado:** procure o identificador no início de `web/app.js` (`MODULOS`).
3. **Tabela/gráfico não aparecem:** procure `mostrarAnaliseVisual` no JS e
   `estatistica_descritiva`, `frequencia` ou `boxplot` no Python.
4. **API parou:** execute `python app.py` e tente `/api/saude`.
5. **Depois de alterar:** execute `python -m pytest -q` antes de publicar.
6. **Cloudflare:** rode `python cloudflare/gerar_assets.py` para copiar o
   Python atualizado e o visual. Um commit no GitHub sozinho não atualiza
   automaticamente a Cloudflare.

**Limites metodológicos:** este projeto reproduz as fórmulas das aulas e
oferece estimativas, não uma conclusão causal nem um teste formal de hipótese.
Para intervalos com σ desconhecido e n pequeno, pode ser necessário t de Student.
Respostas sobre representatividade temporal, aceitação comercial ou decisão
de engenharia exigem interpretação humana além do intervalo numérico.

---

## 1. O que aparece na tela

A **calculadora fixa à esquerda** possui visor, teclas numéricas e seis funções estatísticas. As duas primeiras são **Intervalo de confiança — Média** e **Intervalo de confiança — Proporção**. Na parte direita ficam o **Fluxo do cálculo** e a área **Dados e enunciado**.

Os cálculos preparatórios (média, desvio, variância, proporção e erro-padrão) ficam recolhidos no grupo **Cálculos auxiliares** para não sobrecarregar a tela.

Ao clicar numa função, surgem os campos que ela precisa. O resultado aparece no visor e na última linha da tabela. A opção **Ver resolução passo a passo** mostra a conta detalhada quando necessário.

**Explicações escondidas:** clique com o botão **direito** sobre uma função. No celular, mantenha o dedo pressionado. O painel da esquerda explica o conceito, a fórmula e os símbolos sem mudar a posição da calculadora.

---

## 1.1. Dados descobertos automaticamente (versão 7)

**Nem todo número de uma questão precisa ser digitado.** Por exemplo, se a professora disser que **40 entre 100** pessoas preferem um produto, o aluno informa apenas o total e a quantidade que prefere. O programa apresenta, **sem botão extra e sem permitir edição**, os dados que consegue deduzir:

| Dado automaticamente calculado | Resultado |
| --- | --- |
| Sucesso / com a característica | 40% |
| Fracasso / sem a característica | 60% |
| Quantidade sem a característica | 60 |
| Valor crítico z | De acordo com o grau de confiança escolhido |
| Erro-padrão da proporção | Calculado a partir de p, (1 − p) e n |

Se houver **250 ocorrências em 1.000**, aparecem **25% com a característica e 75% sem ela**, e a contagem complementar é 750.

**Atenção:** quando a entrada for apenas *porcentagem + total* e a multiplicação não der uma contagem inteira, a calculadora **não inventa meia pessoa**. Por exemplo, 25% de 250 equivaleriam a 62,5 pessoas; nesse caso, ela mostra os dois percentuais e deixa de mostrar as contagens não dedutíveis como inteiros.

A mesma lógica oferece outros dados úteis, conforme a fórmula escolhida:

- **Intervalo da média:** valor crítico Z, erro-padrão e, se houver lista, a média, o desvio e n calculados.
- **Intervalo da proporção:** proporção, complemento, contagem complementar (quando possível), Z e erro-padrão.
- **Média amostral:** quantidade de valores e soma.
- **Desvio-padrão e variância:** média e medida complementar já calculadas, sem exigir contas separadas.
- **Correlação e regressão:** quantidade de pares, médias de X e Y e, na regressão, R².
- **Escore Z:** diferença entre o valor observado e a média.
- **Tamanho da amostra:** dados estimados disponíveis e valor crítico Z. Proporção prevista não é a mesma coisa que proporção observada.

Os valores derivados aparecem numa área verde **"Calculado automaticamente — somente leitura"**, abaixo das entradas azuis. São elementos HTML de saída (`<output>`), não campos de digitação. Quando o aluno muda um número, o sistema elimina o resultado anterior e consulta o Python novamente. Se o dado ainda estiver incompleto, não inventa uma resposta.

### Onde corrigir o comportamento

- **O percentual está errado?** Procure `indicadores_automaticos` e `_percentuais_complementares` no arquivo `calculos.py`. É ali que a conta é feita.
- **O valor está certo, mas a linha não aparece?** Procure `linhasQueFazemSentido` em `web/app.js`. Essa função define quais números derivados cada módulo pode exibir.
- **O valor está desatualizado enquanto digita?** Confira `pedirIndicadoresAutomaticos` no `web/app.js`. Ela faz uma chamada curta à API Python depois de uma pequena pausa e ignora respostas antigas.
- **As cores das células estão ruins?** Procure `.painel-derivados`, `.linha-derivada` e `.celula-derivada` em `web/styles.css`. No celular, os tamanhos ficam no `web/mobile.css`.
- **O fluxograma está sem explicação?** Confira `EXPLICACOES_FLUXO` e `animarEtapasConcluidas` em `web/app.js`. São apenas frases e animações: as fórmulas não ficam no JavaScript.

O fluxo do cálculo explica cada etapa com uma frase curta, iluminando os nós da esquerda para a direita após a resposta. Pessoas que preferem movimento reduzido veem todas as etapas sem animação.

---

## 2. Duas maneiras de fornecer informações

Várias fórmulas têm uma linha **Forma de entrada** com duas opções:

| Opção | Quando escolher | O que o programa faz |
| --- | --- | --- |
| **Dados informados** | A professora já disse os resultados estatísticos necessários | Você digita esses números; o Python os utiliza diretamente. |
| **Lista de valores** | A professora informou a sequência de observações ou você copiou células do Excel | Você cola a lista; o Python descobre automaticamente o tamanho, a média, o desvio ou a proporção, conforme a fórmula. |

**Não é necessário calcular a média e o desvio antes de abrir o intervalo de confiança.** Na entrada por lista, o próprio intervalo faz essas contas, mostra os valores obtidos nas linhas azuis/verdes e continua com a margem de erro e os dois limites.

Isso se aplica ao intervalo da média, intervalo da proporção, escore Z, tamanho da amostra e erro-padrão. A proporção auxiliar também aceita duas maneiras de entrada.

### Como colar uma coluna do Excel

Para números contínuos, digite `2; 4; 6; 8`, ou cole um valor por linha. Você também pode colar células copiadas do Excel (separadas por tabulação). Use **vírgula para casas decimais** e **ponto e vírgula para separar números**.

Para uma **proporção**, a lista representa a presença ou ausência de uma característica. Informe **`1` / `0`** ou **`sim` / `não`** para cada observação. Por exemplo, `sim; não; sim; não` representa duas respostas positivas em quatro observações. **Não use uma lista de alturas, notas ou tempos como lista de proporções.**

### Amostral ou populacional?

Quando o programa calcula o desvio a partir de uma lista, você pode escolher:

- **Amostral (`n − 1`)**: equivalente ao `DESVPAD.A` do Excel. Para esse caso são necessários pelo menos **dois números**.
- **Populacional (`n`)**: equivalente ao `DESVPAD.P` do Excel, quando a lista representa a população inteira.

O programa calcula a **média** e a **quantidade n** automaticamente em ambos os casos.

Se o enunciado já trouxer o desvio pronto, **não é necessário selecionar esse tipo**: escolha *Dados informados* e digite diretamente o número.

---

## 3. Onde está o intervalo de confiança?

Na **primeira linha dos botões principais**, à esquerda, existem duas teclas com o nome completo **Intervalo de confiança** e a indicação **Média** ou **Proporção**.

### Intervalo de confiança da média

Você pode preencher de duas formas:

**Dados informados:** Média → Desvio-padrão → Tamanho (n) → Alfa (α).

**Lista de valores:** Valores da amostra → Tipo de desvio → Alfa (α). Após calcular, surgirão as linhas **Média calculada**, **Desvio calculado**, **Quantidade**, **Margem de erro** e **Intervalo de confiança**.

A fórmula usada nos slides é:

```text
Margem de erro = z × desvio-padrão / raiz(n)
Limite inferior = média − margem
Limite superior = média + margem
```

O **`INT.CONFIANÇA` do Excel fornece a margem**, e não sozinho os dois limites. A tela mostra os dois resultados para ficar igual à resolução em aula.

Na foto da aula, com média `159`, desvio `12,42`, confiança `95%` (α = `0,05`) e n = `10`, o resultado é **margem 7,70** e **intervalo aproximadamente 151,30 a 166,70**.

**Limitação de método:** os slides de intervalo da média usam o valor crítico Z e explicam que o desvio amostral pode substituir o populacional quando `n > 30`. Se `n` for pequeno e só houver desvio amostral, pode ser necessário usar **t de Student**. O programa não afirma que Z serve para qualquer amostra: mostra um aviso quando isso exige atenção.

### Intervalo de confiança da proporção

**Dados informados:** informe o tamanho total `n`, escolha **Quantidade** ou **Porcentagem**, digite o dado disponível e selecione Alfa.

**Lista de valores:** cole as respostas individuais em `1/0` ou `sim/não` e selecione Alfa. O programa conta automaticamente positivos e total, obtém a proporção e calcula a margem e o intervalo.

A fórmula Z usada nos slides é:

```text
p = quantidade com característica / total
Margem = z × raiz[p × (1 − p) / n]
Intervalo = (p − margem ; p + margem)
```

A apresentação exibe o resultado em porcentagens e também identifica casos nos quais a aproximação normal pode ser inadequada.

---

## 4. O que cada função pede

| Função | Dados informados | Lista de observações |
| --- | --- | --- |
| **Correlação de Pearson** | — | Duas listas pareadas: X e Y. |
| **Regressão linear simples** | — | Listas X/Y; novo X para previsão é opcional. |
| **Intervalo da média** | Média, desvio, tamanho e alfa. | Números individuais, tipo de desvio e alfa. |
| **Intervalo da proporção** | Total, contagem ou porcentagem, alfa. | Respostas 1/0 ou sim/não; alfa. |
| **Escore Z** | Valor observado, média e desvio. | Valor observado e lista de números; tipo de desvio. |
| **Tamanho da amostra** | Tipo (média/proporção), desvio ou proporção prevista, margem e confiança. | Lista de uma **lista de valores da amostra**, margem e confiança. |
| **Média amostral** | — | Apenas a lista de números. |
| **Desvio-padrão** | — | Lista de números e tipo amostral/populacional. |
| **Variância** | — | Lista de números e tipo amostral/populacional. |
| **Proporção amostral** | Quantidade com característica e total. | Respostas 1/0 ou sim/não. |
| **Erro-padrão** | Tipo, desvio/porcentagem e tamanho. | Lista numérica (média) ou binária (proporção). |

A função **Tamanho da amostra** sempre **arredonda para cima**. Quando a questão de proporção não traz uma estimativa prévia e você está no modo informado, pode deixar a proporção em branco; o programa usa 50%, valor conservador. Uma **lista de valores** serve para estimar a variabilidade, não representa o tamanho final calculado.

### Alfa e grau de confiança

A professora usa `α` (alfa) e o grau de confiança. No seletor:

| Confiança | Alfa | Valor crítico Z (conforme a tabela da aula) |
| --- | --- | --- |
| 90% | 0,10 | 1,645 |
| 95% | 0,05 | 1,960 |
| 99% | 0,01 | 2,575 |

A tela mostra alfa e confiança juntos. O Python recebe a confiança e encontra o valor crítico correspondente no `calculos.py`.

---

## 5. Como abrir no computador (funciona sem internet)

1. Instale o **Python 3.10 ou mais recente** no Windows.
2. Extraia o ZIP completo da calculadora ou baixe o repositório.
3. Abra a pasta que contém `app.py`.
4. Execute `iniciar_windows.bat` com dois cliques ou abra o terminal e digite:

```bash
python app.py
```

5. Se o navegador não abrir, acesse `http://127.0.0.1:8765`.
6. **Deixe o terminal aberto durante a apresentação.** Para encerrar, pressione `Ctrl+C`.

No Windows, quando só o comando `py` funciona, use `py app.py`.

Se a porta 8765 já estiver em uso, execute `python app.py --porta 8790` e abra `http://127.0.0.1:8790`.

Para permitir que um celular na **mesma rede Wi-Fi** do PC acesse a versão local, use `python app.py --rede`. Esse modo deixa o servidor acessível na rede local: use somente em rede confiável.

**A versão offline roda o mesmo `calculos.py` usado pela publicação na Cloudflare.** Não precisa se conectar à internet para calcular.

---

## 6. Estrutura do código: qual arquivo abrir para cada problema?

```text
Calculadora-Estatistica/
├── README.md                 ← Você está aqui: manual de manutenção.
├── app.py                    ← Inicia o servidor Python no seu PC.
├── calculos.py               ← TODAS as contas estatísticas e validações.
├── iniciar_windows.bat       ← Atalho para abrir no Windows.
├── tests/
│   ├── test_calculos.py      ← Exercícios originais, erros e servidor local.
│   └── test_duas_entradas.py ← Confere os modos direto/lista.
├── web/
│   ├── index.html            ← Posição da calculadora e dos botões.
│   ├── app.js                ← Seleção, campos, fluxo, comunicação com Python.
│   ├── styles.css            ← Cores e tamanhos para o PC.
│   └── mobile.css            ← Ajustes de layout do celular.
└── cloudflare/
    ├── worker.py             ← Servidor Python da versão na nuvem.
    ├── gerar_assets.py       ← Gera cópias para a Cloudflare.
    └── LEIA-ME.md            ← Instruções próprias de publicação.
```

Os arquivos `cloudflare/calculos.py` e `cloudflare/web_assets.py` são **gerados automaticamente**. Não tente corrigir fórmulas neles: corrija em `calculos.py` e gere novamente.

### 6.1. `calculos.py`: local mais importante

Contém as funções com o mesmo nome do conteúdo da aula. Na ordem geral:

1. **Ler valores:** `numero` transforma `1,5` em número; `lista_numeros` separa itens; `inteiro` e `positivo` impedem valores inválidos.
2. **Escolher confiança:** `z_critico` consulta a tabela 90/95/99.
3. **Padronizar resultados:** `texto_num` coloca vírgula decimal; `saida` cria um conjunto de dados para a interface.
4. **Cálculos com pares:** `somas_pares`, `correlacao` e `regressao` calculam as relações entre X e Y.
5. **Modos direto/lista:** `modo_entrada`, `resumo_de_valores`, `media_desvio_da_questao`, `eventos_binarios`, `proporcao_da_questao` e `resumo_mostrado` preparam os números sem duplicar fórmulas.
6. **Intervalos e estatística:** `ic_media`, `ic_proporcao`, `escore`, `tamanho_amostra`, funções auxiliares e `erro_padrao`.
7. **Teclado básico:** `basica` resolve adição, subtração, multiplicação, divisão e porcentagem.
8. **Seleção final:** `FORMULAS` liga cada nome interno à função matemática. `calcular` recebe a escolha e executa essa função.

**Se der resultado errado**, identifique a fórmula, procure `def ic_media(` ou a outra função correspondente, leia os comentários da seção e compare os dados e o divisor. Corrija em **um só lugar**.

**Exemplo de ordem de execução:** clicar Intervalo da média → JavaScript envia `{formula: 'ic_media', entrada: 'lista', valores: '...', confianca: '95'}` → Python calcula média/desvio/n → Python calcula margem e limites → Python devolve `valores_calculados` com os números de cada linha → tela apresenta o resultado.

### 6.2. `web/app.js`: os botões e a planilha visual

O JavaScript **não contém cálculos estatísticos**. Procure os seguintes blocos comentados:

- `MODULOS`: nome completo, explicação, lista de campos e sequência do fluxo de cada fórmula.
- `selecionarFormula`: muda a fórmula selecionada, limpa os resultados anteriores.
- `construirCampos`: transforma os campos definidos em `MODULOS` em linhas azuis de formulário.
- `construirLinhasResultado`: cria as células de saída, inclusive médias e desvios calculados automaticamente.
- `exibirCamposCorretos`: mostra só os campos que combinam com **entrada direto/lista** e **tipo média/proporção**.
- `lerCampos`: recolhe os valores visíveis para enviar ao Python.
- `camposObrigatoriosPreenchidos`: não deixa calcular sem as informações essenciais.
- `pedirAoPython`: usa HTTP para enviar o formulário à rota `/api/calcular`.
- `calcularFormula`: recebe a resposta; evita que respostas antigas sobrescrevam dados já alterados.
- `mostrarLinhasResultado`: preenche as células usando `valores_calculados` vindos do Python.
- `resumoNoFluxo` e `desenharFluxo`: colocam os dados nos nós e destacam o andamento em verde.
- `abrirAjuda` e `fecharAjuda`: controlam a explicação do botão direito.
- `tecladoBasico` e `inserirNoCampo`: controlam as teclas visuais e o campo selecionado.
- `iniciarBotoes`: conecta os eventos de clique e teclado físico às funções.

**Quer mudar o nome de um campo?** Altere o `titulo` dentro de `MODULOS`, sem renomear seu `id` sem atualizar também o Python.

**Quer que um campo só apareça em "lista"?** Use a propriedade `entrada: 'lista'` em sua definição; para média ou proporção, use também `mostrar: 'media'` ou `mostrar: 'proporcao'`.

**Quer mudar a cor do título?** Abra `styles.css`, não `calculos.py`.

### 6.3. `web/index.html`: a posição das teclas

É o desenho estático da página. Os dois botões de intervalo de confiança foram colocados **na primeira linha** para serem encontrados rapidamente. Os botões usam `data-formula="ic_media"`, `data-formula="ic_proporcao"` etc.; esse nome deve corresponder ao identificador de `MODULOS` e de `FORMULAS`.

### 6.4. `app.py`: o servidor local

A classe `Atendente` entrega a página e recebe as requisições de cálculo. As rotas principais são:

- `/` → carrega a página.
- `/api/saude` → informa se o Python está ativo.
- `/api/calcular` → recebe dados, chama `calcular` e devolve a resposta.

Se a página abrir mas não calcular, veja no terminal se `app.py` ainda está ligado e se o navegador está no endereço correto.

### 6.5. `cloudflare/worker.py`: a mesma conta publicada na internet

Na nuvem, o Worker substitui o pequeno servidor HTTP local. Importa o mesmo `calculos.py`. O gerador copia os arquivos visuais para que a Cloudflare possa servi-los. Não há duas versões das fórmulas.

---

## 7. O que fazer se alguma coisa falhar durante a apresentação

| Problema | Onde procurar | Solução inicial |
| --- | --- | --- |
| O botão não muda os campos | `web/app.js` | Procure `selecionarFormula`, a propriedade `data-formula` e a definição em `MODULOS`. |
| O modo lista mostra campos do modo direto | `web/app.js` | Procure `exibirCamposCorretos` e a propriedade `entrada` do campo. |
| O desvio não bate com o Excel | `calculos.py` | Confira se usou **amostral (n−1)** ou **populacional (n)** e se os dados da lista estão corretos. |
| O intervalo está estranho | `calculos.py` | Confira `ic_media` ou `ic_proporcao`, a confiança, a unidade do erro e o tamanho. |
| O fluxograma mostra etapa errada | `web/app.js` | Procure `resumoNoFluxo`, que organiza os números recebidos do Python. |
| O navegador mostra erro de conexão | `app.py` | Reinicie com `python app.py`; confirme a porta no terminal. |
| A página parece antiga depois de atualizar online | Navegador | Atualize a página sem cache (`Ctrl + F5`). |
| A versão do celular corta botões | `web/mobile.css` | Ajuste só tamanhos e espaços do layout responsivo. |
| Digitou um número e aparece erro de validação | `calculos.py` | Veja `numero`, `inteiro`, `lista_numeros`, `eventos_binarios`. |

Para reduzir riscos, **nunca altere duas fórmulas ao mesmo tempo sem testar**. Se houver dúvida, restaure o arquivo da versão anterior do GitHub.

---

## 8. Executar a bateria de testes

Abra o terminal na raiz do projeto e rode:

```bash
python -m unittest discover -s tests -v
```

Os testes cobrem exercícios dos slides, entradas inválidas, respostas do servidor e equivalência entre modo direto e modo lista. Também são conferidos, no navegador, os campos condicionais, o visor, o fluxograma, o painel de explicações e a disposição no celular.

Na revisão da versão 6, **85 testes automáticos Python** e testes de interface em resoluções de computador e celular passaram. Isso reduz os riscos, mas não é garantia matemática de que toda possível entrada será válida.

---

## 9. Notas sobre os materiais da aula

A organização dos dois intervalos, a escolha de alfa e os valores críticos Z foram conferidos com as apresentações **Intervalo de confiança — Média**, **Intervalo de confiança — Proporção** e **Tamanho da amostra**. Correlação, regressão e escore seguem os conteúdos correspondentes. O programa oferece recursos auxiliares e dois modos de entrada para facilitar a digitação durante a apresentação, mas **não substitui a escolha do método estatístico exigido no enunciado**.

A apresentação oral é mais simples se a sequência for: **identificar o objetivo → escolher a função → escolher como o enunciado forneceu os dados → calcular → explicar o resultado**.


## Margem informada e estimativa da população — versão 8

### Para que servem os campos novos?

- **Margem de erro informada** (opcional): preencha quando a questão já trouxer E. Em intervalos de média, E usa a unidade da média. Em intervalos de proporção, E usa **pontos percentuais** (8 significa 8 p.p., ou 0,08 em decimal). Quando o campo fica vazio, a calculadora obtém E pela fórmula normal.
- **Tamanho da população (N)** (opcional nos intervalos e tamanho da amostra): informe apenas se a questão mencionar o total de pessoas/itens da população. N é diferente de **n**, que é o tamanho da amostra.
- **Estimar população**, dentro de Cálculos auxiliares: informe uma amostra (por quantidade, percentual ou lista) e o total populacional N. O aplicativo estima quantos indivíduos da população podem ter a característica e apresenta uma faixa aproximada. É sempre uma estimativa amostral; não é o total real contado.

### Diferenças matemáticas importantes

1. Na proporção, use `p = sucessos / n` e `q = 1 - p`. A margem do enunciado é expressa em p.p. (pontos percentuais), não em número de indivíduos.
2. No intervalo da proporção, `IC = p ± E`. Se N é conhecido, a estimativa de casos é `N × p` e os limites projetados são `N × (p ± E)`. A projeção de pessoas não é contagem exata. Os limites de contagem ficam no intervalo possível de zero até N.
3. Ao calcular E pela fórmula, se N é conhecido e a amostragem foi **aleatória simples sem reposição**, aplica-se a **correção de população finita** `√[(N−n)/(N−1)]`. Se N não foi informado, o fator é 1 (o resultado clássico do Excel). **Se E foi informada, ela não é corrigida de novo.**
4. Para tamanho da amostra, `n0` é o cálculo habitual sem correção. Com N conhecido, o tamanho corrigido é `n = N × n0 / (N + n0 − 1)`, sempre arredondado para cima e no máximo N.
5. **Não é possível deduzir o número de pessoas que existem numa população usando apenas a margem de erro.** A calculadora exige N quando o objetivo for projetar a quantidade de casos na população.

### Se algo der errado no código

- **Conta da margem ou correção de população**: abra `calculos.py` e procure `margem_fornecida`, `fator_populacao_finita`, `ic_media`, `ic_proporcao` ou `tamanho_amostra`.
- **Estimar o número de casos**: procure `projecao_de_casos` e `estimativa_populacao`.
- **Um campo desapareceu ou está errado**: abra `web/app.js`, procure `MODULOS` e a lista `campos` da fórmula correspondente.
- **Layout da tela**: abra `web/styles.css` ou `web/mobile.css` (celular).
- **Hospedagem**: `cloudflare/worker.py` só atende requisições. Não deve conter fórmulas.



## Termos dos slides — tamanho da amostra

Os campos de **Tamanho da amostra** seguem a terminologia de
`Tamanho da Amostra_AMS.pdf` da professora:

- **Estimativa da Média (μ):** desvio-padrão populacional (σ),
  erro amostral máximo aceito (Em) e grau de confiança.
- **Estimativa da Proporção (p):** proporção estimada (p),
  margem de erro da proporção (Ep) e grau de confiança.
- **Valores informados:** para quando o exercício já fornece σ ou p.
- **Lista de valores:** opção adicional para quando há observações brutas.
  O Python estima o desvio-padrão amostral, sem solicitar um campo extra.
- **Comparar 90%, 95% e 99%:** opção para o exercício de comparação.

O nome "valores piloto" não é usado na interface. Se o desvio é
obtido a partir de uma lista, esse valor não é necessariamente o desvio
populacional conhecido do enunciado. O resultado n é arredondado para cima.
