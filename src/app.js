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
      const k = M.inteiro(lido(form, 'sucessos', 'Quantidade com a característica'), 'Quantidade com a característica', true);
      $('ip-proporcao').textContent = k <= n ? `${percentual(k / n)} com a característica` : '—';
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
    const dec = (n, casas) => n.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:casas});
    const pct = (p, casas) => dec(p * 100, casas) + '%';
    const z = M.valorCritico(confianca(form));
    // AM: número mínimo de medições para estimar uma média.
    if (id === 'am') {
      const r = M.amostraMedia({confianca: confianca(form), desvio: lido(form, 'desvio', 'Desvio-padrão'), erro: lido(form, 'erro', 'Erro máximo')});
      return (casas = 2) => ({
        titulo: 'Tamanho mínimo da amostra', valor: `n = ${fmt(r.n, 0)}`,
        frase: `São necessárias pelo menos ${fmt(r.n, 0)} observações para estimar a média com ${confianca(form)}% de confiança.`,
        extras: [['Antes de arredondar', dec(r.exato, casas)]],
        passos: [
          ['Identificar o valor crítico', `Para ${confianca(form)}% de confiança, usamos Z = ${fmt(z, 3)}.`],
          ['Substituir na fórmula', `n = (${fmt(z, 3)} × ${fmt(r.desvio)} ÷ ${fmt(r.erro)})² = ${dec(r.exato, casas)}.`],
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
        frase: `São necessárias pelo menos ${fmt(r.n, 0)} observações para estimar a proporção com ${confianca(form)}% de confiança.`,
        extras: [['Proporção (p)', pct(r.p, casas)], ['Complemento (1 − p)', pct(r.q, casas)], ['Antes de arredondar', dec(r.exato, casas)]],
        passos: [
          ['Transformar porcentagens em decimais', `p = ${fmt(r.p, 4)}, complemento = ${fmt(r.q, 4)} e Ep = ${fmt(r.ep, 4)}.`],
          ['Aplicar a fórmula', `n = ${fmt(z, 3)}² × ${fmt(r.p, 4)} × ${fmt(r.q, 4)} ÷ ${fmt(r.ep, 4)}² = ${dec(r.exato, casas)}.`],
          ['Arredondar para cima', `A amostra mínima é de ${fmt(r.n, 0)} observações.`]
        ]
      });
    }
    // IM: média menos a margem e média mais a margem.
    if (id === 'im') {
      const r = M.intervaloMedia({confianca: confianca(form), media: lido(form, 'media', 'Média amostral'), desvio: lido(form, 'desvio', 'Desvio-padrão'), n: lido(form, 'n', 'Tamanho da amostra')});
      return (casas = 2) => ({
        titulo: 'Intervalo de confiança', valor: `${dec(r.inferior, casas)} a ${dec(r.superior, casas)}`,
        frase: `Com ${confianca(form)}% de confiança, estimamos a média populacional entre ${dec(r.inferior, casas)} e ${dec(r.superior, casas)}.`,
        extras: [['Margem de erro (Em)', dec(r.margem, casas)], ['Limite inferior', dec(r.inferior, casas)], ['Limite superior', dec(r.superior, casas)]],
        aviso: r.aviso,
        passos: [
          ['Escolher o valor crítico', `Para ${confianca(form)}% de confiança, usamos Z = ${fmt(z, 3)}.`],
          ['Calcular a margem de erro', `Em = ${fmt(z, 3)} × ${fmt(r.desvio)} ÷ √${fmt(r.n, 0)} = ${dec(r.margem, casas)}.`],
          ['Encontrar os dois limites', `${fmt(r.media)} − ${dec(r.margem, casas)} = ${dec(r.inferior, casas)}; ${fmt(r.media)} + ${dec(r.margem, casas)} = ${dec(r.superior, casas)}.`]
        ]
      });
    }
    // IP: proporção menos a margem e proporção mais a margem.
    if (id === 'ip') {
      const padraoTexto = form.elements.namedItem('padrao').value.trim();
      const r = M.intervaloProporcao({confianca: confianca(form), sucessos: lido(form, 'sucessos', 'Quantidade com a característica'), n: lido(form, 'n', 'Tamanho da amostra'), padrao: padraoTexto ? lido(form, 'padrao', 'Padrão aceitável') : null});
      let comparacao = '';
      if (r.padrao !== null) comparacao = r.atendePadrao
        ? `O limite superior está abaixo do padrão de ${fmt(r.padrao)}%. Pelo critério informado, a condição foi atendida.`
        : `O intervalo não fica inteiro abaixo do padrão de ${fmt(r.padrao)}%. Não dá para garantir a condição.`;
      return (casas = 2) => ({
        titulo: 'Intervalo de confiança', valor: `${pct(r.inferior, casas)} a ${pct(r.superior, casas)}`,
        frase: `Com ${confianca(form)}% de confiança, estimamos a proporção populacional entre ${pct(r.inferior, casas)} e ${pct(r.superior, casas)}.`,
        extras: [['Com a característica', pct(r.p, casas)], ['Sem a característica', pct(r.q, casas)], ['Margem de erro', `${dec(r.margem * 100, casas)} pontos percentuais`]],
        aviso: [...r.avisos, comparacao].filter(Boolean).join(' '),
        passos: [
          ['Encontrar a proporção', `p = ${fmt(r.sucessos, 0)} ÷ ${fmt(r.n, 0)} = ${fmt(r.p, 6)}; complemento = ${fmt(r.q, 6)}.`],
          ['Calcular a margem de erro', `Ep = ${fmt(z, 3)} × √(${fmt(r.p, 6)} × ${fmt(r.q, 6)} ÷ ${fmt(r.n, 0)}) = ${dec(r.margem, casas)}.`],
          ['Encontrar os limites', `Subtraímos e somamos a margem à proporção: ${pct(r.inferior, casas)} a ${pct(r.superior, casas)}.`]
        ]
      });
    }
    // DE: calcula a nova amostra quando o erro precisa diminuir.
    if (id === 'de') {
      const r = M.diminuirErro({confianca: confianca(form), desvio: lido(form, 'desvio', 'Desvio-padrão'), n: lido(form, 'n', 'Tamanho atual da amostra'), fator: lido(form, 'k', 'Dividir o erro por')});
      return (casas = 2) => ({
        titulo: 'Novo tamanho da amostra', valor: `n = ${fmt(r.novoN, 0)}`,
        frase: `Para dividir o erro por ${fmt(r.fator)} é preciso aumentar a amostra em ${fmt(r.adicionar, 0)} observações.`,
        extras: [['Amostra atual', fmt(r.n, 0)], ['Erro atual', dec(r.erroAtual, casas)], ['Novo erro', dec(r.novoErro, casas)], ['Observações adicionais', fmt(r.adicionar, 0)]],
        passos: [
          ['Calcular o erro atual', `Em = ${fmt(z, 3)} × ${fmt(r.desvio)} ÷ √${fmt(r.n, 0)} = ${dec(r.erroAtual, casas)}.`],
          ['Diminuir o erro', `Novo Em = ${dec(r.erroAtual, casas)} ÷ ${fmt(r.fator)} = ${dec(r.novoErro, casas)}.`],
          ['Recalcular a amostra', `Novo n = (${fmt(z, 3)} × ${fmt(r.desvio)} ÷ ${dec(r.novoErro, casas)})² ≈ ${dec(r.exato, casas)}. Arredondamos para ${fmt(r.novoN, 0)}.`]
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
  // A resposta é uma função que lembra os valores da conta original.
  // 2 e 10 são as quantidades de casas decimais disponíveis para visualização.
  function mostrarResultado(secao, criarResposta, casas = 2, aberto = false, focar = false) {
    const resposta = criarResposta(casas);
    const painel = secao.querySelector('.resultado');
    painel.replaceChildren();
    const resumo = colocarTexto('div', 'resposta-superior', 'RESPOSTA DO EXERCÍCIO');
    const valor = colocarTexto('strong', 'numero-resposta', resposta.valor);
    const frase = colocarTexto('p', 'frase-resposta', resposta.frase);
    // O botão alterna a precisão sem reler os campos nem recalcular a fórmula.
    const botao = colocarTexto('button', 'precisao', casas === 2 ? 'Mostrar mais casas decimais' : 'Voltar a 2 casas decimais');
    botao.type = 'button';
    botao.setAttribute('aria-pressed', String(casas !== 2));
    botao.addEventListener('click', () => mostrarResultado(secao, criarResposta, casas === 2 ? 10 : 2, detalhes.open, true));
    painel.append(resumo, valor, botao, frase);

    if (resposta.extras?.length) {
      const tabela = colocarTexto('div', 'extras', '');
      for (const [nome, dado] of resposta.extras) {
        const linha = colocarTexto('div', 'extra-linha', '');
        linha.append(colocarTexto('span', '', nome), colocarTexto('strong', '', dado));
        tabela.append(linha);
      }
      painel.append(tabela);
    }
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
    painel.hidden = false;
    // Devolve o foco ao botão para quem navega com o teclado.
    if (focar) botao.focus({preventScroll:true});
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
