"""Testes de estados extremos, teclado, seletores e larguras 320–1920px."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text(encoding='utf-8')
for s in ['<link rel="stylesheet" href="./assets/styles.css">','<script defer src="./src/math.js"></script>','<script defer src="./src/app.js"></script>']:
 HTML=HTML.replace(s,'')

def abrir(browser,width):
 pg=browser.new_page(viewport={'width':width,'height':900})
 err=[];pg.on('pageerror',lambda e:err.append(str(e)))
 pg.set_content(HTML);pg.add_style_tag(content=(ROOT/'assets/styles.css').read_text(encoding='utf-8'))
 pg.add_script_tag(content=(ROOT/'src/math.js').read_text(encoding='utf-8'))
 pg.add_script_tag(content=(ROOT/'src/app.js').read_text(encoding='utf-8'))
 return pg,err

def campo(pg,k,v):pg.locator(f'[data-field="{k}"]').fill(str(v))
def calc(pg):pg.locator('#calculate').click()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [320,360,390,540,700,768,930,1024,1440,1920]:
  pg,errors=abrir(b,width)
  assert pg.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'overflow {width}'
  if width<=700:pg.locator('#topic-mobile').select_option('proporcao-ic')
  else:pg.locator('button[data-topic="proporcao-ic"]').click()
  campo(pg,'n','2200');campo(pg,'positivos','860');calc(pg)
  assert pg.locator('#form-error').is_hidden()
  assert pg.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'overflow result {width}'
  assert not errors,errors
  pg.close()
 # Checkbox desconhecida precisa esconder campo após clicar
 pg,errors=abrir(b,1440)
 pg.locator('button[data-choice="tipo"][data-value="proporcao"]').click()
 pg.locator('[data-field="desconhecida"]').check()
 assert pg.locator('[data-field="percentual"]').count()==0
 campo(pg,'erro','3');calc(pg)
 assert '1.068' in pg.locator('#result-content').inner_text()
 # Ao trocar a definição da proporção limpa erro para prevenir mistura de unidades
 pg.locator('button[data-choice="tipo"][data-value="media"]').click()
 assert pg.locator('[data-field="erro"]').input_value()==''
 # Um formulário incorreto não deixa resultado anterior na tela
 campo(pg,'desvio','20');campo(pg,'erro','0');calc(pg)
 assert pg.locator('#form-error').is_visible()
 assert pg.locator('#result-content').is_hidden()
 # Outra margem válida recalcula sem mensagem antiga
 campo(pg,'erro','5');calc(pg)
 assert pg.locator('#form-error').is_hidden()
 assert pg.locator('#result-content').is_visible()
 assert not errors,errors
 pg.close()
 # Proporção informada em % calcula sucessos apenas se contagem inteira
 pg,errors=abrir(b,1440)
 pg.locator('button[data-topic="proporcao-ic"]').click()
 pg.locator('button[data-choice="modo"][data-value="percentual"]').click()
 campo(pg,'n','100');campo(pg,'percentual','40');calc(pg)
 assert 'Sem a característica' in pg.locator('#result-content').inner_text()
 assert '60' in pg.locator('#result-content').inner_text()
 campo(pg,'n','3');campo(pg,'percentual','40');calc(pg)
 assert 'Sem a característica' not in pg.locator('#result-content').inner_text()
 assert not errors,errors
 pg.close()
 # Y constante permite reta horizontal em regressão
 pg,errors=abrir(b,1440)
 pg.locator('button[data-topic="regressao"]').click()
 campo(pg,'x','1;2;3');campo(pg,'y','7;7;7');calc(pg)
 assert 'ŷ = 0 × X + 7' in pg.locator('#result-content').inner_text()
 assert not errors,errors
 pg.close()
 print('QA de bordas OK — 10 larguras, checkbox, erros, valores implícitos e regressão constante')
 b.close()
