/* Exercícios adaptados dos três PDFs da disciplina, com números novos.
 * Cada caso contém somente os campos da calculadora que o resolve.
 * Em comparações há mais de um botão; nenhum deles revela a resposta sozinho.
 */
(function (global) {
  'use strict';
  // Cada cenário guarda o texto do botão e os valores que serão preenchidos.
  const caso = (rotulo, campos) => ({rotulo, campos});
  // Cada linha tem código, aba, título, enunciado e cenários de treino.
  const exemplos = [
    ['A1','am','Tempo de resposta de API','Uma API tem desvio-padrão populacional de 980 ms. Com 95% de confiança e erro máximo de 75 ms, quantas requisições devem ser medidas?',[caso('Preencher dados',{confianca:95,desvio:980,erro:75})]],
    ['A2','am','Comparar graus de confiança','Para uma API com σ = 870 ms e Em = 65 ms, compare as amostras mínimas com 90%, 95% e 99% de confiança.',[90,95,99].map(confianca=>caso(`${confianca}% de confiança`,{confianca,desvio:870,erro:65}))],
    ['A3','ap','Pesquisa eleitoral','Uma pesquisa estima 42% de intenção de voto. Qual amostra mínima permite erro de 2,5% com 95% de confiança?',[caso('Preencher dados',{confianca:95,p:42,erro:'2,5'})]],
    ['A4','ap','Falhas de software','Uma equipe de QA estima que 18% dos testes falham. Com 99% de confiança e erro de 4%, calcule a amostra mínima. Repita quando a proporção for desconhecida.',[caso('Proporção conhecida',{confianca:99,p:18,erro:4}),caso('Proporção desconhecida',{confianca:99,desconhecida:true,erro:4})]],
    ['B1','im','Altura dos estudantes','Uma amostra de 64 estudantes tem altura média de 1,69 m e desvio-padrão de 0,16 m. Determine o IC de 95%.',[caso('Preencher dados',{confianca:95,media:'1,69',desvio:'0,16',n:64})]],
    ['B2','im','Altura com 90% de confiança','Uma amostra de 64 estudantes tem média de 1,69 m e desvio-padrão de 0,16 m. Determine o IC de 90%.',[caso('Preencher dados',{confianca:90,media:'1,69',desvio:'0,16',n:64})]],
    ['B3','im','Altura com 99% de confiança','Uma amostra de 64 estudantes tem média de 1,69 m e desvio-padrão de 0,16 m. Determine o IC de 99%.',[caso('Preencher dados',{confianca:99,media:'1,69',desvio:'0,16',n:64})]],
    ['B4','im','Efeito do tamanho da amostra','Para altura média de 1,69 m, desvio-padrão de 0,16 m e confiança de 99%, compare os intervalos com 64 e 144 estudantes.',[64,144].map(n=>caso(`n = ${n}`,{confianca:99,media:'1,69',desvio:'0,16',n}))],
    ['B5','im','Tempo de resposta de servidor','Em 81 requisições, o tempo médio foi de 275 ms e o desvio-padrão de 38 ms. Calcule o IC de 95%.',[caso('Preencher dados',{confianca:95,media:275,desvio:38,n:81})]],
    ['B6','im','Consumo de memória RAM','Em 49 execuções, o consumo médio foi de 3,4 GB, com desvio-padrão de 0,55 GB. Estime a média populacional com 99% de confiança.',[caso('Preencher dados',{confianca:99,media:'3,4',desvio:'0,55',n:49})]],
    ['B7','im','Duração de sessões','Em 72 sessões de uma plataforma, a duração média foi de 21,4 minutos, com desvio-padrão de 5,1 minutos. Determine o IC de 90%.',[caso('Preencher dados',{confianca:90,media:'21,4',desvio:'5,1',n:72})]],
    ['C1','ip','Intenção de voto','Em uma pesquisa com 1.850 eleitores, 703 declararam intenção de votar em um candidato. Construa o IC de 95%.',[caso('Preencher dados',{confianca:95,sucessos:703,n:1850})]],
    ['C2','ip','Preferência por barbeador','Entre 240 entrevistados, 87 preferem determinada marca de barbeador. Determine o IC de 90% para essa preferência.',[caso('Preencher dados',{confianca:90,sucessos:87,n:240})]],
    ['C3','ip','Etiquetas sem defeitos','Em 680 etiquetas examinadas, 46 estavam defeituosas. Estime, com 95% de confiança, a proporção de etiquetas sem defeitos. Informe a quantidade que interessa.',[caso('Preencher dados',{confianca:95,sucessos:634,n:680})]],
    ['C4','ip','Taxa de desemprego','Uma amostra de 1.240 habitantes em idade de trabalhar contém 103 desempregados. Estime a proporção de desempregados com 95% de confiança.',[caso('Preencher dados',{confianca:95,sucessos:103,n:1240})]],
    ['C5','ip','Taxa de bugs','Em 320 módulos de software, 41 têm bugs críticos. Construa o IC de 95% e verifique se a taxa está abaixo do padrão estabelecido de 18%.',[caso('Preencher dados',{confianca:95,sucessos:41,n:320,padrao:18})]],
    ['C6','ip','Autenticação em dois fatores','Entre 720 usuários, 478 utilizam autenticação em dois fatores. Determine o IC de 99% para a adoção.',[caso('Preencher dados',{confianca:99,sucessos:478,n:720})]],
    ['C7','ip','Satisfação com aplicativo','Em 950 usuários pesquisados, 684 avaliaram positivamente o aplicativo. Construa o IC de 95% para a proporção de satisfeitos.',[caso('Preencher dados',{confianca:95,sucessos:684,n:950})]],
    ['T1','de','Diminuir a margem de erro','Uma amostra de 80 medições tem desvio-padrão de 14,5. Com 95% de confiança, quantas observações adicionais são necessárias para reduzir a margem de erro a um terço?',[caso('Preencher dados',{confianca:95,desvio:'14,5',n:80,k:3})]]
  ];
  global.ExemplosEstatistica = exemplos;
  if (typeof document === 'undefined') return;
  const lista = document.getElementById('lista-exemplos');
  if (!lista) return;
  const grupos = {am:'Tamanho da amostra — média',ap:'Tamanho da amostra — proporção',im:'Intervalo de confiança — média',ip:'Intervalo de confiança — proporção',de:'Diminuir o erro — treino extra'};
  // O botão usa os controles existentes: limpa o caso anterior e preenche o novo.
  function carregar(aba, campos) {
    const form = document.getElementById(`form-${aba}`);
    const tab = document.querySelector(`.aba[data-aba="${aba}"]`);
    if (!form || !tab) return;
    // Apaga os campos antigos antes de colocar os novos.
    form.reset();
    for (const [nome, valor] of Object.entries(campos)) {
      const campo = form.elements.namedItem(nome);
      if (!campo) continue;
      if (campo.type === 'checkbox') campo.checked = Boolean(valor);
      else campo.value = String(valor);
    }
    // Avisa a interface da mudança e abre a aba correta.
    form.dispatchEvent(new Event('change', {bubbles:true}));
    tab.click();
    form.querySelector('button[type="submit"]').focus();
  }
  // Cria um elemento visual e coloca texto nele.
  function criar(tag, texto, classe) {
    const el = document.createElement(tag);
    el.textContent = texto;
    if (classe) el.className = classe;
    return el;
  }
  // Monta os cartões de exercício, separados por assunto.
  for (const [aba, titulo] of Object.entries(grupos)) {
    const grupo = criar('section','','grupo-exemplos');
    grupo.append(criar('h3',titulo));
    const grade = criar('div','','grade-exemplos');
    for (const [codigo,tipo,nome,enunciado,casos] of exemplos) {
      if (tipo !== aba) continue;
      const card = criar('article','','cartao exemplo-card');
      card.append(criar('h4',`${codigo} · ${nome}`),criar('p',enunciado));
      const acoes = criar('div','','acoes exemplo-acoes');
      for (const {rotulo,campos} of casos) {
        const botao = criar('button',rotulo,'limpar');
        botao.type = 'button';
        botao.addEventListener('click',()=>carregar(aba,campos));
        acoes.append(botao);
      }
      card.append(acoes);grade.append(card);
    }
    grupo.append(grade);lista.append(grupo);
  }
})(globalThis);
