/* ===========================================================================
   ARQUIVO: web/app.js — TECLAS, CAMPOS E VISOR

   ESTE ARQUIVO NÃO CALCULA CORRELAÇÃO, REGRESSÃO, INTERVALOS OU ESCORE.
   Essas contas ficam em calculos.py. Aqui nós apenas:
   1. Descobrimos qual botão foi clicado.
   2. Montamos os campos necessários àquela fórmula.
   3. Enviamos os valores ao Python.
   4. Mostramos a resposta e o andamento do fluxograma.

   Em caso de defeito, procure o título da seção antes de alterar qualquer coisa.
   =========================================================================== */

// ---------------------------------------------------------------------------
// 01 — FÓRMULAS E TEXTOS QUE APARECEM NA TELA
// Para mudar o nome de um botão, altere HTML. Para mudar sua explicação,
// altere o campo 'guia' aqui. Para alterar a CONTA, edite calculos.py.
// ---------------------------------------------------------------------------
const MODULOS = {
  correlacao: {
    nome: 'Correlação de Pearson',
    formula: 'r = Σ[(xi − x̄)(yi − ȳ)] / √[Σ(xi − x̄)² · Σ(yi − ȳ)²]',
    pista: 'A pergunta quer saber a força e a direção da relação entre dois conjuntos de números.',
    fluxo: ['Pares X e Y', 'Médias', 'Desvios', 'Coeficiente r', 'Interpretação'],
    campos: [
      {id: 'x', titulo: 'Valores de X', dica: 'Separe os números por ; ou uma linha por valor.', tipo: 'lista'},
      {id: 'y', titulo: 'Valores de Y', dica: 'Informe um Y para cada X, na mesma ordem.', tipo: 'lista'}
    ],
    guia: {
      conceito: 'Correlação mede se duas variáveis quantitativas mudam juntas e o quanto essa relação se parece com uma linha reta.',
      reconhecer: 'Procure expressões como “existe relação?”, “força da relação”, “direção”, “correlação” ou “coeficiente de Pearson”.',
      entradas: 'X é a primeira variável e Y é a segunda. Cada linha ou posição forma um par. As duas listas precisam ter a mesma quantidade de números.',
      simbolos: 'r é o resultado, entre −1 e +1. x̄ e ȳ são médias. Σ significa somar. Valores próximos de +1 têm relação positiva forte; próximos de −1 têm relação negativa forte.',
      cuidado: 'Correlação não demonstra causa e efeito. Se todos os X ou todos os Y forem iguais, não é possível calcular r.'
    }
  },
  regressao: {
    nome: 'Regressão linear simples',
    formula: 'a = Σ[(xi − x̄)(yi − ȳ)] / Σ(xi − x̄)²;  b = ȳ − a x̄;  ŷ = a x + b',
    pista: 'A pergunta quer montar uma reta ou prever o valor de Y a partir de X.',
    fluxo: ['Pares X e Y', 'Médias', 'Inclinação a', 'Intercepto b', 'Reta / previsão'],
    campos: [
      {id: 'x', titulo: 'Valores de X', dica: 'Variável usada para explicar ou prever Y.', tipo: 'lista'},
      {id: 'y', titulo: 'Valores de Y', dica: 'Valores correspondentes a cada X.', tipo: 'lista'},
      {id: 'prever', titulo: 'Novo X para prever Y (opcional)', dica: 'Deixe vazio se a professora pedir só a equação.', tipo: 'texto', opcional: true},
      {id: 'prever_y', titulo: 'Valor de Y para estimar X (opcional)', dica: 'Inverte a reta, não é nova regressão.', tipo: 'texto', opcional: true}
    ],
    guia: {
      conceito: 'Regressão constrói a reta que melhor representa os pares X e Y. Diferentemente da correlação, também serve para fazer uma previsão.',
      reconhecer: 'Escute “encontre a equação”, “coeficiente angular”, “intercepto”, “preveja”, “qual será Y quando X…” ou “regressão linear”.',
      entradas: 'X é a variável explicativa; Y é o resultado que você quer prever. Informe as duas listas na mesma ordem. O campo “novo X” é opcional.',
      simbolos: 'a é a inclinação da reta; b é o intercepto, valor previsto quando X é zero. ŷ (“y chapéu”) é o Y previsto.',
      cuidado: 'Se os X forem todos iguais, a inclinação não existe. Previsões muito longe dos X observados podem ser pouco confiáveis.'
    }
  },
  // INTERVALO DA MÉDIA: escolha entre os valores PRONTOS da professora
  // e a LISTA copiada do Excel. O Python calcula média, desvio e n.
  ic_media: {
    nome: 'Intervalo de confiança da média',
    formula: 'E = z × σ / √n; IC = (média − E; média + E)',
    pista: 'Estima a média de uma população com um limite inferior e outro superior.',
    fluxo: ['Dados da média', 'Valor crítico z', 'Margem E', 'Limites', 'Intervalo de confiança'],
    campos: [
      {id:'entrada', titulo:'Forma de entrada', tipo:'modo_entrada'},
      {id:'media', titulo:'Média amostral (x̄)', tipo:'texto', entrada:'direto'},
      {id:'desvio', titulo:'Desvio-padrão (σ ou s)', tipo:'texto', entrada:'direto'},
      {id:'n', titulo:'Tamanho da amostra (n)', tipo:'texto', entrada:'direto'},
      {id:'valores', titulo:'Valores da amostra', tipo:'lista', entrada:'lista',
       dica:'Cole os números de uma coluna do Excel ou separe por ponto e vírgula.'},
      {id:'tipo_dispersao', titulo:'Tipo de desvio', tipo:'tipo_dispersao', entrada:'lista'},
      {id:'confianca', titulo:'Alfa (α)', tipo:'confianca'},
      {id:'margem_informada', titulo:'Margem de erro informada (opcional)', tipo:'texto', opcional:true,
       dica:'Em branco = calcular automaticamente. Se informada, use a mesma unidade da média.'},
      {id:'populacao', titulo:'Tamanho da população (N) — opcional', tipo:'texto', opcional:true,
       dica:'Só se a professora informar o total de indivíduos; não é a amostra n.'},
      {id:'referencia', titulo:'Valor de referência (opcional)', tipo:'texto', opcional:true,
       dica:'Se o problema pede comparar o IC com um valor, informe-o aqui.'},
      {id:'tipo_referencia', titulo:'Como comparar?', tipo:'tipo_referencia', mostrar:'com_referencia', opcional:true},
      {id:'comparar_n', titulo:'Comparar com outra amostra n (opcional)', tipo:'texto', opcional:true,
       dica:'Para comparar o efeito do tamanho da amostra mantendo a média e o desvio.'}
    ],
    guia: {
      conceito:'Estima a faixa onde pode estar a média verdadeira. O Excel INT.CONFIANÇA retorna a margem de erro, não os dois limites.',
      reconhecer:'Quando a questão pedir intervalo da média, média populacional, limites da média ou margem de erro da média.',
      entradas:'Dados informados: média, desvio, tamanho e alfa. Lista de valores: cole todas as observações; média, desvio e tamanho serão calculados automaticamente.',
      simbolos:'x̄ é média; σ ou s é desvio-padrão; n é tamanho da amostra; z depende da confiança; E é margem de erro.',
      cuidado:'A aula utiliza Z. Para n pequeno com desvio amostral, confirme se seria necessário t de Student.'
    }
  },
  // INTERVALO DA PROPORÇÃO: a lista deve ter respostas binárias
  // (1/0 ou sim/não). A outra entrada aceita quantidades ou porcentagem.
  ic_proporcao: {
    nome:'Intervalo de confiança da proporção',
    formula:'p = positivos / n; E = z × √[p(1 − p)/n]; IC = (p − E; p + E)',
    pista:'Estima a porcentagem de pessoas ou itens que têm uma característica.',
    fluxo:['Amostra n', 'Proporção p', 'Valor crítico z', 'Margem E', 'Intervalo de confiança'],
    campos:[
      {id:'entrada', titulo:'Forma de entrada', tipo:'modo_entrada'},
      {id:'n', titulo:'Quantidade total (n)', tipo:'texto', entrada:'direto'},
      {id:'modo', titulo:'Dado disponível', tipo:'modo_proporcao', entrada:'direto'},
      {id:'sucessos', titulo:'Quantidade com característica', tipo:'texto', mostrar:'contagem', entrada:'direto'},
      {id:'percentual', titulo:'Porcentagem (%)', tipo:'texto', mostrar:'porcentagem', entrada:'direto'},
      {id:'valores', titulo:'Respostas da amostra', tipo:'lista', entrada:'lista',
       dica:'Uma resposta por linha: 1/0 ou sim/não.'},
      {id:'confianca', titulo:'Alfa (α)', tipo:'confianca'},
      {id:'margem_informada', titulo:'Margem de erro informada em p.p. (opcional)', tipo:'texto', opcional:true,
       dica:'Exemplo: 8 significa 8 pontos percentuais. Em branco, a calculadora determina E.'},
      {id:'populacao', titulo:'Tamanho da população (N) — opcional', tipo:'texto', opcional:true,
       dica:'Informe o total conhecido para projetar pessoas e corrigir população finita.'},
      {id:'referencia', titulo:'Porcentagem de referência (opcional)', tipo:'texto', opcional:true,
       dica:'Ex.: limite de 20% de bugs ou pelo menos 25% de interessados.'},
      {id:'tipo_referencia', titulo:'Como comparar?', tipo:'tipo_referencia', mostrar:'com_referencia', opcional:true}
    ],
    guia:{
      conceito:'Estima um intervalo para uma proporção percentual.',
      reconhecer:'Quando aparecerem aprovação, satisfação, defeitos, quantidade de casos ou porcentagem de uma amostra.',
      entradas:'Dados informados: total e quantidade ou porcentagem. Lista: informe 1 ou sim para cada ocorrência e 0 ou não para cada ausência.',
      simbolos:'p é a proporção decimal, n é o total, E é a margem de erro; resultado em porcentagens.',
      cuidado:'Em amostras pequenas ou proporções extremas a aproximação normal pode ser imprecisa.'
    }
  },
  // ESTIMATIVA POPULACIONAL: recebe uma amostra e o tamanho TOTAL N.
  // O valor da população não é deduzido da margem; precisa ser conhecido.
  populacao: {
    nome:'Estimativa da população',
    formula:'Casos esperados ≈ N × p; faixa ≈ N × (p ± E)',
    pista:'Estima quantas pessoas da população têm uma característica, a partir da amostra.',
    fluxo:['Amostra', 'Proporção p', 'Margem E', 'População N', 'Estimativa'],
    campos:[
      {id:'entrada', titulo:'Forma de entrada', tipo:'modo_entrada'},
      {id:'n', titulo:'Quantidade na amostra (n)', tipo:'texto', entrada:'direto'},
      {id:'modo', titulo:'Dado disponível', tipo:'modo_proporcao', entrada:'direto'},
      {id:'sucessos', titulo:'Quantidade com característica', tipo:'texto', mostrar:'contagem', entrada:'direto'},
      {id:'percentual', titulo:'Porcentagem da amostra (%)', tipo:'texto', mostrar:'porcentagem', entrada:'direto'},
      {id:'valores', titulo:'Respostas da amostra', tipo:'lista', entrada:'lista',
       dica:'Uma resposta por linha: 1/0 ou sim/não.'},
      {id:'populacao', titulo:'Tamanho da população (N)', tipo:'texto',
       dica:'Total conhecido de pessoas ou itens na população (não é n).'},
      {id:'confianca', titulo:'Grau de confiança', tipo:'confianca'},
      {id:'margem_informada', titulo:'Margem de erro em p.p. (opcional)', tipo:'texto', opcional:true,
       dica:'Se a professora forneceu a margem, digite aqui. Caso contrário, calculamos.'}
    ],
    guia:{
      conceito:'Projeta a quantidade de pessoas com uma característica usando os dados amostrais e o tamanho conhecido da população.',
      reconhecer:'Quando a questão informar a população N e perguntar aproximadamente quantas pessoas preferem, compram ou apresentam algo.',
      entradas:'Informe o tamanho da amostra e a quantidade positiva, ou cole as respostas; informe também N. Margem é opcional.',
      simbolos:'N é a população total; n é a amostra; p é a proporção amostral; E é a margem em decimal.',
      cuidado:'É uma estimativa, não uma contagem real. A margem de erro sozinha nunca revela o tamanho da população.'
    }
  },
  // ESCORE: valor observado é sempre necessário. Os outros dois
  // números podem vir do enunciado OU da lista de observações.
  escore: {
    nome:'Escore Z', formula:'z = (x − média) / desvio-padrão',
    pista:'Indica quantos desvios-padrão o valor observado está distante da média.',
    fluxo:['Valor e média', 'Diferença x − μ', 'Desvio σ', 'Divisão', 'Escore z'],
    campos:[
      {id:'valor', titulo:'Valor observado (x)', tipo:'texto'},
      {id:'entrada', titulo:'Forma de entrada', tipo:'modo_entrada'},
      {id:'media', titulo:'Média', tipo:'texto', entrada:'direto'},
      {id:'desvio', titulo:'Desvio-padrão', tipo:'texto', entrada:'direto'},
      {id:'valores', titulo:'Valores da amostra', tipo:'lista', entrada:'lista'},
      {id:'tipo_dispersao', titulo:'Tipo de desvio', tipo:'tipo_dispersao', entrada:'lista'}
    ],
    guia:{
      conceito:'Compara um valor específico com a média de um grupo usando o desvio-padrão como unidade.',
      reconhecer:'Enunciados com escore Z, padronização ou distância em desvios-padrão.',
      entradas:'Digite sempre o valor observado. Escolha informar média e desvio diretamente ou calcular ambos pela lista.',
      simbolos:'z positivo significa acima da média; negativo significa abaixo; zero coincide com a média.',
      cuidado:'Desvio-padrão zero impede a divisão.'
    }
  },
  // TAMANHO DA AMOSTRA: uma LISTA aqui funciona como AMOSTRA PILOTO.
  // O objetivo é estimar a dispersão antes de decidir quantos coletar.
  amostra: {
    nome:'Tamanho da amostra',
    formula:'Média: n = (z × σ / Em)²  |  Proporção: n = z² × p(1 − p) / Ep²',
    pista:'Determine o número mínimo de observações necessárias.',
    fluxo:['Estimativa', 'Grau de confiança', 'Margem de erro', 'Cálculo', 'Tamanho da amostra'],
    campos:[
      // O PDF tem duas situações: estimativa da média ou da proporção.
      {id:'tipo', titulo:'O que deseja estimar?', tipo:'tipo_amostra'},
      // Os exercícios normalmente já informam o desvio ou a proporção.
      // A lista permanece disponível para quando só forem dados os valores.
      {id:'entrada', titulo:'Dados do exercício', tipo:'modo_entrada'},
      {id:'desvio', titulo:'Desvio-padrão populacional (σ)', tipo:'texto', mostrar:'media', entrada:'direto'},
      {id:'percentual', titulo:'Proporção estimada (p) (%)', tipo:'texto', mostrar:'proporcao', entrada:'direto', opcional:true,
       dica:'Se o exercício não informar p, deixe vazio: será utilizado 50%.'},
      {id:'valores', titulo:'Valores da amostra', tipo:'lista', entrada:'lista',
       dica:'Cole os números. Para proporção, use sim/não ou 1/0.'},
      // Na lista, o Python calcula o desvio amostral (n - 1) sozinho.
      {id:'erro', titulo:'Erro amostral máximo aceito (Em)', tipo:'texto'},
      {id:'confianca', titulo:'Grau de confiança', tipo:'confianca'},
      // Campos opcionais usados em exercícios de comparação ou N conhecido.
      {id:'comparar_confiancas', titulo:'Comparar 90%, 95% e 99%?', tipo:'comparar_confiancas'},
      {id:'populacao', titulo:'Tamanho da população (N) — se informado', tipo:'texto', opcional:true}
    ],
    guia:{
      conceito:'Calcula quantas observações são necessárias para estimar uma média ou uma proporção.',
      reconhecer:'O enunciado pergunta quantas pessoas, medições, casos de teste ou requisições são necessários.',
      entradas:'Para média, informe o desvio-padrão populacional (σ) e o erro máximo (Em). Para proporção, informe p e a margem (Ep). Em ambos, escolha o grau de confiança.',
      simbolos:'n é o tamanho da amostra, z é o valor crítico, σ é o desvio-padrão, p é a proporção e Em/Ep são as margens de erro.',
      cuidado:'Se o enunciado não informar p, use 50%. Arredonde sempre o tamanho da amostra para cima. Se usar uma lista para estimar o desvio, esse valor não é necessariamente o desvio da população.'
    }
  },
  // ========================================================
  // CÁLCULOS AUXILIARES. O PYTHON FAZ AS CONTAS.
  // Os botões ficam dentro de "Cálculos auxiliares".
  // ========================================================
  media_amostral: {
    nome: 'Média amostral',
    formula: 'x̄ = (x1 + x2 + ... + xn) / n',
    pista: 'Digite os valores da amostra. A calculadora soma e divide pela quantidade.',
    fluxo: ['Dados', 'Quantidade', 'Soma', 'Divisão', 'Média'],
    campos: [{id:'valores', titulo:'Valores da amostra', dica:'Separe por ponto e vírgula ou uma linha para cada número.', tipo:'lista'}],
    guia: {
      conceito:'A média amostral representa o valor médio dos dados coletados. É usada, por exemplo, no intervalo de confiança para a média.',
      reconhecer:'"Calcule a média", "média amostral", "média aritmética" ou "valor médio".',
      entradas:'Informe todos os valores observados, separando-os por ponto e vírgula ou quebras de linha.',
      simbolos:'x̄ é a média amostral. Σ indica soma. n é a quantidade de valores.',
      cuidado:'A vírgula dentro de um número é decimal. Use ponto e vírgula para separar valores.'
    }
  },
  desvio_padrao: {
    nome: 'Desvio-padrão',
    formula: 'Amostral: s = √[Σ(xi − x̄)²/(n − 1)]  |  Populacional: σ = √[Σ(xi − μ)²/N]',
    pista: 'Informe os valores e escolha se são uma amostra ou toda a população.',
    fluxo: ['Valores', 'Média', 'Desvios²', 'Variância', 'Desvio-padrão'],
    campos: [
      {id:'tipo', titulo:'Tipo de dados', tipo:'tipo_dispersao'},
      {id:'valores', titulo:'Valores', dica:'Separe por ; ou uma linha por número.', tipo:'lista'}
    ],
    guia: {
      conceito:'Mostra o quanto os valores se espalham em torno da média. Quanto maior o desvio-padrão, mais dispersos os valores.',
      reconhecer:'"Desvio-padrão", "dispersão" ou quando um intervalo de confiança pede σ ou s.',
      entradas:'Informe os valores. Escolha AMOSTRAL se são apenas parte do grupo; POPULACIONAL se representam todo o grupo.',
      simbolos:'s é desvio amostral (divide por n−1). σ é desvio populacional (divide por N).',
      cuidado:'Para o desvio AMOSTRAL são necessários no mínimo dois dados. Não confunda desvio com variância.'
    }
  },
  variancia: {
    nome: 'Variância',
    formula: 'Amostral: s² = Σ(xi − x̄)²/(n − 1)  |  Populacional: σ² = Σ(xi − μ)²/N',
    pista: 'Informe os valores e escolha amostral ou populacional.',
    fluxo: ['Valores', 'Média', 'Desvios²', 'Divisor', 'Variância'],
    campos: [
      {id:'tipo', titulo:'Tipo de dados', tipo:'tipo_dispersao'},
      {id:'valores', titulo:'Valores', dica:'Separe por ; ou uma linha por número.', tipo:'lista'}
    ],
    guia: {
      conceito:'A variância mede a dispersão dos valores ao quadrado. A raiz da variância é o desvio-padrão.',
      reconhecer:'"Variância", "dispersão ao quadrado", "s²" ou "σ²".',
      entradas:'Informe os valores e identifique se os dados formam uma amostra ou a população inteira.',
      simbolos:'Σ é soma; x̄ é média; n−1 é o divisor amostral; N é o divisor populacional.',
      cuidado:'Para a variância amostral é preciso ao menos dois números.'
    }
  },
  // PROPORÇÃO AUXILIAR: aceita contagem pronta ou lista de sim/não.
  proporcao_amostral: {
    nome:'Proporção amostral', formula:'p = quantidade com característica / total',
    pista:'Mostra qual parte da amostra apresenta uma característica.',
    fluxo:['Total', 'Casos', 'Divisão', 'Proporção', 'Porcentagem'],
    campos:[
      {id:'entrada', titulo:'Forma de entrada', tipo:'modo_entrada'},
      {id:'sucessos', titulo:'Quantidade com característica', tipo:'texto', entrada:'direto'},
      {id:'n', titulo:'Total', tipo:'texto', entrada:'direto'},
      {id:'valores', titulo:'Respostas da amostra', tipo:'lista', entrada:'lista',
       dica:'Uma resposta por linha: 1/0 ou sim/não.'}
    ],
    guia:{
      conceito:'Transforma uma contagem em proporção ou porcentagem.',
      reconhecer:'Quando pedir a fração, porcentagem ou taxa de casos em uma amostra.',
      entradas:'Quantidade/total direto ou lista de respostas individuais 1/0.',
      simbolos:'p é a proporção; n é o total; k é a quantidade de casos positivos.',
      cuidado:'A contagem positiva não pode ultrapassar o total.'
    }
  },
  // ERRO-PADRÃO: na lista de números, calcula o desvio e a contagem;
  // na lista de sim/não, calcula a proporção e a contagem.
  erro_padrao: {
    nome:'Erro-padrão', formula:'Média: EP = s / √n; Proporção: EP = √[p(1 − p) / n]',
    pista:'Mostra quanto a estimativa amostral pode variar entre diferentes amostras.',
    fluxo:['Tipo', 'Dados', 'Fórmula', 'Resultado', 'Erro-padrão'],
    campos:[
      {id:'tipo', titulo:'Qual tipo?', tipo:'tipo_amostra'},
      {id:'entrada', titulo:'Forma de entrada', tipo:'modo_entrada'},
      {id:'n', titulo:'Tamanho da amostra', tipo:'texto', entrada:'direto'},
      {id:'desvio', titulo:'Desvio-padrão', tipo:'texto', mostrar:'media', entrada:'direto'},
      {id:'percentual', titulo:'Proporção observada (%)', tipo:'texto', mostrar:'proporcao', entrada:'direto'},
      {id:'valores', titulo:'Valores da amostra', tipo:'lista', entrada:'lista',
       dica:'Média: números. Proporção: 1/0 ou sim/não.'},
      {id:'tipo_dispersao', titulo:'Tipo de desvio', tipo:'tipo_dispersao', mostrar:'media', entrada:'lista'}
    ],
    guia:{
      conceito:'Mede a variação esperada da média ou proporção estimada entre amostras.',
      reconhecer:'Quando pedir erro-padrão da média ou erro-padrão de proporção.',
      entradas:'Dados já informados ou lista de observações. No modo lista, n e desvio/proporção são calculados.',
      simbolos:'EP é erro-padrão, n é número de observações, s é desvio e p é proporção.',
      cuidado:'Erro-padrão não é a margem de erro do intervalo.'
    }
  }
  ,
  // ========================================================
  // NOVO BLOCO: exercícios com dados de uma coluna do Excel.
  // As contas continuam em calculos.py; aqui só definimos os campos.
  // ========================================================
  descritiva: {
    nome:'Medidas descritivas',
    formula:'Média, mediana, moda, variância e desvio-padrão amostral',
    pista:'Cole a coluna numérica e obtenha todas as medidas de uma vez.',
    fluxo:['Valores','Ordenar','Média','Dispersão','Medidas finais'],
    campos:[{id:'valores', titulo:'Coluna de valores', tipo:'lista',
      dica:'Cole uma coluna de números do Excel; separadores: linha, tabulação ou ponto e vírgula.'}],
    guia:{conceito:'Descreve uma coluna numérica por média, moda, mediana, variância, desvio e amplitude.',
      reconhecer:'Questões com média, mediana, moda, resumo estatístico ou medidas descritivas.',
      entradas:'Cole a coluna dos tempos de acesso ou qualquer coluna de números.',
      simbolos:'s² é variância amostral; s é o desvio-padrão; n é quantidade.',
      cuidado:'Para desvio e variância amostrais precisamos de ao menos dois números.'}
  },
  frequencia: {
    nome:'Tabela de frequências',
    formula:'fi = frequência simples; fr = fi/n × 100; Fi = acumulada',
    pista:'Cole uma coluna para contar valores, percentuais e frequências acumuladas.',
    fluxo:['Ler coluna','Agrupar valores','Contar fi','Percentual fr','Tabela e gráfico'],
    campos:[
      {id:'formato', titulo:'Como agrupar?', tipo:'formato_frequencia'},
      {id:'valores', titulo:'Coluna do Excel', tipo:'lista', dica:'M/F ou números, um valor por linha.'},
      {id:'classes', titulo:'Número de classes (padrão 5)', tipo:'texto', mostrar:'classes', opcional:true,
       dica:'Use classes só para histograma de valores numéricos.'}
    ],
    guia:{conceito:'Conta quantas vezes um valor ou classe aparece. Também constrói tabela percentual e acumulada.',
      reconhecer:'Questões com fi, fr, frequência acumulada, tabela de frequência, gráfico de barras ou histograma.',
      entradas:'Sexo: categoria. Tempo semanal: valor exato ou classes (histograma).',
      simbolos:'fi é quantidade; fr é porcentagem; Fi é frequência acumulada.',
      cuidado:'Para variável nominal, a acumulada depende da ordem escolhida; não tem interpretação ordinal.'}
  },
  boxplot: {
    nome:'Quartis e boxplot',
    formula:'AIQ = Q3 − Q1; outliers fora de Q1−1,5AIQ e Q3+1,5AIQ',
    pista:'Calcula quartis, outliers e escore Z de cada valor da lista.',
    fluxo:['Ordenar valores','Calcular quartis','Amplitude AIQ','Identificar outliers','Boxplot e Z'],
    campos:[{id:'valores', titulo:'Coluna de valores', tipo:'lista',
      dica:'Cole os tempos de acesso da planilha, um valor por linha.'}],
    guia:{conceito:'Mostra a distribuição em quartis e destaca valores muito afastados pelo critério interquartil.',
      reconhecer:'Perguntas sobre Q1, mediana, Q3, boxplot, outlier, AIQ ou escore Z de uma lista.',
      entradas:'Cole os números da coluna do Excel. Os escores individuais aparecem na tabela após Calcular.',
      simbolos:'Q1=25%; Q2=mediana; Q3=75%; AIQ=Q3−Q1.',
      cuidado:'Usa QUARTIL.INC do Excel. Outlier por AIQ não é automaticamente um z maior que 3.'}
  },
  classificacao: {
    nome:'Classificação de variáveis',
    formula:'Qualitativa (nominal/ordinal) ou quantitativa (discreta/contínua)',
    pista:'Classifique as variáveis dos exercícios das planilhas.',
    fluxo:['Escolher variável','Identificar dados','Ver ordem','Ver contagem','Classificação'],
    campos:[{id:'variavel', titulo:'Variável da planilha', tipo:'variavel_classificacao'}],
    guia:{conceito:'Classifica uma variável segundo seu significado, não apenas pela aparência dos números.',
      reconhecer:'Questões com variável qualitativa nominal, ordinal, quantitativa discreta ou contínua.',
      entradas:'Selecione a coluna da planilha Correlação e Regressão ou Tabela Slide.',
      simbolos:'Discreta: contagem; contínua: medida; ordinal: categorias com ordem.',
      cuidado:'Idade em anos completos é discreta; idade exata, contínua.'}
  }

};

