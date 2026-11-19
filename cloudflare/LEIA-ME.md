# Cloudflare — publicação opcional (separado do código principal)

**O programa funciona sem Cloudflare**: `python app.py`. Esta pasta existe para não misturar hospedagem com fórmulas ou visual.

## Opção recomendada para apresentação

Use o programa local no computador. Se precisar do celular, execute `python app.py --rede` e utilize o IP do computador na mesma rede Wi-Fi.

## Acesso externo opcional via Cloudflare Tunnel

Cloudflare Tunnel pode tornar o servidor do seu computador acessível pela internet sem abrir portas no roteador. Para um uso permanente, associe o túnel a um hostname de um domínio sob sua conta Cloudflare **e configure Cloudflare Access** antes de compartilhar o link.

- O servidor continua sendo o Python do computador; a Cloudflare encaminha o tráfego.
- O PC deve permanecer ligado durante o uso.
- Não ative um hostname público sem proteção de acesso, porque o servidor local não possui login.
- Não há requisito de Cloudflare para PC, testes, ou uso no celular na mesma rede.

Para a documentação atual: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
