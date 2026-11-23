/*
 * ESTATÍSTICA APLICADA — A TELA E OS BOTÕES
 * =============================================================
 * Se um campo não aparece, procure a função montarFormulario().
 * Se um cálculo estiver errado, abra src/math.js.
 * Se o visual estiver errado, abra assets/styles.css.
 * Não há frameworks, rede, cookies ou armazenamento de dados pessoais.
 */
(function () {
  'use strict';
  const MathEst = globalThis.StatMath;
  const $ = id => document.getElementById(id);
  const FORM = $('calc-form');
  if (!MathEst || !FORM) return;

  // Cada assunto guarda apenas o nome, uma frase e a ajuda da disciplina.
  const ASSUNTOS = {
    amostra: {grupo:'TAMANHO DA AMOSTRA',titulo:'Tamanho da amostra',descricao:'Descubra quantas observações são necessárias em uma pesquisa.',ajuda:'Quando o enunciado perguntar <strong>quantas pessoas, medições ou requisições</strong> são necessárias. Para média, use o desvio-padrão populacional (σ) e o erro amostral máximo aceito (Em). Para proporção, use a proporção estimada (p) e a margem Ep. O tamanho é arredondado para cima.'},
    'media-ic':{grupo:'INTERVALO DE CONFIANÇA',titulo:'Intervalo da média',descricao:'Estime a faixa em que pode estar a média verdadeira da população.',ajuda:'Quando a professora pedir <strong>intervalo de confiança para a média</strong>. O enunciado geralmente informa média amostral, desvio-padrão, tamanho da amostra e grau de confiança. O resultado tem um limite inferior e outro superior.'},
    'proporcao-ic':{grupo:'INTERVALO DE CONFIANÇA',titulo:'Intervalo da proporção',descricao:'Estime uma porcentagem da população a partir de uma amostra.',ajuda:'Quando a pergunta disser <strong>quantos preferem, quantos aprovam, porcentagem de defeitos ou casos positivos</strong>. Informe a quantidade com a característica e o total. A calculadora obtém p e seu complemento automaticamente.'},
    correlacao:{grupo:'CORRELAÇÃO E REGRESSÃO',titulo:'Correlação de Pearson',descricao:'Veja se duas variáveis aumentam ou diminuem juntas.',ajuda:'Quando o exercício pedir a <strong>força ou a direção da relação entre X e Y</strong>. Cada valor de X precisa corresponder a um valor de Y na mesma posição. r vai de −1 a +1. Correlação não prova causa e efeito.'},
    regressao:{grupo:'CORRELAÇÃO E REGRESSÃO',titulo:'Regressão linear simples',descricao:'Encontre a equação da reta e estime valores de Y.',ajuda:'Quando o problema pedir a <strong>equação da reta, previsão, coeficiente angular ou intercepto</strong>. Informe os pares X/Y, e um novo X se quiser prever Y. Previsões fora dos X observados são extrapolações.'},
    escore:{grupo:'ESCORE',titulo:'Escore Z',descricao:'Descubra quantos desvios-padrão separam um valor da média.',ajuda:'Quando aparecerem <strong>escore Z, padronização ou distância da média</strong>. Informe o valor observado, a média e o desvio-padrão. Um Z positivo está acima da média; negativo, abaixo.'},
    basico:{grupo:'CÁLCULO DE APOIO',titulo:'Média e desvio-padrão',descricao:'Cole uma lista de números para obter os valores usados nas fórmulas.',ajuda:'Assim como no Excel, basta inserir uma <strong>coluna de valores</strong>. A média, o desvio-padrão amostral e o populacional são calculados automaticamente. s divide por n−1; σ divide por n.'}
  };

  // Estado curto: valores são mantidos enquanto o aluno alterna de assunto.
  const estados = Object.create(null);
  let atual = 'amostra';
  let ultimaResposta = '';
  let temporizadorCopiar = null;

  function estado() {
    if (!estados[atual]) estados[atual]={tipo:'media',entrada:'direto',modo:'quantidade',confianca:'95',desconhecida:false};
    return estados[atual];
  }
  function esc(texto) { return String(texto).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // Funções que criam uma única linha do formulário.
  function campo(chave,rotulo,opcoes={}) {
    const s=estado(), valor=s[chave] ?? '';
    const ajuda=opcoes.ajuda?`<p class="field-hint">${esc(opcoes.ajuda)}</p>`:'';
    const simbolo=opcoes.simbolo?`<span class="symbol">${esc(opcoes.simbolo)}</span>`:'';
    return `<div class="field" data-wrapper="${chave}"><label class="field-label" for="f-${chave}"><span>${esc(rotulo)}</span>${simbolo}</label><input id="f-${chave}" data-field="${chave}" inputmode="${opcoes.inteiro?'numeric':'decimal'}" autocomplete="off" type="text" value="${esc(valor)}" placeholder="${esc(opcoes.placeholder||'Digite o valor')}">${ajuda}</div>`;
  }
  function area(chave,rotulo,ajuda='Um número por linha ou separado por ponto e vírgula.') {
    return `<div class="field"><label class="field-label" for="f-${chave}">${esc(rotulo)}</label><textarea id="f-${chave}" data-field="${chave}" spellcheck="false" placeholder="Cole os valores aqui"></textarea><p class="field-hint">${esc(ajuda)}</p></div>`;
  }
  function confianca() {
    const v=estado().confianca??'95';
    return `<div class="field"><label class="field-label" for="f-confianca">Grau de confiança</label><select id="f-confianca" data-field="confianca">${[90,95,99].map(z=>`<option value="${z}" ${v==z?'selected':''}>${z}% · z = ${MathEst.zCritico(z).toLocaleString('pt-BR',{maximumFractionDigits:3})}</option>`).join('')}</select></div>`;
  }
  function botoes(chave,rotulo,opcoes) {
    const selected=estado()[chave]??opcoes[0][0];
    return `<div class="pill-heading">${esc(rotulo)}</div><div class="pill-control" role="group" aria-label="${esc(rotulo)}">${opcoes.map(([val,text])=>`<button type="button" data-choice="${chave}" data-value="${val}" class="${selected===val?'selected':''}" aria-pressed="${selected===val}">${esc(text)}</button>`).join('')}</div>`;
  }
  function opcaoCheckbox(chave,rotulo) {
    return `<label class="inline-check"><input type="checkbox" data-field="${chave}" ${estado()[chave]?'checked':''}><span>${esc(rotulo)}</span></label>`;
  }
  function extras(conteudo) {
    return `<details class="extra-details"><summary>Mais opções (se o enunciado informar)</summary><div class="extra-inner">${conteudo}</div></details>`;
  }
  function extrasIC(proporcao=false) {
    return extras(campo('margem','Margem de erro já informada', {simbolo:proporcao?'pontos percentuais':'mesma unidade da média',ajuda:proporcao?'Se informar 8, significa 8 pontos percentuais.':'Deixe vazio para a calculadora obter a margem.'})+campo('populacao','Tamanho total da população (N)',{inteiro:true,ajuda:'Preencha somente se o total da população for conhecido.'}));
  }
  function modEntrada() {return botoes('entrada','Como o exercício fornece os dados?', [['direto','Valores informados'],['lista','Lista de valores']]);}

  // Só aparecem os campos necessários para o assunto e o modo escolhidos.
  function montarFormulario() {
    const s=estado();
    let html='';
    if (atual==='amostra') {
      html+=botoes('tipo','O que deseja estimar?',[['media','Média'],['proporcao','Proporção']]);
      html+=modEntrada();
      if (s.entrada==='lista') {
        html+=area('valores','Valores da amostra',s.tipo==='media'?'Cole uma lista de números. O desvio-padrão será calculado.':'Informe uma resposta por linha: sim/não ou 1/0.');
      } else if (s.tipo==='media') {
        html+=campo('desvio','Desvio-padrão populacional',{simbolo:'σ'});
      } else {
        html+=opcaoCheckbox('desconhecida','Proporção desconhecida (usar 50%)');
        if (!s.desconhecida) html+=campo('percentual','Proporção estimada',{simbolo:'p · %'});
      }
      html+=campo('erro','Erro amostral máximo aceito',{simbolo:s.tipo==='media'?'Em · mesma unidade':'Ep · %'});
      html+=confianca();
      html+=extras(campo('populacao','Tamanho total da população (N)',{inteiro:true,ajuda:'Opcional. Só preencha se a professora informar N.'}));
    } else if (atual==='media-ic') {
      html+=modEntrada();
      if (s.entrada==='direto') html+=campo('media','Média amostral',{simbolo:'x̄'})+campo('desvio','Desvio-padrão',{simbolo:'σ ou s'})+campo('n','Tamanho da amostra',{simbolo:'n',inteiro:true});
      else html+=area('valores','Valores da amostra');
      html+=confianca()+extrasIC(false);
    } else if (atual==='proporcao-ic') {
      html+=modEntrada();
      if (s.entrada==='direto') {
        html+=botoes('modo','O que o enunciado informa?',[['quantidade','Quantidade'],['percentual','Porcentagem']]);
        html+=campo('n','Tamanho da amostra',{simbolo:'n',inteiro:true});
        html+=s.modo==='quantidade'?campo('positivos','Quantidade com a característica',{simbolo:'k',inteiro:true}):campo('percentual','Proporção observada',{simbolo:'p · %'});
      } else html+=area('valores','Respostas da amostra','Informe sim/não ou 1/0, uma resposta por linha.');
      html+=confianca()+extrasIC(true);
    } else if (atual==='correlacao'||atual==='regressao') {
      html+=area('x','Valores de X')+area('y','Valores de Y','Cada Y deve corresponder ao X da mesma posição.');
      if (atual==='regressao') html+=extras(campo('novoX','Novo valor de X para prever Y',{ajuda:'Opcional. Deixe vazio se quiser apenas a equação da reta.'}));
    } else if (atual==='escore') {
      html+=campo('valor','Valor observado',{simbolo:'x'})+modEntrada();
      html+=s.entrada==='direto'?campo('media','Média',{simbolo:'μ ou x̄'})+campo('desvio','Desvio-padrão',{simbolo:'σ ou s'}):area('valores','Valores da amostra');
    } else if (atual==='basico') {
      html+=area('valores','Valores observados');
    }
    $('dynamic-form').innerHTML=html;
    // Textareas não recebem conteúdo HTML do usuário: preencha via value.
    $('dynamic-form').querySelectorAll('textarea[data-field]').forEach(area=>{area.value=s[area.dataset.field]??'';});
    $('dynamic-form').querySelectorAll('input[data-field],select[data-field],textarea[data-field]').forEach(input=>{
      input.addEventListener(input.type==='checkbox'?'change':'input',()=>{
        s[input.dataset.field]=input.type==='checkbox'?input.checked:input.value;
        invalidarResultado();
        if(input.dataset.field==='desconhecida') montarFormulario();
      });
    });
    $('dynamic-form').querySelectorAll('button[data-choice]').forEach(botao=>{
      botao.addEventListener('click',()=>{
        if(botao.dataset.choice==='tipo' && s.tipo!==botao.dataset.value){s.erro='';s.valores='';}
        s[botao.dataset.choice]=botao.dataset.value;
        invalidarResultado();
        montarFormulario();
      });
    });
  }

  // Uma alteração nos dados invalida a resposta anterior: nunca mostre resposta velha.
  function invalidarResultado() {
    $('form-error').hidden=true;
    $('result-content').hidden=true;
    $('result-placeholder').hidden=false;
    $('copy-btn').hidden=true;
    ultimaResposta='';
  }
  function mudarAssunto(id) {
    if (!ASSUNTOS[id]) return;
    atual=id;
    const a=ASSUNTOS[id];
    $('topic-group').textContent=a.grupo;
    $('topic-title').textContent=a.titulo;
    $('topic-description').textContent=a.descricao;
    $('topic-help').innerHTML=`<p>${a.ajuda}</p>`; // somente texto estático deste arquivo
    $('help-details').open=false;
    $('topic-mobile').value=id;
    document.querySelectorAll('.nav-link').forEach(b=>{
      const ativo=b.dataset.topic===id;
      b.classList.toggle('is-active',ativo);
      if(ativo)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    });
    montarFormulario();
    invalidarResultado();
  }

  // Lê os dados da tela. Ninguém precisa preencher um valor que pode ser calculado.
  const numero=(chave,nome)=>MathEst.numero(estado()[chave],nome);
  const opcional=(chave,nome)=>String(estado()[chave]??'').trim()?MathEst.numero(estado()[chave],nome):null;
  function controleN(chave,nome,obrigatorio=true) {
    const v=obrigatorio?numero(chave,nome):opcional(chave,nome);
    if (v==null)return null;
    if(!Number.isSafeInteger(v)||v<1)throw Error(`${nome}: informe um número inteiro positivo.`);
    return v;
  }
  function lerConfianca(){return Number(estado().confianca??95);}
  function dadosProporcao() {
    const s=estado();
    if(s.entrada==='lista'){
      const dados=MathEst.respostasBinarias(s.valores);
      return {p:dados.p,n:dados.total,positivos:dados.positivos,origem:'lista'};
    }
    const n=controleN('n','Tamanho da amostra');
    let positivos=null,p;
    if(s.modo==='percentual') p=MathEst.porcentagem(s.percentual,'Proporção observada');
    else {
      positivos=MathEst.numero(s.positivos,'Quantidade com a característica');
      if(!Number.isSafeInteger(positivos)||positivos<0||positivos>n)throw Error('Quantidade com a característica: informe um inteiro entre zero e o total.');
      p=positivos/n;
    }
    if(positivos===null){const calculados=p*n;const maisProximo=Math.round(calculados);if(Math.abs(calculados-maisProximo)<1e-9)positivos=maisProximo;}
    return {p,n,positivos,origem:'direto'};
  }
  function lerMedia() {
    const s=estado();
    if(s.entrada==='lista'){
      const d=MathEst.descrever(MathEst.lista(s.valores,'Valores',2));
      return {media:d.media,desvio:d.desvioAmostra,n:d.n,amostral:true};
    }
    return {media:numero('media','Média amostral'),desvio:numero('desvio','Desvio-padrão'),n:controleN('n','Tamanho da amostra'),amostral:false};
  }

  // Número em português, sem zeros demais e sem resultados falsamente precisos.
  const nf = new Intl.NumberFormat('pt-BR',{maximumFractionDigits:6});
  const n2 = new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const fmt=v=>nf.format(Object.is(v,-0)?0:v);
  const pct=v=>`${n2.format(v*100)}%`;
  function resumo(linha,valor){return {linha,valor:String(valor)};}
  function calcular() {
    const s=estado(), confianca=lerConfianca();
    if(atual==='amostra'){
      const N=controleN('populacao','População (N)',false);
      if(s.tipo==='media'){
        let desvio=null;let aviso='';
        if(s.entrada==='lista'){
          const d=MathEst.descrever(MathEst.lista(s.valores,'Valores',2));
          desvio=d.desvioAmostra;
          aviso='O desvio foi estimado a partir da lista; ele não é necessariamente o desvio-padrão populacional conhecido.';
        } else desvio=numero('desvio','Desvio-padrão populacional');
        const E=numero('erro','Erro amostral máximo aceito (Em)');
        const r=MathEst.tamanhoMedia({desvio,erroMax:E,confianca,populacao:N});
        const comparar=[90,95,99].map(c=>[`${c}%`,fmt(MathEst.tamanhoMedia({desvio,erroMax:E,confianca:c,populacao:N}).n)]);
        return {etiqueta:'Amostra mínima necessária',valor:fmt(r.n),unidade:'observações',linhas:[resumo('Desvio-padrão (σ)',fmt(desvio)),resumo('Erro máximo (Em)',fmt(E)),resumo('Grau de confiança',`${confianca}%`),...(N?[resumo('População total (N)',fmt(N))]:[])],insight:`Para estimar a média com ${confianca}% de confiança, são necessárias pelo menos ${fmt(r.n)} observações.`,aviso,etapas:r.etapas,comparar};
      }
      let p, aviso='';
      if(s.entrada==='lista')p=MathEst.respostasBinarias(s.valores).p;
      else if(s.desconhecida){p=.5;aviso='Sem proporção conhecida, foi adotado p = 50%, a opção mais conservadora.';}
      else p=MathEst.porcentagem(s.percentual,'Proporção estimada');
      const E=MathEst.porcentagem(numero('erro','Erro da proporção (Ep)'),'Erro da proporção (Ep)');
      const r=MathEst.tamanhoProporcao({p,erroP:E,confianca,populacao:N});
      const comparar=[90,95,99].map(c=>[`${c}%`,fmt(MathEst.tamanhoProporcao({p,erroP:E,confianca:c,populacao:N}).n)]);
      return {etiqueta:'Amostra mínima necessária',valor:fmt(r.n),unidade:'observações',linhas:[resumo('Proporção (p)',pct(p)),resumo('Complemento (1 − p)',pct(r.q)),resumo('Erro (Ep)',pct(E)),resumo('Grau de confiança',`${confianca}%`)],insight:`Para estimar essa proporção com ${confianca}% de confiança, são necessárias pelo menos ${fmt(r.n)} observações.`,aviso,etapas:r.etapas,comparar};
    }
    if(atual==='media-ic'){
      const d=lerMedia(),E=opcional('margem','Margem de erro informada'),N=controleN('populacao','População (N)',false);
      const r=MathEst.intervaloMedia({...d,confianca,margem:E,populacao:N});
      return {etiqueta:'Intervalo de confiança da média',valor:`${n2.format(r.inferior)} a ${n2.format(r.superior)}`,unidade:`Grau de confiança: ${confianca}%`,linhas:[resumo('Média amostral (x̄)',fmt(d.media)),resumo('Desvio-padrão',fmt(d.desvio)),resumo('Tamanho da amostra (n)',fmt(d.n)),resumo('Margem de erro (Em)',fmt(r.E))],insight:`A média populacional é estimada entre ${n2.format(r.inferior)} e ${n2.format(r.superior)}.`,aviso:r.aviso,etapas:r.etapas};
    }
    if(atual==='proporcao-ic'){
      const d=dadosProporcao(),E=opcional('margem','Margem de erro informada'),N=controleN('populacao','População (N)',false);
      const r=MathEst.intervaloProporcao({p:d.p,n:d.n,confianca,margem:E==null?null:E/100,populacao:N});
      const q=1-d.p;
      const linhas=[resumo('Proporção (p)',pct(d.p)),resumo('Complemento (1 − p)',pct(q)),resumo('Tamanho da amostra (n)',fmt(d.n)),resumo('Margem de erro',`${n2.format(r.E*100)} p.p.`)];
      if(d.positivos!==null)linhas.push(resumo('Com a característica',fmt(d.positivos)),resumo('Sem a característica',fmt(d.n-d.positivos)));
      return {etiqueta:'Intervalo de confiança da proporção',valor:`${pct(r.inferior)} a ${pct(r.superior)}`,unidade:`Grau de confiança: ${confianca}%`,linhas,insight:`A proporção da população é estimada entre ${pct(r.inferior)} e ${pct(r.superior)}.`,aviso:r.avisos.join(' '),etapas:r.etapas};
    }
    if(atual==='correlacao'||atual==='regressao'){
      const X=MathEst.lista(s.x,'Valores de X'),Y=MathEst.lista(s.y,'Valores de Y');
      if(atual==='correlacao'){
        const r=MathEst.correlacao(X,Y);
        return {etiqueta:'Coeficiente de correlação (r)',valor:fmt(r.r),unidade:`Correlação ${r.sentido} ${r.intensidade}`,linhas:[resumo('Quantidade de pares',fmt(X.length)),resumo('Média de X',fmt(r.mx)),resumo('Média de Y',fmt(r.my))],insight:`A relação linear é ${r.intensidade} e ${r.sentido}. Correlação não demonstra causa e efeito.`,etapas:r.etapas,grafico:{X,Y}};
      }
      const novoX=opcional('novoX','Novo valor de X');
      const r=MathEst.regressao(X,Y,novoX);
      const sinal=r.b<0?'−':'+';
      const equacao=`ŷ = ${fmt(r.a)} × X ${sinal} ${fmt(Math.abs(r.b))}`;
      return {etiqueta:'Equação da reta',valor:equacao,valorPequeno:true,unidade:'Regressão linear simples',linhas:[resumo('Inclinação (a)',fmt(r.a)),resumo('Intercepto (b)',fmt(r.b)),resumo('Correlação (r)',r.r===null?'Não definida':fmt(r.r)),resumo('Determinação (R²)',r.r2===null?'Não definido':pct(r.r2)),...(novoX!=null?[resumo(`Previsão para X = ${fmt(novoX)}`,fmt(r.previsto))]:[])],insight:`A cada unidade de X, o valor previsto de Y ${r.a>=0?'aumenta':'diminui'} em ${fmt(Math.abs(r.a))} unidades.`,aviso:r.fora?'A previsão está fora dos valores observados de X. Isso é uma extrapolação.':'',etapas:r.etapas,grafico:{X,Y,a:r.a,b:r.b}};
    }
    if(atual==='escore'){
      const valor=numero('valor','Valor observado');
      let media,desvio,n=null;
      if(s.entrada==='lista'){
        const d=MathEst.descrever(MathEst.lista(s.valores,'Valores',2));media=d.media;desvio=d.desvioAmostra;n=d.n;
      }else{media=numero('media','Média');desvio=numero('desvio','Desvio-padrão');}
      const r=MathEst.escore({valor,media,desvio});
      return {etiqueta:'Escore Z',valor:fmt(r.z),unidade:r.z>0?'Acima da média':r.z<0?'Abaixo da média':'Igual à média',linhas:[resumo('Valor observado',fmt(valor)),resumo('Média',fmt(media)),resumo('Desvio-padrão',fmt(desvio)),...(n?[resumo('Quantidade de valores',fmt(n))]:[])],insight:`O valor está a ${fmt(Math.abs(r.z))} desvio(s)-padrão ${r.z>0?'acima':r.z<0?'abaixo':'da mesma posição'} da média.`,etapas:r.etapas};
    }
    if(atual==='basico'){
      const d=MathEst.descrever(MathEst.lista(s.valores,'Valores',1));
      return {etiqueta:'Média aritmética',valor:fmt(d.media),unidade:`Calculada a partir de ${fmt(d.n)} valor(es)`,linhas:[resumo('Quantidade (n)',fmt(d.n)),resumo('Mediana',fmt(d.mediana)),resumo('Desvio-padrão populacional (σ)',fmt(d.desvioPop)),resumo('Desvio-padrão amostral (s)',d.desvioAmostra==null?'Não definido (n=1)':fmt(d.desvioAmostra)),resumo('Variância populacional',fmt(d.varianciaPop)),resumo('Variância amostral',d.varianciaAmostra==null?'Não definida (n=1)':fmt(d.varianciaAmostra))],insight:'Use σ se os valores são toda a população; use s se são uma amostra.',etapas:[{titulo:'Calcular a média',conta:'Média = soma dos valores ÷ quantidade',explicacao:`Somamos ${fmt(d.n)} valores e dividimos pela quantidade.`},{titulo:'Medir a dispersão',conta:'Variância = soma dos desvios ao quadrado ÷ divisor',explicacao:'O divisor é n para a população e n−1 para uma amostra.'},{titulo:'Calcular o desvio-padrão',conta:'Desvio-padrão = √variância',explicacao:'Tiramos a raiz quadrada da variância.'}]};
    }
    throw Error('Cálculo não encontrado.');
  }

  // RESULTADO: todas as linhas são somente leitura. Nenhum número extra para preencher.
  function renderizarResultado(r) {
    const root=$('result-content');root.replaceChildren();
    function node(tag,cls,txt,pai=root){const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;pai.appendChild(x);return x;}
    const bloco=node('div','result-summary');
    node('div','result-kicker',r.etiqueta,bloco);
    node('strong','result-number'+(r.valorPequeno||String(r.valor).length>23?' small':''),r.valor,bloco);
    if(r.unidade)node('div','result-unit',r.unidade,bloco);
    const lista=node('div','result-rows');
    r.linhas.forEach(l=>{const linha=node('div','result-row',undefined,lista);node('span','',l.linha,linha);node('strong','',l.valor,linha);});
    if(r.insight)node('div','result-insight',r.insight);
    if(r.aviso)node('div','result-warning',r.aviso);
    if(r.grafico)grafico(r.grafico,root);
    if(r.comparar){
      const d=node('details','compare-details');node('summary','', 'Comparar 90%, 95% e 99%',d);
      const table=node('table','compare-table',undefined,d);
      const header=node('tr','',undefined,node('thead','',undefined,table));node('th','','Confiança',header);node('th','','Amostra mínima',header);
      const body=node('tbody','',undefined,table);
      r.comparar.forEach(([conf,n])=>{const row=node('tr','',undefined,body);node('td','',conf,row);node('td','',n,row);});
    }
    if(r.etapas?.length){
      const d=node('details','work-details');node('summary','','Ver resolução passo a passo',d);const ol=node('ol','work-steps',undefined,d);
      r.etapas.forEach((etapa,i)=>{const li=node('li','',undefined,ol);node('span','step-index',String(i+1),li);const item=node('div','',undefined,li);node('div','step-title',etapa.titulo,item);node('div','step-calc',etapa.conta,item);node('div','step-explain',etapa.explicacao,item);});
    }
    root.hidden=false;$('result-placeholder').hidden=true;$('copy-btn').hidden=false;
    ultimaResposta=[r.etiqueta+': '+r.valor,r.unidade||'',...r.linhas.map(l=>`${l.linha}: ${l.valor}`),r.insight||''].filter(Boolean).join('\n');
  }

  // Pequeno gráfico de dispersão para correlação e regressão; sem bibliotecas.
  function grafico({X,Y,a,b},root) {
    if(X.length>10000)return;
    const w=400,h=245,pad=28;
    const xmin=Math.min(...X),xmax=Math.max(...X),ymin=Math.min(...Y),ymax=Math.max(...Y);
    const rx=Math.max(1e-10,xmax-xmin),ry=Math.max(1e-10,ymax-ymin);
    const xx=x=>pad+(x-xmin)/rx*(w-2*pad),yy=y=>h-pad-(y-ymin)/ry*(h-2*pad);
    const wrap=document.createElement('div');wrap.className='simple-chart';
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('role','img');svg.setAttribute('aria-label','Gráfico de dispersão dos pares X e Y');
    function elem(tag,attrs){const el=document.createElementNS(svg.namespaceURI,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));svg.appendChild(el);return el;}
    elem('line',{x1:pad,y1:h-pad,x2:w-pad,y2:h-pad,class:'axis'});elem('line',{x1:pad,y1:h-pad,x2:pad,y2:pad,class:'axis'});
    X.forEach((x,i)=>elem('circle',{cx:xx(x),cy:yy(Y[i]),r:Math.max(2.5,Math.min(4,38/Math.sqrt(X.length))),class:'data-point'}));
    if(a!==undefined&&b!==undefined){elem('line',{x1:xx(xmin),y1:yy(a*xmin+b),x2:xx(xmax),y2:yy(a*xmax+b),class:'reg-line'});}
    const t=elem('text',{x:pad,y:h-6});t.textContent=`X: ${fmt(xmin)} a ${fmt(xmax)}`;
    const label=elem('text',{x:pad+3,y:15});label.textContent=`Y: ${fmt(ymin)} a ${fmt(ymax)}`;
    wrap.appendChild(svg);root.appendChild(wrap);
  }

  // Eventos e proteções contra falha. Qualquer erro vira uma frase, não derruba a tela.
  FORM.addEventListener('submit',evento=>{
    evento.preventDefault();$('form-error').hidden=true;
    try {renderizarResultado(calcular());}
    catch(e){invalidarResultado();$('form-error').textContent=e instanceof Error?e.message:'Não foi possível calcular. Confira os valores.';$('form-error').hidden=false;}
  });
  $('clear').addEventListener('click',()=>{
    const atualEstado=estado();
    estados[atual]={tipo:atualEstado.tipo,entrada:atualEstado.entrada,modo:atualEstado.modo,confianca:'95',desconhecida:false};
    montarFormulario();invalidarResultado();
  });
  document.querySelectorAll('button[data-topic]').forEach(b=>b.addEventListener('click',()=>mudarAssunto(b.dataset.topic)));
  $('topic-mobile').addEventListener('change',e=>mudarAssunto(e.target.value));
  $('copy-btn').addEventListener('click',async()=>{
    if(!ultimaResposta)return;
    try{
      if(navigator.clipboard&&globalThis.isSecureContext)await navigator.clipboard.writeText(ultimaResposta);
      else{
        const area=document.createElement('textarea');area.value=ultimaResposta;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();
        if(!document.execCommand('copy'))throw Error('Não foi possível copiar');area.remove();
      }
      $('copy-btn').textContent='Copiado!';clearTimeout(temporizadorCopiar);temporizadorCopiar=setTimeout(()=>$('copy-btn').textContent='Copiar',1600);
    }catch(e){$('copy-btn').textContent='Selecione e copie';}
  });
  mudarAssunto(atual);
})();
