# Diagramas do projeto — Starter Pack

## Caso de uso

```mermaid
flowchart TD
    A[Estudante recebe um enunciado] --> B[Escolhe uma fórmula]
    B --> C[Informa valores ou cola lista]
    C --> D{Dados válidos?}
    D -- Não --> E[Mensagem explicando o campo]
    E --> C
    D -- Sim --> F[Calcula no navegador]
    F --> G[Mostra resposta e valores auxiliares]
    G --> H[Abre explicação se precisar]
```

## Componentes

```mermaid
flowchart LR
    HTML[index.html] --> APP[src/app.js]
    CSS[assets/styles.css] --> HTML
    APP --> MATH[src/math.js]
    QA[tests/*.test.mjs] --> MATH
    QA --> WORKER[deploy/worker.js]
    BUILDER[tools/build-worker.mjs] --> WORKER
    HTML --> BUILDER
    APP --> BUILDER
    MATH --> BUILDER
    CSS --> BUILDER
    WORKER --> CF[Cloudflare Workers]
```

## Sequência de uma conta

```mermaid
sequenceDiagram
    actor Aluno
    participant Pagina as app.js
    participant Matematica as math.js
    Aluno->>Pagina: Escolhe intervalo da média
    Aluno->>Pagina: Preenche média, desvio, n e confiança
    Pagina->>Matematica: intervaloMedia(dados)
    alt Dados incorretos
      Matematica-->>Pagina: Erro legível
      Pagina-->>Aluno: Qual valor deve corrigir
    else Dados válidos
      Matematica-->>Pagina: Margem, limites e etapas
      Pagina-->>Aluno: Resposta destacada
      Aluno->>Pagina: Abrir resolução (opcional)
      Pagina-->>Aluno: Passos e explicação breve
    end
```

## Dados e segurança

Não há modelo de banco de dados, entidades persistidas, login ou credenciais. Todos os valores permanecem na memória da página e desaparecem ao fechá-la/recarregá-la. O navegador executa as contas; o Worker apenas entrega os arquivos e um endpoint de saúde.
