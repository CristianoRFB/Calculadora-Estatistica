# RFB Method — V1 enxuta

**Objetivo:** atendimento aos cinco temas do index.html de referência, sem extras.

## Pesquisa e arquitetura
- Repositórios analisados: Carlos-Candido/Calculadora (validação), KaykyOne/f-calculadora-estatistica (organização), GuilhermeOliveira0/calculadora-estatistica (cinco módulos e layout).
- Arquitetura: HTML estático → app.js (formulário) → calculos.js (contas) → resultado. Não há API, login, banco ou Firebase.
- Stack: HTML/CSS/JS sem frameworks, dependências de produção ou assinatura.

## Simplicidade e anti-AI-slop
- Azul discreto, contraste consistente, uma navegação com cinco opções.
- Sem animações obrigatórias, sugestões inventadas, telas que acumulam funções ou recursos decorativos.
- Não existem exemplos preenchidos automaticamente: o estudante fornece os valores do enunciado.

## QA
- Testes determinísticos de fórmulas, unidades, arredondamentos, entrada brasileira e falhas.
- Navegação de todas as abas, respostas com campos corretos, limpeza, entradas inválidas e responsividade.
- Worker testado em Node e URL pública verificada separadamente após publicar.
- **Limite:** testes não garantem ausência absoluta de bugs.

## Publicação e manutenção
- Preservar a versão antiga do GitHub numa branch de backup antes de substituir o conteúdo de `main`.
- Atualizar GitHub antes da Cloudflare.
- Manter o mesmo endereço do Worker `77-statlab-estatistica`.
- Registros de commit e publicação devem ser anotados no relatório final.
