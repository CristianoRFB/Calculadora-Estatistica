# Roteiro de todos os 44 exercícios da professora

Este roteiro foi criado a partir de `todas_questoes_estatistica_pdfs_excel.txt` recebido no chat.
Não é um gabarito oficial: serve para encontrar a função correta e saber o que informar.
Os 44 IDs seguem a ordem dos PDFs/planilhas; a base **Tabela Slide.xlsx** não contém exercícios escritos.

## Antes de começar

1. Na calculadora, selecione o botão indicado na tabela.
2. Se a professora já forneceu média/desvio/n, mantenha **Dados informados**.
3. Se recebeu uma lista de observações, escolha **Lista de valores** e cole uma coluna do Excel.
4. A cor azul indica entrada; os valores automáticos aparecem como resultados somente leitura.
5. Em gráficos e tabelas, abra **Análise de dados e gráficos** na lateral esquerda.
6. Nos exercícios com valores de referência (por exemplo “no máximo 20%”), preencha também a referência e o critério.

## Índice de exercícios

| Questão | Tema do enunciado | Botão | Dados principais |
|---|---|---|---|
| A1 | TEMPO DE RESPOSTA DE UMA API (estimativa da média) | Tamanho da amostra | tipo=media, desvio=1250, margem E=100, confiança=95 |
| A2 | IMPACTO DO NÍVEL DE CONFIANÇA (exemplo/comparação) | Tamanho da amostra | tipo=media, desvio=1250, margem E=100, confiança=95, comparar graus=sim |
| A3 | PESQUISA ELEITORAL (estimativa da proporção) | Tamanho da amostra | tipo=proporcao, percentual=30, margem E=2, confiança=95 |
| A4 | TAXA DE FALHAS DE SOFTWARE (estimativa da proporção) | Tamanho da amostra | tipo=proporcao, percentual=15, margem E=3, confiança=95 |
| B1 | ALTURA DOS ESTUDANTES (exemplo) | Intervalo de confiança → Média | média=1,75, desvio=0,13, n=40, confiança=95 |
| B2 | ALTURA DOS ESTUDANTES, 90% (exemplo) | Intervalo de confiança → Média | média=1,75, desvio=0,13, n=40, confiança=90 |
| B3 | ALTURA DOS ESTUDANTES, 99% (exemplo) | Intervalo de confiança → Média | média=1,75, desvio=0,13, n=40, confiança=99 |
| B4 | EFEITO DO TAMANHO DA AMOSTRA (comparação) | Intervalo de confiança → Média | média=1,75, desvio=0,13, n=40, confiança=99, outro n=100 |
| B5 | DESAFIO 1: TEMPO DE RESPOSTA DE SERVIDOR | Intervalo de confiança → Média | média=320, desvio=45, n=50, confiança=95 |
| B6 | DESAFIO 2: CONSUMO DE MEMÓRIA RAM | Intervalo de confiança → Média | média=2,8, desvio=0,4, n=36, confiança=99 |
| B7 | DESAFIO 3: DURAÇÃO DE SESSÕES DE USUÁRIO | Intervalo de confiança → Média | média=18,5, desvio=4,2, n=60, confiança=90 |
| C1 | PESQUISA ELEITORAL (exemplo) | Intervalo de confiança → Proporção | n=2200, positivos=860, confiança=95 |
| C2 | PESQUISA DE OPINIÃO: BARBEADOR | Intervalo de confiança → Proporção | n=100, positivos=40, confiança=90 |
| C3 | ETIQUETAS DEFEITUOSAS | Intervalo de confiança → Proporção | n=500, positivos=35, confiança=95 |
| C4 | TAXA DE DESEMPREGO | Intervalo de confiança → Proporção | n=1000, positivos=89, confiança=95 |
| C5 | DESAFIO 1: TAXA DE BUGS EM SOFTWARE | Intervalo de confiança → Proporção | n=200, positivos=34, confiança=95, referência=20, tipo de comparação=maximo |
| C6 | DESAFIO 2: ADOÇÃO DE AUTENTICAÇÃO EM DOIS FATORES | Intervalo de confiança → Proporção | n=500, positivos=315, confiança=99 |
| C7 | DESAFIO 3: SATISFAÇÃO COM APLICATIVO MOBILE | Intervalo de confiança → Proporção | n=800, positivos=560, confiança=95 |
| D1 | CARGA DO SERVIDOR VERSUS TEMPO DE RESPOSTA (exemplo) | Regressão | X=100;200;300;400;500;600, Y=50;80;130;190;260;350 |
| D2 | BUGS VERSUS COMPLEXIDADE DO CÓDIGO (exemplo) | Regressão | X=3;5;8;10;12;15, Y=2;4;7;9;11;13 |
| D3 | EXERCÍCIO: USUÁRIOS VERSUS USO DE BANDA | Regressão | X da tabela/CSV, Y da tabela/CSV |
| E0 | EXEMPLO DE ALTURA DE ESTUDANTES (aba explicativa) | Intervalo de confiança → Média | média=1,75, desvio=0,13, n=40, confiança=95 |
| E1 | PLANO ILIMITADO DE INTERNET | Intervalo de confiança → Média | média=140,8, desvio=6,5, n=50, confiança=95 |
| E2 | NOTAS DE UM TESTE | Intervalo de confiança → Média | média=77,6, desvio=14,2, n=150, confiança=95 |
| E3 | PREÇO DA PASSAGEM DE ÔNIBUS | Intervalo de confiança → Média | média=3,50, desvio=0,50, n=50, confiança=95 |
| E4 | SUBSTITUIÇÃO DE APARELHOS DE TV | Intervalo de confiança → Média | média=8,2, desvio=1,1, n=75, confiança=90 |
| E5 | VIDA ÚTIL DAS LÂMPADAS | Intervalo de confiança → Média | média=350, desvio=100, n=64, confiança=95, referência=400 |
| E6 | ESPESSURA DA PINTURA AUTOMOTIVA | Intervalo de confiança → Média | média=148, desvio=3,3, n=50, confiança=95, referência=150 |
| E7 | IDADE DE ALUNOS DE PÓS-GRADUAÇÃO | Intervalo de confiança → Média | média=32,2, desvio=4,3, n=45, confiança=95, referência=33 |
| E8 | CARREGAMENTO SEM FIO DE CELULARES | Intervalo de confiança → Média | média=124, desvio=7,23, n=40, confiança=95, referência=120, tipo de comparação=maximo |
| E9 | PREÇO E ACEITAÇÃO DE PRODUTO | Intervalo de confiança → Média | média=45,5, desvio=5, n=100, confiança=99, referência=50 |
| F0 | EXEMPLO DE PESQUISA ELEITORAL (aba explicativa) | Intervalo de confiança → Proporção | n=2200, positivos=860, confiança=95 |
| F1 | TAXA DE DESEMPREGO | Intervalo de confiança → Proporção | n=1000, positivos=89, confiança=95 |
| F2 | PEIXES PRÓPRIOS PARA CONSUMO | Intervalo de confiança → Proporção | n=100, positivos=82, confiança=99 |
| F3 | VOTOS NO CANDIDATO B | Intervalo de confiança → Proporção | n=2305, modo=porcentagem, percentual=40, confiança=95 |
| F4 | LANÇAMENTO DE UM PRODUTO, 95% | Intervalo de confiança → Proporção | n=500, positivos=155, confiança=95, referência=25, tipo de comparação=minimo |
| F5 | LANÇAMENTO DE UM PRODUTO, 99% | Intervalo de confiança → Proporção | n=500, positivos=155, confiança=99, referência=25, tipo de comparação=minimo |
| F6 | PREFERÊNCIA ENTRE ANALGÉSICOS | Intervalo de confiança → Proporção | n=100, positivos=45, confiança=95, referência=50, tipo de comparação=diferente |
| G1 | CLASSIFICAÇÃO DE VARIÁVEIS | Classificar variável | variável=sexo |
| G2 | TABELAS DE FREQUÊNCIA | Frequências e gráfico | agrupamento=categorica, valores da coluna da tabela/CSV |
| G3 | GRÁFICOS | Frequências e gráfico | agrupamento=classes, valores da coluna da tabela/CSV, nº de classes=5 |
| G4 | MEDIDAS DESCRITIVAS | Medidas descritivas | valores da coluna da tabela/CSV |
| G5 | BOXPLOT, QUARTIS, OUTLIERS E ESCORE Z | Quartis e boxplot | valores da coluna da tabela/CSV |
| G6 | CORRELAÇÃO E REGRESSÃO ENTRE IDADE E ACESSO SEMANAL | Regressão | X da tabela/CSV, Y da tabela/CSV, novo X=50, Y para estimar X=50 |

