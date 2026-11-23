# RFB Method — execução desta reconstrução

## Starter Pack

- Problema definido: ferramenta didática simples para estudante leigo.
- Referências analisadas: três repositórios de colegas; nomes e fórmulas dos slides.
- Requisitos: sete áreas, dois modos de entrada quando úteis, resultado principal claro, detalhes ocultáveis, zero serviços pagos.
- Arquitetura e diagramas documentados em `DIAGRAMAS.md`.
- Stack documentada em `../STACK.md`.

## AntiVibeCoding

Nenhum gráfico, botão ou pacote pode ser incluído sem ligação com o exercício. Não usar IA para inventar resultados; os valores são calculados por fórmulas determinísticas. Qualquer atualização precisa de teste que reproduza o problema.

## AntiLoop

Se houver duas falhas iguais, registrar o comportamento, a hipótese e a mudança de estratégia. O QA com navegador foi adaptado para usar os arquivos locais em `about:blank` porque a navegação de rede do ambiente estava bloqueada — esse ensaio **não comprova a hospedagem**; esta deve ser testada separadamente.

## GitHub

Conferência antes do desenvolvimento: nenhuma Issue aberta, nenhum PR aberto no repositório da calculadora. Preservar a última versão da main numa branch de backup. V1 nova em branch `rfb/v1-clean`, com PR e relatório de QA. Após validação, mesclar; somente depois publicar no Worker existente.

## Handoff

Cada rodada deve registrar: commit SHA, evidências de testes, bugs conhecidos, comparação com o requisito, publicação real e o que não foi concluído. Não alegar “zero bugs absoluto”; testar casos comuns, limites, dados inválidos e responsividade.