// ---------------------------------------------------------------------------
// 02 — ELEMENTOS DA PÁGINA E VARIÁVEIS DE ESTADO
// Variáveis de estado guardam o que foi escolhido ou digitado, não fazem contas.
// ---------------------------------------------------------------------------
const el = id => document.getElementById(id);
let formulaSelecionada = null;
let ultimoResultado = null;
let andamento = 'vazio';   // vazio, editando, pronto, calculando, feito, erro
let campoAtivo = null;     // referência ao último campo usado com o teclado virtual
let respostaPython = null;
let aguardando = false;
let versaoDosCampos = 0; // impede que uma resposta antiga mude a nova fórmula
let timerIndicadores = null; // pequena pausa para não consultar Python a cada tecla
let rodadaDaAnimacao = 0; // cancela a animação antiga se trocar os dados
let etapaAnimada = null; // etapa verde que será destacada durante a transição

// Estas quatro variáveis são somente do teclado básico (+, −, ×, ÷).
// A conta em si também é enviada ao Python.
let numeroAtual = '0';
let primeiroNumero = null;
let operacaoPendente = null;
let digitandoNovoNumero = false;

// ---------------------------------------------------------------------------
// 03 — SELECIONAR UMA FUNÇÃO OU VOLTAR AO TECLADO BÁSICO
// ---------------------------------------------------------------------------
function selecionarFormula(id) {
  pararAnimacao();
  clearTimeout(timerIndicadores);
  formulaSelecionada = id;
  campoAtivo = null;
  versaoDosCampos += 1;
  respostaPython = null;
  ultimoResultado = null;
  andamento = 'vazio';
  el('painel-resultado').hidden = true;
  el('painel-resultado').open = false;
  el('linhas-resultado').hidden = true;
  el('painel-derivados').hidden = true;
  el('erro').hidden = true;
  limparAnaliseVisual();

  document.querySelectorAll('.tecla-formula').forEach(botao => {
    botao.classList.toggle('selecionada', botao.dataset.formula === formulaSelecionada);
    botao.setAttribute('aria-pressed', String(botao.dataset.formula === formulaSelecionada));
  });

  if (!formulaSelecionada) {
    el('nome-formula').textContent = 'Informe os dados';
    el('pista').hidden = false;
    el('pista').textContent = 'Selecione uma função para abrir os campos necessários.';
    el('campos').replaceChildren();
    el('acoes').hidden = true;
    atualizarVisor('Calculadora básica', numeroAtual);
    desenharFluxo();
    return;
  }

  const modulo = MODULOS[formulaSelecionada];
  el('nome-formula').textContent = 'Informe os dados';
  el('pista').hidden = true;
  el('pista').textContent = modulo.pista;
  el('acoes').hidden = false;
  atualizarVisor(modulo.nome, '0');
  construirCampos();
  desenharFluxo();
}

