# Calculadora de Estatística Aplicada

Projeto didático feito em **Python puro (sem dependências externas)** para apresentar exercícios de Estatística Aplicada. A interface funciona no navegador do PC, e a versão celular usa **o mesmo Python**; não há duas versões das fórmulas para manter.

## Abrir no computador (Windows, Linux ou macOS)

1. Instale o Python 3.10 ou superior, se ainda não tiver.
2. Abra a pasta do projeto no VS Code.
3. Execute no terminal:

   ```bash
   python app.py
   ```

4. Se o navegador não abrir sozinho, acesse **http://127.0.0.1:8765**.
5. Deixe o terminal aberto durante a apresentação. Para fechar: `Ctrl+C`.

No Windows, também é possível dar dois cliques em `iniciar_windows.bat`.

### Usar no celular pela mesma rede Wi-Fi

No PC, em vez do comando anterior, execute:

```bash
python app.py --rede
```

Descubra o IP local do computador com `ipconfig` (Windows) ou `hostname -I` (Linux). No navegador do celular, abra, por exemplo, `http://192.168.1.20:8765` (substitua pelo IP real do PC). O PC precisa estar ligado, o celular precisa estar na mesma rede, e o firewall deve permitir essa porta em **redes privadas**. A interface se adapta à tela pelo arquivo `web/mobile.css`.

**Importante:** no modo `--rede`, a calculadora fica acessível a outros aparelhos da mesma rede. Use apenas numa rede confiável. No modo padrão, somente o próprio PC acessa.

## Como usar durante a apresentação

- Identifique no enunciado os termos-chave apresentados no painel *Escute estas palavras*.
- Clique na fórmula correspondente na lateral esquerda (ou na barra superior, no celular).
- Digite os dados usando vírgula ou ponto nos decimais: `1,75` e `1.75` são aceitos.
- Para listar **vários valores X e Y**, **separe-os por ponto e vírgula**: `100; 200; 300` e `50; 80; 130`.
- Clique em *Calcular*. A resposta e os passos aparecerão logo abaixo.
- Há exemplos das aulas em todos os módulos. `Ctrl+Enter` calcula rapidamente.

## Onde arrumar um erro na hora

| Se o problema for... | Arquivo a abrir |
| --- | --- |
| Fórmula errada, arredondamento, resultado numérico | `calculos.py` |
| Botão, texto, exemplo ou campos de entrada | `web/app.js` |
| Visual no computador | `web/styles.css` |
| Visual no celular | `web/mobile.css` |
| Servidor ou porta do Python | `app.py` |
| Testes automáticos | `tests/test_calculos.py` |

Os cálculos são independentes da interface. As seções de `calculos.py` começam com o comentário `FUNCIONAMENTO REFERENTE À FÓRMULA DE ...` para localizar rapidamente uma conta.

## Fórmulas da professora

| Assunto | Fórmula |
| --- | --- |
| Correlação de Pearson | `r = Σ[(xi−x̄)(yi−ȳ)] / √[Σ(xi−x̄)² × Σ(yi−ȳ)²]` |
| Regressão simples | `a = Σ[(xi−x̄)(yi−ȳ)] / Σ(xi−x̄)²`, `b = ȳ−ax̄`, `ŷ = ax+b` |
| IC para média | `E = zσ/√n`, `IC = (x̄−E, x̄+E)` |
| IC para proporção | `p = sucessos/n`, `E = z√[p(1−p)/n]`, `IC = (p−E, p+E)` |
| Escore Z | `z = (x−μ)/σ` |
| Amostra para média | `n = (zσ/E)²` (arredondar para cima) |
| Amostra para proporção | `n = z²p(1−p)/E²` (arredondar para cima) |

Para manter fidelidade à apostila, usamos os valores críticos **90% = 1,645; 95% = 1,96; 99% = 2,575**. Os resultados internos não são arredondados antes de calcular os limites; os slides às vezes arredondam a margem de erro primeiro, gerando diferenças de centésimos. Na regressão do exemplo de servidor, a equação é `ŷ = 0,6x − 33,3333`: há um erro de digitação em uma linha de texto do slide, mas o gráfico mostra o valor correto.

**Observação estatística:** o IC para média implementa o método Z da aula. Quando o desvio populacional é desconhecido e a amostra é pequena, pode ser necessário o intervalo t de Student. O IC de proporção usa a aproximação normal da aula; amostras muito pequenas ou proporções extremas podem pedir outro método. Não use a calculadora para inferências formais sem conferir as hipóteses.

## Testar antes de apresentar

Execute na pasta do projeto:

```bash
python -m unittest discover -s tests -v
```

O programa também contém uma rota de diagnóstico: `http://127.0.0.1:8765/api/saude`.

## Cloudflare e acesso fora de casa

Uma instalação Python local **não é executada diretamente em Cloudflare Pages**. Para compartilhar exatamente o mesmo motor Python sem duplicar fórmulas, é possível usar **Cloudflare Tunnel**, que encaminha requisições para o PC onde `python app.py` está rodando. O computador deve permanecer ligado e conectado. Não exponha o serviço publicamente sem configurar proteção de acesso. Veja o arquivo `cloudflare/LEIA-ME.md`.

**Plano B no dia:** mantenha a pasta deste projeto salva no PC. A calculadora funciona sem internet, sem CDN e sem instalação de bibliotecas Python extras.
