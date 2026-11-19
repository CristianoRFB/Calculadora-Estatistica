# Calculadora de Estatística Aplicada

Calculadora feita para apresentar os conteúdos de Estatística Aplicada da professora Andrea P. Silva. O objetivo é conseguir ouvir um enunciado, descobrir qual conta a questão pede, informar os dados, calcular e explicar a sequência de operações.

Este projeto foi escrito para que **uma pessoa iniciante em programação consiga abrir o código durante a apresentação e encontrar rapidamente o trecho que precisa corrigir**. Não usamos frameworks de interface, banco de dados, login nem bibliotecas matemáticas externas.

> **Regra principal:** os cálculos estatísticos ficam em `calculos.py`. O JavaScript apenas controla as teclas, os campos e a exibição. A versão para celular usa o mesmo Python da versão do computador.

## 1. O que existe no programa

A calculadora segue a organização visual da calculadora científica do Windows: visor, teclas numéricas, operações básicas e uma faixa de teclas estatísticas. A calculadora fica imóvel na coluna esquerda; a coluna direita mostra os campos e o fluxograma do procedimento.

Há **seis botões principais de estatística**, com mais cinco fórmulas auxiliares recolhidas logo abaixo:

| Botão | Conta | Pergunta que ajuda a responder |
| --- | --- | --- |
| `Correlação` | Correlação de Pearson | Existe uma relação linear? Qual a direção e a força? |
| `Regressão` | Regressão linear simples | Qual é a equação da reta? Qual Y seria previsto? |
| `Intervalo da média` | Intervalo de confiança para a média | Entre quais limites deve ficar a média populacional? |
| `Intervalo da proporção` | Intervalo de confiança para a proporção | Entre quais porcentagens deve ficar uma taxa populacional? |
| `Escore` | Escore Z | Quantos desvios-padrão um valor está da média? |
| `Tamanho da amostra` | Tamanho de amostra | Quantas observações serão necessárias? |

Também há as operações básicas `+`, `−`, `×`, `÷` e `%`.

### Cálculos auxiliares (novos)

Quando o exercício informa **os valores brutos da amostra** em vez da média ou do desvio-padrão já prontos, abra **Cálculos auxiliares** na calculadora. Esse grupo fica recolhido para a tela principal continuar limpa.

| Botão auxiliar | Para que serve | Fórmula |
| --- | --- | --- |
| Média amostral | Encontrar a média dos valores | `x̄ = Σx / n` |
| Desvio-padrão | Verificar quanto os dados variam em torno da média | `s = √[Σ(x−x̄)²/(n−1)]` (amostral) ou `σ = √[Σ(x−μ)²/N]` (populacional) |
| Variância | Calcular a dispersão antes de tirar a raiz | `s² = Σ(x−x̄)²/(n−1)` ou `σ² = Σ(x−μ)²/N` |
| Proporção | Transformar uma contagem em taxa (%) | `p̂ = quantidade com a característica / total` |
| Erro-padrão | Obter uma etapa da margem de erro | Média: `EP = s / √n`; proporção: `EP = √[p̂(1−p̂)/n]` |

**Amostra e população não são a mesma coisa:** a variância amostral divide por `n − 1`. A populacional divide por `N`. A tela pergunta qual dos dois é o caso antes de calcular. Para usar desvio-padrão *amostral*, informe pelo menos duas observações.

**Como digitar:** valores como `2; 4; 6; 8` usam o ponto e vírgula para separar; valores decimais como `1,5` usam vírgula decimal. Também é possível colar um valor por linha. Essas regras são as mesmas para PC e celular.

**Como chegar ao intervalo de confiança da média:** primeiro calcule a média amostral e o desvio-padrão quando o enunciado entregar somente uma lista de observações. Anote `x̄`, `s` e `n`; depois entre em **Intervalo da média** e informe esses números, junto do grau de confiança. Os slides da professora usam a fórmula Z e permitem usar `s` no lugar de `σ` com `n > 30`; para amostras pequenas e desvio populacional desconhecido pode ser necessário aplicar a distribuição t, que não foi acrescentada à calculadora.