## Questões especiais: como preencher

**A2:** marque “Comparar 90%, 95% e 99%” em Tamanho da amostra. Surge tabela com três linhas.
**A4:** faça uma vez com proporção 15%. Repita deixando a proporção em branco (o Python usa 50% de forma conservadora).
**B4:** além da amostra de 40, preencha “Comparar com outra amostra n” = 100.
**C4 e F1:** após calcular IC da proporção, o erro-padrão aparece na área de dados calculados.
**C5:** referência 20% + “No máximo este valor”. A proporção observada pode estar abaixo de 20%, sem que o IC inteiro fique abaixo.
**D1 a D3:** cole X e Y cada qual em seu campo da Correlação ou Regressão. Na Regressão o gráfico de dispersão exibe a reta ajustada.
**E2:** a margem de erro e o intervalo completo aparecem em linhas de resultado separadas.
**E4:** o intervalo dos aparelhos antigos não pode ser automaticamente generalizado a aparelhos atuais. Essa parte depende do contexto.
**E5 a E9:** informe valor de referência quando houver (400, 150, 33, 120 ou 50); para E8 escolha “No máximo”.
**F2:** o enunciado registra 18 impróprios entre 100; como pede a proporção de **próprios**, informe 82 positivos entre 100.
**F4/F5:** referência mínima 25% e confiança 95%/99%. A decisão deve considerar a faixa de confiança, não apenas 31% observados.
**F6:** avalie 45 pessoas que preferiram A em 100; referência 50%, modo “É diferente?”. O aplicativo mostra a interpretação do IC; não faz um teste formal de hipótese.
**G1:** classifique Sexo, Idade e Tempo de acesso um de cada vez; nas tabelas de trabalhadores, os outros tipos também estão disponíveis.
**G2/G3:** use a coluna Sexo com “Categorias” e a coluna Tempo com “Valores numéricos exatos” ou “Classes” (histograma).
**G4:** cole Tempo de acesso em “Medidas descritivas”; o sistema calcula média, mediana, moda, variância, desvio e amplitude.
**G5:** cole Tempo em “Quartis e boxplot”; a tabela mostrará o escore Z de cada observação e marcação dos outliers pelo AIQ.
**G6:** em Regressão, X=Idade e Y=Tempo. Previsão para idade 50 ou 70 é extrapolação, pois a maior idade observada é 40. Para estimar X com 50 horas, use o campo opcional “Y para estimar X”. A inversão não substitui regressão inversa.