// ---------------------------------------------------------------------------
// 04 — FORMULÁRIO COM CAMPOS DIFERENTES PARA CADA FÓRMULA
// Se precisar adicionar um campo, inclua-o na lista 'campos' do módulo acima.
// ---------------------------------------------------------------------------
function construirCampos() {
  // Cada variável vira UMA LINHA: nome azul à esquerda, valor à direita.
  // Se quiser mudar a conta matemática, abra calculos.py; aqui é só tela.
  const container = el('campos');
  container.replaceChildren();
  const modulo = MODULOS[formulaSelecionada];

  for (const definicao of modulo.campos) {
    const grupo = document.createElement('div');
    grupo.className = 'campo';
    grupo.dataset.mostrar = definicao.mostrar || '';
    // Define em qual modo este campo deve aparecer. Campos sem a
    // propriedade 'entrada' aparecem nos dois modos.
    grupo.dataset.entrada = definicao.entrada || '';

    const nome = document.createElement('label');
    nome.className = 'celula-nome';
    nome.htmlFor = `campo-${definicao.id}`;
    nome.textContent = definicao.titulo;
    grupo.append(nome);

    const celulaValor = document.createElement('div');
    celulaValor.className = 'celula-entrada';
    let campo;
    if (['confianca', 'modo_proporcao', 'modo_entrada', 'tipo_amostra', 'tipo_dispersao', 'tipo_referencia', 'comparar_confiancas', 'formato_frequencia', 'variavel_classificacao'].includes(definicao.tipo)) {
      campo = document.createElement('select');
      // No intervalo mostramos o ALFA, mas enviamos a confiança ao Python.
      const opcoes = definicao.tipo === 'confianca'
        ? (formulaSelecionada.startsWith('ic_')
          ? [['90', '0,10  ·  90%'], ['95', '0,05  ·  95%'], ['99', '0,01  ·  99%']]
          : [['90', '90%  (α = 0,10)'], ['95', '95%  (α = 0,05)'], ['99', '99%  (α = 0,01)']])
        : definicao.tipo === 'modo_entrada'
        ? [['direto', 'Valores informados'], ['lista', 'Lista de valores']]
        : definicao.tipo === 'modo_proporcao'
        ? [['contagem', 'Quantidade'], ['porcentagem', 'Porcentagem']]
        : definicao.tipo === 'tipo_dispersao'
        ? [['amostral', 'Amostral (n − 1)'], ['populacional', 'Populacional (N)']]
        : definicao.tipo === 'tipo_referencia'
        ? [['pertence', 'Está dentro do intervalo?'], ['minimo', 'Pelo menos este valor'],
           ['maximo', 'No máximo este valor'], ['diferente', 'É diferente deste valor?']]
        : definicao.tipo === 'comparar_confiancas'
        ? [['nao', 'Não'], ['sim', 'Sim — mostrar comparação']]
        : definicao.tipo === 'formato_frequencia'
        ? [['categorica', 'Categorias (sexo, escolaridade...)'], ['exata', 'Valores numéricos exatos'],
           ['classes', 'Intervalos de classe / histograma']]
        : definicao.tipo === 'variavel_classificacao'
        ? [['sexo', 'Sexo'], ['idade', 'Idade (anos completos)'], ['tempo_acesso', 'Tempo de acesso semanal'],
           ['tempo_servico', 'Tempo de serviço'], ['escolaridade', 'Escolaridade'],
           ['salario', 'Salário'], ['dependentes', 'Número de dependentes'],
           ['automovel', 'Automóvel próprio']]
        : (formulaSelecionada === 'amostra'
          ? [['media', 'Estimativa da média'], ['proporcao', 'Estimativa da proporção']]
          : [['media', 'Média'], ['proporcao', 'Proporção']]);
      for (const [valor, titulo] of opcoes) campo.append(new Option(titulo, valor));
      if (definicao.tipo === 'confianca') campo.value = '95';
    } else if (definicao.tipo === 'lista') {
      campo = document.createElement('textarea');
      campo.rows = 2;
      campo.placeholder = 'Cole os valores aqui (um por linha ou separados por ;)';
    } else {
      campo = document.createElement('input');
      campo.type = 'text';
      campo.inputMode = 'decimal';
      campo.autocomplete = 'off';
      campo.spellcheck = false;
      campo.placeholder = 'Digite o valor';
    }
    campo.id = `campo-${definicao.id}`;
    campo.name = definicao.id;
    if (definicao.dica) campo.title = definicao.dica;
    campo.addEventListener('focus', () => { if (campo.tagName !== 'SELECT') campoAtivo = campo; });
    campo.addEventListener('input', camposAlterados);
    campo.addEventListener('change', camposAlterados);
    celulaValor.append(campo);
    grupo.append(celulaValor);
    container.append(grupo);
  }
  exibirCamposCorretos();
  construirLinhasResultado();
  construirLinhasDerivadas();
}

