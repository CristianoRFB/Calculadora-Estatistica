/* =============================================================
   INTERFACE DA CALCULADORA
   Este JavaScript NÃO faz cálculos estatísticos.
   Ele só monta os campos, envia ao Python e mostra as respostas.
   Assim, se alguma fórmula precisar de correção, abra calculos.py.
   ============================================================= */

// =============================================================
// DESCRIÇÃO DAS FÓRMULAS E CAMPOS MOSTRADOS NO PC E NO CELULAR
// =============================================================
const MODULOS = [
  {
    id: 'correlacao', titulo: 'Correlação de Pearson', menu: 'Correlação', icone: 'r',
    descricao: 'Verifique se duas variáveis caminham juntas e se a relação linear é positiva, negativa, fraca ou forte.',
    formula: 'r = Σ[(xi − x̄)(yi − ȳ)] / √(Σ(xi − x̄)² × Σ(yi − ȳ)²)',
    botao: 'Correlação — r',
    pistas: '“Existe relação?”, “correlação entre X e Y”, “força da relação”, “Pearson” ou “relação positiva e negativa”.',
    legenda: [['r', 'coeficiente entre −1 e +1'], ['X', 'primeira variável'], ['Y', 'segunda variável'], ['x̄, ȳ', 'médias de X e Y'], ['Σ', 'somatório (soma de todos os pares)']],
    campos: [
      {id: 'x', nome: 'Valores de X', dica: 'Separe os números com ; (ponto e vírgula)', area: true, amplo: true, placeholder: '100; 200; 300; 400; 500; 600'},
      {id: 'y', nome: 'Valores de Y', dica: 'Um Y correspondente para cada X', area: true, amplo: true, placeholder: '50; 80; 130; 190; 260; 350'}
    ],
    exemplos: [
      {nome: 'Servidor: requisições × tempo', dados: {x:'100; 200; 300; 400; 500; 600', y:'50; 80; 130; 190; 260; 350'}},
      {nome: 'Bugs × complexidade do código', dados: {x:'3; 5; 8; 10; 12; 15', y:'2; 4; 7; 9; 11; 13'}}
    ]
  },
  {
    id: 'regressao', titulo: 'Regressão linear simples', menu: 'Regressão linear', icone: 'ŷ',
    descricao: 'Encontre a equação da reta pelos mínimos quadrados e estime qual será Y para um novo valor de X.',
    formula: 'a = Σ[(xi − x̄)(yi − ȳ)] / Σ(xi − x̄)²;  b = ȳ − ax̄;  ŷ = ax + b',
    botao: 'Regressão — ŷ = ax + b',
    pistas: '“Equação da reta”, “previsão”, “inclinação”, “intercepto”, “quanto será Y se X for...” ou “regressão”.',
    legenda: [['a', 'inclinação: quanto Y muda por unidade de X'], ['b', 'intercepto: Y quando X = 0'], ['ŷ', 'valor previsto de Y'], ['X', 'variável que explica'], ['Y', 'variável a prever']],
    campos: [
      {id: 'x', nome: 'Valores de X', dica: 'Use ; para separar', area: true, amplo: true, placeholder:'100; 200; 300; 400; 500; 600'},
      {id: 'y', nome: 'Valores de Y', dica: 'Mesma quantidade de números que X', area: true, amplo: true, placeholder:'50; 80; 130; 190; 260; 350'},
      {id: 'prever', nome: 'Novo X para prever Y (opcional)', dica: 'Deixe vazio se quiser somente a equação', placeholder:'700'}
    ],
    exemplos: [
      {nome: 'Servidor: prever em 700 requisições', dados:{x:'100; 200; 300; 400; 500; 600',y:'50; 80; 130; 190; 260; 350',prever:'700'}},
      {nome: 'Bugs e complexidade', dados:{x:'3; 5; 8; 10; 12; 15',y:'2; 4; 7; 9; 11; 13',prever:'16'}},
      {nome: 'Usuários × consumo de banda', dados:{x:'50;80;100;150;200;250;300;350;400;450;500', y:'110;165;200;280;380;490;560;600;700;830;1290',prever:'520'}}
    ]
  },
  {
    id: 'ic_media', titulo: 'Intervalo de confiança da média', menu: 'IC da média', icone: 'μ',
    descricao: 'Estime o intervalo provável para uma média populacional a partir da média, desvio-padrão e amostra.',
    formula: 'E = z × σ / √n;   IC = (x̄ − E; x̄ + E)',
    botao: 'IC da média — x̄ ± E',
    pistas: '“Média de...”, “tempo médio”, “altura média”, “desvio-padrão”, “amostra de n” e “95% de confiança”.',
    legenda: [['x̄', 'média encontrada na amostra'], ['σ ou s', 'desvio-padrão informado'], ['n', 'quantidade de observações'], ['z', 'valor crítico (90%, 95% ou 99%)'], ['E', 'margem de erro da média']],
    campos: [
      {id:'media',nome:'Média amostral (x̄)',dica:'Ex.: média de 320 ms',placeholder:'320'},
      {id:'desvio',nome:'Desvio-padrão (σ ou s)',dica:'Ex.: 45 ms',placeholder:'45'},
      {id:'n',nome:'Tamanho da amostra (n)',dica:'Amostra de quantas medições?',placeholder:'50'},
      {id:'confianca',nome:'Nível de confiança',opcoes:[['90','90% — z = 1,645'],['95','95% — z = 1,96'],['99','99% — z = 2,575']]}
    ],
    exemplos: [
      {nome:'Tempo de resposta do servidor',dados:{media:'320',desvio:'45',n:'50',confianca:'95'}},
      {nome:'Consumo de RAM (99%)',dados:{media:'2,8',desvio:'0,4',n:'36',confianca:'99'}},
      {nome:'Altura de estudantes (95%)',dados:{media:'1,75',desvio:'0,13',n:'40',confianca:'95'}},
      {nome:'Sessões de usuários (90%)',dados:{media:'18,5',desvio:'4,2',n:'60',confianca:'90'}}
    ]
  },
  {
    id: 'ic_proporcao', titulo: 'Intervalo de confiança da proporção', menu: 'IC da proporção', icone: '%',
    descricao: 'Estime a porcentagem de uma população a partir de sucessos ou de uma proporção medida na amostra.',
    formula: 'p = sucessos / n;  E = z × √[p(1 − p)/n];  IC = (p − E; p + E)',
    botao: 'IC da proporção — p ± E',
    pistas: '“Quantos de um total”, “porcentagem de pessoas”, “taxa de defeitos”, “34 em 200”, “satisfação” ou “proporção”.',
    legenda: [['p', 'parte da amostra com a característica'], ['n', 'tamanho da amostra'], ['z', 'valor crítico escolhido'], ['E', 'margem em pontos percentuais'], ['IC', 'limites da proporção estimada']],
    campos: [
      {id:'n',nome:'Total de observações (n)',dica:'Ex.: 200 módulos analisados',placeholder:'200'},
      {id:'sucessos',nome:'Quantidade com a característica',dica:'Ex.: 34 com bugs. Se usar p%, deixe vazio.',placeholder:'34'},
      {id:'percentual',nome:'Proporção conhecida, em % (opcional)',dica:'Use somente se não souber a contagem de sucessos',placeholder:'17'},
      {id:'confianca',nome:'Nível de confiança',opcoes:[['90','90% — z = 1,645'],['95','95% — z = 1,96'],['99','99% — z = 2,575']]}
    ],
    exemplos: [
      {nome:'34 módulos com bugs em 200',dados:{n:'200',sucessos:'34',percentual:'',confianca:'95'}},
      {nome:'2FA: 315 entre 500 usuários',dados:{n:'500',sucessos:'315',percentual:'',confianca:'99'}},
      {nome:'Satisfação: 560 entre 800',dados:{n:'800',sucessos:'560',percentual:'',confianca:'95'}},
      {nome:'Barbeador: 40 de 100',dados:{n:'100',sucessos:'40',percentual:'',confianca:'90'}}
    ]
  },
  {
    id: 'escore', titulo: 'Escore Z', menu: 'Escore Z', icone: 'z',
    descricao: 'Descubra quantos desvios-padrão um valor observado está acima ou abaixo da média.',
    formula: 'z = (x − μ) / σ',
    botao: 'Escore Z — (x − μ) / σ',
    pistas: '“Valor observado”, “média”, “desvio-padrão”, “quantos desvios acima da média” ou “valor fora do normal”.',
    legenda: [['x', 'valor observado no exercício'], ['μ', 'média de referência'], ['σ', 'desvio-padrão (não pode ser zero)'], ['z', 'quantos desvios o valor se afastou']],
    campos: [
      {id:'valor',nome:'Valor observado (x)',dica:'O número que quero comparar',placeholder:'280'},
      {id:'media',nome:'Média (μ)',dica:'O valor médio de referência',placeholder:'200'},
      {id:'desvio',nome:'Desvio-padrão (σ)',dica:'Dispersão dos dados',placeholder:'40'}
    ],
    exemplos: [
      {nome:'Servidor: resposta de 280 ms',dados:{valor:'280',media:'200',desvio:'40'}},
      {nome:'RAM: 5,5 GB com média de 4',dados:{valor:'5,5',media:'4',desvio:'0,5'}},
      {nome:'Rede: latência de 20 ms',dados:{valor:'20',media:'30',desvio:'5'}},
      {nome:'Prova: nota 8, média 6',dados:{valor:'8',media:'6',desvio:'1'}}
    ]
  },
  {
    id: 'amostra', titulo: 'Tamanho mínimo da amostra', menu: 'Tamanho da amostra', icone: 'n',
    descricao: 'Descubra quantas pessoas, requisições ou observações devem ser analisadas para a precisão desejada.',
    formula: 'Média: n = (zσ/E)²;  Proporção: n = z² × p(1 − p)/E²',
    botao: 'Tamanho da amostra — n',
    pistas: '“Quantas pessoas preciso pesquisar?”, “número mínimo de observações”, “margem de erro desejada” ou “tamanho da amostra”.',
    legenda: [['n', 'quantidade mínima de observações'], ['σ', 'desvio-padrão (para médias)'], ['p', 'proporção estimada (para taxas)'], ['E', 'margem de erro desejada'], ['z', 'nível de confiança']],
    campos: [
      {id:'tipo',nome:'O que será estimado?',opcoes:[['media','Média'],['proporcao','Proporção / porcentagem']]},
      {id:'desvio',nome:'Desvio-padrão (só para média)',dica:'Ex.: 1250 ms',placeholder:'1250',apenas:'media'},
      {id:'percentual',nome:'Proporção estimada, em %',dica:'Deixe vazio para 50% (conservador)',placeholder:'15',apenas:'proporcao'},
      {id:'erro',nome:'Margem de erro desejada',dica:'Para média: unidade normal. Para proporção: em %.',placeholder:'100'},
      {id:'confianca',nome:'Nível de confiança',opcoes:[['90','90% — z = 1,645'],['95','95% — z = 1,96'],['99','99% — z = 2,575']]}
    ],
    exemplos: [
      {nome:'API: desvio 1250, erro 100 ms',dados:{tipo:'media',desvio:'1250',erro:'100',confianca:'95'}},
      {nome:'Pesquisa: 30%, erro de 2%',dados:{tipo:'proporcao',percentual:'30',erro:'2',confianca:'95'}},
      {nome:'Falhas de software: 15%, erro 3%',dados:{tipo:'proporcao',percentual:'15',erro:'3',confianca:'95'}}
    ]
  }
];

