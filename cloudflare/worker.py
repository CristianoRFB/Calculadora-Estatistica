"""Adaptador Python para a publicação online na Cloudflare.

As fórmulas NÃO estão neste arquivo: continuam em calculos.py.
Para gerar os dois arquivos auxiliares, rode: python cloudflare/gerar_assets.py
"""

from urllib.parse import urlparse

from workers import WorkerEntrypoint, Response
from calculos import calcular
from web_assets import ARQUIVOS


# ============================================================
# FUNCIONAMENTO DO SERVIDOR PYTHON HOSPEDADO NA CLOUDFLARE
# ============================================================
class Default(WorkerEntrypoint):
    """Recebe requisições do navegador como o servidor local app.py."""

    async def fetch(self, request):
        caminho = urlparse(request.url).path

        # Diagnóstico: comprova que o Python da nuvem está funcionando.
        if caminho == '/api/saude':
            return Response.json({'ok': True, 'mensagem': 'Python Cloudflare funcionando'})

        # A mesma calculadora Python responde ao PC e ao celular online.
        if caminho == '/api/calcular':
            if request.method != 'POST':
                return Response.json({'erro': 'Use POST.'}, status=405)
            try:
                return Response.json(calcular(await request.json()))
            except (ValueError, OverflowError, ZeroDivisionError, TypeError) as erro:
                return Response.json({'erro': str(erro)}, status=400)
            except Exception:
                return Response.json({'erro': 'JSON inválido.'}, status=400)

        # Os arquivos visuais são entregues sem precisar de um banco de dados.
        if request.method not in ('GET', 'HEAD'):
            return Response('Método não permitido', status=405)
        if caminho == '/':
            caminho = '/index.html'
        conteudo = ARQUIVOS.get(caminho)
        if conteudo is None:
            return Response('Não encontrado', status=404)
        tipo = ('text/html' if caminho.endswith('.html') else
                'text/css' if caminho.endswith('.css') else 'application/javascript')
        return Response(conteudo, headers={'Content-Type': tipo + '; charset=utf-8'})
