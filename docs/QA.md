# QA e auditoria técnica — evidências

## Comandos

- `node --check src/math.js`
- `node --check src/app.js`
- `npm run build`
- `npm test`
- `python tests/browser_smoke.py` (com Playwright e Chromium disponíveis apenas no ambiente de QA)

## Casos de teste

- Português brasileiro: milhar `1.250`, decimal `1,25`, listas coladas do Excel e entradas inválidas.
- Cálculos: sete assuntos, amostra para média/proporção, IC para média/proporção, correlação, regressão, escore Z e medidas básicas.
- Confiabilidades: Z=1,645 / 1,96 / 2,575.
- Exemplos dos exercícios da professora: séries A, B, C, D, E, F e regressão de G6.
- Situações extremas: `n=0`, `p=0` na estimativa amostral, desvio zero, X ou Y constante, listas com comprimentos diferentes, N menor que n, valores não finitos, regressão de Y constante.
- Navegador: abas desktop e seletor mobile, campos por modo, campos opcionais, cálculos, limpar, erros, gráficos, responsividade e console JS.
- Cloudflare: respostas 200/404/405/HEAD, cabeçalhos e endpoint `/api/saude`.

## Limites que precisam continuar explícitos

- Browser QA executado via `set_content` + injeção dos quatro arquivos, pois Chromium do ambiente bloqueou navegação `http://127.0.0.1` e `file://`. Essa técnica testa o JavaScript/CSS **real**, mas não a entrega por HTTP.
- Testes de Worker no Node verificam seu handler. Publicação externa requer consulta separada ao Worker real.
- Nenhum teste pode provar ausência absoluta de bugs.
- Testes matemáticos não fornecem gabarito oficial para enunciados interpretativos.

## Execução local nesta revisão

- `npm run check`: **170/170 testes automáticos aprovados**, incluindo testes unitários, matriz numérica dos exercícios A–F/G6 e simulação HTTP do Worker.
- `python tests/browser_smoke.py`: **PC e celular aprovados**, 9 variantes dos 7 assuntos, sem erros JS.
- `python tests/browser_edge.py`: **10 tamanhos de tela (320 a 1920 px)** sem rolagem horizontal; checkbox desconhecido, campos com mudança de modo, mensagem de erro, proporções implícitas e regressão constante aprovados.
- Interface conferida com imagens de 1440px e 390px.
- Limite: testes do navegador foram executados com os mesmos arquivos da aplicação injetados num documento em memória, porque o Chromium de QA bloqueou a navegação local. O HTTP do Worker foi testado isoladamente em Node. A URL real deve ser checada depois do deploy.

- CI em `.github/workflows/qa.yml`: executa `npm run check` no PR e verifica que o Worker gerado não diverge dos arquivos da aplicação.

## Publicação verificada

- GitHub: PR #1 mesclado, CI de push e PR passaram.
- Cloudflare: deploy `48ca366b65d14a9cb08cda4cd02ef2b2`, com subdomínio habilitado.
- Leitura externa: `/`, `/api/saude`, `/src/math.js` e `/assets/styles.css` responderam e exibiram conteúdos da V1.
- Navegação automatizada no domínio externo: indisponível pelo serviço de browser de terceiros. Isso não invalida os testes interativos locais, mas não deve ser apresentado como teste E2E de produção.
