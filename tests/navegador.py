"""Teste de uso real das cinco abas, sem precisar hospedar o site."""
from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
style=(root/'assets/style.css').read_text(encoding='utf-8')
math=(root/'src/calculos.js').read_text(encoding='utf-8')
app=(root/'src/app.js').read_text(encoding='utf-8')
examples=(root/'src/exemplos.js').read_text(encoding='utf-8')

def start(browser,w=1366,h=900):
    page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.set_content(html,wait_until='domcontentloaded')
    page.add_style_tag(content=style)
    page.add_script_tag(content=math)
    page.add_script_tag(content=app)
    page.add_script_tag(content=examples)
    assert not errors,errors
    return page,errors

def submit(page,topic,values,expected):
    page.locator(f'[data-aba="{topic}"]').click()
    for key,value in values.items():
        page.locator(f'#form-{topic} [name="{key}"]').fill(str(value))
    page.locator(f'#form-{topic} button[type="submit"]').click()
    answer=page.locator(f'#aba-{topic} .resultado')
    assert answer.is_visible(),f'Não calculou: {topic}, erro={page.locator(f"#form-{topic} .erro").inner_text()}'
    assert expected in answer.inner_text(),(topic,expected,answer.inner_text())
    assert 'Ver resolução passo a passo' in answer.inner_text()
    return answer

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page,errors=start(browser)
    submit(page,'am',{'desvio':'1.250','erro':'100'},'601')
    page.screenshot(path=str(root/'tests/desktop-azul.png'),full_page=True)
    submit(page,'ap',{'p':'30','erro':'2'},'2.017')
    assert '70%' in page.locator('#ap-complemento').inner_text()
    page.locator('#ap-desconhecida').check()
    assert page.locator('#ap-p').is_disabled()
    assert page.locator('#ap-complemento').inner_text()=='50%'
    page.locator('#form-ap button[type="submit"]').click()
    assert page.locator('#aba-ap .resultado').is_visible()
    submit(page,'im',{'media':'320','desvio':'45','n':'50'},'307,53 a 332,47')
    # Alterna precisão e verifica que a resolução permanece aberta.
    answer=page.locator('#aba-im .resultado')
    answer.locator('summary').click()
    for _ in range(10):
        answer.locator('.precisao').click()
        assert '307,526636' in answer.locator('.numero-resposta').inner_text()
        assert answer.locator('details').evaluate('(el) => el.open')
        assert page.locator('#im-media').input_value()=='320'
        answer.locator('.precisao').click()
        assert '307,53 a 332,47' in answer.locator('.numero-resposta').inner_text()
    page.locator('[data-aba="ip"]').click()
    page.locator('#ip-confianca').select_option('90')
    submit(page,'ip',{'sucessos':'40','n':'100'},'31,94% a 48,06%')
    assert '40%' in page.locator('#ip-proporcao').inner_text()
    submit(page,'de',{'desvio':'12','n':'40','k':'2'},'160')
    assert '120' in page.locator('#aba-de .resultado').inner_text()
    # Alterar um campo não pode deixar a resposta antiga visível.
    page.locator('#de-n').fill('50')
    assert not page.locator('#aba-de .resultado').is_visible()
    # O erro não pode derrubar a página.
    page.locator('#de-n').fill('0')
    page.locator('#form-de button[type="submit"]').click()
    assert page.locator('#form-de .erro').is_visible()
    page.locator('#form-de button[type="reset"]').click()
    assert page.locator('#de-n').input_value()==''
    assert not page.locator('#form-de .erro').is_visible()
    assert not errors,errors
    # Exercícios: verifica cada cenário, a limpeza de valores antigos e o cálculo.
    cases=page.evaluate('ExemplosEstatistica.map(([codigo,tipo,,,casos])=>({codigo,tipo,casos}))')
    for item in cases:
        for i,case in enumerate(item['casos']):
            page.locator('[data-aba="ex"]').click()
            card=page.locator('.exemplo-card').filter(has=page.locator('h4',has_text=item['codigo']+' ·'))
            card.locator('button').nth(i).click()
            topic=item['tipo']
            form=page.locator(f'#form-{topic}')
            assert form.is_visible()
            assert not page.locator(f'#aba-{topic} .resultado').is_visible()
            for name,value in case['campos'].items():
                field=form.locator(f'[name="{name}"]')
                if isinstance(value,bool): assert field.is_checked()==value
                else: assert field.input_value()==str(value),(name,value,field.input_value())
            if topic=='ip' and 'padrao' not in case['campos']: assert form.locator('[name="padrao"]').input_value()==''
            if topic=='ap' and 'desconhecida' not in case['campos']: assert not form.locator('[name="desconhecida"]').is_checked()
            form.locator('button[type="submit"]').click()
            assert page.locator(f'#aba-{topic} .resultado').is_visible(),(item,form.locator('.erro').inner_text())
    page.locator('[data-aba="ex"]').click()
    page.screenshot(path=str(root/'tests/exemplos-desktop.png'),full_page=True)
    assert not errors,errors
    page.close()
    print('23 cenários de exemplo: OK')
    print('Desktop: 5 fórmulas, dados derivados, erro, alterar, limpar, troca de abas: OK')
    # Verificar telas estreitas: a página não deve ter rolagem horizontal.
    for width in (320,360,375,390,430,620,768,900,1024,1366,1920):
        q,err=start(browser,width,850)
        overflow=q.evaluate('document.documentElement.scrollWidth > window.innerWidth + 1')
        assert not overflow,f'Rolagem horizontal em {width}px: {q.evaluate("document.documentElement.scrollWidth")}'
        q.locator('[data-aba="ip"]').click()
        assert q.locator('#aba-ip').is_visible()
        q.locator('[data-aba="ex"]').click()
        assert q.locator('#aba-ex').is_visible()
        assert q.locator('.exemplo-card').count()==19
        assert not q.evaluate('document.documentElement.scrollWidth > window.innerWidth + 1'), f'Exemplos: overflow em {width}px'
        assert not err,err
        if width==390:
            q.screenshot(path=str(root/'tests/exemplos-celular.png'),full_page=True)
            q.locator('[data-aba="ip"]').click()
            q.locator('#ip-confianca').select_option('90')
            submit(q,'ip',{'sucessos':'40','n':'100'},'31,94% a 48,06%')
            q.locator('#aba-ip .precisao').click()
            assert not q.evaluate('document.documentElement.scrollWidth > window.innerWidth + 1')
            q.screenshot(path=str(root/'tests/celular-azul.png'),full_page=True)
        q.close()
    print('Responsividade: 11 larguras entre 320px e 1920px: OK')
    browser.close()