// Cada resultado tem sua última linha, como o Excel da professora.
// Nos intervalos, a primeira saída é a margem (INT.CONFIANÇA no Excel)
// e a última é o intervalo completo [média - E; média + E].
function construirLinhasResultado() {
  // Só as respostas finais ficam aqui: margem e limites, ou resultado único.
  // Os números inferidos da amostra ficam em "linhas-derivadas" logo acima.
  const container = el('linhas-resultado');
  container.replaceChildren();
  let linhas;
  if (formulaSelecionada === 'ic_media') {
    linhas = [['margem', 'Margem de erro'], ['intervalo', 'Intervalo de confiança']];
  } else if (formulaSelecionada === 'ic_proporcao') {
    linhas = [['margem', 'Margem de erro'], ['intervalo', 'Intervalo de confiança']];
  } else if (formulaSelecionada === 'populacao') {
    linhas = [['projecao', 'Pessoas estimadas'], ['projecao_intervalo', 'Faixa estimada']];
  } else {
    linhas = [['resultado', 'Resultado']];
  }

  for (const [chave, titulo] of linhas) {
    const linha = document.createElement('div');
    linha.className = 'linha-saida';
    const nome = document.createElement('span');
    nome.className = 'celula-nome';
    nome.textContent = titulo;
    const valor = document.createElement('output');
    valor.className = 'celula-resultado';
    valor.id = `saida-${chave}`;
    valor.textContent = '—';
    linha.append(nome, valor);
    container.append(linha);
  }
  container.hidden = false;
}

// ---------------------------------------------------------------------------
// 04.1 — DADOS CALCULADOS AUTOMATICAMENTE (SEM CAIXAS EDITÁVEIS)
//
// Tudo que for adicionando aqui é uma LEGENDA, não uma nova conta!
// A chave precisa coincidir com o nome devolvido por indicadores_automaticos
// em calculos.py. Caso queira mudar a operação, altere o Python.
// ---------------------------------------------------------------------------
function linhasQueFazemSentido() {
  const lista = el('campo-entrada')?.value === 'lista';
  const tipo = el('campo-tipo')?.value;
  const formula = formulaSelecionada;
  const itens = [];
  const adicionar = (chave, texto) => itens.push([chave, texto]);

  if (formula === 'ic_proporcao' || formula === 'populacao' || formula === 'proporcao_amostral' ||
      ((formula === 'amostra' || formula === 'erro_padrao') && tipo === 'proporcao')) {
    adicionar('p_pct', formula === 'amostra' ? 'Proporção prevista (sim)' : 'Sucesso / com característica');
    adicionar('q_pct', 'Fracasso / sem característica');
    if (formula !== 'amostra') {
      // A contagem complementar só aparece se o Python souber o total e
      // uma quantidade inteira. Não inventamos meia pessoa.
      adicionar('fracassos', 'Quantidade sem característica');
      if (lista || el('campo-modo')?.value === 'porcentagem') {
        adicionar('sucessos', 'Quantidade com característica');
      }
    }
    if (formula === 'ic_proporcao' || formula === 'populacao') {
      adicionar('z', 'Valor crítico z');
      adicionar('ep_pct', 'Erro-padrão da proporção');
      if (formula === 'ic_proporcao') {
        adicionar('projecao', 'Pessoas estimadas na população');
        adicionar('projecao_intervalo', 'Faixa estimada de pessoas');
      }
    }
    if (formula === 'amostra') adicionar('z', 'Valor crítico z');
    return itens;
  }

  if (formula === 'ic_media') {
    if (lista) {
      adicionar('media', 'Média obtida da lista');
      adicionar('desvio', 'Desvio-padrão obtido');
      adicionar('n', 'Quantidade de valores');
    }
    adicionar('z', 'Valor crítico z');
    adicionar('ep', 'Erro-padrão da média');
    adicionar('correcao', 'Fator de população finita');
  } else if (formula === 'escore') {
    if (lista) {
      adicionar('media', 'Média obtida da lista');
      adicionar('desvio', 'Desvio-padrão obtido');
    }
    adicionar('diferenca', 'Valor menos média');
  } else if (formula === 'amostra') {
    if (lista) {
      adicionar('n', 'Quantidade de valores');
      adicionar('desvio', 'Desvio-padrão calculado');
    }
    adicionar('z', 'Valor crítico z');
    adicionar('amostra_sem_correcao', 'Amostra sem correção');
  } else if (formula === 'erro_padrao') {
    if (lista) {
      adicionar('n', 'Quantidade de valores');
      adicionar('desvio', 'Desvio-padrão calculado');
    }
  } else if (formula === 'media_amostral') {
    adicionar('n', 'Quantidade de valores');
    adicionar('soma', 'Soma dos valores');
  } else if (formula === 'desvio_padrao' || formula === 'variancia') {
    adicionar('n', 'Quantidade de valores');
    adicionar('media', 'Média calculada');
    if (formula === 'desvio_padrao') adicionar('variancia', 'Variância calculada');
    else adicionar('desvio', 'Desvio-padrão calculado');
  } else if (formula === 'correlacao' || formula === 'regressao') {
    adicionar('n', 'Quantidade de pares');
    adicionar('media_x', 'Média de X');
    adicionar('media_y', 'Média de Y');
    if (formula === 'regressao') adicionar('r2', 'R² · variação explicada');
  }
  return itens;
}

