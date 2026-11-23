import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../deploy/worker.js';
const url='https://teste.invalid';
for(const [path,tipo] of [['/','text/html'],['/index.html','text/html'],['/src/math.js','text/javascript'],['/src/app.js','text/javascript'],['/assets/styles.css','text/css']]){
 test('Worker responde '+path,async()=>{
  const r=await worker.fetch(new Request(url+path));assert.equal(r.status,200);assert.ok(r.headers.get('content-type').startsWith(tipo));assert.ok((await r.text()).length>50);assert.equal(r.headers.get('X-Content-Type-Options'),'nosniff');
 });
}
test('Worker HEAD sem corpo',async()=>{const r=await worker.fetch(new Request(url+'/index.html',{method:'HEAD'}));assert.equal(r.status,200);assert.equal(await r.text(),'');});
test('Worker JSON saúde',async()=>{const r=await worker.fetch(new Request(url+'/api/saude'));assert.equal((await r.json()).versao,'1.0.0');});
test('Worker 404 sem vazar código',async()=>{const r=await worker.fetch(new Request(url+'/segredos'));assert.equal(r.status,404);});
test('Worker rejeita POST inesperado',async()=>{const r=await worker.fetch(new Request(url+'/',{method:'POST'}));assert.equal(r.status,405);});
