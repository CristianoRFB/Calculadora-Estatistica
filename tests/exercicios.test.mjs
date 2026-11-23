/*
 * MATRIZ DE CONFERÊNCIA — A1–F6 + correlação/regressão da professora.
 * Os números vêm de materiais da disciplina e não representam gabarito oficial.
 * Confere os cálculos numéricos; questões interpretativas exigem interpretação.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../src/math.js';
const M=globalThis.StatMath;
const aproximado=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} ≠ ${b}`);
// A: tamanho da amostra, médias e proporções.
for(const [id,nivel,esperado] of [['A1',95,601],['A2-90',90,423],['A2-99',99,1037]]){
 test(id+' amostra para média',()=>assert.equal(M.tamanhoMedia({desvio:1250,erroMax:100,confianca:nivel}).n,esperado));
}
for(const [id,p,E,esperado] of [['A3',.3,.02,2017],['A4',.15,.03,545],['A4-sem-p',.5,.03,1068]]){
 test(id+' amostra para proporção',()=>assert.equal(M.tamanhoProporcao({p,erroP:E,confianca:95}).n,esperado));
}
// B: intervalo de média: alturas, servidor, RAM e sessões.
const mediaCasos=[
 ['B1',1.75,.13,40,95],['B2',1.75,.13,40,90],['B3',1.75,.13,40,99],
 ['B4',1.75,.13,100,99],['B5',320,45,50,95],['B6',2.8,.4,36,99],['B7',18.5,4.2,60,90],
 ['E0',1.75,.13,40,95],['E1',140.8,6.5,50,95],['E2',77.6,14.2,150,95],
 ['E3',3.5,.5,50,95],['E4',8.2,1.1,75,90],['E5',350,100,64,95],
 ['E6',148,3.3,50,95],['E7',32.2,4.3,45,95],['E8',124,7.23,40,95],['E9',45.5,5,100,99]
];
for(const [id,media,desvio,n,confianca] of mediaCasos){
 test(id+' intervalo da média',()=>{
  const r=M.intervaloMedia({media,desvio,n,confianca});
  const E=M.zCritico(confianca)*desvio/Math.sqrt(n);
  aproximado(r.E,E);aproximado(r.inferior,media-E);aproximado(r.superior,media+E);
 });
}
// C e F: pesquisa eleitoral, barbeador, bugs, autenticação e satisfação.
const propCasos=[
 ['C1',860,2200,95],['C2',40,100,90],['C3',35,500,95],['C4',89,1000,95],
 ['C5',34,200,95],['C6',315,500,99],['C7',560,800,95],['F0',860,2200,95],
 ['F1',89,1000,95],['F2',82,100,99],['F3',.4*2305,2305,95],['F4',155,500,95],
 ['F5',155,500,99],['F6',45,100,95]
];
for(const [id,positivos,n,confianca] of propCasos){
 test(id+' intervalo da proporção',()=>{
  const p=positivos/n, r=M.intervaloProporcao({p,n,confianca});
  const E=M.zCritico(confianca)*Math.sqrt(p*(1-p)/n);
  aproximado(r.E,E);aproximado(r.inferior,p-E);aproximado(r.superior,p+E);
 });
}
for(const [id,X,Y] of [
 ['D1',[100,200,300,400,500,600],[50,80,130,190,260,350]],
 ['D2',[3,5,8,10,12,15],[2,4,7,9,11,13]],
 ['D3',[50,80,100,150,200,250,300,350,400,450,500],[110,165,200,280,380,490,560,600,700,830,1290]],
 ['G6',[12,13,13,13,14,15,16,15,17,18,18,19,20,20,20,21,22,22,23,25,30,32,32,33,33,33,35,38,38,40],
  [20,20,21,22,24,25,26,27,27,30,30,30,30,32,35,34,30,30,38,40,40,40,44,36,38,30,44,48,40,60]]
]){
 test(id+' correlação e regressão',()=>{
  const c=M.correlacao(X,Y),r=M.regressao(X,Y);
  assert.ok(c.r>=-1&&c.r<=1);aproximado(r.a*r.mx+r.b,r.my,1e-6);
 });
}
