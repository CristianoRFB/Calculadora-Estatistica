/*
 * INTERFACE — botões, campos e apresentação dos resultados.
 * As fórmulas ficam em calculos.js; aqui só lemos entradas e mostramos a conta.
 * Para trocar o nome de um campo, altere seu <label> no index.html.
 */
(() => {
  'use strict';
  const M = globalThis.Calculos;
  const $ = id => document.getElementById(id);
  const fmt = (n, casas = 4) => n.toLocaleString('pt-BR', {maximumFractionDigits: casas});
  const percentual = (p, casas = 2) => `${fmt(p * 100, casas)}%`;
  const lido = (form, nome, titulo) => M.numero(form.elements.namedItem(nome).value, titulo);
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
  function atualizarProporcao() {
    try {
      const form = $('form-ip');
      const n = M.inteiro(lido(form, 'n', 'Tamanho da amostra'), 'Tamanho da amostra');
      const k = M.inteiro(lido(form, 'sucessos', 'Quantidade com a característica'), 'Quantidade com a característica', true);
      $('ip-proporcao').textContent = k <= n ? `${percentual(k / n)} com a característica` : '—';
    } catch (_) { $('ip-proporcao').textContent = '—'; }
  }
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
    const z = M.valorCritico(confianca(form));
    if (id === 'am') {
      const r = M.amostraMedia({confianca: confianca(form), desvio: lido(form, 'desvio', 'Desvio-padrão'), erro: lido(form, 'erro', 'Erro máximo')});
      return {
        titulo: 'Tamanho mínimo da amostra', valor: `n = ${fmt(r.n, 0)}`,
        frase: `São necessárias pelo menos ${fmt(r.n, 0)} observações para estimar a média com ${confianca(form)}% de confiança.`,
        extras: [['Antes de arredondar', fmt(r.exato, 6)]],
        passos: [
          ['Identificar o valor crítico', `Para ${confianca(form)}% de confiança, usamos Z = ${fmt(z, 3)}.`],
          ['Substituir na fórmula', `n = (${fmt(z, 3)} × ${fmt(r.desvio)} ÷ ${fmt(r.erro)})² = ${fmt(r.exato, 6)}.`],
          ['Arredondar para cima', `Precisamos de ${fmt(r.n, 0)} observações, pois não existe uma fração de pessoa ou medição.`]
        ]
      };
    }
    if (id === 'ap') {
      const p = $('ap-desconhecida').checked ? 50 : lido(form, 'p', 'Proporção estimada');
      const r = M.amostraProporcao({confianca: confianca(form), percentual: p, erro: lido(form, 'erro', 'Erro da proporção')});
      return {
        titulo: 'Tamanho mínimo da amostra', valor: `n = ${fmt(r.n, 0)}`,
        frase: `São necessárias pelo menos ${fmt(r.n, 0)} observações para estimar a proporção com ${confianca(form)}% de confiança.`,
        extras: [['Proporção (p)', percentual(r.p)], ['Complemento (1 − p)', percentual(r.q)], ['Antes de arredondar', fmt(r.exato, 6)]],
        passos: [
          ['Transformar porcentagens em decimais', `p = ${fmt(r.p, 4)}, complemento = ${fmt(r.q, 4)} e Ep = ${fmt(r.ep, 4)}.`],
          ['Aplicar a fórmula', `n = ${fmt(z, 3)}² × ${fmt(r.p, 4)} × ${fmt(r.q, 4)} ÷ ${fmt(r.ep, 4)}² = ${fmt(r.exato, 6)}.`],
          ['Arredondar para cima', `A amostra mínima é de ${fmt(r.n, 0)} observações.`]
        ]
      };
    }
    if (id === 'im') {
      const r = M.intervaloMedia({confianca: confianca(form), media: lido(form, 'media', 'Média amostral'), desvio: lido(form, 'desvio', 'Desvio-padrão'), n: lido(form, 'n', 'Tamanho da amostra')});
      return {
        titulo: 'Intervalo de confiança', valor: `${fmt(r.inferior, 4)} a ${fmt(r.superior, 4)}`,
        frase: `Com ${confianca(form)}% de confiança, estimamos a média populacional entre ${fmt(r.inferior, 4)} e ${fmt(r.superior, 4)}.`,
        extras: [['Margem de erro (Em)', fmt(r.margem, 6)], ['Limite inferior', fmt(r.inferior, 6)], ['Limite superior', fmt(r.superior, 6)]],
        aviso: r.aviso,
        passos: [
          ['Escolher o valor crítico', `Para ${confianca(form)}% de confiança, usamos Z = ${fmt(z, 3)}.`],
          ['Calcular a margem de erro', `Em = ${fmt(z, 3)} × ${fmt(r.desvio)} ÷ √${fmt(r.n, 0)} = ${fmt(r.margem, 6)}.`],
          ['Encontrar os dois limites', `${fmt(r.media)} − ${fmt(r.margem, 6)} = ${fmt(r.inferior, 6)}; ${fmt(r.media)} + ${fmt(r.margem, 6)} = ${fmt(r.superior, 6)}.`]
        ]
      };
    }
    if (id === 'ip') {
      const padraoTexto = form.elements.namedItem('padrao').value.trim();
      const r = M.intervaloProporcao({confianca: confianca(form), sucessos: lido(form, 'sucessos', 'Quantidade com a característica'), n: lido(form, 'n', 'Tamanho da amostra'), padrao: padraoTexto ? lido(form, 'padrao', 'Padrão aceitável') : null});
      let comparacao = '';
      if (r.padrao !== null) comparacao = r.atendePadrao
        ? `O limite superior está abaixo do padrão de ${fmt(r.padrao)}%. Pelo critério informado, a condição foi atendida.`
        : `O intervalo não fica inteiro abaixo do padrão de ${fmt(r.padrao)}%. Não dá para garantir a condição.`;
      return {
        titulo: 'Intervalo de confiança', valor: `${percentual(r.inferior)} a ${percentual(r.superior)}`,
        frase: `Com ${confianca(form)}% de confiança, estimamos a proporção populacional entre ${percentual(r.inferior)} e ${percentual(r.superior)}.`,
        extras: [['Com a característica', percentual(r.p)], ['Sem a característica', percentual(r.q)], ['Margem de erro', `${fmt(r.margem * 100, 4)} pontos percentuais`]],
        aviso: [...r.avisos, comparacao].filter(Boolean).join(' '),
        passos: [
          ['Encontrar a proporção', `p = ${fmt(r.sucessos, 0)} ÷ ${fmt(r.n, 0)} = ${fmt(r.p, 6)}; complemento = ${fmt(r.q, 6)}.`],
          ['Calcular a margem de erro', `Ep = ${fmt(z, 3)} × √(${fmt(r.p, 6)} × ${fmt(r.q, 6)} ÷ ${fmt(r.n, 0)}) = ${fmt(r.margem, 6)}.`],
          ['Encontrar os limites', `Subtraímos e somamos a margem à proporção: ${percentual(r.inferior)} a ${percentual(r.superior)}.`]
        ]
      };
    }
    if (id === 'de') {
      const r = M.diminuirErro({confianca: confianca(form), desvio: lido(form, 'desvio', 'Desvio-padrão'), n: lido(form, 'n', 'Tamanho atual da amostra'), fator: lido(form, 'k', 'Dividir o erro por')});
      return {
        titulo: 'Novo tamanho da amostra', valor: `n = ${fmt(r.novoN, 0)}`,
        frase: `Para dividir o erro por ${fmt(r.fator)} é preciso aumentar a amostra em ${fmt(r.adicionar, 0)} observações.`,
        extras: [['Amostra atual', fmt(r.n, 0)], ['Erro atual', fmt(r.erroAtual, 6)], ['Novo erro', fmt(r.novoErro, 6)], ['Observações adicionais', fmt(r.adicionar, 0)]],
        passos: [
          ['Calcular o erro atual', `Em = ${fmt(z, 3)} × ${fmt(r.desvio)} ÷ √${fmt(r.n, 0)} = ${fmt(r.erroAtual, 6)}.`],
          ['Diminuir o erro', `Novo Em = ${fmt(r.erroAtual, 6)} ÷ ${fmt(r.fator)} = ${fmt(r.novoErro, 6)}.`],
          ['Recalcular a amostra', `Novo n = (${fmt(z, 3)} × ${fmt(r.desvio)} ÷ ${fmt(r.novoErro, 6)})² ≈ ${fmt(r.exato, 4)}. Arredondamos para ${fmt(r.novoN, 0)}.`]
        ]
      };
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
  function mostrarResultado(secao, resposta) {
    const painel = secao.querySelector('.resultado');
    painel.replaceChildren();
    const resumo = colocarTexto('div', 'resposta-superior', 'RESPOSTA DO EXERCÍCIO');
    const valor = colocarTexto('strong', 'numero-resposta', resposta.valor);
    const frase = colocarTexto('p', 'frase-resposta', resposta.frase);
    painel.append(resumo, valor, frase);

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
  }

  // A entrada mudou: esconde o resultado anterior para não confundir cálculos.
  for (const form of document.querySelectorAll('form.dados')) {
    const secao = form.closest('.assunto');
    const aviso = form.querySelector('.erro');
    const resultado = secao.querySelector('.resultado');
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
    form.addEventListener('input', () => {
      resultado.hidden = true;
      aviso.hidden = true;
      atualizarComplemento(); atualizarProporcao(); atualizarErro();
    });
    form.addEventListener('change', () => {
      resultado.hidden = true;
      aviso.hidden = true;
      atualizarZ(form); atualizarComplemento(); atualizarProporcao(); atualizarErro();
    });
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
