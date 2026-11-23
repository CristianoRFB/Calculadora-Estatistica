/*
 * TESTES: execute npm test.
 * Cada caso verifica uma regra da disciplina ou um erro comum de digitação.
 * Nenhuma dependência externa é necessária.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../src/math.js';
const M=globalThis.StatMath;
const perto=(atual,alvo,tol=1e-8)=>assert.ok(Math.abs(atual-alvo)<tol,`${atual} deveria ser ~${alvo}`);

test('estrutura matemática disponível',()=>{
  for(const nome of ['numero','lista','descrever','correlacao','regressao','intervaloMedia','intervaloProporcao','tamanhoMedia','tamanhoProporcao','escore'])assert.equal(typeof M[nome],'function');
});
for (const [entrada, esperado] of [['1.250',1250],['1.250,50',1250.5],['1,25',1.25],['1.25',1.25],['-20,5',-20.5],['0',0],['+120',120],['12.345.678',12345678]]){
  test('número brasileiro '+entrada,()=>perto(M.numero(entrada),esperado));
}
for(const entrada of ['abc','1,2,3','1.2,3,4','NaN','Infinity','1e500','','--2']){
  test('rejeitar número inválido '+JSON.stringify(entrada),()=>assert.throws(()=>M.numero(entrada)));
}
test('listas Excel com linhas, tabs e ;',()=>assert.deepEqual(M.lista('1,5\n2,5\t3,5;4,5'),[1.5,2.5,3.5,4.5]));
test('lista vazia ou curta rejeitada',()=>assert.throws(()=>M.lista('10')));
test('média, desvio amostral, desvio populacional',()=>{
  const d=M.descrever([2,4,6,8]);perto(d.media,5);perto(d.desvioAmostra,Math.sqrt(20/3));perto(d.desvioPop,Math.sqrt(5));perto(d.mediana,5);
});
test('um único valor: s indefinido',()=>{
  const d=M.descrever([10]);assert.equal(d.desvioAmostra,null);assert.equal(d.desvioPop,0);
});
for(const [nivel,z] of [[90,1.645],[95,1.96],[99,2.575]])test('tabela Z '+nivel,()=>assert.equal(M.zCritico(nivel),z));
test('tabela Z rejeita 92%',()=>assert.throws(()=>M.zCritico(92)));
for(const [nivel,n] of [[90,423],[95,601],[99,1037]])test('amostra média, σ1250 Em100 '+nivel,()=>assert.equal(M.tamanhoMedia({desvio:1250,erroMax:100,confianca:nivel}).n,n));
for(const [p,E,esperado] of [[.3,.02,2017],[.15,.03,545],[.5,.03,1068]])test(`amostra proporção ${p} ${E}`,()=>assert.equal(M.tamanhoProporcao({p,erroP:E,confianca:95}).n,esperado));
test('corrigir amostra por população conhecida',()=>{
  const r=M.tamanhoProporcao({p:.3,erroP:.05,confianca:95,populacao:1000});assert.ok(r.n<323&&r.n>0);
});
test('amostra não aceita p=0 ou p=1',()=>{for(const p of [0,1])assert.throws(()=>M.tamanhoProporcao({p,erroP:.02}));});
test('amostra rejeita margem zero, negativa e não finita',()=>{
  for(const E of [0,-1,NaN,Infinity])assert.throws(()=>M.tamanhoMedia({desvio:1250,erroMax:E}));
});
test('amostra arredonda para cima sem somar 1 por erro binário',()=>{
  assert.equal(M.arredondarCima(600.0000000000001),600);
  assert.equal(M.arredondarCima(600.0000001),601);
});
test('IC média dados da aula 320 45 n50 95%',()=>{
  const r=M.intervaloMedia({media:320,desvio:45,n:50,confianca:95});
  perto(r.E,1.96*45/Math.sqrt(50));perto(r.inferior,307.52663638,1e-6);perto(r.superior,332.47336362,1e-6);
});
test('IC média recebe margem já informada',()=>{
 const r=M.intervaloMedia({media:159,desvio:12.42,n:10,margem:7.70});perto(r.inferior,151.3);perto(r.superior,166.7);
});
test('IC proporção: 40 de 100 a 90%',()=>{
  const r=M.intervaloProporcao({p:.4,n:100,confianca:90});perto(r.E,.080588,1e-6);perto(r.inferior,.319412,1e-6);perto(r.superior,.480588,1e-6);
});
test('IC proporção com margem 8 pontos percentuais',()=>{
 const r=M.intervaloProporcao({p:.4,n:100,confianca:90,margem:.08});perto(r.inferior,.32);perto(r.superior,.48);
});
test('IC proporção alerta quando amostra é pequena/extrema',()=>{
 const r=M.intervaloProporcao({p:.02,n:20});assert.ok(r.avisos.length>=1);
});
test('IC população N menor que n rejeitada',()=>assert.throws(()=>M.intervaloMedia({media:10,desvio:2,n:100,populacao:20})));
test('IC com correção finita tem margem menor',()=>{
 const a=M.intervaloMedia({media:10,desvio:2,n:100});const b=M.intervaloMedia({media:10,desvio:2,n:100,populacao:150});assert.ok(b.E<a.E);
});
test('respostas sim/não e 1/0',()=>{
 const r=M.respostasBinarias('sim;não;1;0;Sim');assert.equal(r.total,5);assert.equal(r.positivos,3);perto(r.p,.6);
});
test('respostas diferentes de sim/não rejeitadas',()=>assert.throws(()=>M.respostasBinarias('sim;talvez')));
test('correlação perfeita positiva',()=>perto(M.correlacao([1,2,3],[2,4,6]).r,1));
test('correlação perfeita negativa',()=>perto(M.correlacao([1,2,3],[6,4,2]).r,-1));
test('correlação: série real da professora',()=>{
 const r=M.correlacao([100,200,300,400,500,600],[50,80,130,190,260,350]);assert.ok(r.r>.97&&r.r<1);
});
test('correlação rejeita lista de tamanhos diferentes',()=>assert.throws(()=>M.correlacao([1,2,3],[1,2])));
test('correlação rejeita todos X constantes',()=>assert.throws(()=>M.correlacao([1,1,1],[1,2,3])));
test('regressão perfeita y=2x+1',()=>{
 const r=M.regressao([1,2,3],[3,5,7],4);perto(r.a,2);perto(r.b,1);perto(r.previsto,9);assert.equal(r.fora,true);
});
test('regressão identifica extrapolação',()=>{
 const r=M.regressao([1,2,3],[3,5,7],2);assert.equal(r.fora,false);
});
test('escore acima e abaixo',()=>{perto(M.escore({valor:280,media:240,desvio:20}).z,2);perto(M.escore({valor:200,media:240,desvio:20}).z,-2);});
test('escore rejeita desvio zero',()=>assert.throws(()=>M.escore({valor:1,media:1,desvio:0})));
// Teste de propriedade: para margens maiores, amostras nunca devem aumentar.
for(let i=1;i<=35;i++){
 const desvio=10+i*9,E=2+i/10;
 test(`propriedade amostra reduz com erro maior #${i}`,()=>{
  const a=M.tamanhoMedia({desvio,erroMax:E,confianca:95});
  const b=M.tamanhoMedia({desvio,erroMax:E*1.4,confianca:95});
  assert.ok(b.n<=a.n);
 });
}
// Teste de propriedade: intervalos devem conter o ponto estimado.
for(let i=2;i<=32;i++){
 test(`intervalo contém sua média #${i}`,()=>{
  const r=M.intervaloMedia({media:i*10,desvio:2*i,n:i+5,confianca:95});
  assert.ok(r.inferior<=i*10&&r.superior>=i*10);
 });
}
test('regressão aceita Y constante mesmo que r fique indefinido',()=>{
 const r=M.regressao([1,2,3],[7,7,7],4);perto(r.a,0);perto(r.b,7);perto(r.previsto,7);assert.equal(r.r,null);assert.equal(r.r2,null);
});