function construirLinhasDerivadas() {
  const container = el('linhas-derivadas');
  container.replaceChildren();
  el('painel-derivados').hidden = true;

  for (const [chave, rotulo] of linhasQueFazemSentido()) {
    const linha = document.createElement('div');
    linha.className = 'linha-derivada';
    linha.dataset.chave = chave;
    linha.hidden = true; // só mostrar quando o Python tiver esse número
    const nome = document.createElement('span');
    nome.className = 'celula-nome';
    nome.textContent = rotulo;
    const valor = document.createElement('output');
    valor.className = 'celula-derivada';
    valor.textContent = '—';
    valor.setAttribute('aria-label', rotulo);
    linha.append(nome, valor);
    container.append(linha);
  }
}

function mostrarIndicadores(dados) {
  // <output> é texto de resultado: o usuário pode selecionar e copiar,
  // mas não pode alterar nem mandar um resultado falso para o Python.
  let temAlgo = false;
  el('linhas-derivadas').querySelectorAll('.linha-derivada').forEach(linha => {
    const valor = dados?.[linha.dataset.chave];
    const disponivel = valor !== undefined && valor !== null && valor !== '';
    linha.hidden = !disponivel;
    linha.querySelector('output').textContent = disponivel ? String(valor) : '—';
    temAlgo ||= disponivel;
  });
  el('painel-derivados').hidden = !temAlgo;
}

function pedirIndicadoresAutomaticos() {
  clearTimeout(timerIndicadores);
  if (!formulaSelecionada) return;
  // Não exibir só z crítico antes do usuário informar qualquer dado.
  const possuiDado = [...el('campos').querySelectorAll('input, textarea')]
    .some(campo => !campo.closest('.campo').hidden && campo.value.trim());
  if (!possuiDado) return;
  const versaoAoPedir = versaoDosCampos;
  const dados = lerCampos();
  timerIndicadores = setTimeout(async () => {
    try {
      const resposta = await pedirAoPython({ ...dados, formula:'indicadores', alvo:formulaSelecionada });
      // Evita que valores de uma questão anterior apareçam na atual.
      if (versaoAoPedir === versaoDosCampos && !respostaPython) {
        mostrarIndicadores(resposta.valores_calculados || {});
      }
    } catch (_) {
      // Campo incompleto não é motivo para mostrar erro enquanto digita.
      // Erros definitivos aparecem somente após clicar em Calcular.
    }
  }, 240);
}

function limparLinhasResultado() {
  el('linhas-resultado').querySelectorAll('output').forEach(item => {
    item.textContent = '—';
    item.closest('.linha-saida').classList.remove('calculado');
  });
}

function mostrarLinhasResultado(resposta) {
  // O Python devolve os valores em "valores_calculados". Aqui apenas
  // os copiamos para a célula que tem o mesmo nome.
  const calculados = resposta.valores_calculados || {};
  el('linhas-resultado').querySelectorAll('.linha-saida').forEach(linha => {
    const campo = linha.querySelector('output');
    const chave = campo.id.replace('saida-', '');
    const pronto = calculados[chave];
    campo.textContent = pronto !== undefined ? pronto :
      chave === 'resultado' || chave === 'intervalo' ? resposta.resultado : '—';
    linha.classList.add('calculado');
  });
}

function exibirCamposCorretos() {
  // Um campo pode depender de DUAS escolhas diferentes:
  // 1) entrada = direto / lista;
  // 2) tipo = média / proporção, ou modo = contagem / porcentagem.
  // Portanto usamos duas condições separadas e não enviamos campos
  // escondidos ao servidor.
  const entrada = el('campo-entrada')?.value || 'direto';
  const tipo = el('campo-tipo')?.value || '';
  const modo = el('campo-modo')?.value || '';
  const formato = el('campo-formato')?.value || '';
  // O rótulo acompanha a fórmula indicada no slide. O nome interno
  // do campo continua sendo "erro", pois é assim que o Python o recebe.
  if (formulaSelecionada === 'amostra') {
    const labelErro = el('campo-erro')?.closest('.campo')?.querySelector('.celula-nome');
    if (labelErro) labelErro.textContent = tipo === 'proporcao'
      ? 'Margem de erro da proporção (Ep)' : 'Erro amostral máximo aceito (Em)';
  }
  el('campos').querySelectorAll('.campo').forEach(grupo => {
    const entradaCorreta = !grupo.dataset.entrada || grupo.dataset.entrada === entrada;
    const opcao = grupo.dataset.mostrar;
    const condicaoCorreta = !opcao || opcao === tipo || opcao === modo || opcao === formato ||
      (opcao === 'com_referencia' && Boolean(el('campo-referencia')?.value.trim()));
    grupo.hidden = !(entradaCorreta && condicaoCorreta);
  });
}

function lerCampos() {
  const dados = {formula: formulaSelecionada};
  el('campos').querySelectorAll('input, textarea, select').forEach(campo => {
    // Um campo oculto não deve ser enviado: evitar dados antigos conflitantes.
    if (!campo.closest('.campo').hidden) dados[campo.name] = campo.value.trim();
  });
  return dados;
}

function camposObrigatoriosPreenchidos() {
  if (!formulaSelecionada) return false;
  const dados = lerCampos();
  return MODULOS[formulaSelecionada].campos.every(campo => {
    const grupo = el(`campo-${campo.id}`).closest('.campo');
    if (grupo.hidden || campo.opcional || campo.id === 'prever') return true;
    return String(dados[campo.id] || '').trim() !== '';
  });
}

function camposAlterados() {
  // Primeiro atualizamos quais campos aparecem; depois o fluxo.
  pararAnimacao();
  exibirCamposCorretos();
  construirLinhasResultado();
  construirLinhasDerivadas();
  versaoDosCampos += 1;
  respostaPython = null;
  ultimoResultado = null;
  atualizarVisor(MODULOS[formulaSelecionada].nome, '0');
  el('painel-resultado').hidden = true;
  el('painel-resultado').open = false;
  limparLinhasResultado();
  el('erro').hidden = true;
  limparAnaliseVisual();
  const campos = [...el('campos').querySelectorAll('input, textarea')].filter(c => !c.closest('.campo').hidden);
  const algumNumero = campos.some(c => c.value.trim() !== '');
  andamento = camposObrigatoriosPreenchidos() ? 'pronto' : algumNumero ? 'editando' : 'vazio';
  desenharFluxo();
  pedirIndicadoresAutomaticos();
}

// ---------------------------------------------------------------------------
// 05 — ENVIO DOS DADOS PARA O PYTHON (ÚNICO LUGAR QUE FAZ CONTAS ESTATÍSTICAS)
// ---------------------------------------------------------------------------
async function pedirAoPython(dados) {
  // Limite de tempo para o navegador não ficar preso caso o servidor pare.
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), 12000);
  try {
    const resposta = await fetch('/api/calcular', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados),
      signal: controle.signal
    });
    const retorno = await resposta.json();
    if (!resposta.ok) throw new Error(retorno.erro || 'Não foi possível concluir o cálculo.');
    return retorno;
  } catch (erro) {
    if (erro.name === 'AbortError') throw new Error('O Python demorou demais para responder. Verifique se o servidor está ligado.');
    if (erro instanceof SyntaxError || erro instanceof TypeError) throw new Error('Sem resposta do Python. Confira o servidor e sua conexão.');
    throw erro;
  } finally {
    clearTimeout(limite);
  }
}

async function calcularFormula(evento) {
  if (evento) evento.preventDefault();
  if (!formulaSelecionada || aguardando) return;
  el('erro').hidden = true;

  if (!camposObrigatoriosPreenchidos()) {
    exibirErro('Preencha todos os campos obrigatórios da fórmula.');
    andamento = 'erro';
    desenharFluxo();
    return;
  }

  // Os botões e campos ficam no mesmo lugar durante a requisição.
  andamento = 'calculando';
  aguardando = true;
  const versaoDaRequisicao = versaoDosCampos;
  desenharFluxo();
  try {
    const resposta = await pedirAoPython(lerCampos());
    // Se o usuário mudou a fórmula ou editou os campos durante a espera,
    // esta resposta já não serve: não sobrescrevemos a conta atual.
    if (versaoDaRequisicao !== versaoDosCampos) return;
    respostaPython = resposta;
    ultimoResultado = resposta.resultado;
    andamento = 'feito';
    clearTimeout(timerIndicadores);
    atualizarVisor(resposta.titulo, resposta.resultado);
    mostrarIndicadores(resposta.valores_calculados || {});
    mostrarLinhasResultado(resposta);
    mostrarResultado(resposta);
    animarEtapasConcluidas();
  } catch (erro) {
    if (versaoDaRequisicao !== versaoDosCampos) return;
    andamento = 'erro';
    exibirErro(erro.message);
    atualizarVisor('Verifique os dados', 'Erro');
  } finally {
    aguardando = false;
    desenharFluxo();
  }
}

function mostrarResultado(resposta) {
  el('painel-resultado').hidden = false;
  el('painel-resultado').open = false;
  el('resultado-completo').textContent = resposta.resultado;
  const lista = el('passos');
  lista.replaceChildren();
  for (const passo of resposta.passos) {
    const item = document.createElement('li');
    item.textContent = passo.replace(/^\d+\.\s*/, '');
    lista.append(item);
  }
  el('interpretacao').textContent = resposta.explicacao;
  el('aviso').hidden = !resposta.aviso;
  el('aviso').textContent = resposta.aviso || '';
  mostrarAnaliseVisual(resposta);
}

function exibirErro(mensagem) {
  el('erro').hidden = false;
  el('erro').textContent = mensagem;
}

function atualizarVisor(expressao, resultado) {
  el('expressao').textContent = expressao;
  el('visor').textContent = resultado;
  // Algumas equações são compridas; reduzir a fonte impede que estourem o visor.
  el('visor').style.fontSize = String(resultado).length > 36 ? '22px' : String(resultado).length > 23 ? '28px' : '';
}

