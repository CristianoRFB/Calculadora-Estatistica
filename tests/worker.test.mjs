/* Verifica o mesmo arquivo usado para a publicação na Cloudflare. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../deploy/worker.js';
const url=path=>'https://calculadora.example'+path;

test('home responde HTML 200',async()=>{
  const r=await worker.fetch(new Request(url('/')));
  assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/text\/html/);
  const html=await r.text();assert.match(html,/Estatística Aplicada/);
  assert.equal((html.match(/data-aba="/g)||[]).length,6);
});
for(const p of ['/index.html','/assets/style.css','/src/calculos.js','/src/app.js','/src/exemplos.js'])test('arquivo '+p+' está disponível',async()=>{
  const r=await worker.fetch(new Request(url(p)));
  assert.equal(r.status,200);assert.ok((await r.text()).length>100);
});
test('rotas desconhecidas respondem 404',async()=>assert.equal((await worker.fetch(new Request(url('/inexistente')))).status,404));
test('POST é rejeitado sem acidente',async()=>assert.equal((await worker.fetch(new Request(url('/'),{method:'POST'}))).status,405));
test('HEAD mantém cabeçalhos e não envia HTML',async()=>{
  const r=await worker.fetch(new Request(url('/'),{method:'HEAD'}));
  assert.equal(r.status,200);assert.equal(await r.text(),'');
});
test('endpoint de diagnóstico responde',async()=>{
  const r=await worker.fetch(new Request(url('/api/saude')));
  assert.equal(r.status,200);assert.deepEqual(await r.json(),{ok:true,versao:'1.0.0',modo:'estatico'});
});