// =============================================================
// FUNÇÕES SIMPLES PARA ENCONTRAR OS ELEMENTOS DA PÁGINA
// =============================================================
const peloId = (id) => document.getElementById(id);
let moduloAtual = MODULOS[4]; // Abre o Escore Z inicialmente.
let ultimaResposta = null;

function elemento(tag, classe, texto) {
  // Criamos os elementos com textContent para tratar entradas como texto, não HTML.
  const node = document.createElement(tag);
  if (classe) node.className = classe;
  if (texto !== undefined) node.textContent = texto;
  return node;
}

// =============================================================
// DESENHO DO MENU E ESCOLHA DA FÓRMULA
// =============================================================
function montarMenu() {
  const menu = peloId('menu');
  menu.replaceChildren();
  MODULOS.forEach((modulo) => {
    const botao = elemento('button', 'nav-button' + (modulo.id === moduloAtual.id ? ' active' : '' ));
    botao.type = 'button';
    botao.setAttribute('aria-pressed', String(modulo.id === moduloAtual.id));
    botao.append(elemento('span','nav-icon',modulo.icone), elemento('span','',modulo.menu));
    botao.addEventListener('click', () => selecionarModulo(modulo.id));
    menu.append(botao);
  });
}

function selecionarModulo(id) {
  const proximo = MODULOS.find((modulo) => modulo.id === id);
  if (!proximo) return;
  moduloAtual = proximo;
  ultimaResposta = null;
  montarMenu();
  peloId('titulo-modulo').textContent = proximo.titulo;
  peloId('descricao-modulo').textContent = proximo.descricao;
  peloId('formula-visual').textContent = proximo.formula;
  peloId('numero-modulo').textContent = String(MODULOS.indexOf(proximo)+1).padStart(2,'0') + ' / 06';
  peloId('nome-botao').textContent = proximo.botao;
  peloId('pistas').textContent = proximo.pistas;
  peloId('erro').hidden = true;
  montarCampos();
  montarLegenda();
  montarExemplos();
  limparResultado();
}

