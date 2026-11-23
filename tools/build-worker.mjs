/*
 * GERAÇÃO DO WORKER — Cloudflare
 * O usuário não precisa editar deploy/worker.js diretamente.
 * Este script copia os 4 arquivos estáticos para um Worker JavaScript.
 * As contas continuam no navegador (src/math.js), não no servidor.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const raiz=join(dirname(fileURLToPath(import.meta.url)),'..');
const arquivos={
  '/index.html':'index.html',
  '/assets/styles.css':'assets/styles.css',
  '/src/math.js':'src/math.js',
  '/src/app.js':'src/app.js'
};
const conteudos=Object.fromEntries(Object.entries(arquivos).map(([url,nome])=>[url,readFileSync(join(raiz,nome),'utf-8')]));
const saida=`/* Gerado automaticamente por tools/build-worker.mjs. */
const ARQUIVOS=${JSON.stringify(conteudos)};
const TIPOS={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8'};
const SEGURANCA={
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'X-Frame-Options':'DENY',
  'Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; base-uri 'none'; frame-ancestors 'none'",
  'Cache-Control':'no-store, max-age=0'
};
export default {
  async fetch(request) {
    const url=new URL(request.url);
    if(url.pathname==='/api/saude')return new Response(JSON.stringify({ok:true,versao:'1.0.0',modo:'estatico'}),{headers:{...SEGURANCA,'Content-Type':'application/json; charset=utf-8'}});
    if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Método não permitido',{status:405,headers:SEGURANCA});
    const path=url.pathname==='/'?'/index.html':url.pathname;
    const corpo=ARQUIVOS[path];
    if(corpo===undefined)return new Response('Página não encontrada',{status:404,headers:SEGURANCA});
    const tipo=path.endsWith('.html')?TIPOS.html:path.endsWith('.css')?TIPOS.css:TIPOS.js;
    return new Response(request.method==='HEAD'?null:corpo,{status:200,headers:{...SEGURANCA,'Content-Type':tipo}});
  }
};
`;
mkdirSync(join(raiz,'deploy'),{recursive:true});
writeFileSync(join(raiz,'deploy/worker.js'),saida);
console.log('Worker gerado:',Buffer.byteLength(saida)/1024|0,'KB, 4 arquivos web.');
