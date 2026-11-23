"""Teste visual do PC e celular. Execute com: python tests/browser_smoke.py.

Usa Chromium e Playwright apenas durante o teste; não são necessários no site.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1].joinpath("index.html").as_uri()
PASTA = Path(__file__).resolve().parents[1]
OUTPUT = PASTA / "screenshots"
OUTPUT.mkdir(exist_ok=True)

def preencher(page, campo, texto):
    page.locator(f'[data-field="{campo}"]').fill(str(texto))

def confirmar(page, esperado):
    page.locator('#calculate').click()
    assert page.locator('#form-error').is_hidden(), page.locator('#form-error').inner_text()
    assert esperado in page.locator('#result-content').inner_text(), (esperado, page.locator('#result-content').inner_text())

def navegar(page, aba, mobile=False):
    if mobile:
        page.locator('#topic-mobile').select_option(aba)
    else:
        page.locator(f'button[data-topic="{aba}"]').click()

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for mobile in [False, True]:
        pagina = browser.new_page(viewport={'width': 390 if mobile else 1440, 'height': 844 if mobile else 930}, device_scale_factor=1, is_mobile=mobile, has_touch=mobile)
        errors = []
        pagina.on('pageerror', lambda e: errors.append(str(e)))
        # O navegador de QA bloqueia navegação externa/local. Injetamos os MESMOS
        # arquivos do site em about:blank, sem simular o cálculo em Python.
        html = (PASTA / 'index.html').read_text(encoding='utf-8')
        html = html.replace('<link rel="stylesheet" href="./assets/styles.css">', '')
        html = html.replace('<script defer src="./src/math.js"></script>', '')
        html = html.replace('<script defer src="./src/app.js"></script>', '')
        pagina.set_content(html, wait_until='domcontentloaded')
        pagina.add_style_tag(content=(PASTA / 'assets/styles.css').read_text(encoding='utf-8'))
        pagina.add_script_tag(content=(PASTA / 'src/math.js').read_text(encoding='utf-8'))
        pagina.add_script_tag(content=(PASTA / 'src/app.js').read_text(encoding='utf-8'))
        assert pagina.locator('h1').inner_text() == 'Tamanho da amostra'
        assert pagina.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'overflow horizontal na home'
        # Tamanho da amostra: média
        preencher(pagina, 'desvio', '1.250')
        preencher(pagina, 'erro', '100')
        confirmar(pagina, '601')
        pagina.screenshot(path=str(OUTPUT / ('mobile_amostra.png' if mobile else 'desktop_amostra.png')),full_page=True)
        assert pagina.locator('details.compare-details').count()==1
        pagina.locator('details.compare-details summary').click()
        assert '1.037' in pagina.locator('details.compare-details').inner_text()
        # Dados informados proporção
        pagina.locator('button[data-choice="tipo"][data-value="proporcao"]').click()
        preencher(pagina,'percentual','30')
        preencher(pagina,'erro','2')
        confirmar(pagina,'2.017')
        # Modo lista de números em tamanho de amostra da média
        pagina.locator('button[data-choice="tipo"][data-value="media"]').click()
        pagina.locator('button[data-choice="entrada"][data-value="lista"]').click()
        preencher(pagina,'valores','2;4;6;8')
        preencher(pagina,'erro','1')
        confirmar(pagina,'observações')
        # Intervalo da média no modo direto
        navegar(pagina, 'media-ic', mobile)
        preencher(pagina,'media','320')
        preencher(pagina,'desvio','45')
        preencher(pagina,'n','50')
        confirmar(pagina,'307,53 a 332,47')
        pagina.locator('details.work-details summary').click()
        assert pagina.locator('li .step-title').count() == 3
        # Lista da média
        pagina.locator('button[data-choice="entrada"][data-value="lista"]').click()
        preencher(pagina,'valores','2\n4\n6\n8')
        confirmar(pagina,'a')
        # Intervalo da proporção no modo contagem
        navegar(pagina,'proporcao-ic',mobile)
        preencher(pagina,'n','100')
        preencher(pagina,'positivos','40')
        pagina.locator('#f-confianca').select_option('90')
        confirmar(pagina,'31,94% a 48,06%')
        pagina.screenshot(path=str(OUTPUT / ('mobile_proporcao.png' if mobile else 'desktop_proporcao.png')),full_page=True)
        # A margem fornecida em pontos percentuais deve prevalecer
        pagina.locator('details.extra-details summary').click()
        preencher(pagina,'margem','8')
        confirmar(pagina,'32,00% a 48,00%')
        # Proporção pela lista sim/não
        pagina.locator('button[data-choice="entrada"][data-value="lista"]').click()
        preencher(pagina,'valores','sim; não; sim; não; sim')
        confirmar(pagina,'5')
        # Correlação
        navegar(pagina,'correlacao',mobile)
        preencher(pagina,'x','1;2;3;4')
        preencher(pagina,'y','2;4;6;8')
        confirmar(pagina,'1')
        assert pagina.locator('.simple-chart svg').count()==1
        # Regressão
        navegar(pagina,'regressao',mobile)
        preencher(pagina,'x','1;2;3')
        preencher(pagina,'y','3;5;7')
        confirmar(pagina,'ŷ = 2 × X + 1')
        # Esco­re Z
        navegar(pagina,'escore',mobile)
        preencher(pagina,'valor','280')
        preencher(pagina,'media','240')
        preencher(pagina,'desvio','20')
        confirmar(pagina,'2')
        # Apoio
        navegar(pagina,'basico',mobile)
        preencher(pagina,'valores','2;4;6;8')
        confirmar(pagina,'5')
        # Erros amigáveis (não crashar)
        pagina.locator('#clear').click()
        pagina.locator('#calculate').click()
        assert pagina.locator('#form-error').is_visible()
        assert pagina.locator('#result-content').is_hidden()
        assert pagina.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'overflow horizontal no fim'
        assert not errors, errors
        print('OK', 'celular' if mobile else 'PC', '9 módulos/modos, erros e responsividade')
        pagina.close()
    browser.close()
