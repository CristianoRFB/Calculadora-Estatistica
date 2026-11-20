"""Testes novos: nunca inventar população e respeitar margem informada."""
import math
import pytest
from calculos import calcular


def executar(formula, **dados):
    return calcular({'formula': formula, **dados})


def test_ic_proporcao_com_margem_dada_em_pontos_percentuais():
    r = executar('ic_proporcao', entrada='direto', n='100', sucessos='40',
                confianca='90', margem_informada='8,06')
    v = r['valores_calculados']
    assert v['origem_margem'] == 'Informada'
    assert v['margem'] == '8,06 p.p.'
    assert v['intervalo'] == '31,94% a 48,06%'
    assert any('margem dada' in s.lower() for s in r['passos'])


def test_margem_auto_continua_compatível_com_exercicio():
    r = executar('ic_proporcao', n='100', sucessos='40', confianca='90')
    assert r['valores_calculados']['margem'] == '8,06 p.p.'
    assert r['valores_calculados']['origem_margem'] == 'Calculada'


def test_margem_informada_da_media_valor_absoluto():
    r = executar('ic_media', media='159', desvio='12,42', n='10', margem_informada='7,70')
    v = r['valores_calculados']
    assert v['intervalo'] == '151,30 a 166,70'
    assert v['origem_margem'] == 'Informada'


def test_finite_population_correction_reduces_uncertainty():
    a = executar('ic_proporcao', n='100', sucessos='40', confianca='90')
    b = executar('ic_proporcao', n='100', sucessos='40', confianca='90', populacao='1000')
    parse = lambda r: float(r['valores_calculados']['margem'].split()[0].replace(',', '.'))
    assert parse(b) < parse(a)
    assert b['valores_calculados']['projecao'] == '≈ 400 pessoas'
    assert 'pessoas' in b['valores_calculados']['projecao_intervalo']
    assert b['valores_calculados']['populacao'] == '1000'


def test_censo_100_de_100_nao_tem_erro_amostral():
    r = executar('ic_proporcao', n='100', sucessos='40', populacao='100')
    assert r['valores_calculados']['margem'] == '0,00 p.p.'
    assert r['valores_calculados']['projecao'] == '≈ 40 pessoas'


def test_margem_manual_nao_sofre_segunda_correcao():
    r = executar('ic_proporcao', n='100', sucessos='40', populacao='1000', margem_informada='8')
    assert r['valores_calculados']['margem'] == '8,00 p.p.'
    assert r['valores_calculados']['intervalo'] == '32,00% a 48,00%'
    assert r['valores_calculados']['projecao_intervalo'] == '320 a 480 pessoas'


def test_estimativa_population_requires_N():
    with pytest.raises(ValueError, match='tamanho TOTAL'):
        executar('populacao', n='100', sucessos='40')


def test_estimativa_population_uses_known_N():
    r = executar('populacao', n='100', sucessos='40', populacao='1000', margem_informada='8')
    assert r['resultado'] == '≈ 400 pessoas'
    assert r['valores_calculados']['projecao_intervalo'] == '320 a 480 pessoas'
    assert 'projeção' in r['explicacao'].lower()


def test_populacao_menor_que_amostra_falha():
    with pytest.raises(ValueError, match='menor que a amostra'):
        executar('ic_proporcao', n='100', sucessos='40', populacao='80')


def test_amostra_finita_recebe_N_e_nao_ultrapassa_N():
    r = executar('amostra', tipo='proporcao', percentual='50',
                confianca='95', erro='5', populacao='500')
    assert r['valores_calculados']['n_final'] == '218'
    assert r['valores_calculados']['populacao'] == '500'
    assert r['valores_calculados']['amostra_sem_correcao'] == '385'


def test_amostra_infinita_mantem_resultado():
    r = executar('amostra', tipo='proporcao', percentual='50', confianca='95', erro='5')
    assert r['valores_calculados']['n_final'] == '385'


def test_population_indicators_before_calculation():
    r = executar('indicadores', alvo='ic_proporcao', n='100', sucessos='40', populacao='1000')
    v = r['valores_calculados']
    assert v['p_pct'] == '40%'
    assert v['projecao'] == '≈ 400 pessoas'
    assert 'projecao_intervalo' not in v


def test_manual_margin_percent_too_large():
    with pytest.raises(ValueError, match='entre 0 e 100'):
        executar('ic_proporcao', n='100', sucessos='40', margem_informada='125')


def test_negative_margin_rejected():
    with pytest.raises(ValueError, match='não negativo'):
        executar('ic_media', media='100', desvio='10', n='100', margem_informada='-2')


def test_population_projection_limits_nonnegative():
    r = executar('populacao', n='10', sucessos='1', populacao='1000', margem_informada='40')
    assert r['valores_calculados']['projecao_intervalo'] == '0 a 500 pessoas'
