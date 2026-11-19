"""Servidor local da calculadora: Python puro, sem Flask e sem instalação.

Rode: python app.py
No celular, use: python app.py --rede   (mesmo Wi-Fi do PC).
"""

import argparse
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser

from calculos import calcular


# ============================================================
# CAMINHO DA INTERFACE — FUNCIONA INDEPENDENTE DA PASTA ATUAL
# ============================================================
PASTA_WEB = Path(__file__).resolve().parent / 'web'


class Atendente(SimpleHTTPRequestHandler):
    """Mostra os arquivos da página e responde aos cálculos em /api/calcular."""

    def __init__(self, *args, **kwargs):
        # Impedimos que o navegador acesse arquivos privados do projeto.
        super().__init__(*args, directory=str(PASTA_WEB), **kwargs)

    def do_GET(self):
        # Endpoint pequeno, útil para conferir se o Python está rodando.
        if self.path == '/api/saude':
            return self.enviar_json(200, {'ok': True, 'mensagem': 'Python funcionando'})
        return super().do_GET()

    def do_POST(self):
        # A interface manda uma conta para o Python; o Python devolve a resposta.
        if self.path != '/api/calcular':
            return self.enviar_json(404, {'erro': 'Endereço não encontrado.'})
        try:
            tamanho = int(self.headers.get('Content-Length', '0'))
            if not 0 < tamanho <= 50_000:
                raise ValueError('Requisição vazia ou muito grande.')
            dados = json.loads(self.rfile.read(tamanho).decode('utf-8'))
            resultado = calcular(dados)
            return self.enviar_json(200, resultado)
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError) as erro:
            return self.enviar_json(400, {'erro': str(erro)})
        except (OverflowError, ZeroDivisionError):
            return self.enviar_json(400, {'erro': 'Números fora do intervalo permitido. Revise os dados.'})

    def enviar_json(self, codigo, conteudo):
        """Envia uma resposta JSON com português e sem cache de resultados."""
        corpo = json.dumps(conteudo, ensure_ascii=False, allow_nan=False).encode('utf-8')
        self.send_response(codigo)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)


# ============================================================
# INICIAR O PROGRAMA NO PC OU DISPONIBILIZAR NA REDE LOCAL
# ============================================================
def iniciar():
    """Abre o navegador do PC e mantém a calculadora disponível."""
    parser = argparse.ArgumentParser(description='Calculadora de Estatística Aplicada')
    parser.add_argument('--rede', action='store_true', help='Permite acesso pelo celular na mesma rede')
    parser.add_argument('--porta', type=int, default=8765, help='Porta do servidor (padrão: 8765)')
    parser.add_argument('--sem-abrir', action='store_true', help='Não abre o navegador automaticamente')
    opcoes = parser.parse_args()
    if not 1 <= opcoes.porta <= 65535:
        parser.error('A porta deve estar entre 1 e 65535.')
    host = '0.0.0.0' if opcoes.rede else '127.0.0.1'
    try:
        with ThreadingHTTPServer((host, opcoes.porta), Atendente) as servidor:
            endereco = f'http://127.0.0.1:{opcoes.porta}'
            print(f'Calculadora no PC: {endereco}', flush=True)
            if opcoes.rede:
                print('Celular: abra http://IP-DO-PC:' + str(opcoes.porta) + ' (mesmo Wi-Fi).', flush=True)
                print('ATENÇÃO: modo rede disponível na rede local; use em rede confiável.', flush=True)
            if not opcoes.sem_abrir:
                webbrowser.open(endereco)
            print('Para encerrar, pressione Ctrl+C.', flush=True)
            servidor.serve_forever()
    except KeyboardInterrupt:
        print('\nCalculadora encerrada.')
    except OSError as erro:
        print(f'Não foi possível iniciar a porta {opcoes.porta}: {erro}')
        raise SystemExit(1) from None


if __name__ == '__main__':
    iniciar()
