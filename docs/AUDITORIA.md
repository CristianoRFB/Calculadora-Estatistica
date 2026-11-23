# Auditoria de referência — RFB Method / Starter Pack

Data: 23/11/2026. Leitura dos arquivos de código, README, configurações e testes dos três repositórios indicados pelo usuário. Auditoria do repositório de destino: Issues abertas = 0; PRs abertos = 0; versão anterior na branch main preservada pelo GitHub.

## 1. Carlos-Candido/Calculadora

Repositório: https://github.com/Carlos-Candido/Calculadora

- Tecnologias: .NET 10, C# e Avalonia; aplicativo desktop, não web.
- Suporta somente IC da média e IC da proporção.
- Pontos fortes: testes matemáticos, validação de inteiros, foco por teclado, controle de desvio σ/s, erro amigável e avisos sobre aproximação Z/Wald.
- Limite: não cobre tamanho da amostra, correlação e regressão; stack desktop desnecessária para página web.

## 2. KaykyOne/f-calculadora-estatistica

Repositório: https://github.com/KaykyOne/f-calculadora-estatistica

- Tecnologias: Next.js 16, React, TypeScript, Tailwind e bibliotecas adicionais.
- Divide oito funções em módulos claros: base de média/desvio, valores críticos, IC média, IC proporção, amostra média, amostra proporção, Pearson e regressão.
- Pontos fortes: separação matemática/UI, importação de pares do Excel, KaTeX, validação de campos, gráfico de dispersão, testes.
- Limite: dependências e complexidade de build acima do necessário para esta apresentação; README não adaptado à disciplina.

## 3. GuilhermeOliveira0/calculadora-estatistica

Repositório: https://github.com/GuilhermeOliveira0/calculadora-estatistica

- Tecnologias: um `index.html` contendo HTML, CSS e JavaScript, com um protótipo separado.
- Cinco abas principais: amostra para média/proporção, IC para média/proporção e diminuir o erro.
- Pontos fortes: formato **Dados → Fórmula → Passo a passo → Resposta**, campos claros, valores críticos da aula, margem e complemento automáticos.
- Limite: arquivo HTML muito grande (~70 KB) com lógica e estilo misturados; nenhuma suíte de testes separada identificada no repositório.

## O que a professora parece exigir (inferência, não declaração oficial)

Pelo conteúdo dos PDFs/planilhas e pela interseção dos três projetos, a tarefa parece exigir que o estudante: **identifique qual cálculo estatístico corresponde ao enunciado, informe os dados corretos, obtenha resultado numericamente coerente e consiga explicar como chegou a ele**. Não há evidência de obrigação de usar uma calculadora científica convencional, conta pessoal ou banco de dados.

## Decisões da V1

- **Adotar a navegação por assunto** vista nas referências, sem replicar sua identidade visual.
- **Separar arquivos** como no projeto de Kayky, porém com HTML/CSS/JS puro.
- **Usar as expressões do material**: “desvio-padrão populacional (σ)”, “erro amostral máximo aceito (Em)”, “grau de confiança”, “média amostral”, “proporção (p)”.
- **Manter sete áreas**: as seis fórmulas centrais e média/desvio como apoio, sem teclado científico ou painel permanente de derivadas.
- **Ocultar o detalhe** até que o estudante solicite: a primeira resposta deve caber em poucos segundos.
- **Manter dados por lista ou diretamente** nas operações em que isso é aplicável.
- **Sem cópia de código alheio**: somente conceitos pedagógicos, classes de teste e requisitos foram aproveitados.

## Comparação com a V10 anterior

A V10 reunia mais de 1.300 linhas Python, mais de 1.400 linhas de interface JS, teclado científico, fluxograma, tabela de resultados, painéis extras e dependência de servidor Python. A V1 tem lógica matemática, tela e CSS isolados, estática e com menor quantidade de opções simultâneas.

## Escopo explícito que fica fora da V1

- G1–G5 da planilha: classificação de variáveis, frequências, histograma, quartis/boxplot e outliers não foram reproduzidos. São recursos candidatos à V1.1 se realmente necessários na apresentação.
- Teste de hipótese formal, intervalos t de Student e intervalos binomiais exatos.
- Amostra aleatória estratificada, bancos de dados e compartilhamento de sessão.