**O que é da aula e o que é complemento:** o material da aula apresenta média amostral, desvio-padrão e proporção como informações para estimativas e intervalos. Os cinco botões auxiliares acrescentam a etapa de calcular essas informações quando apenas os valores brutos estão disponíveis. As contas seguem as definições estatísticas usuais, mantendo o fluxo ensinado para os intervalos.


**Não há exercícios pré-preenchidos, cartões de exemplos nem dados de demonstração na tela.** É preciso informar os números do enunciado que for apresentado.

## 2. Como abrir no computador

É necessário ter **Python 3.10 ou mais recente** instalado. Não é necessário instalar pacotes do `pip`.

1. Baixe o repositório ou seu ZIP do GitHub e extraia os arquivos.
2. Abra a pasta `Calculadora-Estatistica`.
3. No Windows, dê dois cliques em `iniciar_windows.bat`, ou abra um terminal na pasta.
4. No terminal, execute:

   ```bash
   python app.py
   ```

5. A calculadora será aberta no navegador padrão. Se ela não abrir automaticamente, acesse `http://127.0.0.1:8765`.
6. Mantenha o terminal aberto. Pressione `Ctrl+C` quando terminar.

Se o Windows reconhecer apenas o comando `py`, utilize `py app.py`.

### Se a internet da sala falhar

A versão local **não precisa de internet**. Mantenha o Python instalado e a pasta do projeto no computador para executar o programa mesmo sem Wi-Fi.

### Se a porta já estiver ocupada

Use:

```bash
python app.py --porta 8790
```

Depois abra `http://127.0.0.1:8790`.

### Para ver apenas as mensagens do terminal

```bash
python app.py --sem-abrir
```

## 3. Como usar durante a apresentação

1. **Ouça o objetivo** da pergunta: força de relação, prever valor, estimar intervalo, padronizar valor ou definir quantidade de observações.
2. **Clique na tecla da fórmula** correspondente, à esquerda. O botão selecionado fica destacado.
3. **Leia os campos**, à direita. Só aparecem as informações necessárias à fórmula selecionada.
4. **Informe os valores** do enunciado. Aceitamos vírgula decimal, como `1,75`.
5. **Clique em Calcular** (ou na tecla `=` do teclado da calculadora).
6. **Leia o visor e o fluxo**, na direita superior. Os nós verdes indicam o procedimento realizado.
7. **Consulte a resolução completa** abaixo do formulário, com os passos que vieram do Python.

Clique novamente na mesma tecla de fórmula para retornar às operações básicas.

### Botão direito = explicação

Clique **com o botão direito do mouse** em qualquer tecla estatística. Uma gaveta será aberta à esquerda com:

- O que é a conta e para que ela serve.
- Como reconhecer a solicitação nas palavras do enunciado.
- Quais dados precisam ser digitados.
- A fórmula escrita e a explicação dos símbolos.
- Um cuidado importante para não aplicar a fórmula incorretamente.

O botão **`? Entenda`** também abre a gaveta da fórmula selecionada. Para fechar, clique no `×`, fora da gaveta ou pressione `Esc`.

**A calculadora não é desmontada nem deslocada quando a explicação é aberta.** O painel simplesmente aparece por cima, e pode ser fechado a qualquer momento.

### Teclado físico e teclado desenhado na tela

- Os números e as operações podem ser digitados pelo teclado físico ou pelas teclas visuais.
- Para usar as teclas visuais dentro de um campo estatístico, **clique primeiro no campo** à direita.
- `C` limpa o número ou o campo selecionado; `⌫` apaga um dígito; `±` troca o sinal.
- A tecla `=` calcula a fórmula selecionada. Sem uma fórmula selecionada, ela conclui a operação básica.
- Para listas de X e Y, use `;` entre valores ou escreva um número por linha. A vírgula é reservada para a parte decimal.
- A regressão também aceita um **novo X opcional**. Se o campo ficar vazio, a calculadora apresenta só a equação.

## 4. Como funciona o fluxograma

O gráfico na parte superior direita foi inspirado no sistema de blocos do Node-RED. Cada fórmula tem **cinco etapas nomeadas**.

- **Cinza:** etapa ainda não concluída.
- **Verde aceso e com brilho:** etapa atual.
- **Verde discreto:** etapa já concluída.
- **Vermelho:** algum dado precisa ser corrigido.

