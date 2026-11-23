# Handoff — para continuar o desenvolvimento

1. Consulte `README.md` e `AGENTS.md` antes de editar.
2. Confirme branch/HEAD, PRs e Issues no GitHub.
3. Use `npm run check` e `python tests/browser_smoke.py` após mexer nas fórmulas ou na interface.
4. Recompile o Worker com `npm run build`; compare o `deploy/worker.js` gerado.
5. Só publique depois de validar; teste `/api/saude` e as páginas externas.
6. Atualize `docs/QA.md` e este handoff com o último commit e status real.
7. Preserve os nomes e a nomenclatura da professora; não volte ao teclado científico.

**Stack:** HTML/CSS/JS puro, sem serviços externos ou dependências de produção.