// ---------------------------------------------------------------------------
// 05.0 — TABELAS E GRÁFICOS SIMPLES. OS DADOS VÊM DO PYTHON.
// Não há contas estatísticas aqui: só desenhamos números já devolvidos.
// Usamos SVG nativo para funcionar offline, sem Chart.js ou internet.
// ---------------------------------------------------------------------------
function limparAnaliseVisual() {
  const area = el('painel-visualizacao');
  if (!area) return;
  area.hidden = true;
  el('grafico-resultado').replaceChildren();
  el('tabela-resultado').replaceChildren();
}

function svgel(nome, atributos = {}) {
  const no = document.createElementNS('http://www.w3.org/2000/svg', nome);
  for (const [chave, valor] of Object.entries(atributos)) no.setAttribute(chave, String(valor));
  return no;
}
function graficoTexto(svg, x, y, texto, ancora = 'middle') {
  const t = svgel('text', {x, y, fill:'#e4eaf0', 'font-size':'11', 'text-anchor':ancora});
  t.textContent = String(texto);
  svg.append(t);
}
function criarGrafico(dados) {
  const largura = 700, altura = 280, esquerda = 45, direita = 18, topo = 18, base = 46;
  const svg = svgel('svg', {viewBox:`0 0 ${largura} ${altura}`, role:'img',
    'aria-label': dados.tipo === 'boxplot' ? 'Boxplot de quartis e outliers' :
                  dados.tipo === 'dispersao' ? 'Gráfico de dispersão' : 'Gráfico de frequências'});
  svg.style.width = '100%';
  svg.style.height = 'auto';
  const desenharLinha = (x1,y1,x2,y2,cor='#7f8a96',larg=1) =>
    svg.append(svgel('line',{x1,y1,x2,y2,stroke:cor,'stroke-width':larg}));
  // Desenho de barras — fi em y; os nomes dos grupos ficam no eixo x.
  if (dados.tipo === 'barras' || dados.tipo === 'histograma') {
    const valores=dados.valores || [], rotulos=dados.rotulos || [];
    const max=Math.max(1,...valores), disp=(largura-esquerda-direita)/valores.length;
    desenharLinha(esquerda,altura-base,largura-direita,altura-base);
    valores.forEach((v,i) => {
      const bar=Math.max(0,v/max*(altura-topo-base));
      const eHistograma = dados.tipo === 'histograma';
      svg.append(svgel('rect',{x:esquerda+i*disp+(eHistograma?0:disp*.12),y:altura-base-bar,
        width:eHistograma?disp:disp*.76,height:bar,fill:'#68c99d',rx:eHistograma?0:3}));
      graficoTexto(svg,esquerda+(i+.5)*disp,altura-base-bar-5,v);
      const intervalo = Math.max(1, Math.ceil(valores.length / 9));
      if (i % intervalo === 0) {
        const curto=rotulos[i]?.length>12?rotulos[i].slice(0,11)+'…':rotulos[i];
        graficoTexto(svg,esquerda+(i+.5)*disp,altura-base+18,curto);
      }
    });
  } else if (dados.tipo === 'dispersao') {
    const xs=dados.x, ys=dados.y;
    const minimoX=Math.min(...xs), maximoX=Math.max(...xs);
    const minimoY=Math.min(...ys), maximoY=Math.max(...ys);
    const spanX=maximoX-minimoX || 1, spanY=maximoY-minimoY || 1;
    const xval=v=>esquerda+((v-minimoX)/spanX)*(largura-esquerda-direita);
    const yval=v=>altura-base-((v-minimoY)/spanY)*(altura-topo-base);
    desenharLinha(esquerda,topo,esquerda,altura-base);
    desenharLinha(esquerda,altura-base,largura-direita,altura-base);
    graficoTexto(svg,esquerda,altura-base+18,minimoX);
    graficoTexto(svg,largura-direita,altura-base+18,maximoX);
    graficoTexto(svg,esquerda-6,topo+5,maximoY,'end');
    graficoTexto(svg,esquerda-6,altura-base,minimoY,'end');
    for(let i=0;i<xs.length;i++)
      svg.append(svgel('circle',{cx:xval(xs[i]),cy:yval(ys[i]),r:4,fill:'#81d8ff'}));
    if(Number.isFinite(dados.inclinacao)) {
      desenharLinha(xval(minimoX),yval(dados.inclinacao*minimoX+dados.intercepto),
                   xval(maximoX),yval(dados.inclinacao*maximoX+dados.intercepto),'#68c99d',2);
    }
  } else if (dados.tipo === 'boxplot') {
    const valores=[dados.min,dados.q1,dados.mediana,dados.q3,dados.max,...dados.outliers];
    const min=Math.min(...valores),max=Math.max(...valores),range=max-min||1;
    const x=v=>esquerda+(v-min)/range*(largura-esquerda-direita);
    const y=110;
    desenharLinha(x(dados.min),y,x(dados.max),y,'#8edac6',2);
    svg.append(svgel('rect',{x:x(dados.q1),y:y-36,width:Math.max(2,x(dados.q3)-x(dados.q1)),
      height:72,fill:'#245445',stroke:'#68d9aa','stroke-width':2}));
    desenharLinha(x(dados.mediana),y-36,x(dados.mediana),y+36,'#d8f7e7',3);
    desenharLinha(x(dados.min),y-16,x(dados.min),y+16,'#92e6c8',2);
    desenharLinha(x(dados.max),y-16,x(dados.max),y+16,'#92e6c8',2);
    dados.outliers.forEach(v=>svg.append(svgel('circle',{cx:x(v),cy:y,r:6,fill:'#ffd081'})));
    [['Mín.',dados.min],['Q1',dados.q1],['Med.',dados.mediana],['Q3',dados.q3],['Máx.',dados.max]]
      .forEach(([rotulo,v],i)=>graficoTexto(svg,x(v),i%2?164:188,`${rotulo}: ${v}`));
  }
  return svg;
}

function mostrarAnaliseVisual(resposta) {
  limparAnaliseVisual();
  if (!resposta.tabela?.length && !resposta.grafico?.tipo) return;
  el('painel-visualizacao').hidden = false;
  if (resposta.grafico?.tipo) el('grafico-resultado').append(criarGrafico(resposta.grafico));
  if (resposta.tabela?.length) {
    const table = document.createElement('table');
    table.className='tabela-analise';
    const cab=table.createTHead().insertRow();
    const colunas=Object.keys(resposta.tabela[0]);
    for(const coluna of colunas) {const cel=document.createElement('th');cel.textContent=coluna;cab.append(cel);}
    const corpo=table.createTBody();
    for (const linha of resposta.tabela) {
      const tr=corpo.insertRow();
      for (const col of colunas) {const td=tr.insertCell();td.textContent=String(linha[col] ?? '');}
    }
    el('tabela-resultado').append(table);
  }
}

// ---------------------------------------------------------------------------
// 05.1 — ANIMAÇÃO DO FLUXOGRAMA
// A matemática JÁ acabou no Python. Esta sequência é apenas uma explicação
// visual, e nunca atrasa ou modifica o resultado mostrado na planilha.
// ---------------------------------------------------------------------------
function pararAnimacao() {
  rodadaDaAnimacao++;
  etapaAnimada = null;
}

function animarEtapasConcluidas() {
  pararAnimacao();
  const rodadaAtual = rodadaDaAnimacao;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    etapaAnimada = 4;
    desenharFluxo();
    return;
  }
  etapaAnimada = 0;
  desenharFluxo();
  for (let i = 1; i <= 4; i++) {
    setTimeout(() => {
      if (rodadaAtual === rodadaDaAnimacao && andamento === 'feito') {
        etapaAnimada = i;
        desenharFluxo();
      }
    }, i * 260);
  }
}

// ---------------------------------------------------------------------------
// 06 — NODE-RED SIMPLIFICADO: NÓS E FIOS COM ESTADO VERDE
// A cor informa a etapa. A conta de verdade continua no Python.
// ---------------------------------------------------------------------------
function rotuloCurto(campo, valor) {
  if (valor === undefined || valor === null || String(valor).trim() === '') return '';
  const nomes = {
    x: 'X', y: 'Y', media: 'x̄', desvio: 'σ', n: 'n', valor: 'x', erro: 'E',
    confianca: 'Confiança', percentual: 'p', sucessos: 'sucessos', prever: 'novo X', populacao: 'N'
  };
  return `${nomes[campo] || campo}=${valor}`;
}

