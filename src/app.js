/*
 * INTERFACE — botões, campos e apresentação dos resultados.
 * As fórmulas ficam em calculos.js; aqui só lemos entradas e mostramos a conta.
 * Para trocar o nome de um campo, altere seu <label> no index.html.
 */
(() => {
  'use strict';
  // M é um apelido para as funções de matemática de calculos.js.
  const M = globalThis.Calculos;
  // Busca um elemento do HTML pelo nome único dele (id).
  const $ = id => document.getElementById(id);
  // Converte números para texto com vírgula brasileira.
  const fmt = (n, casas = 4) => n.toLocaleString('pt-BR', {maximumFractionDigits: casas});
  // Multiplica o decimal por 100 e acrescenta o símbolo de porcentagem.
  const percentual = (p, casas = 2) => `${fmt(p * 100, casas)}%`;
  // Lê o campo preenchido e verifica se o texto é um número.
  const lido = (form, nome, titulo) => M.numero(form.elements.namedItem(nome).value, titulo);
  // Lê a confiança escolhida e a transforma em número.
  const confianca = form => Number(form.elements.namedItem('confianca').value);

  // Trocar assunto não apaga o que foi digitado nas outras abas.
  function abrirAba(id) {
    for (const secao of document.querySelectorAll('.assunto')) {
      const selecionada = secao.id === `aba-${id}`;
      secao.hidden = !selecionada;
      secao.classList.toggle('visivel', selecionada);
    }
    for (const botao of document.querySelectorAll('.aba')) {
      const selecionado = botao.dataset.aba === id;
      botao.classList.toggle('ativa', selecionado);
      if (selecionado) botao.setAttribute('aria-current', 'page');
      else botao.removeAttribute('aria-current');
    }
  }

  // Exibe o valor Z sem pedir ao estudante que procure uma tabela.
  function atualizarZ(form) {
    const id = form.id.slice(5);
    const saída = document.querySelector(`[data-z="${id}"]`);
    saída.textContent = `Z = ${fmt(M.valorCritico(confianca(form)), 3)}`;
  }

  // Campos descobertos automaticamente: o estudante não consegue editá-los.
  function atualizarComplemento() {
    const form = $('form-ap');
    const desconhecida = $('ap-desconhecida').checked;
    const campo = $('ap-p');
    campo.disabled = desconhecida;
    campo.placeholder = desconhecida ? '50' : 'Digite a porcentagem';
    if (desconhecida) { $('ap-complemento').textContent = '50%'; return; }
    try {
      const p = M.porcentagem(M.numero(campo.value), 'Proporção');
      $('ap-complemento').textContent = percentual(1 - p);
    } catch (_) { $('ap-complemento').textContent = '—'; }
  }
  // Divide a quantidade com a característica pelo total pesquisado.
  function atualizarProporcao() {
    try {
      const form = $('form-ip');
      const n = M.inteiro(lido(form, 'n', 'Tamanho da amostra'), 'Tamanho da amostra');
      // Lê o texto inteiro para não perder o símbolo %. A matemática decide qual modo usar.
      const dado = M.lerCaracteristica(form.elements.namedItem('sucessos').value, n);
      $('ip-proporcao').textContent = `${percentual(dado.p)} com a característica`;
    } catch (_) { $('ip-proporcao').textContent = '—'; }
  }
  // Calcula o erro atual para descobrir como diminuir a margem.
  function atualizarErro() {
    try {
      const form = $('form-de');
      const desvio = lido(form, 'desvio', 'Desvio-padrão');
      const n = M.inteiro(lido(form, 'n', 'Tamanho atual da amostra'), 'Tamanho atual da amostra');
      const e = M.valorCritico(confianca(form)) * desvio / Math.sqrt(n);
      $('de-atual').textContent = desvio > 0 ? fmt(e, 6) : '—';
    } catch (_) { $('de-atual').textContent = '—'; }
  }

  // Cada operação usa EXCLUSIVAMENTE as funções matemáticas do arquivo calculos.js.
  function executar(id, form) {
    // Estas funções só transformam números em texto. Não mudam a conta.
    // Nos intervalos de confiança (IM e IP), os resultados visíveis arredondam para cima.
    // Exemplo: 1,231 vira 1,24 com duas casas; -1,231 vira -1,23 (em direção ao maior número).
    // Nas demais abas, a exibição usa o arredondamento normal. O valor completo não arredonda.
    // Nenhuma opção altera os valores guardados nem as contas feitas com eles.
    const paraCima = id === 'im' || id === 'ip';
    // Alguns navegadores antigos não conhecem roundingMode. Este teste detecta isso.
    const aceitaCeil = new Intl.NumberFormat('pt-BR', {roundingMode:'ceil'}).resolvedOptions().roundingMode === 'ceil';
    // Deslocar a vírgula pela notação científica evita erros de multiplicação como 0,07 × 100.
    const deslocar = (n, k) => {
      const [coef, expoente = '0'] = String(n).split('e');
      return Number(coef + 'e' + (Number(expoente) + k));
    };
    const formatar = (n, casas, estilo = 'decimal') => {
      if (casas === 'completo') return n.toLocaleString('pt-BR', {style:estilo, maximumSignificantDigits:21});
      const opcoes = {style:estilo, minimumFractionDigits:casas, maximumFractionDigits:casas};
      if (paraCima && aceitaCeil) opcoes.roundingMode = 'ceil';
      if (paraCima && !aceitaCeil) {
        // Alternativa para navegadores antigos: desloca, arredonda para cima e volta a vírgula.
        const k = casas + (estilo === 'percent' ? 2 : 0);
        const ampliado = deslocar(n, k);
        if (Number.isFinite(ampliado)) n = deslocar(Math.ceil(ampliado), -k);
      }
      return n.toLocaleString('pt-BR', opcoes);
    };
    const dec = (n, casas) => formatar(n, casas);
    // O próprio navegador transforma a fração em porcentagem sem multiplicações extras.
    const pct = (p, casas) => formatar(p, casas, 'percent');
    const z = M.valorCritico(confianca(form));
    // A resolução matemática usa os mesmos números da resposta, sem refazer a conta.
    // x mostra um número sem limitar suas casas; F representa uma fração (parte de cima e de baixo).
    const x = n => dec(n, 'completo');
    const F = (numerador, denominador) => ({numerador, denominador});
    // Cada linha é uma lista de textos e frações, na ordem em que aparecem no papel.
    // O sinal ≈ indica que o número exibido pode ter sido arredondado.
    const eq = (...partes) => partes;
    const fim = (n, casas) => ' ≈ ' + dec(n, casas);
    // O tamanho mínimo é sempre inteiro: não podemos pesquisar uma parte de uma pessoa.
    // A frase mostra também o resultado decimal ANTES de arredondar para cima.
    // Assim, ao clicar em mais casas, a frase acompanha a precisão escolhida.
    // AM: número mínimo de medições para estimar uma média.
    if (id === 'am') {
      const r = M.amostraMedia({confianca: confianca(form), desvio: lido(form, 'desvio', 'Desvio-padrão'), erro: lido(form, 'erro', 'Erro máximo')});
      return (casas = 2) => ({
        titulo: 'Tamanho mínimo da amostra', valor: `n = ${fmt(r.n, 0)}`,
        frase: `O cálculo resulta em ${dec(r.exato, casas)}. Arredondando para cima, são necessárias pelo menos ${fmt(r.n, 0)} observações para estimar a média com ${confianca(form)}% de confiança.`,
        extras: [['Antes de arredondar', dec(r.exato, casas)]],
        formulas: [
          ['Fórmula original', eq('n = (', F('Z · σ', 'Em'), ')²')],
          ['Substituindo os valores', eq('n = (', F(x(z) + ' · ' + x(r.desvio), x(r.erro)), ')²')],
          ['Resultado do cálculo', eq('n', fim(r.exato, casas))],
          ['Tamanho mínimo (arredondando para cima)', eq('n = ', fmt(r.n, 0))]
        ],
        passos: [
          ['Identificar o valor crítico', `Para ${confianca(form)}% de confiança, usamos Z = ${fmt(z, 3)}.`],
          ['Substituir na fórmula', `n = (${fmt(z, 3)} × ${dec(r.desvio, 'completo')} ÷ ${dec(r.erro, 'completo')})² ≈ ${dec(r.exato, casas)}.`],
          ['Arredondar para cima', `Precisamos de ${fmt(r.n, 0)} observações, pois não existe uma fração de pessoa ou medição.`]
        ]
      });
    }
    // AP: número mínimo de pessoas ou itens para estimar uma porcentagem.
    if (id === 'ap') {
      const p = $('ap-desconhecida').checked ? 50 : lido(form, 'p', 'Proporção estimada');
      const r = M.amostraProporcao({confianca: confianca(form), percentual: p, erro: lido(form, 'erro', 'Erro da proporção')});
      return (casas = 2) => ({
        titulo: 'Tamanho mínimo da amostra', valor: `n = ${fmt(r.n, 0)}`,
        frase: `O cálculo resulta em ${dec(r.exato, casas)}. Arredondando para cima, são necessárias pelo menos ${fmt(r.n, 0)} observações para estimar a proporção com ${confianca(form)}% de confiança.`,
        extras: [['Proporção (p)', pct(r.p, casas)], ['Complemento (1 − p)', pct(r.q, casas)], ['Antes de arredondar', dec(r.exato, casas)]],
        formulas: [
          ['Fórmula original', eq('n = ', F('Z² · p · (1 − p)', 'Ep²'))],
          ['Transformando os percentuais', eq('p = ', F(x(p), '100'), ' = ' + x(r.p) + '; 1 − p = ' + x(r.q) + '; Ep = ' + x(r.ep))],
          ['Substituindo os valores', eq('n = ', F(x(z) + '² · ' + x(r.p) + ' · ' + x(r.q), x(r.ep) + '²'))],
          ['Resultado do cálculo', eq('n', fim(r.exato, casas))],
          ['Tamanho mínimo (arredondando para cima)', eq('n = ', fmt(r.n, 0))]
        ],
        passos: [
          ['Transformar porcentagens em decimais', `p = ${dec(r.p, 'completo')}, complemento = ${dec(r.q, 'completo')} e Ep = ${dec(r.ep, 'completo')}.`],
          ['Aplicar a fórmula', `n = ${fmt(z, 3)}² × ${dec(r.p, 'completo')} × ${dec(r.q, 'completo')} ÷ ${dec(r.ep, 'completo')}² ≈ ${dec(r.exato, casas)}.`],
          ['Arredondar para cima', `A amostra mínima é de ${fmt(r.n, 0)} observações.`]
        ]
      });
    }
    // IM: média menos a margem e média mais a margem.
    if (id === 'im') {
      const r = M.intervaloMedia({confianca: confianca(form), media: lido(form, 'media', 'Média amostral'), desvio: lido(form, 'desvio', 'Desvio-padrão'), n: lido(form, 'n', 'Tamanho da amostra')});
      return (casas = 2) => ({
        grafico: { inferior: dec(r.inferior, casas), centro: dec(r.media, casas), superior: dec(r.superior, casas), rotulo: 'Média amostral', pontual: r.inferior === r.superior },
        titulo: 'Intervalo de confiança', valor: `${dec(r.inferior, casas)} a ${dec(r.superior, casas)}`,
        frase: `Com ${confianca(form)}% de confiança, estimamos a média populacional entre ${dec(r.inferior, casas)} e ${dec(r.superior, casas)}.`,
        extras: [['Margem de erro (Em)', dec(r.margem, casas)], ['Limite inferior', dec(r.inferior, casas)], ['Limite superior', dec(r.superior, casas)]],
        formulas: [
          ['Fórmula da margem de erro', eq('Em = ', F('Z · σ', '√n'))],
          ['Substituindo os valores', eq('Em = ', F(x(z) + ' · ' + x(r.desvio), '√' + fmt(r.n, 0)), fim(r.margem, casas))],
          ['Fórmula do intervalo', eq('IC = x̄ ± Em')],
          ['Limite inferior', eq('x̄ − Em = ' + x(r.media) + ' − ' + x(r.margem), fim(r.inferior, casas))],
          ['Limite superior', eq('x̄ + Em = ' + x(r.media) + ' + ' + x(r.margem), fim(r.superior, casas))],
          ['Intervalo de confiança', eq('IC ≈ [' + dec(r.inferior, casas) + ' ; ' + dec(r.superior, casas) + ']')]
        ],
        aviso: [r.aviso, casas === 'completo' ? '' : 'Exibição arredondada para cima. Para conferir os limites originais, selecione Valor completo.'].filter(Boolean).join(' '),
        passos: [
          ['Escolher o valor crítico', `Para ${confianca(form)}% de confiança, usamos Z = ${fmt(z, 3)}.`],
          ['Calcular a margem de erro', `Em = ${fmt(z, 3)} × ${dec(r.desvio, 'completo')} ÷ √${fmt(r.n, 0)} ≈ ${dec(r.margem, casas)}.`],
          ['Encontrar os dois limites', `${dec(r.media, 'completo')} − ${dec(r.margem, 'completo')} ≈ ${dec(r.inferior, casas)}; ${dec(r.media, 'completo')} + ${dec(r.margem, 'completo')} ≈ ${dec(r.superior, casas)}.`]
        ]
      });
    }
    // IP: proporção menos a margem e proporção mais a margem.
    if (id === 'ip') {
      const padraoTexto = form.elements.namedItem('padrao').value.trim();
      const r = M.intervaloProporcao({confianca: confianca(form), sucessos: form.elements.namedItem('sucessos').value, n: lido(form, 'n', 'Tamanho da amostra'), padrao: padraoTexto ? lido(form, 'padrao', 'Padrão estabelecido') : null});
      let comparacao = '';
      if (r.padrao !== null) comparacao = r.atendePadrao
        ? `Considerando os valores sem arredondar, o limite superior está abaixo do padrão de ${dec(r.padrao, 'completo')}%. Pelo critério informado, a condição foi atendida.`
        : `Considerando os valores sem arredondar, o intervalo não fica inteiro abaixo do padrão de ${dec(r.padrao, 'completo')}%. Não dá para garantir a condição.`;
      return (casas = 2) => ({
        grafico: { inferior: pct(r.inferior, casas), centro: pct(r.p, casas), superior: pct(r.superior, casas), rotulo: 'Proporção amostral', pontual: r.inferior === r.superior },
        titulo: 'Intervalo de confiança', valor: `${pct(r.inferior, casas)} a ${pct(r.superior, casas)}`,
        frase: `Com ${confianca(form)}% de confiança, estimamos a proporção populacional entre ${pct(r.inferior, casas)} e ${pct(r.superior, casas)}.`,
        extras: [['Com a característica', pct(r.p, casas)], ['Sem a característica', pct(r.q, casas)], ['Margem de erro', `${dec(deslocar(r.margem, 2), casas)} pontos percentuais`]],
        formulas: [
          ['Proporção amostral', r.percentualInformado === null
            ? eq('p = ', F('sucessos', 'n'), ' = ', F(fmt(r.sucessos, 0), fmt(r.n, 0)), ' ≈ ' + x(r.p))
            : eq('p = ', F(x(r.percentualInformado), '100'), ' = ' + x(r.p))],
          ['Complemento', eq('1 − p = 1 − ' + x(r.p) + ' ≈ ' + x(r.q))],
          ['Fórmula da margem de erro', eq('Ep = Z · √(p · (1 − p) / n)')],
          ['Substituindo os valores', eq('Ep = ' + x(z) + ' · √(', F(x(r.p) + ' · ' + x(r.q), fmt(r.n, 0)), ') ≈ ' + x(r.margem))],
          ['Fórmula do intervalo', eq('IC = p ± Ep')],
          ['Limite inferior', eq('p − Ep = ' + x(r.p) + ' − ' + x(r.margem) + ' ≈ ' + pct(r.inferior, casas))],
          ['Limite superior', eq('p + Ep = ' + x(r.p) + ' + ' + x(r.margem) + ' ≈ ' + pct(r.superior, casas))],
          ['Intervalo de confiança', eq('IC ≈ [' + pct(r.inferior, casas) + ' ; ' + pct(r.superior, casas) + ']')]
        ],
        aviso: [...r.avisos, comparacao, casas === 'completo' ? '' : 'Exibição arredondada para cima. Para conferir os limites originais, selecione Valor completo.'].filter(Boolean).join(' '),
        passos: [
          // Se o exercício já der a porcentagem, basta dividir por 100, sem descobrir uma contagem.
          ['Encontrar a proporção', r.percentualInformado === null
            ? `p = ${fmt(r.sucessos, 0)} ÷ ${fmt(r.n, 0)} = ${dec(r.p, 'completo')}; complemento = ${dec(r.q, 'completo')}.`
            : `p = ${dec(r.percentualInformado, 'completo')}% ÷ 100 = ${dec(r.p, 'completo')}; complemento = ${dec(r.q, 'completo')}.`],
          ['Calcular a margem de erro', `Ep = ${fmt(z, 3)} × √(${dec(r.p, 'completo')} × ${dec(r.q, 'completo')} ÷ ${fmt(r.n, 0)}) = ${dec(r.margem, 'completo')}, ou ${dec(deslocar(r.margem, 2), casas)} pontos percentuais.`],
          ['Encontrar os limites', `Subtraímos e somamos a margem à proporção: ${pct(r.inferior, casas)} a ${pct(r.superior, casas)}.`]
        ]
      });
    }
    // DE: calcula a nova amostra quando o erro precisa diminuir.
    if (id === 'de') {
      const r = M.diminuirErro({confianca: confianca(form), desvio: lido(form, 'desvio', 'Desvio-padrão'), n: lido(form, 'n', 'Tamanho atual da amostra'), fator: lido(form, 'k', 'Dividir o erro por')});
      return (casas = 2) => ({
        titulo: 'Novo tamanho da amostra', valor: `n = ${fmt(r.novoN, 0)}`,
        frase: `O cálculo resulta em ${dec(r.exato, casas)} observações antes de arredondar para cima. Para dividir o erro por ${dec(r.fator, 'completo')} é preciso aumentar a amostra em ${fmt(r.adicionar, 0)} observações, chegando a ${fmt(r.novoN, 0)} no total.`,
        extras: [['Amostra atual', fmt(r.n, 0)], ['Antes de arredondar', dec(r.exato, casas)], ['Erro atual', dec(r.erroAtual, casas)], ['Novo erro', dec(r.novoErro, casas)], ['Observações adicionais', fmt(r.adicionar, 0)]],
        formulas: [
          ['Margem de erro atual', eq('Em = ', F('Z · σ', '√n'), ' = ', F(x(z) + ' · ' + x(r.desvio), '√' + fmt(r.n, 0)), fim(r.erroAtual, casas))],
          ['Nova margem de erro', eq('Novo Em = ', F('Em', 'k'), ' = ', F(x(r.erroAtual), x(r.fator)), fim(r.novoErro, casas))],
          ['Fórmula da nova amostra', eq('Novo n = (', F('Z · σ', 'Novo Em'), ')²')],
          ['Substituindo os valores', eq('Novo n = (', F(x(z) + ' · ' + x(r.desvio), x(r.novoErro)), ')²')],
          ['Resultado do cálculo', eq('Novo n', fim(r.exato, casas))],
          ['Tamanho mínimo (arredondando para cima)', eq('Novo n = ' + fmt(r.novoN, 0))],
          ['Observações adicionais', eq(fmt(r.novoN, 0) + ' − ' + fmt(r.n, 0) + ' = ' + fmt(r.adicionar, 0))]
        ],
        passos: [
          ['Calcular o erro atual', `Em = ${fmt(z, 3)} × ${dec(r.desvio, 'completo')} ÷ √${fmt(r.n, 0)} ≈ ${dec(r.erroAtual, casas)}.`],
          ['Diminuir o erro', `Novo Em = ${dec(r.erroAtual, 'completo')} ÷ ${dec(r.fator, 'completo')} ≈ ${dec(r.novoErro, casas)}.`],
          ['Recalcular a amostra', `Novo n = (${fmt(z, 3)} × ${dec(r.desvio, 'completo')} ÷ ${dec(r.novoErro, 'completo')})² ≈ ${dec(r.exato, casas)}. Arredondamos para ${fmt(r.novoN, 0)}.`]
        ]
      });
    }
    throw new Error('Cálculo não encontrado.');
  }

  // Cria o resultado usando apenas textContent: entradas não viram HTML.
  function colocarTexto(elemento, classe, texto) {
    const filho = document.createElement(elemento);
    filho.className = classe;
    filho.textContent = texto;
    return filho;
  }
  // O gráfico é uma régua do intervalo: a ponta esquerda é o menor valor,
  // a ponta direita é o maior, e a bolinha é a média ou proporção da amostra.
  // Ele usa os mesmos números da resposta, sem fazer outra conta matemática.
  function criarGrafico(intervalo) {
    const figura = document.createElement('figure');
    figura.className = 'grafico-ic';
    figura.append(colocarTexto('figcaption', '', 'Visualização do intervalo de confiança'));

    // Três colunas deixam os textos legíveis até na tela de um celular.
    const rotulos = colocarTexto('div', 'grafico-rotulos', '');
    for (const [nome, valor] of [
      ['Limite inferior', intervalo.inferior],
      [intervalo.rotulo, intervalo.centro],
      ['Limite superior', intervalo.superior]
    ]) {
      const coluna = colocarTexto('div', '', '');
      coluna.append(colocarTexto('span', '', nome), colocarTexto('strong', '', valor));
      rotulos.append(coluna);
    }

    // A linha de fundo é apenas uma referência visual, não uma escala absoluta.
    // Quando os limites são iguais, a linha azul vira somente um ponto.
    const regua = colocarTexto('div', 'grafico-regua' + (intervalo.pontual ? ' pontual' : ''), '');
    regua.setAttribute('aria-hidden', 'true');
    regua.append(colocarTexto('div', 'grafico-faixa', ''), colocarTexto('span', 'grafico-centro', ''));
    figura.append(regua, rotulos);
    figura.append(colocarTexto('p', 'grafico-nota', intervalo.pontual
      ? 'Os dois limites coincidem: a margem de erro calculada é nula ou indistinguível na precisão numérica.'
      : 'A linha azul representa a faixa estimada. O ponto central é o valor da amostra.'));
    return figura;
  }

  // RESOLUÇÃO COM FÓRMULA: monta expressões com frações de verdade, como no caderno.
  // Usamos elementos HTML e textContent, não HTML vindo dos dados digitados.
  function criarResolucaoFormula(formulas) {
    const bloco = colocarTexto('div', 'contas-formula', '');
    for (const [rotulo, partes] of formulas) {
      const linha = colocarTexto('div', 'conta-formula', '');
      linha.append(colocarTexto('span', 'conta-rotulo', rotulo));
      const expressao = colocarTexto('div', 'conta-expressao', '');
      for (const parte of partes) {
        if (typeof parte === 'string') {
          expressao.append(colocarTexto('span', 'conta-texto', parte));
        } else {
          // Uma fração é composta por dois textos separados por uma linha horizontal.
          const fracao = colocarTexto('span', 'conta-fracao', '');
          fracao.append(colocarTexto('span', 'conta-numerador', parte.numerador),
            colocarTexto('span', 'conta-denominador', parte.denominador));
          // O texto alternativo ajuda quem usa leitor de tela.
          fracao.setAttribute('role', 'math');
          fracao.setAttribute('aria-label', parte.numerador + ' dividido por ' + parte.denominador);
          expressao.append(fracao);
        }
      }
      linha.append(expressao);
      bloco.append(linha);
    }
    return bloco;
  }

  // IMPRESSÃO: prepara uma cópia organizada da resolução para a folha de papel.
  // Esta cópia fica escondida na tela. O CSS só a revela no modo de impressão.
  // Não existe servidor de PDF: o navegador consegue salvar a folha como PDF sozinho.
  function criarRelatorio(secao, painel, lista) {
    const relatorio = colocarTexto('article', 'relatorio-impressao', '');
    relatorio.append(colocarTexto('p', 'relatorio-marca', 'ESTATÍSTICA APLICADA • RESOLUÇÃO'));
    relatorio.append(colocarTexto('h2', '', secao.querySelector('h2').textContent));
    // O PDF identifica a opção escolhida e usa os mesmos números da tela.
    const precisaoAtiva = painel.querySelector('.precisao[aria-pressed="true"]');
    if (precisaoAtiva) relatorio.append(colocarTexto('p', 'relatorio-precisao', 'Precisão: ' + precisaoAtiva.textContent));

    // Copia os nomes dos campos e os valores que foram usados na conta.
    const dados = colocarTexto('section', 'relatorio-bloco', '');
    dados.append(colocarTexto('h3', '', 'Dados do exercício'));
    const tabela = colocarTexto('dl', 'relatorio-dados', '');
    const form = secao.querySelector('form.dados');
    for (const rotulo of form.querySelectorAll('label[for]')) {
      const campo = document.getElementById(rotulo.htmlFor);
      if (!campo) continue;
      // Se a proporção é desconhecida, a fórmula usa 50% mesmo com o campo desativado.
      const valor = campo.id === 'ap-p' && campo.disabled
        ? '50% (proporção desconhecida)'
        : campo.tagName === 'SELECT'
          ? (campo.selectedOptions[0]?.textContent || campo.value)
          : campo.value.trim();
      if (!valor) continue; // Não imprime campos opcionais que ficaram vazios.
      tabela.append(colocarTexto('dt', '', rotulo.textContent.trim()), colocarTexto('dd', '', valor));
    }
    const z = form.querySelector('[data-z]');
    if (z) tabela.append(colocarTexto('dt', '', 'Valor crítico'), colocarTexto('dd', '', z.textContent));
    dados.append(tabela);
    relatorio.append(dados);

    // Copia as fórmulas mostradas na aba selecionada, sem duplicar a matemática.
    const formulas = colocarTexto('section', 'relatorio-bloco', '');
    formulas.append(colocarTexto('h3', '', 'Fórmula utilizada'));
    for (const expressao of secao.querySelectorAll('.formula .expressao')) {
      formulas.append(colocarTexto('p', 'relatorio-formula', expressao.textContent));
    }
    relatorio.append(formulas);

    // A resposta, os valores intermediários e o gráfico já estão prontos.
    // cloneNode(true) faz uma cópia, sem retirar nada da tela original.
    const resposta = colocarTexto('section', 'relatorio-bloco', '');
    resposta.append(colocarTexto('h3', '', 'Resposta do exercício'));
    for (const classe of ['.numero-resposta', '.frase-resposta', '.extras', '.grafico-ic', '.aviso']) {
      const item = painel.querySelector(classe);
      if (item) resposta.append(item.cloneNode(true));
    }
    relatorio.append(resposta);

    // O passo a passo sai completo mesmo se estiver recolhido na tela.
    const passos = colocarTexto('section', 'relatorio-bloco passos', '');
    passos.append(colocarTexto('h3', '', 'Resolução passo a passo'), lista.cloneNode(true));
    relatorio.append(passos);
    // A resolução matemática também sai no PDF, mesmo que esteja fechada na tela.
    const contas = painel.querySelector('.contas-formula');
    if (contas) {
      const secaoFormula = colocarTexto('section', 'relatorio-bloco', '');
      secaoFormula.append(colocarTexto('h3', '', 'Resolução com fórmula'), contas.cloneNode(true));
      relatorio.append(secaoFormula);
    }
    return relatorio;
  }

  // A resposta é uma função que lembra os valores da conta original.
  // As três opções são 0 casas, 2 casas (padrão) e precisão completa.
  function mostrarResultado(secao, criarResposta, casas = 2, aberto = false, focar = false, formulaAberta = false) {
    const resposta = criarResposta(casas);
    const painel = secao.querySelector('.resultado');
    painel.replaceChildren();
    const resumo = colocarTexto('div', 'resposta-superior', 'RESPOSTA DO EXERCÍCIO');
    const valor = colocarTexto('strong', 'numero-resposta', resposta.valor);
    const frase = colocarTexto('p', 'frase-resposta', resposta.frase);
    // Cada botão seleciona uma apresentação do mesmo resultado, sem refazer a conta.
    const controles = colocarTexto('div', 'precisao-opcoes', '');
    controles.setAttribute('role', 'group');
    controles.setAttribute('aria-label', 'Arredondamento dos resultados');
    let botaoAtivo;
    for (const [modo, nome] of [[0, 'Sem casas decimais'], [2, '2 casas decimais'], ['completo', 'Valor completo']]) {
      const botao = colocarTexto('button', 'precisao', nome);
      botao.type = 'button';
      botao.dataset.precisao = String(modo);
      botao.setAttribute('aria-pressed', String(casas === modo));
      if (casas === modo) botaoAtivo = botao;
      botao.addEventListener('click', () => {
        if (casas !== modo) mostrarResultado(secao, criarResposta, modo, detalhes.open, true, detalhesFormula.open);
      });
      controles.append(botao);
    }
    painel.append(resumo, valor, controles, frase);

    if (resposta.extras?.length) {
      const tabela = colocarTexto('div', 'extras', '');
      for (const [nome, dado] of resposta.extras) {
        const linha = colocarTexto('div', 'extra-linha', '');
        linha.append(colocarTexto('span', '', nome), colocarTexto('strong', '', dado));
        tabela.append(linha);
      }
      painel.append(tabela);
    }
    // Só os intervalos de confiança têm uma régua de limites.
    if (resposta.grafico) painel.append(criarGrafico(resposta.grafico));
    if (resposta.aviso) painel.append(colocarTexto('p', 'aviso', resposta.aviso));
    const detalhes = document.createElement('details');
    detalhes.className = 'passos';
    // Se o passo a passo estava aberto, continua aberto.
    detalhes.open = aberto;
    const titulo = document.createElement('summary');
    titulo.textContent = 'Ver resolução passo a passo';
    detalhes.append(titulo);
    const lista = document.createElement('ol');
    resposta.passos.forEach(([nome, explicacao]) => {
      const passo = document.createElement('li');
      passo.append(colocarTexto('strong', '', nome), colocarTexto('p', '', explicacao));
      lista.append(passo);
    });
    detalhes.append(lista);
    painel.append(detalhes);

    // A nova seção é independente do passo a passo e começa recolhida.
    // Ao alterar a precisão, preservamos o estado aberto/fechado das duas seções.
    const detalhesFormula = document.createElement('details');
    detalhesFormula.className = 'passos resolucao-formula';
    detalhesFormula.open = formulaAberta;
    const tituloFormula = colocarTexto('summary', '', 'Ver resolução com fórmula');
    detalhesFormula.append(tituloFormula, criarResolucaoFormula(resposta.formulas));
    painel.append(detalhesFormula);

    // O botão aparece só depois que uma conta foi resolvida com sucesso.
    // window.print abre a janela nativa: escolha "Salvar como PDF" como destino.
    const imprimir = colocarTexto('button', 'imprimir-pdf', 'Imprimir / Salvar em PDF');
    imprimir.type = 'button';
    imprimir.addEventListener('click', () => window.print());
    painel.append(imprimir, criarRelatorio(secao, painel, lista));
    painel.hidden = false;
    // Devolve o foco ao botão para quem navega com o teclado.
    if (focar) botaoAtivo?.focus({preventScroll:true});
  }

  // A entrada mudou: esconde o resultado anterior para não confundir cálculos.
  for (const form of document.querySelectorAll('form.dados')) {
    const secao = form.closest('.assunto');
    const aviso = form.querySelector('.erro');
    const resultado = secao.querySelector('.resultado');
    // Ao clicar Calcular, impede o recarregamento da página e mostra a resposta.
    form.addEventListener('submit', evento => {
      evento.preventDefault();
      aviso.hidden = true;
      resultado.hidden = true;
      try { mostrarResultado(secao, executar(form.id.slice(5), form)); }
      catch (erro) {
        aviso.textContent = erro instanceof Error ? erro.message : 'Não foi possível calcular. Revise os valores.';
        aviso.hidden = false;
      }
    });
    // A cada digitação, esconde a resposta antiga.
    form.addEventListener('input', () => {
      resultado.hidden = true;
      aviso.hidden = true;
      atualizarComplemento(); atualizarProporcao(); atualizarErro();
    });
    // Atualiza os valores automáticos quando uma seleção muda.
    form.addEventListener('change', () => {
      resultado.hidden = true;
      aviso.hidden = true;
      atualizarZ(form); atualizarComplemento(); atualizarProporcao(); atualizarErro();
    });
    // Ao clicar Limpar, apaga resposta e mensagens de erro.
    form.addEventListener('reset', () => {
      resultado.hidden = true;
      aviso.hidden = true;
      // Os valores só voltam ao padrão após o evento reset terminar.
      queueMicrotask(() => { atualizarZ(form); atualizarComplemento(); atualizarProporcao(); atualizarErro(); });
    });
    atualizarZ(form);
  }
  document.querySelectorAll('[data-aba]').forEach(botao => {
    botao.addEventListener('click', () => abrirAba(botao.dataset.aba));
  });
  atualizarComplemento(); atualizarProporcao(); atualizarErro(); abrirAba('am');
})();
