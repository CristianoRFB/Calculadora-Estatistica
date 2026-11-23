# Handoff — para continuar o desenvolvimento

1. Consulte `README.md` e `AGENTS.md` antes de editar.
2. Confirme branch/HEAD, PRs e Issues no GitHub.
3. Use `npm run check` e `python tests/browser_smoke.py` após mexer nas fórmulas ou na interface.
4. Recompile o Worker com `npm run build`; compare o `deploy/worker.js` gerado.
5. Só publique depois de validar; teste `/api/saude` e as páginas externas.
6. Atualize `docs/QA.md` e este handoff com o último commit e status real.
7. Preserve os nomes e a nomenclatura da professora; não volte ao teclado científico.

**Stack:** HTML/CSS/JS puro, sem serviços externos ou dependências de produção.

## Último checkpoint — 23/11/2026

- PR #1: mesclado em `main` (`0cb9a1fbb7743bb0d10b047f5494c35c3970dc72`).
- 170 testes automáticos em Node passaram; browser PC/celular + dez larguras passaram.
- Worker existente recebeu código novo, com HTTP e saúde externos confirmados.
- Questões G1–G5 (frequência, boxplot etc.) conscientemente fora da V1.
