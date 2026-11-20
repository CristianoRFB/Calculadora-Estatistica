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
      {id: 'prever', titulo: 'Novo X para prever Y (opcional)', dica: 'Deixe vazio se a professora pedir só a equação.', tipo: 'texto'}
    ],
    guia: {
      conceito: 'Regressão constrói a reta que melhor representa os pares X e Y. Diferentemente da correlação, também serve para fazer uma previsão.',
      reconhecer: 'Escute “encontre a equação”, “coeficiente angular”, “intercepto”, “preveja”, “qual será Y quando X…” ou “regressão linear”.',
      entradas: 'X é a variável explicativa; Y é o resultado que você quer prever. Informe as duas listas na mesma ordem. O campo “novo X” é opcional.',
      simbolos: 'a é a inclinação da reta; b é o intercepto, valor previsto quando X é zero. ŷ (“y chapéu”) é o Y previsto.',
      cuidado: 'Se os X forem todos iguais, a inclinação não existe. Previsões muito longe dos X observados podem ser pouco confiáveis.'
    }
  },
  ic_media: {
    nome: 'Intervalo de confiança da média',
    formula: 'E = z · σ / √n;  IC = (x̄ − E; x̄ + E)',
    pista: 'O enunciado pede dois limites para estimar uma média, informando média, desvio e tamanho da amostra.',
    fluxo: ['Dados da média', 'Valor crítico z', 'Margem E', 'Limites', 'Intervalo IC'],
    campos: [
      {id: 'media', titulo: 'Média', dica: 'O valor médio informado no problema.', tipo: 'texto'},
      {id: 'desvio', titulo: 'Desvio-padrão', dica: 'Mede a dispersão dos valores.', tipo: 'texto'},
      {id: 'confianca', titulo: 'Alfa (α)', tipo: 'confianca'},
      {id: 'n', titulo: 'Tamanho (n)', dica: 'Quantidade observada na pesquisa.', tipo: 'texto'}
    ],
    guia: {
      conceito: 'Um intervalo de confiança da média apresenta uma faixa estimada para a média verdadeira da população.',
      reconhecer: '“Tempo médio”, “altura média”, “consumo médio”, “intervalo de confiança para a média” e dados de média/desvio/amostra.',
      entradas: 'Copie a média, o desvio-padrão, o número de observações n e o grau de confiança. Não confunda o desvio com a margem de erro.',
      simbolos: 'x̄ é média da amostra. σ é desvio-padrão da população (ou s em certas condições). n é o tamanho da amostra. E é a margem de erro.',
      cuidado: 'O método usa os valores críticos Z ensinados em aula. Se σ for desconhecido e a amostra for pequena, pode ser necessário usar t de Student.'
    }
  },
  ic_proporcao: {
    nome: 'Intervalo de confiança da proporção',
    formula: 'p = sucessos / n;  E = z · √[p(1 − p)/n];  IC = (p − E; p + E)',
    pista: 'A pergunta envolve porcentagem de pessoas, acertos, defeitos ou outra contagem dentro de um total.',
    fluxo: ['Amostra n', 'Proporção p', 'Valor crítico z', 'Margem E', 'Intervalo IC'],
    campos: [
      {id: 'n', titulo: 'Quantidade total (n)', dica: 'Total de pessoas, registros ou itens analisados.', tipo: 'texto'},
      {id: 'modo', titulo: 'Como a proporção foi informada?', tipo: 'modo_proporcao'},
      {id: 'sucessos', titulo: 'Quantidade com a característica', dica: 'Número dentro do total n.', tipo: 'texto', mostrar: 'contagem'},
      {id: 'percentual', titulo: 'Proporção observada (%)', dica: 'Digite a porcentagem, sem o símbolo %.', tipo: 'texto', mostrar: 'porcentagem'},
      {id: 'confianca', titulo: 'Alfa (α)', tipo: 'confianca'}
    ],
    guia: {
      conceito: 'Aqui o interesse não é um valor médio, mas a parte de um total. O intervalo estima a proporção verdadeira da população.',
      reconhecer: '“Quantos de um total”, “percentual”, “taxa de defeitos”, “proporção”, “satisfação”, “aprovação” ou “fração”.',
      entradas: 'Informe o total n e escolha entre informar a quantidade com a característica ou a porcentagem já calculada. Não misture os dois modos.',
      simbolos: 'p é a proporção observada (de 0 a 1), n é o total e E é a margem de erro. O resultado aparece em porcentagem.',
      cuidado: 'A quantidade com a característica deve estar entre zero e n. Para amostras pequenas ou proporções extremas, a aproximação normal pode falhar.'
    }
  },
  escore: {
    nome: 'Escore Z',
    formula: 'z = (x − μ) / σ',
    pista: 'O enunciado pergunta quantos desvios-padrão um valor está acima ou abaixo da média.',
    fluxo: ['Valor e média', 'Diferença x − μ', 'Desvio σ', 'Divisão', 'Escore z'],
    campos: [
      {id: 'valor', titulo: 'Valor observado (x)', dica: 'O número específico que será comparado.', tipo: 'texto'},
      {id: 'media', titulo: 'Média (μ)', dica: 'Média do grupo.', tipo: 'texto'},
      {id: 'desvio', titulo: 'Desvio-padrão (σ)', dica: 'Precisa ser maior que zero.', tipo: 'texto'}
    ],
    guia: {
      conceito: 'O escore Z diz a distância entre um valor e a média, medida em unidades de desvio-padrão.',
      reconhecer: '“Posição relativa”, “escore”, “padronização”, “distância da média” ou “quantos desvios-padrão”.',
      entradas: 'x é o valor que você quer analisar, μ é a média do grupo e σ é o desvio-padrão.',
      simbolos: 'z positivo significa acima da média; z negativo, abaixo. Zero significa exatamente na média.',
      cuidado: 'O desvio-padrão não pode ser zero. O escore sozinho não diz se o resultado é bom ou ruim.'
    }
  },
  amostra: {
    nome: 'Tamanho da amostra',
    formula: 'Média: n = (z · σ / E)²   |   Proporção: n = z² · p(1 − p) / E²',
    pista: 'A questão pergunta quantas observações, pessoas ou medições serão necessárias.',
    fluxo: ['Objetivo', 'Confiança z', 'Margem de erro', 'Calcular n', 'Arredondar'],
    campos: [
      {id: 'tipo', titulo: 'O que você quer estimar?', tipo: 'tipo_amostra'},
      {id: 'desvio', titulo: 'Desvio-padrão (σ)', dica: 'Para estimar uma média.', tipo: 'texto', mostrar: 'media'},
      {id: 'percentual', titulo: 'Proporção prevista (%) — opcional', dica: 'Em branco, o cálculo usa p = 50% como opção conservadora.', tipo: 'texto', mostrar: 'proporcao'},
      {id: 'erro', titulo: 'Margem de erro máxima (E)', dica: 'Na média, use a unidade original. Na proporção, informe pontos percentuais.', tipo: 'texto'},
      {id: 'confianca', titulo: 'Grau de confiança', tipo: 'confianca'}
    ],
    guia: {
      conceito: 'O tamanho da amostra diz quantos dados precisamos coletar para atingir a margem de erro e a confiança desejadas.',
      reconhecer: '“Quantos serão necessários”, “amostra mínima”, “número de participantes” ou “quantas medições coletar”.',
      entradas: 'Primeiro escolha média ou proporção. Na média, informe desvio e erro na mesma unidade. Na proporção, informe porcentagem prevista (se souber) e margem em pontos percentuais.',
      simbolos: 'n é a quantidade mínima. z é o valor crítico da confiança. σ é o desvio-padrão. E é a margem de erro tolerada.',
      cuidado: 'O tamanho calculado é sempre arredondado para CIMA, mesmo que a parte decimal seja pequena.'
    }
  },
  // ========================================================
  // FÓRMULAS AUXILIARES. O PYTHON FAZ AS CONTAS.
  // Estas teclas ficam dentro de "Cálculos auxiliares".
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
  proporcao_amostral: {
    nome: 'Proporção amostral',
    formula: 'p̂ = quantidade com característica / total',
    pista: 'Informe quantos casos têm a característica e quantos existem no total.',
    fluxo: ['Total', 'Casos', 'Divisão', 'Proporção', 'Porcentagem'],
    campos: [
      {id:'sucessos', titulo:'Quantidade com a característica', tipo:'texto'},
      {id:'n', titulo:'Quantidade total', tipo:'texto'}
    ],
    guia: {
      conceito:'Calcula que parte da amostra apresenta uma característica, expressa em número decimal ou porcentagem.',
      reconhecer:'"Quantos de um total", "taxa de defeitos", "proporção" ou "porcentagem da amostra".',
      entradas:'Informe uma quantidade inteira com a característica e a quantidade total de itens.',
      simbolos:'p̂ é a proporção amostral; n é o total; a quantidade favorável nunca pode superar n.',
      cuidado:'Para obter a porcentagem, multiplique a proporção decimal por 100.'
    }
  },
  erro_padrao: {
    nome: 'Erro-padrão',
    formula: 'Média: EP = s / √n  |  Proporção: EP = √[p̂(1 − p̂) / n]',
    pista: 'O erro-padrão é usado antes da margem de erro em um intervalo de confiança.',
    fluxo: ['Tipo', 'Amostra', 'Fórmula', 'Resultado', 'Erro-padrão'],
    campos: [
      {id:'tipo', titulo:'Qual o tipo?', tipo:'tipo_amostra'},
      {id:'n', titulo:'Quantidade de observações (n)', tipo:'texto'},
      {id:'desvio', titulo:'Desvio-padrão (σ ou s)', tipo:'texto', mostrar:'media'},
      {id:'percentual', titulo:'Proporção observada (%)', tipo:'texto', mostrar:'proporcao'}
    ],
    guia: {
      conceito:'O erro-padrão mede a variação esperada de uma média ou proporção amostral entre amostras.',
      reconhecer:'"Erro-padrão", "erro da média" ou a etapa anterior à margem de erro no intervalo de confiança.',
      entradas:'Para média: desvio-padrão e n. Para proporção: porcentagem observada e n.',
      simbolos:'EP é erro-padrão, n é tamanho da amostra, s ou σ é desvio-padrão, p̂ é proporção.',
      cuidado:'O erro-padrão não é igual à margem de erro; para obter a margem, multiplica-se pelo valor crítico z.'
    }
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
  formulaSelecionada = id;
  campoAtivo = null;
  versaoDosCampos += 1;
  respostaPython = null;
  ultimoResultado = null;
  andamento = 'vazio';
  el('painel-resultado').hidden = true;
  el('painel-resultado').open = false;
  el('linhas-resultado').hidden = true;
  el('erro').hidden = true;

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

    const nome = document.createElement('label');
    nome.className = 'celula-nome';
    nome.htmlFor = `campo-${definicao.id}`;
    nome.textContent = definicao.titulo;
    grupo.append(nome);

    const celulaValor = document.createElement('div');
    celulaValor.className = 'celula-entrada';
    let campo;
    if (['confianca', 'modo_proporcao', 'tipo_amostra', 'tipo_dispersao'].includes(definicao.tipo)) {
      campo = document.createElement('select');
      // No intervalo mostramos o ALFA, mas enviamos a confiança ao Python.
      const opcoes = definicao.tipo === 'confianca'
        ? (formulaSelecionada.startsWith('ic_')
          ? [['90', '0,10  ·  90%'], ['95', '0,05  ·  95%'], ['99', '0,01  ·  99%']]
          : [['90', '90%  (α = 0,10)'], ['95', '95%  (α = 0,05)'], ['99', '99%  (α = 0,01)']])
        : definicao.tipo === 'modo_proporcao'
        ? [['contagem', 'Quantidade'], ['porcentagem', 'Porcentagem']]
        : definicao.tipo === 'tipo_dispersao'
        ? [['amostral', 'Amostral (n − 1)'], ['populacional', 'Populacional (N)']]
        : [['media', 'Média'], ['proporcao', 'Proporção']];
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
}

// Cada resultado tem sua última linha, como o Excel da professora.
// Nos intervalos, a primeira saída é a margem (INT.CONFIANÇA no Excel)
// e a última é o intervalo completo [média - E; média + E].
function construirLinhasResultado() {
  const container = el('linhas-resultado');
  container.replaceChildren();
  const linhas = formulaSelecionada === 'ic_media' || formulaSelecionada === 'ic_proporcao'
    ? [['margem', 'Margem de erro'], ['intervalo', 'Intervalo de confiança']]
    : [['resultado', 'Resultado']];

  for (const [chave, nome] of linhas) {
    const linha = document.createElement('div');
    linha.className = 'linha-saida';
    const titulo = document.createElement('span');
    titulo.className = 'celula-nome';
    titulo.textContent = nome;
    const valor = document.createElement('output');
    valor.className = 'celula-resultado';
    valor.id = `saida-${chave}`;
    valor.textContent = '—';
    linha.append(titulo, valor);
    container.append(linha);
  }
  container.hidden = false;
}

function limparLinhasResultado() {
  el('linhas-resultado').querySelectorAll('output').forEach(item => {
    item.textContent = '—';
    item.closest('.linha-saida').classList.remove('calculado');
  });
}

function mostrarLinhasResultado(resposta) {
  // Os valores chegam PRONTOS do Python. Nenhuma fórmula é repetida no JS.
  const resultados = resposta.valores_calculados || {};
  const margem = el('saida-margem');
  const intervalo = el('saida-intervalo');
  const resultado = el('saida-resultado');
  if (margem) margem.textContent = resultados.margem || '—';
  if (intervalo) intervalo.textContent = resultados.intervalo || resposta.resultado;
  if (resultado) resultado.textContent = resposta.resultado;
  el('linhas-resultado').querySelectorAll('.linha-saida').forEach(linha => {
    linha.classList.add('calculado');
  });
}

function exibirCamposCorretos() {
  const valores = lerCampos();
  // IC proporção: escolha entre contagem e porcentagem.
  // Amostra: escolha entre média e proporção.
  el('campos').querySelectorAll('[data-mostrar]').forEach(grupo => {
    const mostrar = grupo.dataset.mostrar;
    const visivel = !mostrar || mostrar === valores.modo || mostrar === valores.tipo;
    grupo.hidden = !visivel;
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
    if (grupo.hidden || campo.id === 'prever' ||
        (formulaSelecionada === 'amostra' && campo.id === 'percentual')) return true;
    return String(dados[campo.id] || '').trim() !== '';
  });
}

function camposAlterados() {
  // Primeiro atualizamos quais campos aparecem; depois o fluxo.
  exibirCamposCorretos();
  versaoDosCampos += 1;
  respostaPython = null;
  ultimoResultado = null;
  atualizarVisor(MODULOS[formulaSelecionada].nome, '0');
  el('painel-resultado').hidden = true;
  el('painel-resultado').open = false;
  limparLinhasResultado();
  el('erro').hidden = true;
  const campos = [...el('campos').querySelectorAll('input, textarea')].filter(c => !c.closest('.campo').hidden);
  const algumNumero = campos.some(c => c.value.trim() !== '');
  andamento = camposObrigatoriosPreenchidos() ? 'pronto' : algumNumero ? 'editando' : 'vazio';
  desenharFluxo();
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
    atualizarVisor(resposta.titulo, resposta.resultado);
    mostrarLinhasResultado(resposta);
    mostrarResultado(resposta);
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
// 06 — NODE-RED SIMPLIFICADO: NÓS E FIOS COM ESTADO VERDE
// A cor informa a etapa. A conta de verdade continua no Python.
// ---------------------------------------------------------------------------
function rotuloCurto(campo, valor) {
  if (valor === undefined || valor === null || String(valor).trim() === '') return '';
  const nomes = {
    x: 'X', y: 'Y', media: 'x̄', desvio: 'σ', n: 'n', valor: 'x', erro: 'E',
    confianca: 'Confiança', percentual: 'p', sucessos: 'sucessos', prever: 'novo X'
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
    ic_media: [
      [rotuloCurto('media', dados.media), rotuloCurto('desvio', dados.desvio), rotuloCurto('n', dados.n)].filter(Boolean).join(' · ') || 'Informe média, desvio e n',
      dados.confianca ? `Confiança=${dados.confianca}%` : 'Escolha a confiança',
      respostaPython ? (respostaPython.passos[1] || '').replace(/^\d+\.\s*/, '') : 'Margem E',
      respostaPython ? (respostaPython.passos[2] || '').replace(/^\d+\.\s*/, '') : 'Limites do intervalo',
      respostaPython ? respostaPython.resultado : 'Intervalo final'
    ],
    ic_proporcao: [
      rotuloCurto('n', dados.n) || 'Informe o total n',
      dados.modo === 'porcentagem'
        ? (dados.percentual ? `p=${dados.percentual}%` : 'Informe a porcentagem')
        : (dados.sucessos ? `sucessos=${dados.sucessos}` : 'Informe a quantidade'),
      dados.confianca ? `Confiança=${dados.confianca}%` : 'Escolha a confiança',
      respostaPython ? (respostaPython.passos[1] || '').replace(/^\d+\.\s*/, '') : 'Margem E',
      respostaPython ? respostaPython.resultado : 'Intervalo final'
    ],
    escore: [
      [rotuloCurto('valor', dados.valor), rotuloCurto('media', dados.media)].filter(Boolean).join(' · ') || 'Informe x e μ',
      dados.valor && dados.media ? 'x − μ' : 'Diferença x − μ',
      rotuloCurto('desvio', dados.desvio) || 'Informe σ',
      respostaPython ? (respostaPython.passos[1] || '').replace(/^\d+\.\s*/, '') : 'Divisão final',
      respostaPython ? respostaPython.resultado : 'Escore z'
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
  const auxiliares = ['media_amostral', 'desvio_padrao', 'variancia', 'proporcao_amostral', 'erro_padrao'];
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

function resumirEntrada() {

  const dados = lerCampos();
  if (!formulaSelecionada) return 'Escolha no teclado';
  if (formulaSelecionada === 'correlacao' || formulaSelecionada === 'regressao') {
    const x = (dados.x || '').split(/[;\n]/).filter(parte => parte.trim()).length;
    const y = (dados.y || '').split(/[;\n]/).filter(parte => parte.trim()).length;
    return `X: ${x} valor(es) · Y: ${y} valor(es)`;
  }
  const itens = Object.entries(dados).filter(([chave, valor]) =>
    !['formula', 'modo', 'tipo', 'confianca'].includes(chave) && valor);
  return itens.length ? itens.map(([chave, valor]) => `${chave}=${valor}`).join(' · ') : 'Aguardando dados';
}

function desenharFluxo() {
  const modulo = formulaSelecionada ? MODULOS[formulaSelecionada] : null;
  const nomes = modulo ? modulo.fluxo : ['Selecionar', 'Informar dados', 'Validar', 'Calcular', 'Resultado'];
  const indiceAtivo = andamento === 'feito' ? 4 : andamento === 'calculando' ? 3
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