// =============================================================
// CRIAÇÃO DOS CAMPOS: INPUT, SELECT OU TEXTAREA
// =============================================================
function montarCampos() {
  const area = peloId('campos');
  area.replaceChildren();
  moduloAtual.campos.forEach((campo) => {
    const envoltorio = elemento('div','field' + (campo.amplo ? ' wide' : ''));
    envoltorio.dataset.apenas = campo.apenas || '';
    const rotulo = elemento('label','',campo.nome);
    rotulo.htmlFor = campo.id;
    if (campo.dica) rotulo.append(elemento('span','hint',campo.dica));
    let entrada;
    if (campo.opcoes) {
      entrada = elemento('select');
      campo.opcoes.forEach(([valor,nome]) => {
        const opcao = elemento('option','',nome);
        opcao.value = valor;
        entrada.append(opcao);
      });
    } else if (campo.area) {
      entrada = elemento('textarea');
      entrada.rows = 2;
      entrada.spellcheck = false;
    } else {
      entrada = elemento('input');
      entrada.type = 'text';
      entrada.inputMode = 'decimal';
      entrada.autocomplete = 'off';
    }
    entrada.id = campo.id;
    entrada.name = campo.id;
    entrada.placeholder = campo.placeholder || '';
    envoltorio.append(rotulo, entrada);
    area.append(envoltorio);
    if (campo.id === 'tipo') entrada.addEventListener('change', atualizarTipoAmostra);
  });
  atualizarTipoAmostra();
}

