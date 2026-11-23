/*
 * CONTAS ESTATÍSTICAS — edite aqui se uma fórmula estiver errada.
 * Não depende do navegador: podemos testar este arquivo sozinho.
 * O resultado guarda números sem arredondar. A tela arredonda só ao exibir.
 */
(function (global) {
  'use strict';

  // Tabela Z usada nos PDFs da professora.
  const TABELA_Z = Object.freeze({90: 1.645, 95: 1.96, 99: 2.575});

  // Aceita 1,25 (decimal), 1.250 (milhar) e 1.250,50.
  // Números inválidos, infinitos e campos vazios geram mensagens legíveis.
  function numero(texto, nome = 'Valor') {
    if (typeof texto === 'number') {
      if (Number.isFinite(texto)) return texto;
      throw new Error(`${nome}: informe um número válido.`);
    }
    const original = String(texto ?? '').trim().replace(/\s/g, '');
    if (!original) throw new Error(`${nome}: preencha este campo.`);
    let ajustado = original;
    if (/^[+-]?\d{1,3}(?:\.\d{3})+,(?:\d+)$/.test(original)) {
      ajustado = original.replace(/\./g, '').replace(',', '.');
    } else if (/^[+-]?[1-9]\d{0,2}(?:\.\d{3})+$/.test(original)) {
      ajustado = original.replace(/\./g, '');
    } else if (/^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(original)) {
      ajustado = original.replace(',', '.');
    } else {
      throw new Error(`${nome}: digite apenas um número (por exemplo, 1,25).`);
    }
    const resultado = Number(ajustado);
    if (!Number.isFinite(resultado)) throw new Error(`${nome}: número grande demais.`);
    return resultado;
  }

  function validarMaior(valor, nome, limite = 0) {
    if (valor <= limite) throw new Error(`${nome}: deve ser maior que ${limite}.`);
    return valor;
  }
  function inteiro(valor, nome, permiteZero = false) {
    if (!Number.isSafeInteger(valor) || valor < (permiteZero ? 0 : 1)) {
      throw new Error(`${nome}: digite um número inteiro ${permiteZero ? 'a partir de zero' : 'maior que zero'}.`);
    }
    return valor;
  }
  function porcentagem(valor, nome, permiteZero = false) {
    if (valor < (permiteZero ? 0 : Number.MIN_VALUE) || valor >= 100) {
      throw new Error(`${nome}: informe uma porcentagem ${permiteZero ? 'de 0 a menos de 100' : 'maior que 0 e menor que 100'}.`);
    }
    return valor / 100;
  }
  function valorCritico(confianca) {
    if (!Object.prototype.hasOwnProperty.call(TABELA_Z, confianca)) {
      throw new Error('Grau de confiança: escolha 90%, 95% ou 99%.');
    }
    return TABELA_Z[confianca];
  }
  // Amostras devem ser arredondadas para cima. O ajuste só evita
  // erros minúsculos de representação binária: 600,0000000000001 -> 600.
  function amostraInteira(valor) {
    if (!Number.isFinite(valor) || valor > Number.MAX_SAFE_INTEGER) {
      throw new Error('Amostra calculada grande demais. Revise a margem de erro.');
    }
    return Math.max(1, Math.ceil(valor - 1e-10));
  }

  // FUNCIONAMENTO DA FÓRMULA: TAMANHO DA AMOSTRA PARA A MÉDIA
  // n = (Z × desvio-padrão / erro máximo)².
  function amostraMedia({confianca = 95, desvio, erro}) {
    const z = valorCritico(confianca);
    validarMaior(desvio, 'Desvio-padrão');
    validarMaior(erro, 'Erro máximo');
    const exato = (z * desvio / erro) ** 2;
    return {z, desvio, erro, exato, n: amostraInteira(exato)};
  }

  // FUNCIONAMENTO DA FÓRMULA: TAMANHO DA AMOSTRA PARA A PROPORÇÃO
  // p e Ep são percentuais na tela, convertidos para decimal antes da conta.
  function amostraProporcao({confianca = 95, percentual, erro}) {
    const z = valorCritico(confianca);
    const p = porcentagem(percentual, 'Proporção estimada');
    const ep = porcentagem(erro, 'Erro da proporção');
    const q = 1 - p;
    const exato = z ** 2 * p * q / ep ** 2;
    return {z, p, q, ep, exato, n: amostraInteira(exato)};
  }

  // FUNCIONAMENTO DA FÓRMULA: INTERVALO DE CONFIANÇA DA MÉDIA
  // Em = Z × σ / √n. Depois subtraímos e somamos Em à média.
  function intervaloMedia({confianca = 95, media, desvio, n}) {
    const z = valorCritico(confianca);
    if (desvio < 0) throw new Error('Desvio-padrão: não pode ser negativo.');
    inteiro(n, 'Tamanho da amostra');
    const margem = z * desvio / Math.sqrt(n);
    const inferior = media - margem, superior = media + margem;
    if (![inferior, superior].every(Number.isFinite)) throw new Error('Resultado grande demais. Revise os dados.');
    return {z, media, desvio, n, margem, inferior, superior, amplitude: superior - inferior, aviso: n <= 30 ? 'Se o desvio é amostral e n é pequeno, pode ser necessário usar t de Student. Esta calculadora segue o método Z da aula.' : ''};
  }

  // FUNCIONAMENTO DA FÓRMULA: INTERVALO DE CONFIANÇA DA PROPORÇÃO
  // p = pessoas com a característica / pessoas pesquisadas.
  // Ep = Z × raiz[p(1-p)/n]. Não alteramos os limites artificialmente.
  function intervaloProporcao({confianca = 95, sucessos, n, padrao = null}) {
    const z = valorCritico(confianca);
    inteiro(n, 'Tamanho da amostra');
    inteiro(sucessos, 'Quantidade com a característica', true);
    if (sucessos > n) throw new Error('Quantidade com a característica: não pode ultrapassar o total pesquisado.');
    const p = sucessos / n, q = 1 - p;
    const margem = z * Math.sqrt(p * q / n);
    const inferior = p - margem, superior = p + margem;
    const avisos = [];
    if (sucessos < 5 || n - sucessos < 5) avisos.push('Poucos casos em um dos grupos: este método de aproximação pode não ser adequado.');
    if (inferior < 0 || superior > 1) avisos.push('A fórmula produziu um limite fora de 0% a 100%. Confira a adequação do método.');
    if (padrao !== null && (padrao < 0 || padrao > 100)) throw new Error('Padrão aceitável: use uma porcentagem entre 0 e 100.');
    return {z, n, sucessos, p, q, margem, inferior, superior, padrao, avisos,
      atendePadrao: padrao === null ? null : superior * 100 < padrao};
  }

  // FUNCIONAMENTO DA FÓRMULA: DIMINUIR O ERRO
  // Se o erro vai ser dividido por k, a amostra cresce cerca de k² vezes.
  function diminuirErro({confianca = 95, desvio, n, fator}) {
    const z = valorCritico(confianca);
    validarMaior(desvio, 'Desvio-padrão');
    inteiro(n, 'Tamanho atual da amostra');
    validarMaior(fator, 'Dividir o erro por', 1);
    const erroAtual = z * desvio / Math.sqrt(n);
    const novoErro = erroAtual / fator;
    const exato = (z * desvio / novoErro) ** 2;
    const novoN = amostraInteira(exato);
    return {z, desvio, n, fator, erroAtual, novoErro, exato, novoN, adicionar: novoN - n};
  }

  global.Calculos = Object.freeze({numero, inteiro, porcentagem, valorCritico,
    amostraInteira, amostraMedia, amostraProporcao, intervaloMedia,
    intervaloProporcao, diminuirErro});
})(globalThis);
