"""Prepara os arquivos para a versão Cloudflare sem duplicar código manualmente.

Rode na pasta do projeto: python cloudflare/gerar_assets.py
Gera dois arquivos ignorados pelo Git: cloudflare/calculos.py e web_assets.py.
"""

from pathlib import Path
import shutil


# ============================================================
# REAPROVEITAR O CÓDIGO PYTHON ORIGINAL (FONTE ÚNICA DAS CONTAS)
# ============================================================
PASTA_CLOUDFLARE = Path(__file__).resolve().parent
RAIZ = PASTA_CLOUDFLARE.parent
shutil.copyfile(RAIZ / 'calculos.py', PASTA_CLOUDFLARE / 'calculos.py')


# ============================================================
# INCORPORAR HTML / CSS / JAVASCRIPT PARA A PUBLICAÇÃO ONLINE
# ============================================================
# O Worker Python serve esses textos como arquivos de página.
# O JavaScript é apenas interface: nenhum cálculo é duplicado aqui.
ARQUIVOS = {
    '/index.html': RAIZ / 'web' / 'index.html',
    '/app.js': RAIZ / 'web' / 'app.js',
    '/styles.css': RAIZ / 'web' / 'styles.css',
    '/mobile.css': RAIZ / 'web' / 'mobile.css',
}

with (PASTA_CLOUDFLARE / 'web_assets.py').open('w', encoding='utf-8') as arquivo:
    arquivo.write('"""Arquivos visuais gerados automaticamente: não editar. """\n')
    arquivo.write('ARQUIVOS = {\n')
    for rota, origem in ARQUIVOS.items():
        arquivo.write(f'    {rota!r}: {origem.read_text(encoding="utf-8")!r},\n')
    arquivo.write('}\n')

print('Arquivos Cloudflare preparados. O projeto principal permanece inalterado.')
