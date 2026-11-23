/* TESTES MATEMÁTICOS — execute npm test. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import '../src/calculos.js';
const C=globalThis.Calculos;
const perto=(atual,esperado,tolerancia=1e-9)=>assert.ok(Math.abs(atual-esperado)<=tolerancia,`${atual} deveria estar perto de ${esperado}`);

test('exatamente cinco cálculos principais disponíveis',()=>{
  for(const fn of ['amostraMedia','amostraProporcao','intervaloMedia','intervaloProporcao','diminuirErro'])assert.equal(typeof C[fn],'function');
});
for(const [digitado,esperado] of [['1.250',1250],['1.250,75',1250.75],['1,25',1.25],['1.25',1.25],['-1,50',-1.5],['12.345.678',12345678],['0',0],['+10',10],['.25',0.25],['0,001',.001]]) {
  test('leitura brasileira: '+digitado,()=>perto(C.numero(digitado),esperado));
}
for(const v of ['', ' ', 'NaN','Infinity','-Infinity','abc','1,2,3','1.2,3','--1','1e10000','10%']){
  test('entrada recusada: '+JSON.stringify(v),()=>assert.throws(()=>C.numero(v)));
}
for(const [conf,z] of [[90,1.645],[95,1.96],[99,2.575]])test('valores Z '+conf,()=>assert.equal(C.valorCritico(conf),z));
for(const v of [0,89,91,92,96,100,NaN])test('confiança inválida '+v,()=>assert.throws(()=>C.valorCritico(v)));
for(const [conf,n] of [[90,423],[95,601],[99,1037]])test('tamanho média σ1250 Em100 '+conf,()=>assert.equal(C.amostraMedia({confianca:conf,desvio:1250,erro:100}).n,n));
for(const [p,E,n] of [[30,2,2017],[15,3,545],[50,3,1068]])test(`tamanho proporção ${p}% e ${E}%`,()=>assert.equal(C.amostraProporcao({percentual:p,erro:E}).n,n));
test('amostra média arredonda para cima e guarda valor exato',()=>{const r=C.amostraMedia({desvio:1250,erro:100});perto(r.exato,600.25);assert.equal(r.n,601);});
test('amostra proporção calcula complemento automaticamente',()=>{const r=C.amostraProporcao({percentual:30,erro:2});perto(r.p,.3);perto(r.q,.7);perto(r.ep,.02);});
test('IC média do servidor (320,45,50,95%)',()=>{const r=C.intervaloMedia({media:320,desvio:45,n:50});perto(r.margem,12.473363619,1e-8);perto(r.inferior,307.526636381,1e-8);perto(r.superior,332.473363619,1e-8);});
test('IC média 159,12,42,10,95%',()=>{const r=C.intervaloMedia({media:159,desvio:12.42,n:10});perto(r.inferior,159-r.margem);assert.ok(r.aviso.includes('t de Student'));});
test('IC média com desvio zero resulta intervalo pontual',()=>{const r=C.intervaloMedia({media:10,desvio:0,n:50});perto(r.inferior,10);perto(r.superior,10);});
test('IC proporção 40/100 com 90%',()=>{const r=C.intervaloProporcao({confianca:90,sucessos:40,n:100});perto(r.p,.4);perto(r.margem,.080588,1e-6);perto(r.inferior,.319412,1e-6);perto(r.superior,.480588,1e-6);});
test('IC proporção 860/2200 95%',()=>{const r=C.intervaloProporcao({sucessos:860,n:2200});perto(r.p,860/2200);perto(r.margem,1.96*Math.sqrt((860/2200)*(1340/2200)/2200));});
test('IC proporção 34/200 padrão máximo 20% não garante',()=>{const r=C.intervaloProporcao({sucessos:34,n:200,padrao:20});assert.equal(r.atendePadrao,false);});
test('IC proporção 0/100 alerta, não esconde 0',()=>{const r=C.intervaloProporcao({sucessos:0,n:100});assert.ok(r.avisos.length>0);assert.equal(r.p,0);});
test('IC proporção limite fora 0..100 fica intacto e alerta',()=>{const r=C.intervaloProporcao({sucessos:1,n:10});assert.ok(r.inferior<0);assert.ok(r.avisos.length>0);});
test('diminuir erro pela metade multiplica n por 4',()=>{const r=C.diminuirErro({desvio:12,n:40,fator:2});perto(r.novoErro,r.erroAtual/2);assert.equal(r.novoN,160);assert.equal(r.adicionar,120);});
test('diminuir erro em 3 vezes multiplica n por 9',()=>{const r=C.diminuirErro({desvio:15,n:20,fator:3});assert.equal(r.novoN,180);});
test('amostra exatamente inteira não ganha observação extra',()=>{assert.equal(C.amostraInteira(600.0000000000001),600);assert.equal(C.amostraInteira(600.00001),601);});
for(const conf of [90,95,99])for(const e of [1,2,5,10,20])test(`propriedade margem maior -> amostra menor (${conf}, ${e})`,()=>{
  const a=C.amostraMedia({confianca:conf,desvio:43,erro:e});
  const b=C.amostraMedia({confianca:conf,desvio:43,erro:e*1.5});
  assert.ok(b.n<=a.n);
});
for(const conf of [90,95,99])for(const n of [20,30,50,100,300])test(`propriedade IC média contém média (${conf}, ${n})`,()=>{
  const a=C.intervaloMedia({confianca:conf,media:127,desvio:35,n});
  assert.ok(a.inferior<=127&&a.superior>=127);
});
for(const conf of [90,95,99])for(const k of [20,40,65,80])test(`propriedade IC proporção contém p (${conf}, ${k})`,()=>{
  const a=C.intervaloProporcao({confianca:conf,sucessos:k,n:100});
  assert.ok(a.inferior<=a.p&&a.superior>=a.p);
});
for(const dado of [
  ()=>C.amostraMedia({desvio:0,erro:100}),
  ()=>C.amostraMedia({desvio:5,erro:0}),
  ()=>C.amostraMedia({desvio:-5,erro:10}),
  ()=>C.amostraProporcao({percentual:0,erro:2}),
  ()=>C.amostraProporcao({percentual:100,erro:2}),
  ()=>C.amostraProporcao({percentual:30,erro:0}),
  ()=>C.intervaloMedia({media:50,desvio:-2,n:10}),
  ()=>C.intervaloMedia({media:50,desvio:2,n:0}),
  ()=>C.intervaloMedia({media:50,desvio:2,n:3.5}),
  ()=>C.intervaloProporcao({sucessos:101,n:100}),
  ()=>C.intervaloProporcao({sucessos:-1,n:100}),
  ()=>C.intervaloProporcao({sucessos:20,n:0}),
  ()=>C.intervaloProporcao({sucessos:20,n:100,padrao:101}),
  ()=>C.diminuirErro({desvio:2,n:40,fator:1}),
  ()=>C.diminuirErro({desvio:2,n:40,fator:-2}),
  ()=>C.diminuirErro({desvio:0,n:40,fator:2}),
])test('dados incorretos geram erro compreensível',()=>assert.throws(dado));
