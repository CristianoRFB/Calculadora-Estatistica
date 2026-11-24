/* Verifica todos os casos de treino contra as mesmas fórmulas e referências independentes. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import '../src/calculos.js';
import '../src/exemplos.js';
const C=globalThis.Calculos, E=globalThis.ExemplosEstatistica;
const n=v=>C.numero(v);
const perto=(a,b)=>assert.ok(Math.abs(a-b)<1e-9*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('19 enunciados distintos, 23 cenários',()=>{assert.equal(E.length,19);assert.equal(new Set(E.map(x=>x[0])).size,19);assert.equal(E.reduce((s,x)=>s+x[4].length,0),23)});
for(const [codigo,tipo,, ,casos] of E)for(const {rotulo,campos:c} of casos)test(`${codigo} — ${rotulo}`,()=>{
 const z=C.valorCritico(c.confianca);
 if(tipo==='am')assert.equal(C.amostraMedia({confianca:c.confianca,desvio:n(c.desvio),erro:n(c.erro)}).n,Math.ceil((z*n(c.desvio)/n(c.erro))**2));
 else if(tipo==='ap'){const p=c.desconhecida?.5:n(c.p)/100;assert.equal(C.amostraProporcao({confianca:c.confianca,percentual:p*100,erro:n(c.erro)}).n,Math.ceil(z*z*p*(1-p)/(n(c.erro)/100)**2));}
 else if(tipo==='im'){const r=C.intervaloMedia({confianca:c.confianca,media:n(c.media),desvio:n(c.desvio),n:n(c.n)});perto(r.inferior,n(c.media)-z*n(c.desvio)/Math.sqrt(n(c.n)));perto(r.superior,n(c.media)+z*n(c.desvio)/Math.sqrt(n(c.n)));}
 else if(tipo==='ip'){const r=C.intervaloProporcao({confianca:c.confianca,sucessos:n(c.sucessos),n:n(c.n),padrao:c.padrao??null});const p=n(c.sucessos)/n(c.n);perto(r.inferior,p-z*Math.sqrt(p*(1-p)/n(c.n)));perto(r.superior,p+z*Math.sqrt(p*(1-p)/n(c.n)));if(c.padrao!==undefined)assert.equal(r.atendePadrao,r.superior*100<c.padrao);}
 else if(tipo==='de')assert.equal(C.diminuirErro({confianca:c.confianca,desvio:n(c.desvio),n:n(c.n),fator:n(c.k)}).novoN,n(c.n)*n(c.k)**2);
 else assert.fail('Aba desconhecida');
});