function atualizarTipoAmostra() {
  // Na amostra, escondemos os campos que não pertencem ao tipo escolhido.
  const tipo = peloId('tipo')?.value || 'media';
  document.querySelectorAll('[data-apenas]').forEach((campo) => {
    campo.hidden = Boolean(campo.dataset.apenas && campo.dataset.apenas !== tipo);
  });
  const campoErro = document.querySelector('label[for="erro"] .hint');
  if (campoErro && moduloAtual.id === 'amostra') {
    campoErro.textContent = tipo === 'media' ? 'Informe o erro na mesma unidade do desvio-padrão.' : 'Informe pontos percentuais: 2 significa 2%.';
  }
}

function montarLegenda() {
  const area = peloId('legenda');
  area.replaceChildren();
  moduloAtual.legenda.forEach(([simbolo,descricao]) => {
    const linha = elemento('div','legend-row');
    linha.append(elemento('span','legend-symbol',simbolo),elemento('span','',descricao));
    area.append(linha);
  });
}

function montarExemplos() {
  const area = peloId('exemplos');
  area.replaceChildren();
  moduloAtual.exemplos.forEach((exemplo) => {
    const botao = elemento('button','example-button');
    botao.type = 'button';
    botao.append(elemento('span','',exemplo.nome), elemento('span','', '↗'));
    botao.addEventListener('click', () => carregarExemplo(exemplo));
    area.append(botao);
  });
}

function carregarExemplo(exemplo) {
  // Preenche sem calcular: o estudante escolhe quando resolver.
  peloId('form-calculadora').reset();
  Object.entries(exemplo.dados).forEach(([chave,valor]) => {
    const campo = peloId(chave);
    if (campo) campo.value = valor;
  });
  atualizarTipoAmostra();
  peloId('erro').hidden = true;
  limparResultado();
  document.querySelector('.calculator').scrollIntoView({behavior:'smooth',block:'start'});
}

