# Regras de continuidade — RFB Method

1. **Ler o estado real antes de editar**: branch/HEAD GitHub, Issues, PRs, testes e Cloudflare. Não confiar em resultados de conversas antigas.
2. **GitHub First**: mudanças relevantes em branch + PR, com checkpoint e registro de QA; preservar a versão anterior antes de reconstruir.
3. **Stack mais simples**: HTML, CSS, JS puro; não adicionar framework, banco de dados, autenticação, nuvem paga ou API sem justificativa de requisito.
4. **Fonte matemática**: fórmulas e vocabulário da professora Andrea. Se existir divergência entre slide e matemática, registrar explicitamente, sem alterar silenciosamente.
5. **Comentários para iniciantes**: todo trecho complicado deve dizer *o que faz*, *por que existe* e *onde corrigir*.
6. **AntiVibeCoding**: nenhuma função só porque parece moderna; exigir utilidade verificável e teste correspondente.
7. **AntiLoop**: após erro repetido, registrar causa, hipótese, evidência e mudar abordagem em vez de repetir tentativa idêntica.
8. **QA**: `npm run check`, QA funcional de PC/celular, entradas inválidas, números pt-BR, regressões, saúde do Worker depois da publicação.
9. **Publicação controlada**: não substituir o Worker com teste falhando. Nunca declarar “sem bugs garantido”.
10. **Rodapé**: assinatura discreta RFB separada da marca própria “Estatística Aplicada”. Não usar assinatura como identidade principal do produto.
11. **Handoff**: atualizar `docs/ESTADO.md`, `docs/QA.md` e `docs/HANDOFF.md` com SHA, testes executados, pendências e próxima tarefa.
