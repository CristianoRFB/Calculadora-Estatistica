# Revisão V1

- Referência de escopo: apenas as cinco opções do `index.html` de GuilhermeOliveira0/calculadora-estatistica.
- Testes unitários e regras de cálculo: `npm run check`.
- Testes do HTML com Chromium e Playwright: `python tests/navegador.py`.
- Testes do Worker: 200, 404, 405, HEAD, arquivos estáticos e rota `/api/saude`.
- Valores conferidos: 601 requisições (σ=1250, Em=100, 95%); 2017 pessoas (p=30%, Ep=2%, 95%); IC 40/100 a 90% (31,94% a 48,06%); redução do erro pela metade quadruplica amostra.
- Abas testadas no navegador: amostra da média, amostra da proporção, IC da média, IC da proporção, diminuição do erro.
- Interações: campos automáticos, mudança de valores, validação, reset, aba selecionada, proporção desconhecida.
- Responsividade: larguras 320, 360, 375, 390, 430, 620, 768, 900, 1024, 1366, 1920px sem rolagem horizontal.
- Segurança de interface: os dados dos usuários são inseridos como texto, nunca avaliados como código ou HTML.
- Limites: a distribuição normal Z segue o material da disciplina e não substitui t Student. Nem a quantidade de testes garante ausência absoluta de defeitos.
