"""Revisão dos nomes dos campos conforme o PDF Tamanho da Amostra_AMS.pdf."""
from pathlib import Path
from calculos import calcular
ARQUIVO = (Path(__file__).parents[1] / 'web/app.js').read_text(encoding='utf-8')
AMOSTRA = ARQUIVO.split('  amostra: {', 1)[1].split('  // CÁLCULOS AUXILIARES',1)[0]

def test_nomes_dos_slides():
    for termo in ('Desvio-padrão populacional (σ)', 'Erro amostral máximo aceito (Em)', 'Margem de erro da proporção (Ep)', 'Grau de confiança', 'Valores da amostra'):
        assert termo in ARQUIVO
    assert 'Valores piloto' not in AMOSTRA
    assert 'Tipo de desvio piloto' not in AMOSTRA

def test_exemplo_media_do_pdf():
    r=calcular({'formula':'amostra','tipo':'media','desvio':'1.250','erro':'100','confianca':'95'})
    assert r['resultado'].startswith('n = 601')

def test_exemplo_proporcao_do_pdf():
    r=calcular({'formula':'amostra','tipo':'proporcao','percentual':'30','erro':'2','confianca':'95'})
    assert r['resultado'].startswith('n = 2.017')
