# Stack — custo de manutenção R$ 0

- HTML5: campos e cinco abas estáticas.
- CSS3: estilo azul, sem bibliotecas.
- JavaScript moderno: cálculos matemáticos locais.
- Cloudflare Workers: distribuição estática usando o Worker já existente.
- Node.js: somente para testar e preparar o pacote de publicação.
- Sem banco de dados, login, anúncios, dependências NPM ou serviço externo para executar cálculos.

## Fluxo de dados

`Aluno digita → app.js valida e chama calculos.js → resultado aparece no navegador`

O servidor não recebe nem armazena os valores digitados. Todas as contas usam o mesmo arquivo matemático e são executadas localmente pelo navegador.