function limparResultado() {
  const area = peloId('resultado');
  const vazio = elemento('div','result-placeholder');
  vazio.append(elemento('div','placeholder-icon','='),
    elemento('h3','','A resposta aparece aqui'),
    elemento('p','','Use um exemplo da aula ou informe os valores do problema para começar.'));
  area.replaceChildren(vazio);
}

// =============================================================
// ENVIO DOS NÚMEROS PARA O PYTHON, ONDE AS FÓRMULAS ESTÃO
// =============================================================
async function executarCalculo(evento) {
  evento.preventDefault();
  const botao = peloId('calcular');
  const alerta = peloId('erro');
  const dados = {formula: moduloAtual.id};
  moduloAtual.campos.forEach((campo) => {
    const entrada = peloId(campo.id);
    if (entrada && !entrada.closest('[hidden]')) dados[campo.id] = entrada.value.trim();
  });
  alerta.hidden = true;
  botao.disabled = true;
  try {
    const resposta = await fetch('/api/calcular', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(dados)
    });
    const resultado = await resposta.json();
    if (!resposta.ok) throw new Error(resultado.erro || 'Não foi possível calcular.');
    ultimaResposta = resultado;
    mostrarResultado(resultado);
  } catch (erro) {
    ultimaResposta = null;
    alerta.textContent = erro instanceof TypeError
      ? 'Não foi possível se comunicar com o Python. Confira se app.py está aberto.'
      : erro.message;
    alerta.hidden = false;
  } finally {
    botao.disabled = false;
  }
}

// =============================================================
// MOSTRAR RESPOSTA, ETAPAS E JUSTIFICATIVA EM LINGUAGEM HUMANA
// =============================================================
function mostrarResultado(dados) {
  const area = peloId('resultado');
  const cabecalho = elemento('div','result-head');
  cabecalho.append(elemento('h3','',dados.titulo));
  const copiar = elemento('button','copy-button','Copiar resposta');
  copiar.type = 'button';
  copiar.addEventListener('click',copiarResposta);
  cabecalho.append(copiar);
  const etapas = elemento('div','result-steps');
  etapas.append(elemento('h4','','Resolução passo a passo'));
  const lista = elemento('ol');
  dados.passos.forEach((passo) => lista.append(elemento('li','',passo)));
  etapas.append(lista);
  const partes = [cabecalho, elemento('div','result-value',dados.resultado),
    elemento('p','result-explanation',dados.explicacao)];
  if (dados.detalhes.length) {
    const pequenos = elemento('div','result-mini');
    dados.detalhes.forEach((texto) => pequenos.append(elemento('span','',texto)));
    partes.push(pequenos);
  }
  partes.push(etapas);
  if (dados.aviso) partes.push(elemento('div','result-warning',dados.aviso));
  area.replaceChildren(...partes);
  area.scrollIntoView({behavior:'smooth',block:'nearest'});
}

async function copiarResposta() {
  if (!ultimaResposta) return;
  const texto = [ultimaResposta.titulo, ultimaResposta.resultado, ultimaResposta.formula,
    ...ultimaResposta.passos, ultimaResposta.explicacao].join('\n');
  try {
    await navigator.clipboard.writeText(texto);
    const botao = document.querySelector('.copy-button');
    if (botao) botao.textContent = 'Copiado!';
  } catch (_) {
    // Copiar pode ser bloqueado fora de HTTPS; a resposta continua visível.
    const botao = document.querySelector('.copy-button');
    if (botao) botao.textContent = 'Selecione o texto para copiar';
  }
}

// =============================================================
// INICIAR A PÁGINA (E FACILITAR A APRESENTAÇÃO COM CTRL + ENTER)
// =============================================================
peloId('form-calculadora').addEventListener('submit',executarCalculo);
peloId('limpar').addEventListener('click', () => {
  peloId('form-calculadora').reset();
  atualizarTipoAmostra();
  peloId('erro').hidden = true;
  ultimaResposta = null;
  limparResultado();
});
document.addEventListener('keydown',(evento) => {
  if ((evento.ctrlKey || evento.metaKey) && evento.key === 'Enter') {
    evento.preventDefault();
    peloId('form-calculadora').requestSubmit();
  }
});
selecionarModulo('escore');
