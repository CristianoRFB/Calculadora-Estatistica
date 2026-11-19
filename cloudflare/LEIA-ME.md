# Publicação Cloudflare (separada da calculadora local)

**Endereço público ativo:** https://77-statlab-estatistica.on7.workers.dev/

A versão online usa um **Cloudflare Python Worker**. Ele importa `calculos.py`, exatamente como `app.py` no computador. A interface é igual nos dois ambientes. Não são necessários banco de dados, serviços externos ou o computador ligado para usar a versão publicada.

## Arquivos e responsabilidade

- `worker.py`: adaptador HTTP para o Python Worker. Não contém fórmulas.
- `gerar_assets.py`: copia o núcleo Python e empacota os arquivos visuais em `web_assets.py`.
- `calculos.py` **na raiz do projeto**: única fonte para editar fórmulas.
- `web/`: única fonte para editar os campos, botões e estilos.

Para preparar novamente os módulos Python da Cloudflare, execute na raiz:

```bash
python cloudflare/gerar_assets.py
```

O comando cria `cloudflare/calculos.py` e `cloudflare/web_assets.py` (ambos gerados, ignorados no Git). Esses arquivos são auxiliares para a publicação de um Worker, não devem ser editados manualmente.

**Atenção:** a implantação na Cloudflare foi feita pela API. Um `git push` posterior **não atualiza automaticamente** o site publicado. Depois de alterar o código, será necessário efetuar uma nova publicação na Cloudflare. A documentação oficial para publicar Workers Python com `pywrangler` está em https://developers.cloudflare.com/workers/languages/python/ .

## Plano B para apresentação

- PC sem internet: `python app.py`.
- Celular na mesma rede do computador: `python app.py --rede`.
- PC ou celular com internet: use o endereço público acima.

O modo local não exige instalar ferramentas da Cloudflare. Evite inserir dados sigilosos nos exemplos da página pública.
