/*
 * GERAÇÃO PARA CLOUDFLARE
 * Converte os quatro arquivos do site num único Worker estático.
 * O site NÃO precisa de API nem de banco: todas as fórmulas rodam no navegador.
 * Se alterar o CSS, HTML ou JavaScript, execute 'npm run build' novamente.
 */
import { readFileSync, writeFileSync } from 'node:fs';
const files = ['index.html', 'assets/style.css', 'src/calculos.js', 'src/app.js'];
const paths = Object.fromEntries(files.map(name => ['/'.concat(name), readFileSync(new URL('../' + name, import.meta.url), 'utf8')]));
paths['/'] = paths['/index.html'];
const script = `// Gerado automaticamente. Edite os arquivos na raiz, não este arquivo.\n` +
  `const FILES = ${JSON.stringify(paths)};\n` +
  `export default { async fetch(request) {\n` +
  `  const caminho = new URL(request.url).pathname;\n` +
  `  if (caminho === '/api/saude') return Response.json({ok:true,versao:'1.0.0',modo:'estatico'});\n` +
  `  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Método não permitido', {status:405,headers:{Allow:'GET, HEAD'}});\n` +
  `  const arquivo = FILES[caminho];\n` +
  `  if (arquivo === undefined) return new Response('Página não encontrada', {status:404});\n` +
  `  const tipo = caminho.endsWith('.css') ? 'text/css' : caminho.endsWith('.js') ? 'text/javascript' : 'text/html';\n` +
  `  return new Response(request.method === 'HEAD' ? null : arquivo, {status:200,headers:{'Content-Type':tipo+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});\n` +
  `}};\n`;
writeFileSync(new URL('../deploy/worker.js', import.meta.url), script, 'utf8');
console.log('Worker gerado a partir dos arquivos do site.');
