# Cloudflare — versão online da calculadora

Este diretório existe apenas para publicar a calculadora na nuvem.

## Qual arquivo faz o quê?

- `worker.py`: recebe os pedidos HTTP do navegador e chama o Python.
- `gerar_assets.py`: prepara cópias do Python original e dos textos visuais.
- `calculos.py` (gerado): cópia automática do `../calculos.py`.
- `web_assets.py` (gerado): conteúdo do HTML, CSS e JavaScript.

**Não edite as duas cópias geradas**. A correção sempre deve ser feita na raiz do projeto; depois execute o gerador novamente.

## Regerar os arquivos, após editar o código

Na pasta principal `Calculadora-Estatistica`, execute:

```bash
python cloudflare/gerar_assets.py
```

O comando copia o `calculos.py` atualizado e incorpora o conteúdo dos arquivos em `web/`. Não exige instalações.

## Publicação no Worker

O Worker já publicado para este projeto usa Python e o sinalizador de compatibilidade `python_workers` (com `disable_python_external_sdk` para evitar dependências adicionais no envio direto pela API).

Para atualizar via API ou ferramentas de publicação, envie como módulos Python os arquivos gerados:

```text
worker.py
calculos.py
web_assets.py
```

A configuração do Worker informa `main_module: worker.py` e a data de compatibilidade atual da implantação. O código de estatística é idêntico ao do PC.

> **Importante:** fazer um commit no GitHub NÃO implica atualizar automaticamente o Worker. A publicação deve ser feita novamente depois de gerar os arquivos. Consulte o painel Cloudflare Workers para configurar uma integração automática caso deseje.

## Rotas para testar

- `/` — calculadora no navegador.
- `/app.js` — código da interface.
- `/styles.css` — estilos para PC.
- `/mobile.css` — estilos para celular.
- `/api/saude` — confirmação de funcionamento do Python.
- `/api/calcular` — recebe uma requisição POST em JSON e responde com a conta.

A versão Cloudflare não usa Flask, banco de dados, credenciais nem serviços externos para calcular.

## Se a publicação apresentar erro

1. Teste a pasta local primeiro com `python app.py`.
2. Execute `python -m unittest discover -s tests -v`.
3. Rode `python cloudflare/gerar_assets.py` novamente.
4. Confirme o nome dos três módulos enviados.
5. Confirme que a flag `python_workers` está ativa no Worker.
6. Refaça o teste em `/api/saude` e, por último, abra a interface.

## Por que não existem fórmulas duplicadas?

O mesmo `calculos.py` é usado na máquina local e na Cloudflare. Se você corrigir a conta em apenas um lugar, os dois ambientes passam a ter a mesma correção na próxima publicação.
