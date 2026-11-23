# STACK.md — decisão técnica

- **HTML5**: estrutura e acessibilidade.
- **CSS3 puro**: layout responsivo, sem Tailwind e sem bibliotecas de componentes.
- **JavaScript puro**: validação, matemática e interação, sem React/Next e sem dependências de produção.
- **Node.js 22+ somente para QA/build**: testes `node:test` e empacotamento opcional.
- **Cloudflare Workers Free / workers.dev existente**: o Worker publica os mesmos arquivos estáticos. Sem função de cálculo no servidor, banco de dados ou dependências externas.
- **Custo recorrente esperado: R$ 0 dentro dos limites do plano gratuito**, sem cadastro de pagamento nem serviços pagos criados neste projeto.
- **Execução offline**: abrir o `index.html` no navegador; nada precisa ser baixado da internet durante o uso.

## Por que não escolher Next.js ou C#?

Next.js adicionaria uma árvore de dependências que não é necessária para quatro arquivos de uma calculadora didática. C# Avalonia é útil para desktop, mas não entrega o mesmo site no navegador e no celular. HTML/CSS/JS do zero combina a simplicidade do projeto de Guilherme com separação de lógica e testes inspirada no projeto de Kayky, sem copiar trechos de nenhum deles.

## Quando revisar a decisão

Somente se surgir requisito real de autenticação, persistência, colaboração ou cálculo pesado no servidor. O projeto atual não precisa desses recursos.