Antes do cálculo, o fluxo acompanha o preenchimento. Depois do cálculo, apresenta valores intermediários enviados pelo Python. O resultado completo também fica em um painel separado abaixo dos dados.

**Caso o fluxograma mostre uma etapa no lugar errado:** abra `web/app.js` e procure `desenharFluxo`. O dicionário `indicesPassos` determina quais linhas da resolução ficam em cada nó.

## 5. Entenda os arquivos sem precisar decorar o projeto

```text
Calculadora-Estatistica/
│
├── app.py                 # Liga o servidor no PC. Não contém fórmulas.
├── calculos.py            # TODAS as contas, regras e mensagens de erro.
├── iniciar_windows.bat    # Abre o programa no Windows com dois cliques.
├── README.md              # Este guia.
│
├── web/
│   ├── index.html         # Estrutura fixa: visor, teclas, painel e gaveta.
│   ├── app.js             # Liga botões, cria campos, chama Python e desenha fluxo.
│   ├── styles.css         # Cores e medidas da aparência para computador.
│   └── mobile.css         # Ajustes EXCLUSIVOS para telas pequenas.
│
├── tests/
│   └── test_calculos.py   # Confere se as fórmulas continuam corretas.
│
└── cloudflare/
    ├── worker.py          # Substitui o servidor local quando está na nuvem.
    ├── gerar_assets.py    # Junta os arquivos necessários para publicar.
    └── LEIA-ME.md         # Instruções para a versão Cloudflare.
```

### `calculos.py` — a parte que resolve as questões

Esse é o primeiro arquivo a abrir se um resultado matemático estiver errado. Ele começa verificando os dados: transforma `1,75` em número, confere se `n` é inteiro, confere se o desvio-padrão é permitido etc.

Depois vêm seções grandes identificadas pelo nome da fórmula. Cada função pega um dicionário com valores e devolve um dicionário de resposta:

- `titulo`: nome da operação.
- `resultado`: texto que vai para o visor.
- `formula`: fórmula escrita para conferência.
- `passos`: lista das contas intermediárias, na sequência correta.
- `explicacao`: interpretação em português.
- `detalhes` e `aviso`: informações adicionais, quando necessárias.

**Para corrigir uma fórmula:** procure a seção `FUNCIONAMENTO REFERENTE À FÓRMULA DE...` e leia os comentários que antecedem os cálculos. Faça a menor alteração necessária e rode os testes antes de apresentar.

### `app.py` — a ponte com o navegador

Ao executar `python app.py`, esse arquivo cria um servidor HTTP na porta 8765. Quando o navegador pede `/`, ele entrega `web/index.html`. Quando pede `/api/calcular`, ele recebe os números e chama `calcular()` em `calculos.py`.

Ele não possui nenhuma cópia das fórmulas. Se o navegador abrir mas não calcular, verifique se esse servidor continua rodando.

### `web/index.html` — a posição de cada parte da tela

Contém a barra superior, o visor, os seis botões estatísticos, o teclado numérico, a área do fluxograma e o painel de ajuda. **Para mover um botão, altere o HTML ou o CSS, não o Python.**

### `web/app.js` — o funcionamento dos botões

As seções do arquivo seguem a ordem das ações do usuário:

1. `MODULOS`: nomes, dicas, símbolos e campos de cada fórmula.
2. Variáveis de estado: qual fórmula está aberta e qual campo foi selecionado.
3. `selecionarFormula`: destaca o botão e atualiza a área da direita.
4. `construirCampos`: cria os campos da fórmula selecionada.
5. `pedirAoPython` e `calcularFormula`: fazem a requisição HTTP.
6. `desenharFluxo`: pinta os nós da sequência de cálculo.
7. `abrirAjuda` e `fecharAjuda`: controlam a gaveta da esquerda.
8. `tecladoBasico` e `inserirNoCampo`: controlam as teclas.
9. `iniciarBotoes`: conecta os cliques e os atalhos.

**Esse arquivo NÃO implementa as fórmulas de estatística.** Modificar uma explicação ali não muda a conta.

### `web/styles.css` e `web/mobile.css`

Os dois arquivos tratam apenas de aparência. A versão para celular não possui cálculos próprios, justamente para impedir que existam resultados diferentes entre PC e telefone.