## Dados completos para copiar do Excel

### Usuários de internet (30 observações)

Arquivo: `dados/usuarios_internet.csv`. As três colunas são Sexo, Idade e Tempo semanal.

```text
Sexo: M; F; M; F; F; F; M; M; M; M; F; M; M; M; F; M; M; F; F; M; M; M; F; F; M; F; F; M; F; M
Idade: 12; 13; 13; 13; 14; 15; 16; 15; 17; 18; 18; 19; 20; 20; 20; 21; 22; 22; 23; 25; 30; 32; 32; 33; 33; 33; 35; 38; 38; 40
Tempo: 20; 20; 21; 22; 24; 25; 26; 27; 27; 30; 30; 30; 30; 32; 35; 34; 30; 30; 38; 40; 40; 40; 44; 36; 38; 30; 44; 48; 40; 60
```

### Trabalhadores (31 observações)

Arquivo: `dados/trabalhadores.csv`. A planilha **Tabela Slide.xlsx** fornece dados, mas não enunciados. 
Você pode copiar uma coluna numérica para Medidas descritivas/Boxplot e as categóricas para Frequência. 

### Pares dos exemplos de correlação e regressão

- D1: X = 100;200;300;400;500;600 | Y = 50;80;130;190;260;350
- D2: X = 3;5;8;10;12;15 | Y = 2;4;7;9;11;13
- D3: X = 50;80;100;150;200;250;300;350;400;450;500 | Y = 110;165;200;280;380;490;560;600;700;830;1290

## Convenções e limitações importantes

- O método de IC da média segue a **aproximação Z** dos materiais. Quando σ é desconhecido e n é pequeno, pode ser necessário usar t de Student.
- Os valores de z vêm da tabela de aula: 90%=1,645; 95%=1,96; 99%=2,575. Mudanças de arredondamento alteram últimos dígitos.
- A proporção utiliza a aproximação normal de Wald; para poucos casos ou proporções extremas, pode não ser adequada.
- A referência opcional compara o intervalo a um limite; não executa automaticamente teste de hipótese.
- Quartis pelo método **QUARTIL.INC**; outro método pode dar números distintos.
- Correlação indica associação linear, não causalidade. Previsão fora da faixa observada deve ser identificada como extrapolação.
- Em G1 e nas questões interpretativas, a escolha da classificação e a conclusão precisam considerar o significado do enunciado.
- Nenhuma calculadora consegue deduzir um tamanho populacional N a partir somente de margem e confiança.
- Dados copiados devem manter cada par X e Y na mesma ordem. Em colunas do Excel, copie apenas os valores sem cabeçalho.