function resumoNoFluxo(indice) {
  const dados = lerCampos();
  if (!formulaSelecionada) return indice === 0 ? 'Escolha a função' : '—';

  const porFormula = {
    correlacao: [
      (() => {
        const x = (dados.x || '').split(/[;\n]/).filter(parte => parte.trim()).length;
        const y = (dados.y || '').split(/[;\n]/).filter(parte => parte.trim()).length;
        return x || y ? `X=${x} · Y=${y}` : 'Informe X e Y';
      })(),
      'Médias de X e Y',
      'Desvios dos pares',
      respostaPython ? (respostaPython.passos[3] || '').replace(/^\d+\.\s*/, '') : 'Coeficiente r',
      respostaPython ? respostaPython.resultado : 'Resultado'
    ],
    regressao: [
      (() => {
        const x = (dados.x || '').split(/[;\n]/).filter(parte => parte.trim()).length;
        const y = (dados.y || '').split(/[;\n]/).filter(parte => parte.trim()).length;
        return x || y ? `X=${x} · Y=${y}` : 'Informe X e Y';
      })(),
      'Médias de X e Y',
      respostaPython ? (respostaPython.passos[1] || '').replace(/^\d+\.\s*/, '') : 'Inclinação a',
      respostaPython ? (respostaPython.passos[2] || '').replace(/^\d+\.\s*/, '') : 'Intercepto b',
      respostaPython ? respostaPython.resultado : 'Equação / previsão'
    ],
    // O Python já separa os números em "valores_calculados".
    // Não repetimos as operações estatísticas em JavaScript.
    ic_media: [
      respostaPython
        ? `Média ${respostaPython.valores_calculados.media} · desvio ${respostaPython.valores_calculados.desvio} · n ${respostaPython.valores_calculados.n}`
        : dados.entrada === 'lista'
        ? `${(dados.valores || '').split(/[;\n]/).filter(x => x.trim()).length} observações`
        : [rotuloCurto('media', dados.media),rotuloCurto('desvio', dados.desvio),rotuloCurto('n', dados.n)].filter(Boolean).join(' · ') || 'Informe os dados',
      respostaPython ? `z = ${respostaPython.valores_calculados.z}` : `Confiança = ${dados.confianca || 95}%`,
      respostaPython ? `E = ${respostaPython.valores_calculados.margem} (${respostaPython.valores_calculados.origem_margem})` : 'Margem informada ou calculada',
      respostaPython ? `Inf.: ${respostaPython.valores_calculados.inferior} · Sup.: ${respostaPython.valores_calculados.superior}` : 'Limites a calcular',
      respostaPython ? respostaPython.valores_calculados.intervalo : 'Intervalo final'
    ],
    ic_proporcao: [
      respostaPython ? `n = ${respostaPython.valores_calculados.n}` :
        rotuloCurto('n', dados.n) || (dados.entrada === 'lista' ? `${(dados.valores || '').split(/[;\n]/).filter(x => x.trim()).length} respostas` : 'Informe o total n'),
      respostaPython ? `p = ${respostaPython.valores_calculados.p}` :
        dados.modo === 'porcentagem' ? `p = ${dados.percentual || '—'}%` : `Casos = ${dados.sucessos || '—'}`,
      respostaPython ? `z = ${respostaPython.valores_calculados.z}` : `Confiança = ${dados.confianca || 95}%`,
      respostaPython ? `E = ${respostaPython.valores_calculados.margem} (${respostaPython.valores_calculados.origem_margem})` : 'Margem informada ou calculada',
      respostaPython ? respostaPython.valores_calculados.intervalo : 'Intervalo final'
    ],
    escore: [
      [rotuloCurto('valor', dados.valor), rotuloCurto('media', dados.media)].filter(Boolean).join(' · ') || (dados.entrada === 'lista' ? 'Valor e dados da lista' : 'Informe x e μ'),
      dados.valor && dados.media ? 'x − μ' : 'Diferença x − μ',
      rotuloCurto('desvio', dados.desvio) || 'Informe σ',
      respostaPython ? (respostaPython.passos[1] || '').replace(/^\d+\.\s*/, '') : 'Divisão final',
      respostaPython ? respostaPython.resultado : 'Escore z'
    ],
    populacao: [
      dados.entrada === 'lista' ? 'Respostas informadas' : [rotuloCurto('n',dados.n),rotuloCurto('sucessos',dados.sucessos)].filter(Boolean).join(' · ') || 'Informe a amostra',
      respostaPython ? `p = ${respostaPython.valores_calculados.p}` : 'Dividir casos pelo total',
      respostaPython ? `E = ${respostaPython.valores_calculados.margem}` : 'Margem informada ou calculada',
      rotuloCurto('populacao',dados.populacao) || 'Informe N',
      respostaPython ? respostaPython.resultado : 'Pessoas estimadas'
    ],
    amostra: [
      dados.tipo === 'proporcao' ? 'Objetivo: proporção' : dados.tipo === 'media' ? 'Objetivo: média' : 'Escolha o objetivo',
      dados.confianca ? `Confiança=${dados.confianca}%` : 'Escolha a confiança',
      rotuloCurto('erro', dados.erro) || 'Informe a margem E',
      respostaPython ? (respostaPython.passos[1] || '').replace(/^\d+\.\s*/, '') : 'Cálculo de n',
      respostaPython ? respostaPython.resultado : 'Amostra final'
    ]
  };
  // Essas cinco fórmulas auxiliares mostram as mesmas cinco etapas
  // devolvidas pelo Python, sem refazer nenhuma conta no navegador.
  const auxiliares = ['media_amostral', 'desvio_padrao', 'variancia', 'proporcao_amostral', 'erro_padrao',
                     'descritiva', 'frequencia', 'boxplot', 'classificacao'];
  if (auxiliares.includes(formulaSelecionada)) {
    if (respostaPython) return (respostaPython.passos[indice] || '').replace(/^\d+\.\s*/, '');
    if (indice === 0) {
      if (dados.valores) return `${dados.valores.split(/[;\n]/).filter(v => v.trim()).length} valor(es)`;
      if (dados.sucessos) return `Quantidade = ${dados.sucessos}`;
      if (dados.tipo) return `Tipo = ${dados.tipo}`;
    }
    return '—';
  }
  const lista = porFormula[formulaSelecionada] || [];
  return lista[indice] || '—';
}

// A função antiga que resumia a amostra foi removida: hoje
// "resumoNoFluxo" já atende todas as funções e evita código duplicado.

// Cada frase diz o que estamos FAZENDO naquela etapa, além do número.
// Se a professora pedir uma explicação diferente, altere apenas estas frases.
const EXPLICACOES_FLUXO = {
  correlacao: ['Lemos X e Y em pares.', 'Calculamos a média de cada coluna.', 'Comparamos as variações em conjunto.', 'A razão dessas variações dá r.', 'O sinal e o tamanho explicam a relação.'],
  regressao: ['Pareamos os valores de X e Y.', 'Calculamos as duas médias.', 'Obtemos quanto Y varia com X.', 'Encontramos o início da reta.', 'Montamos a equação para prever Y.'],
  ic_media: ['Lemos ou calculamos média, desvio e n.', 'A confiança determina o z.', 'Multiplicamos z pelo erro-padrão.', 'Subtraímos e somamos a margem.', 'A faixa encontrada estima a média.'],
  ic_proporcao: ['Contamos o total de respostas.', 'Dividimos os casos positivos pelo total.', 'A confiança determina o z.', 'Usamos p, q, n e z para achar E.', 'Subtraímos e somamos E à proporção.'],
  escore: ['Lemos o valor que será comparado.', 'Subtraímos a média do valor.', 'Identificamos o desvio-padrão.', 'Dividimos a diferença pelo desvio.', 'O z mostra quantos desvios separam.'],
  amostra: ['Escolhemos média ou proporção.', 'A confiança define o valor z.', 'Usamos a margem de erro informada.', 'Aplicamos a fórmula para n.', 'Arredondamos o resultado para cima.'],
  populacao: ['Lemos a amostra.', 'Dividimos casos positivos pelo total.', 'Usamos a margem dada ou calculada.', 'Multiplicamos a proporção por N.', 'Exibimos a estimativa, não uma contagem real.'],
  media_amostral: ['Lemos todos os valores.', 'Contamos quantos existem.', 'Somamos os valores.', 'Dividimos a soma pela quantidade.', 'Encontramos a média.'],
  desvio_padrao: ['Lemos todos os valores.', 'Calculamos a média.', 'Somamos os desvios ao quadrado.', 'Dividimos por n−1 ou N.', 'Tiramos a raiz da variância.'],
  variancia: ['Lemos todos os valores.', 'Calculamos a média.', 'Somamos os desvios ao quadrado.', 'Escolhemos n−1 ou N.', 'A divisão resulta na variância.'],
  proporcao_amostral: ['Contamos o total.', 'Contamos os casos positivos.', 'Dividimos positivos pelo total.', 'Obtemos p entre 0 e 1.', 'Multiplicamos por 100 para obter %.'],
  erro_padrao: ['Definimos média ou proporção.', 'Reunimos os dados necessários.', 'Aplicamos a expressão adequada.', 'Efetuamos a divisão ou a raiz.', 'Encontramos o erro-padrão.'],
  descritiva: ['Lemos a coluna do Excel.', 'Ordenamos os números.', 'Calculamos a média.', 'Calculamos o desvio e a variância.', 'Mostramos também a mediana e moda.'],
  frequencia: ['Lemos cada resposta.', 'Agrupamos por valor ou intervalo.', 'Contamos as ocorrências fi.', 'Convertimos fi para porcentagem.', 'Geramos a tabela e o gráfico.'],
  boxplot: ['Ordenamos os números.', 'Localizamos Q1, Q2 e Q3.', 'Calculamos o intervalo interquartil.', 'Verificamos quem está fora dos limites.', 'Desenhamos o boxplot e calculamos z.'],
  classificacao: ['Identificamos a coluna.', 'Analisamos o significado dos dados.', 'Verificamos a ordem das categorias.', 'Identificamos contagem ou medida.', 'Informamos a classificação.']
};

function desenharFluxo() {
  const modulo = formulaSelecionada ? MODULOS[formulaSelecionada] : null;
  const nomes = modulo ? modulo.fluxo : ['Selecionar', 'Informar dados', 'Validar', 'Calcular', 'Resultado'];
  const indiceAtivo = andamento === 'feito' ? (etapaAnimada ?? 4) : andamento === 'calculando' ? 3
    : andamento === 'pronto' || andamento === 'erro' ? 2 : andamento === 'editando' ? 1 : 0;
  const fluxo = el('fluxo');
  fluxo.replaceChildren();

  nomes.forEach((nome, indice) => {
    if (indice > 0) {
      const fio = document.createElement('div');
      fio.className = 'ligacao' + (indice <= indiceAtivo ? ' concluida' : '');
      fluxo.append(fio);
    }
    const no = document.createElement('div');
    no.className = 'no-fluxo';
    if (indice < indiceAtivo) no.classList.add('concluido');
    if (indice === indiceAtivo) no.classList.add(andamento === 'erro' ? 'falhou' : 'ativo');
    const titulo = document.createElement('span');
    titulo.className = 'no-titulo';
    titulo.textContent = nome;
    no.append(titulo);

    const detalhe = document.createElement('span');
    detalhe.className = 'no-dado';
    detalhe.textContent = resumoNoFluxo(indice);
    detalhe.title = detalhe.textContent;
    no.append(detalhe);
    // Quando a professora forneceu a margem, não dizer que nós a calculamos.
    // O texto é didático e acompanha a operação realmente executada pelo Python.
    let frases = EXPLICACOES_FLUXO[formulaSelecionada];
    if (frases && respostaPython && ['ic_media','ic_proporcao','populacao'].includes(formulaSelecionada)) {
      const dados = lerCampos();
      if (dados.margem_informada) {
        frases = [...frases];
        const indiceMargem = formulaSelecionada === 'ic_proporcao' ? 3 : 2;
        frases[indiceMargem] = 'Usamos a margem dada no enunciado.';
      }
    }
    if (frases && respostaPython && andamento === 'feito' && indice <= indiceAtivo) {
      const explicacao = document.createElement('span');
      explicacao.className = 'no-explicacao';
      explicacao.textContent = frases[indice];
      no.append(explicacao);
    }
    fluxo.append(no);
  });

  const rotulos = {
    vazio: modulo ? 'Informe os dados' : 'Aguardando função',
    editando: 'Preenchendo', pronto: 'Pronto para calcular',
    calculando: 'Calculando', feito: 'Concluído', erro: 'Corrija os dados'
  };
  const estado = el('estado-fluxo');
  estado.textContent = rotulos[andamento];
  estado.className = 'estado-fluxo' + (andamento === 'feito' ? ' ok' : andamento === 'erro' ? ' erro' : '');
  el('fluxo-instrucao').textContent = modulo ? 'Os blocos mostram a ordem da resolução.' : 'Selecione uma função para começar.';
}