## 6. O que cada fórmula recebe

### Correlação de Pearson (`r`)

Precisa de duas listas de valores: `x` e `y`, com o mesmo número de elementos. Calcula médias, somas de desvios e o coeficiente `r`. Não é possível calcular o coeficiente se alguma variável não variar.

### Regressão simples (`ŷ`)

Precisa das listas `x` e `y`. Também pode receber `prever`, que é um novo X facultativo. A calculadora mostra a inclinação `a`, o intercepto `b`, a equação e, quando solicitada, uma previsão.

### Intervalo de confiança para a média (`IC μ`)

Recebe `media`, `desvio`, `n` e `confianca`. Calcula a margem de erro `E = z × desvio / √n` e os limites `média − E` e `média + E`.

### Intervalo de confiança para a proporção (`IC p`)

Recebe `n` e **uma** das duas formas de informar a proporção: `sucessos` (quantidade) ou `percentual` (porcentagem). O resultado aparece como intervalo de porcentagens.

### Escore Z (`z`)

Recebe `valor`, `media` e `desvio`. Calcula `z = (valor − media) / desvio`. Um desvio-padrão igual a zero não é permitido.

### Tamanho da amostra (`n`)

Recebe `tipo` (`media` ou `proporcao`), `confianca`, `erro` e o valor adicional exigido pelo tipo escolhido. O resultado é sempre arredondado para cima.

### Valores críticos usados na disciplina

| Confiança | Valor Z |
| --- | --- |
| 90% | 1,645 |
| 95% | 1,96 |
| 99% | 2,575 |

A tabela fica em um único lugar: função `z_critico()` dentro de `calculos.py`. Os slides usam valores arredondados, então pequenas diferenças podem ocorrer se outras calculadoras adotarem mais casas decimais.

**Atenção aos arredondamentos:** esta calculadora faz a conta com precisão interna e só arredonda na apresentação. Algumas soluções dos slides arredondam a margem de erro antes de calcular os limites, de modo que o último decimal pode ser diferente.

## 7. Como corrigir um defeito durante a apresentação

| O que aconteceu | Onde procurar | O que verificar |
| --- | --- | --- |
| O site não abre | `app.py` | Python instalado, porta 8765 e terminal aberto |
| O site abre, mas o cálculo não responde | `app.py` | Se `/api/calcular` está recebendo requisições |
| Resultado matemático incorreto | `calculos.py` | Função da fórmula correspondente |
| Um campo não aparece | `web/app.js` | Lista `campos` do módulo e `exibirCamposCorretos` |
| O botão seleciona a fórmula errada | `web/index.html` | Atributo `data-formula` do botão |
| O botão direito não abre a explicação | `web/app.js` | Funções `abrirAjuda` e `iniciarBotoes` |
| O fluxo brilha na etapa errada | `web/app.js` | Função `desenharFluxo` e `indicesPassos` |
| Um texto está errado | `web/app.js` | Campo `guia` ou `pista` do módulo |
| Uma cor ou tamanho está ruim no PC | `web/styles.css` | Variáveis no início do arquivo e classe correspondente |
| Algo não cabe na tela do celular | `web/mobile.css` | Regras dentro do `@media` |
| Cloudflare mostra página antiga | `cloudflare/gerar_assets.py` | Gere os arquivos novamente e publique o Worker |

### Como verificar se o servidor está respondendo

Com o Python rodando, abra `http://127.0.0.1:8765/api/saude`. Deve aparecer uma mensagem informando que o Python está funcionando.

### Como verificar as fórmulas depois de alterar o arquivo

Execute na pasta principal:

```bash
python -m unittest discover -s tests -v
```

Os testes usam apenas a biblioteca padrão do Python. Se aparecer `OK` no final, os casos testados passaram. Isso não é garantia absoluta para todas as entradas possíveis, mas reduz o risco de um erro passar despercebido.

## 8. Como usar no celular

**Opção A: pela internet.** Acesse o endereço do Worker publicado na Cloudflare. Ele executa as mesmas fórmulas Python que o PC.

**Opção B: na mesma rede do computador.** Abra o servidor local de modo que aceite outros aparelhos:

```bash
python app.py --rede
```

Descubra o IP local do PC e, no telefone conectado ao mesmo Wi-Fi, acesse `http://IP-DO-PC:8765`. O Firewall do Windows pode solicitar permissão. Use essa opção somente em uma rede confiável.

No celular, o grupo "Cálculos auxiliares" também começa recolhido e pode ser expandido ao tocar no título. Os blocos ficam empilhados, os campos ocupam toda a largura e a sequência do fluxo pode ser deslizada horizontalmente sem deslocar o restante da página. **Para abrir a explicação de uma tecla, mantenha-a pressionada**; as explicações podem ser consultadas pelo toque longo.

## 9. Versão Cloudflare: como os arquivos se relacionam

Na nuvem não executamos `app.py`, pois Cloudflare Workers fornece o próprio servidor. Usamos o adaptador Python `cloudflare/worker.py`.

A ferramenta `cloudflare/gerar_assets.py` prepara dois arquivos auxiliares:

- `cloudflare/calculos.py`: cópia automática do Python original (não edite essa cópia).
- `cloudflare/web_assets.py`: arquivos visuais convertidos em textos para o Worker servir as páginas.

Essa cópia serve apenas para a publicação. **A fonte original das fórmulas continua sendo o `calculos.py` na raiz.**

Leia `cloudflare/LEIA-ME.md` para instruções sobre como publicar e atualizar o Worker. Após mudar CSS, HTML, JS ou Python, gere novamente os arquivos auxiliares antes de publicar.

## 10. Regras de manutenção para evitar quebrar o programa

1. Não replique uma fórmula estatística em JavaScript. Use sempre o arquivo central de cálculos.
2. Não altere todos os arquivos de uma vez quando houver um defeito pequeno.
3. Não mude os identificadores como `ic_media` sem atualizar também a tecla no HTML.
4. Não confunda vírgula decimal com ponto e vírgula que separa números da lista.
5. Não arredonde os números antes de concluir os cálculos; deixe a formatação para o final.
6. Não remova a validação de divisão por zero, n inteiro ou listas de tamanhos diferentes.
7. Execute os testes e abra a tela no navegador depois de alterar código.
8. Guarde uma cópia local funcional para apresentar se o Wi-Fi cair.

## 11. Créditos e referências de ensino

Calculadora desenvolvida para prática dos tópicos ministrados em **Estatística Aplicada, Fatec**. Fórmulas e organização pedagógica baseadas nos materiais de aula: Correlação e Regressão Linear; Intervalo de Confiança da Média; Intervalo de Confiança da Proporção; Medida de Posição Relativa (Escore); e Tamanho da Amostra.

Projeto educacional, sem coleta de dados pessoais e sem dependências externas para o modo local.


## 12. Onde alterar as cinco fórmulas auxiliares

Todas estão em `calculos.py`, separadas pelos títulos `FÓRMULA DA MÉDIA`, `FÓRMULA DA VARIÂNCIA`, `FÓRMULA DA PROPORÇÃO AMOSTRAL` e `FÓRMULA DO ERRO-PADRÃO`.

- `dados_de_uma_amostra`: lê a lista e calcula média e soma dos desvios ao quadrado.
- `media_amostral`: soma os valores e divide por `n`.
- `medidas_de_dispersao`: concentra a lógica comum de variância e desvio-padrão, distinguindo amostral e populacional.
- `variancia` / `desvio_padrao`: selecionam qual das medidas mostrar.
- `proporcao_amostral`: divide a quantidade com a característica pelo total.
- `erro_padrao`: aplica a fórmula apropriada para média ou proporção.

Em `web/app.js`, procure `media_amostral`, `desvio_padrao`, `variancia`, `proporcao_amostral` e `erro_padrao` dentro da constante `MODULOS`: lá ficam os nomes dos campos, os textos de orientação e as etapas do fluxograma. Em `web/index.html` fica a área recolhível `id="auxiliares"`. Em `web/styles.css` ficam as regras de tamanho e cor.

**Para testar depois de corrigir uma fórmula:** `python -m unittest discover -s tests -v`. Os testes novos verificam também a diferença entre `n` e `n−1`, os valores decimais, as contagens e os limites das entradas.
