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
      {id: 'media', titulo: 'Média amostral (x̄)', dica: 'O valor médio informado no problema.', tipo: 'texto'},
      {id: 'desvio', titulo: 'Desvio-padrão (σ ou s)', dica: 'Mede a dispersão dos valores.', tipo: 'texto'},
      {id: 'n', titulo: 'Tamanho da amostra (n)', dica: 'Quantidade observada na pesquisa.', tipo: 'texto'},
      {id: 'confianca', titulo: 'Grau de confiança', tipo: 'confianca'}
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
      {id: 'confianca', titulo: 'Grau de confiança', tipo: 'confianca'}
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
  // Clicar novamente na mesma fórmula volta ao modo de calculadora comum.
  formulaSelecionada = formulaSelecionada === id ? null : id;
  versaoDosCampos += 1;
  ultimoResultado = null;
  respostaPython = null;
  campoAtivo = null;
  andamento = 'vazio';
  el('erro').hidden = true;
  el('painel-resultado').hidden = true;

  document.querySelectorAll('.tecla-formula').forEach(botao => {
    botao.classList.toggle('selecionada', botao.dataset.formula === formulaSelecionada);
    botao.setAttribute('aria-pressed', String(botao.dataset.formula === formulaSelecionada));
  });

  if (!formulaSelecionada) {
    el('nome-formula').textContent = 'Escolha uma função';
    el('pista').textContent = 'Selecione a conta que a professora pediu. Os campos aparecerão aqui.';
    el('formula-escrita').hidden = true;
    el('campos').replaceChildren();
    el('acoes').hidden = true;
    el('botao-ajuda').disabled = true;
    atualizarVisor('Calculadora básica', numeroAtual);
    desenharFluxo();
    return;
  }

  const modulo = MODULOS[formulaSelecionada];
  el('nome-formula').textContent = modulo.nome;
  el('pista').textContent = modulo.pista;
  el('formula-escrita').textContent = modulo.formula;
  el('formula-escrita').hidden = false;
  el('acoes').hidden = false;
  el('botao-ajuda').disabled = false;
  atualizarVisor(modulo.nome, '0');
  construirCampos();
  desenharFluxo();
}

// ---------------------------------------------------------------------------
// 04 — FORMULÁRIO COM CAMPOS DIFERENTES PARA CADA FÓRMULA
// Se precisar adicionar um campo, inclua-o na lista 'campos' do módulo acima.
// ---------------------------------------------------------------------------
function construirCampos() {
  const container = el('campos');
  container.replaceChildren();
  const modulo = MODULOS[formulaSelecionada];

  // Ao escolher uma nova fórmula começamos com campos vazios.
  // Trocar o modo de proporção NÃO recria os campos; só os esconde.

  for (const definicao of modulo.campos) {
    const grupo = document.createElement('div');
    grupo.className = 'campo';
    if (definicao.tipo === 'lista') grupo.classList.add('inteiro');
    grupo.dataset.mostrar = definicao.mostrar || '';

    const label = document.createElement('label');
    label.htmlFor = `campo-${definicao.id}`;
    label.textContent = definicao.titulo;
    grupo.append(label);

    // Select é usado somente para escolhas; os números ficam em inputs/textareas.
    let campo;
    if (definicao.tipo === 'confianca' || definicao.tipo === 'modo_proporcao' || definicao.tipo === 'tipo_amostra') {
      campo = document.createElement('select');
      const opcoes = definicao.tipo === 'confianca'
        ? [['90', '90%'], ['95', '95%'], ['99', '99%']]
        : definicao.tipo === 'modo_proporcao'
        ? [['contagem', 'Tenho a quantidade'], ['porcentagem', 'Tenho a porcentagem']]
        : [['media', 'Média'], ['proporcao', 'Proporção']];
      for (const [valor, titulo] of opcoes) {
        const opcao = new Option(titulo, valor);
        campo.append(opcao);
      }
      if (definicao.tipo === 'confianca') campo.value = '95';
    } else if (definicao.tipo === 'lista') {
      campo = document.createElement('textarea');
      campo.rows = 2;
      campo.placeholder = 'Separe por ; ou quebre uma linha';
    } else {
      campo = document.createElement('input');
      campo.type = 'text';
      campo.inputMode = 'decimal';
      campo.autocomplete = 'off';
      campo.spellcheck = false;
    }
    campo.id = `campo-${definicao.id}`;
    campo.name = definicao.id;
    campo.addEventListener('focus', () => { if (campo.tagName !== 'SELECT') campoAtivo = campo; });
    campo.addEventListener('input', camposAlterados);
    campo.addEventListener('change', camposAlterados);
    grupo.append(campo);

    if (definicao.dica) {
      const dica = document.createElement('span');
      dica.className = 'dica';
      dica.textContent = definicao.dica;
      grupo.append(dica);
    }
    container.append(grupo);
  }
  exibirCamposCorretos();
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
    mostrarResultado(resposta);
    el('historico-atual').textContent = `${resposta.titulo}: ${resposta.resultado}`;
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
    if (respostaPython) {
      // O primeiro bloco mostra os dados; os seguintes mostram as etapas reais.
      // 'passos' vem do Python, portanto a interface NÃO faz as contas de novo.
      const indicesPassos = {
        correlacao: [null, 1, 2, 3, null],
        regressao: [null, 0, 1, 2, null],
        ic_media: [null, 0, 1, 2, null],
        ic_proporcao: [null, 0, 1, 2, null],
        escore: [null, 0, null, 1, null],
        amostra: [null, 0, null, 1, null]
      };
      const passoId = indicesPassos[formulaSelecionada][indice];
      if (indice === 0) detalhe.textContent = resumirEntrada();
      else if (indice === 4) detalhe.textContent = respostaPython.resultado;
      else if (formulaSelecionada === 'escore' && indice === 2) detalhe.textContent = 'σ = ' + lerCampos().desvio;
      else if (formulaSelecionada === 'amostra' && indice === 2) detalhe.textContent = 'E = ' + lerCampos().erro;
      else detalhe.textContent = (respostaPython.passos[passoId] || '').replace(/^\d+\.\s*/, '');
    } else if (indice === 0 && modulo) {
      detalhe.textContent = resumirEntrada();
    } else if (indice === indiceAtivo) {
      detalhe.textContent = andamento === 'erro' ? 'Corrija os campos' :
        andamento === 'calculando' ? 'Python processando' :
        andamento === 'pronto' ? 'Pronto para calcular' :
        andamento === 'editando' ? 'Preencha os restantes' : 'Aguardando';
    } else {
      detalhe.textContent = '—';
    }
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
  el('fluxo-instrucao').textContent = modulo ?
    'Os blocos mostram a ordem da resolução. O verde indica onde o cálculo está.' :
    'Selecione uma função no teclado da calculadora.';
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
    el('historico-atual').textContent = resposta.formula + ' = ' + numeroAtual;
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
  el('botao-ajuda').addEventListener('click', () => abrirAjuda(formulaSelecionada));
  el('fechar-ajuda').addEventListener('click', fecharAjuda);
  el('fundo-ajuda').addEventListener('click', fecharAjuda);
  el('limpar-campos').addEventListener('click', () => {
    el('campos').querySelectorAll('input, textarea').forEach(campo => campo.value = '');
    camposAlterados();
    atualizarVisor(MODULOS[formulaSelecionada].nome, '0');
  });
  el('limpar-historico').addEventListener('click', () => {
    el('historico-atual').textContent = 'Nenhuma conta realizada.';
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