// ---------------------------------------------------------------------------
// 07 — EXPLICAÇÕES À ESQUERDA: BOTÃO DIREITO OU TOQUE LONGO
// Só criamos textos de referência. O corpo da calculadora fica montado atrás.
// ---------------------------------------------------------------------------
let focoAntesDaAjuda = null;
function abrirAjuda(id) {
  if (!MODULOS[id]) return;
  focoAntesDaAjuda = document.activeElement;
  const modulo = MODULOS[id];
  el('ajuda-titulo').textContent = modulo.nome;
  const conteudo = el('ajuda-conteudo');
  conteudo.replaceChildren();
  const secoes = [
    ['Para que serve?', modulo.guia.conceito],
    ['Como reconhecer no enunciado?', modulo.guia.reconhecer],
    ['O que preencher?', modulo.guia.entradas],
    ['Fórmula', modulo.formula],
    ['O que cada símbolo significa?', modulo.guia.simbolos],
    ['Atenção', modulo.guia.cuidado]
  ];
  for (const [titulo, texto] of secoes) {
    const cabecalho = document.createElement('h3');
    cabecalho.textContent = titulo;
    const paragrafo = document.createElement('p');
    paragrafo.textContent = texto;
    if (titulo === 'Fórmula') paragrafo.className = 'equacao-ajuda';
    if (titulo === 'Atenção') paragrafo.className = 'nota-ajuda';
    conteudo.append(cabecalho, paragrafo);
  }
  el('fundo-ajuda').hidden = false;
  el('painel-ajuda').hidden = false;
  el('fechar-ajuda').focus();
}
function fecharAjuda() {
  el('fundo-ajuda').hidden = true;
  el('painel-ajuda').hidden = true;
  if (focoAntesDaAjuda && focoAntesDaAjuda.focus) focoAntesDaAjuda.focus();
}

// ---------------------------------------------------------------------------
// 08 — TECLADO NUMÉRICO: INSERÇÃO NO CAMPO ATIVO OU CONTA COMUM
// ---------------------------------------------------------------------------
function inserirNoCampo(tecla) {
  if (!campoAtivo || !campoAtivo.isConnected || campoAtivo.closest('.campo').hidden) return false;
  // Operadores são reservados à calculadora básica. Para valores negativos,
  // a tecla ± muda o sinal do campo selecionado.
  if (['+', '-', '*', '/', '=', '%'].includes(tecla)) return false;
  let texto = campoAtivo.value;
  let inicio = campoAtivo.selectionStart ?? texto.length;
  let fim = campoAtivo.selectionEnd ?? texto.length;
  if (tecla === 'C') { campoAtivo.value = ''; inicio = 0; }
  else if (tecla === 'back') {
    if (inicio === fim && inicio > 0) inicio -= 1;
    campoAtivo.setRangeText('', inicio, fim, 'end');
  } else if (tecla === 'sign') {
    campoAtivo.value = texto.startsWith('-') ? texto.slice(1) : '-' + texto;
    inicio = campoAtivo.value.length;
  } else {
    campoAtivo.setRangeText(tecla, inicio, fim, 'end');
  }
  campoAtivo.focus();
  camposAlterados();
  return true;
}

function tecladoBasico(tecla) {
  // Enquanto uma fórmula estiver ativa, = sempre calcula aquela fórmula.
  if (formulaSelecionada) {
    if (tecla === '=') return calcularFormula();
    if (['+', '-', '*', '/', '%'].includes(tecla)) return;
    // Sem campo selecionado, começamos pelo primeiro campo de número.
    // Assim o teclado da calculadora funciona logo após escolher uma função.
    if (!campoAtivo || !campoAtivo.isConnected || campoAtivo.closest('.campo').hidden) {
      campoAtivo = el('campos').querySelector('.campo:not([hidden]) input, .campo:not([hidden]) textarea');
    }
    inserirNoCampo(tecla);
    return;
  }

  // A sequência abaixo só controla números e operações básicas.
  // A operação final é feita pelo Python na seção 'basica' de calculos.py.
  if (/^\d$/.test(tecla)) {
    numeroAtual = digitandoNovoNumero ? tecla : numeroAtual === '0' ? tecla : numeroAtual + tecla;
    digitandoNovoNumero = false;
  } else if (tecla === ',') {
    if (digitandoNovoNumero) { numeroAtual = '0,'; digitandoNovoNumero = false; }
    else if (!numeroAtual.includes(',')) numeroAtual += ',';
  } else if (tecla === 'C') {
    numeroAtual = '0'; primeiroNumero = null; operacaoPendente = null; digitandoNovoNumero = false;
  } else if (tecla === 'back') {
    numeroAtual = numeroAtual.length > 1 ? numeroAtual.slice(0, -1) : '0';
    if (numeroAtual === '-') numeroAtual = '0';
  } else if (tecla === 'sign') {
    numeroAtual = numeroAtual.startsWith('-') ? numeroAtual.slice(1) : '-' + numeroAtual;
  } else if (tecla === '%') {
    // A porcentagem também passa pelo Python para evitar contas duplicadas.
    return calcularBasico(numeroAtual, 'percentual');
  } else if (['+', '-', '*', '/'].includes(tecla)) {
    primeiroNumero = numeroAtual;
    operacaoPendente = tecla;
    digitandoNovoNumero = true;
  } else if (tecla === '=') {
    if (primeiroNumero !== null && operacaoPendente) {
      return calcularBasico(numeroAtual, operacaoPendente, primeiroNumero);
    }
  }
  const operadorVisivel = {'+': '+', '-': '−', '*': '×', '/': '÷'}[operacaoPendente];
  atualizarVisor(operadorVisivel ? `${primeiroNumero} ${operadorVisivel}` : 'Calculadora básica', numeroAtual);
}

async function calcularBasico(segundo, operador, primeiro = '') {
  if (aguardando) return;
  aguardando = true;
  try {
    const resposta = await pedirAoPython({formula:'basica', operacao:operador, primeiro, segundo});
    numeroAtual = resposta.numero;
    atualizarVisor(resposta.formula, numeroAtual);
    primeiroNumero = null;
    operacaoPendente = null;
    digitandoNovoNumero = true;
  } catch (erro) {
    atualizarVisor('Conta não realizada', 'Erro');
    exibirErro(erro.message);
  } finally {
    aguardando = false;
  }
}

// ---------------------------------------------------------------------------
// 09 — LIGAR BOTÕES, ATALHOS E INICIAR A INTERFACE
// ---------------------------------------------------------------------------
function iniciarBotoes() {
  document.querySelectorAll('.tecla-formula').forEach(botao => {
    // Clique esquerdo: selecionar a conta. Direito: explicar sem selecionar.
    botao.addEventListener('click', () => {
      if (botao.dataset.toqueLongo === 'sim') {
        botao.dataset.toqueLongo = '';
        return;
      }
      selecionarFormula(botao.dataset.formula);
    });
    botao.addEventListener('contextmenu', evento => {
      evento.preventDefault();
      abrirAjuda(botao.dataset.formula);
    });
    // Em celulares não existe botão direito: segurar por 650 ms abre a ajuda.
    let temporizador;
    botao.addEventListener('pointerdown', evento => {
      if (evento.pointerType === 'mouse') return;
      temporizador = setTimeout(() => {
        botao.dataset.toqueLongo = 'sim';
        abrirAjuda(botao.dataset.formula);
      }, 650);
    });
    for (const evento of ['pointerup', 'pointerleave', 'pointercancel']) {
      botao.addEventListener(evento, () => clearTimeout(temporizador));
    }
  });

  el('teclado').querySelectorAll('[data-key]').forEach(botao => {
    botao.addEventListener('click', () => tecladoBasico(botao.dataset.key));
  });
  el('formulario').addEventListener('submit', calcularFormula);
  el('fechar-ajuda').addEventListener('click', fecharAjuda);
  el('fundo-ajuda').addEventListener('click', fecharAjuda);
  el('limpar-campos').addEventListener('click', () => {
    el('campos').querySelectorAll('input, textarea').forEach(campo => campo.value = '');
    camposAlterados();
    atualizarVisor(MODULOS[formulaSelecionada].nome, '0');
  });

  // Atalho de teclado: quando um input está focado, o navegador escreve nele.
  // Fora dos campos, as teclas físicas usam a calculadora básica.
  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && !el('painel-ajuda').hidden) return fecharAjuda();
    if (!el('painel-ajuda').hidden) return;
    if (evento.target.closest('input, textarea, select')) return;
    if (evento.target.closest('button') && (evento.key === 'Enter' || evento.key === ' ')) return;
    const tecla = evento.key === 'Enter' ? '=' : evento.key === 'Backspace' ? 'back'
      : evento.key === 'Escape' ? 'C' : evento.key === '.' ? ',' : evento.key;
    if (/^\d$/.test(tecla) || ['=', 'back', 'C', ',', '+', '-', '*', '/', '%'].includes(tecla)) {
      evento.preventDefault();
      tecladoBasico(tecla);
    }
  });
}

async function conferirPython() {
  try {
    const resposta = await fetch('/api/saude', {cache:'no-store'});
    if (!resposta.ok) throw new Error('Sem conexão');
    el('conexao').classList.remove('falha');
    el('conexao').lastChild.textContent = ' Python conectado';
  } catch (_) {
    el('conexao').classList.add('falha');
    el('conexao').lastChild.textContent = ' Python indisponível';
  }
}

iniciarBotoes();
desenharFluxo();
conferirPython();
