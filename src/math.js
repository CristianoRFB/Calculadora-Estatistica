/*
 * ESTATÍSTICA APLICADA — CONTAS MATEMÁTICAS
 * =============================================================
 * Este arquivo contém somente as contas. Não cria botões ou campos.
 * Se alguma resposta estiver errada, comece a procurar aqui.
 *
 * Cálculos da aula: amostra, intervalos, correlação, regressão, escore Z.
 * Valores críticos do material da professora Andrea: 90, 95 e 99%.
 */
(function (global) {
  'use strict';

  // Evita mensagens técnicas. Toda regra rejeita valores impossíveis antes de calcular.
  function erro(mensagem) { throw new Error(mensagem); }
  function finito(valor, nome) {
    if (!Number.isFinite(valor) || Math.abs(valor) > 1e15) erro(`${nome}: informe um número válido e não excessivamente grande.`);
    return valor;
  }
  function inteiro(valor, nome, minimo = 1) {
    finito(valor, nome);
    if (!Number.isSafeInteger(valor) || valor < minimo) erro(`${nome}: informe um número inteiro ${minimo === 0 ? 'não negativo' : `a partir de ${minimo}`}.`);
    return valor;
  }
  function positivo(valor, nome, permiteZero = false) {
    finito(valor, nome);
    if (valor < 0 || (!permiteZero && valor === 0)) erro(`${nome}: informe um valor ${permiteZero ? 'maior ou igual a zero' : 'maior que zero'}.`);
    return valor;
  }

  // Números brasileiros: 1.250 = 1250; 1,25 = 1.25; 1.250,5 = 1250.5.
  // Ponto decimal sem grupos de milhar também funciona: 1.25 = 1.25.
  function numero(texto, nome = 'Valor') {
    if (typeof texto === 'number') return finito(texto, nome);
    if (typeof texto !== 'string' || !texto.trim()) erro(`${nome}: preencha este campo.`);
    let valor = texto.trim().replace(/\s/g, '').replace(/\u2212/g, '-');
    const agrupado = /^[+-]?(?:[1-9]\d{0,2})(?:\.\d{3})+(?:,\d+)?$/;
    if (agrupado.test(valor)) valor = valor.replace(/\./g, '').replace(',', '.');
    else if (/^[+-]?(?:\d+)(?:,\d+)?$/.test(valor)) valor = valor.replace(',', '.');
    else if (/^[+-]?(?:\d+)(?:\.\d+)?$/.test(valor)) { /* ponto decimal válido */ }
    else erro(`${nome}: use apenas números (ex.: 12,5).`);
    return finito(Number(valor), nome);
  }

  // Aceita uma coluna colada do Excel, tabs ou números separados por ponto e vírgula.
  function lista(texto, nome = 'Valores', minimo = 2) {
    if (typeof texto !== 'string' || !texto.trim()) erro(`${nome}: informe os números.`);
    const partes = texto.split(/[;\n\r\t]+/).map(v => v.trim()).filter(Boolean);
    if (partes.length > 10000) erro(`${nome}: use no máximo 10.000 valores por vez.`);
    if (partes.length < minimo) erro(`${nome}: informe ao menos ${minimo} valores.`);
    return partes.map((valor, i) => numero(valor, `${nome} (${i + 1}º valor)`));
  }

  // Valores da tabela Z fornecida na disciplina; não substituir por estimativas.
  const CRITICOS = Object.freeze({ 90: 1.645, 95: 1.96, 99: 2.575 });
  function zCritico(nivel) {
    const z = CRITICOS[nivel];
    if (!z) erro('Grau de confiança: escolha 90%, 95% ou 99%.');
    return z;
  }
  function conferirProporcao(p) {
    finito(p, 'Proporção');
    if (p < 0 || p > 1) erro('A proporção deve ficar entre 0% e 100%.');
    return p;
  }
  function porcentagem(valor, nome = 'Porcentagem') {
    return conferirProporcao(numero(valor, nome) / 100);
  }
  function arredondarCima(x) {
    finito(x, 'Tamanho da amostra');
    if (x > Number.MAX_SAFE_INTEGER) erro('O tamanho necessário é excessivo. Confira a margem de erro.');
    // Corrige erro de representação binária somente quando o número é praticamente inteiro.
    const proximo = Math.round(x);
    const tolerancia = Math.min(1e-9, 1e-12 * Math.max(1, Math.abs(x)));
    return Math.max(1, Math.abs(x - proximo) < tolerancia ? proximo : Math.ceil(x));
  }

  // Desvio amostral usa n−1. Desvio populacional usa n.
  function descrever(valores) {
    if (!Array.isArray(valores) || !valores.length) erro('Informe os valores da amostra.');
    if (valores.length > 10000) erro('A lista excede 10.000 observações.');
    valores.forEach((x, i) => finito(x, `Valor ${i + 1}`));
    const n = valores.length;
    const media = valores.reduce((a, b) => a + b, 0) / n;
    const quad = valores.reduce((a, b) => a + (b - media) ** 2, 0);
    const ordenados = [...valores].sort((a, b) => a - b);
    const mediana = n % 2 ? ordenados[(n - 1) / 2] : (ordenados[n / 2 - 1] + ordenados[n / 2]) / 2;
    const varianciaPop = quad / n;
    const varianciaAmostra = n > 1 ? quad / (n - 1) : null;
    const resultado = { n, soma: media * n, media, mediana, varianciaPop, varianciaAmostra,
      desvioPop: Math.sqrt(varianciaPop), desvioAmostra: varianciaAmostra === null ? null : Math.sqrt(varianciaAmostra), quadrados: quad };
    Object.entries(resultado).forEach(([k, v]) => { if (typeof v === 'number') finito(v, k); });
    return resultado;
  }

  // PROPORÇÃO DE SIM / NÃO: útil quando a professora dita uma lista de respostas.
  function respostasBinarias(texto) {
    if (typeof texto !== 'string' || !texto.trim()) erro('Respostas: cole as observações.');
    const itens = texto.split(/[;\n\r\t]+/).map(x => x.trim().toLowerCase()).filter(Boolean);
    if (!itens.length || itens.length > 10000) erro('Respostas: informe de 1 a 10.000 itens.');
    let positivos = 0;
    for (const item of itens) {
      if (['1', 'sim', 's', 'positivo', 'positiva'].includes(item)) positivos++;
      else if (!['0', 'não', 'nao', 'n', 'negativo', 'negativa'].includes(item)) erro(`Resposta "${item}": use sim/não ou 1/0.`);
    }
    return { total: itens.length, positivos, p: positivos / itens.length };
  }

  function fatorFinito(n, N) {
    if (N == null) return 1;
    inteiro(N, 'População (N)', 2);
    if (n > N) erro('A população (N) não pode ser menor que a amostra (n).');
    return Math.sqrt((N - n) / (N - 1));
  }
  function amostraFinita(n0, N) {
    if (N == null) return arredondarCima(n0);
    inteiro(N, 'População (N)', 2);
    return arredondarCima((N * n0) / (N + n0 - 1));
  }

  // TAMANHO DA AMOSTRA — Estimativa da média: n = (zσ/Em)².
  function tamanhoMedia({ desvio, erroMax, confianca = 95, populacao = null }) {
    positivo(desvio, 'Desvio-padrão populacional (σ)');
    positivo(erroMax, 'Erro amostral máximo aceito (Em)');
    const z = zCritico(confianca), bruto = (z * desvio / erroMax) ** 2;
    return { z, bruto, n: amostraFinita(bruto, populacao), desvio, erroMax, populacao,
      etapas: [
        {titulo:'Escolher o valor crítico', conta:`Confiança ${confianca}% → z = ${z}`, explicacao:'O grau de confiança determina o valor z da tabela.'},
        {titulo:'Substituir os dados', conta:`n = (${z} × ${desvio} ÷ ${erroMax})²`, explicacao:'Multiplicamos z pelo desvio, dividimos pelo erro máximo e elevamos ao quadrado.'},
        {titulo:'Arredondar para cima', conta:`n ≈ ${bruto}`, explicacao:'Arredondamos para cima para respeitar a precisão pedida.'}
      ]};
  }

  // TAMANHO DA AMOSTRA — Estimativa da proporção: n = z² p(1−p)/Ep².
  function tamanhoProporcao({ p, erroP, confianca = 95, populacao = null }) {
    conferirProporcao(p);
    if (p === 0 || p === 1) erro('Para calcular a amostra com p igual a 0% ou 100%, use uma estimativa não extrema ou marque proporção desconhecida (50%).');
    if (erroP <= 0 || erroP >= 1 || !Number.isFinite(erroP)) erro('Erro da proporção (Ep): informe um valor maior que 0% e menor que 100%.');
    const z = zCritico(confianca), q = 1 - p, bruto = z ** 2 * p * q / (erroP ** 2);
    return { z, p, q, bruto, n: amostraFinita(bruto, populacao), erroP, populacao,
      etapas: [
        {titulo:'Encontrar o complemento', conta:`q = 1 − ${p} = ${q}`, explicacao:'O complemento é a parte que não apresenta a característica.'},
        {titulo:'Aplicar a fórmula', conta:`n = ${z}² × ${p} × ${q} ÷ ${erroP}²`, explicacao:'Aplicamos o valor z, a proporção e a margem de erro.'},
        {titulo:'Arredondar para cima', conta:`n ≈ ${bruto}`, explicacao:'Se o resultado não for inteiro, sempre aumentamos para o próximo inteiro.'}
      ]};
  }

  // INTERVALO DE CONFIANÇA DA MÉDIA — E=z×desvio/raiz(n); IC=media±E.
  function intervaloMedia({ media, desvio, n, confianca = 95, margem = null, populacao = null, amostral = false }) {
    finito(media, 'Média amostral'); positivo(desvio, 'Desvio-padrão', true); inteiro(n, 'Tamanho da amostra');
    if (amostral && n < 2) erro('Para calcular desvio amostral, são necessários ao menos dois valores.');
    const z = zCritico(confianca), fator = fatorFinito(n, populacao);
    const automatica = z * desvio / Math.sqrt(n) * fator;
    if (margem != null) positivo(margem, 'Margem de erro informada', true);
    const E = margem ?? automatica;
    const inferior = finito(media - E, 'Limite inferior'), superior = finito(media + E, 'Limite superior');
    return { z, media, desvio, n, E, automatica, inferior, superior, fator, confianca, amostral,
      aviso: amostral && n <= 30 ? 'O método Z é o utilizado no material da aula. Com desvio amostral e amostra pequena, alguns exercícios exigem t de Student.' : '',
      etapas: [
        {titulo:'Identificar os dados', conta:`Média = ${media}; desvio = ${desvio}; n = ${n}`, explicacao:'Usamos os números que vieram no enunciado ou os obtidos da lista.'},
        {titulo:'Obter a margem de erro', conta: margem == null ? `E = ${z} × ${desvio} ÷ √${n}` : `E = ${margem} (informada)`, explicacao:margem == null?'Dividimos o desvio pela raiz da amostra e multiplicamos por z.':'O enunciado já informou a margem, então não precisamos recalculá-la.'},
        {titulo:'Calcular os dois limites', conta:`${media} − ${E} e ${media} + ${E}`, explicacao:'Subtraímos e somamos a margem à média.'}
      ]};
  }

  // INTERVALO DE CONFIANÇA DA PROPORÇÃO — Ep=z√[p(1−p)/n].
  function intervaloProporcao({ p, n, confianca = 95, margem = null, populacao = null }) {
    conferirProporcao(p); inteiro(n, 'Tamanho da amostra');
    const z = zCritico(confianca), q = 1 - p, fator = fatorFinito(n, populacao);
    const erroPadrao = Math.sqrt(p * q / n);
    const automatica = z * erroPadrao * fator;
    if (margem != null) positivo(margem, 'Margem de erro informada', true);
    const E = margem ?? automatica;
    const inferior = p - E, superior = p + E;
    const avisos = [];
    if (n*p < 5 || n*q < 5) avisos.push('A amostra tem poucas ocorrências em uma das categorias; a aproximação normal pode ser inadequada.');
    if (inferior < 0 || superior > 1) avisos.push('Os limites ultrapassam 0% ou 100%; interprete a aproximação com cautela.');
    return {z,p,q,n,E,automatica,erroPadrao,inferior,superior,confianca,avisos,
      etapas: [
        {titulo:'Calcular a proporção', conta:`p = ${p}; q = ${q}`, explicacao:'Dividimos a quantidade com a característica pelo total. O restante é 1 − p.'},
        {titulo:'Encontrar a margem', conta:margem == null?`E = ${z} × √(${p} × ${q} ÷ ${n})`:`E = ${margem} (informada)`, explicacao:margem == null?'Multiplicamos p pelo complemento, dividimos por n, tiramos a raiz e aplicamos z.':'Usamos a margem fornecida pelo enunciado.'},
        {titulo:'Montar o intervalo', conta:`${p} − ${E} e ${p} + ${E}`, explicacao:'Subtraímos e somamos a margem à proporção encontrada.'}
      ]};
  }

  // CORRELAÇÃO — usa os mesmos pares X e Y na mesma ordem.
  function pares(X, Y, exigirVariacaoY = true) {
    if (X.length !== Y.length || X.length < 2) erro('X e Y precisam ter a mesma quantidade de valores (ao menos dois pares).');
    const mx = descrever(X).media, my = descrever(Y).media;
    let Sxx=0, Syy=0, Sxy=0;
    X.forEach((x, i) => {const dx=x-mx, dy=Y[i]-my;Sxx+=dx*dx;Syy+=dy*dy;Sxy+=dx*dy;});
    if (!(Sxx>0)) erro('Todos os valores de X são iguais. Não é possível calcular esta relação.');
    if (!(Syy>0) && exigirVariacaoY) erro('Todos os valores de Y são iguais. A correlação não está definida.');
    const r=Syy>0 ? Math.max(-1,Math.min(1,Sxy/Math.sqrt(Sxx*Syy))) : null;
    return {X,Y,mx,my,Sxx,Syy,Sxy,r};
  }
  function correlacao(X, Y) {
    const b=pares(X,Y), {r}=b, magnitude=Math.abs(r);
    const intensidade=magnitude >= .999999999 ? 'perfeita' : magnitude >= .7 ? 'forte' : magnitude >= .3 ? 'moderada' : magnitude < 1e-12 ? 'nula' : 'fraca';
    const sentido=r>1e-12?'positiva':r<-1e-12?'negativa':'nula';
    return {...b,intensidade,sentido,
      etapas:[
        {titulo:'Encontrar as médias',conta:`x̄ = ${b.mx}; ȳ = ${b.my}`, explicacao:'Somamos cada grupo e dividimos pela quantidade de pares.'},
        {titulo:'Comparar as variações',conta:`Σ(X−x̄)(Y−ȳ) = ${b.Sxy}`, explicacao:'Verificamos se X e Y aumentam ou diminuem juntos.'},
        {titulo:'Calcular r',conta:`r = Σ(X−x̄)(Y−ȳ) ÷ √(Σ(X−x̄)² · Σ(Y−ȳ)²)`, explicacao:'O resultado varia entre −1 e +1 e mostra a relação linear.'}
      ]};
  }
  function regressao(X, Y, novoX=null) {
    // Mesmo se Y for constante, existe a reta horizontal ŷ = média de Y.
    // Apenas a correlação r fica indefinida nesse caso.
    const b=pares(X,Y,false), a=b.Sxy/b.Sxx, intercepto=b.my-a*b.mx;
    const previsto=novoX==null?null:finito(a*novoX+intercepto,'Previsão');
    const fora=novoX!=null && (novoX<Math.min(...X)||novoX>Math.max(...X));
    return {...b,a,b:intercepto,previsto,novoX,fora,r2:b.r===null?null:b.r*b.r,
      etapas:[
        {titulo:'Calcular as médias',conta:`x̄ = ${b.mx}; ȳ = ${b.my}`, explicacao:'Encontramos o centro dos valores de X e de Y.'},
        {titulo:'Encontrar a inclinação',conta:`a = ${b.Sxy} ÷ ${b.Sxx}`, explicacao:'Dividimos a variação conjunta pela variação de X.'},
        {titulo:'Encontrar o intercepto',conta:`b = ${b.my} − (${a} × ${b.mx})`, explicacao:'Subtraímos da média de Y a inclinação multiplicada pela média de X.'},
        {titulo:'Montar a reta',conta:`ŷ = ${a} × X + (${intercepto})`, explicacao:'A reta permite estimar Y para valores de X.'}
      ]};
  }

  // ESCORE Z — quantos desvios o valor está acima/abaixo da média.
  function escore({valor,media,desvio}) {
    finito(valor,'Valor observado'); finito(media,'Média'); positivo(desvio,'Desvio-padrão');
    const diferenca=valor-media, z=diferenca/desvio;
    return {valor,media,desvio,diferenca,z:finito(z,'Escore Z'),
      etapas:[
        {titulo:'Encontrar a diferença',conta:`${valor} − ${media} = ${diferenca}`,explicacao:'Subtraímos a média do valor observado.'},
        {titulo:'Dividir pelo desvio',conta:`${diferenca} ÷ ${desvio} = ${z}`,explicacao:'O resultado mostra quantos desvios-padrão separam o valor da média.'}
      ]};
  }

  const API=Object.freeze({numero,lista,zCritico,porcentagem,arredondarCima,descrever,respostasBinarias,tamanhoMedia,tamanhoProporcao,intervaloMedia,intervaloProporcao,correlacao,regressao,escore});
  global.StatMath=API;
})(globalThis);
