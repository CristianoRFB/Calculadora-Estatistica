"""Verificações dos números que aparecem automaticamente na tela.

O objetivo destes testes é garantir que as células somente de leitura
não mostrem percentuais errados nem inventem pessoas fracionárias.
"""

import pytest
from calculos import calcular


def indicadores(alvo, **dados):
    """Imita a pequena consulta que o navegador faz enquanto o aluno digita."""
    return calcular({'formula': 'indicadores', 'alvo': alvo, **dados})['valores_calculados']


def test_40_de_100_percentuais_e_contagem_complementar():
    r = indicadores('ic_proporcao', entrada='direto', modo='contagem', n='100', sucessos='40')
    assert r['p_pct'] == '40%'
    assert r['q_pct'] == '60%'
    assert r['sucessos'] == '40'
    assert r['fracassos'] == '60'
    assert r['p_decimal'] == '0,4'
    assert r['q_decimal'] == '0,6'


def test_250_de_1000_nao_depende_de_ser_100():
    r = indicadores('ic_proporcao', entrada='direto', n='1000', sucessos='250')
    assert r['p_pct'] == '25%'
    assert r['q_pct'] == '75%'
    assert r['fracassos'] == '750'


def test_lista_binaria_fornece_ambas_as_categorias():
    r = indicadores('ic_proporcao', entrada='lista', valores='sim; não; sim; não; não')
    assert r['p_pct'] == '40%'
    assert r['q_pct'] == '60%'
    assert r['n'] == '5'
    assert r['fracassos'] == '3'


def test_porcentagem_de_250_nao_inventa_meia_pessoa():
    r = indicadores('ic_proporcao', entrada='direto', modo='porcentagem', n='250', percentual='25')
    assert r['p_pct'] == '25%'
    assert r['q_pct'] == '75%'
    assert 'sucessos' not in r
    assert 'fracassos' not in r


def test_porcentagem_com_contagem_inteira_pode_obter_outra_categoria():
    r = indicadores('ic_proporcao', entrada='direto', modo='porcentagem', n='200', percentual='25')
    assert r['sucessos'] == '50'
    assert r['fracassos'] == '150'


def test_zero_sucessos_eh_valido():
    r = indicadores('ic_proporcao', entrada='direto', n='100', sucessos='0')
    assert r['p_pct'] == '0%'
    assert r['q_pct'] == '100%'
    assert r['fracassos'] == '100'


def test_todos_sucessos_eh_valido():
    r = indicadores('ic_proporcao', entrada='direto', n='10', sucessos='10')
    assert r['q_pct'] == '0%'
    assert r['fracassos'] == '0'


def test_total_sem_sucessos_nao_inventa_percentual():
    r = indicadores('ic_proporcao', entrada='direto', n='100')
    assert r['n'] == '100'
    assert 'p_pct' not in r
    assert 'q_pct' not in r


def test_percentual_sem_total_ja_tem_complemento():
    r = indicadores('ic_proporcao', entrada='direto', modo='porcentagem', percentual='35')
    assert r['p_pct'] == '35%'
    assert r['q_pct'] == '65%'
    assert 'fracassos' not in r


def test_dados_invalidos_preview_nao_quebra():
    r = indicadores('ic_proporcao', entrada='direto', n='10', sucessos='50')
    assert r == {}


def test_ic_proporcao_completo_preserva_indicadores():
    r = calcular({'formula':'ic_proporcao','entrada':'direto','modo':'contagem','n':'100','sucessos':'40','confianca':'90'})
    assert r['valores_calculados']['p_pct'] == '40%'
    assert r['valores_calculados']['q_pct'] == '60%'
    assert r['valores_calculados']['fracassos'] == '60'
    assert r['valores_calculados']['z'] == '1,645'
    assert '31,94%' in r['valores_calculados']['intervalo']


def test_proporcao_auxiliar_tem_dados_derivados():
    r = calcular({'formula':'proporcao_amostral','n':'100','sucessos':'40','entrada':'direto'})
    assert r['valores_calculados']['q_pct'] == '60%'
    assert r['valores_calculados']['fracassos'] == '60'


def test_media_erro_padrao_antes_de_calcular():
    r = indicadores('ic_media', entrada='direto', media='159', desvio='12,42', n='10', confianca='95')
    assert r['media'] == '159'
    assert r['ep'] == '3,927549'
    assert r['z'] == '1,96'


def test_media_dados_brutos_automaticos():
    r = indicadores('ic_media', entrada='lista', tipo_dispersao='amostral', valores='2;4;6;8')
    assert r['media'] == '5'
    assert r['n'] == '4'
    assert r['desvio'] == '2,581989'


def test_desvio_mostra_media_e_variancia():
    r = indicadores('desvio_padrao', tipo='amostral', valores='2;4;6;8')
    assert r['media'] == '5'
    assert r['variancia'] == '6,666667'


def test_regressao_mostra_r2():
    r = indicadores('regressao', x='1;2;3', y='2;4;6')
    assert r['r2'] == '100%'
    assert r['inclinacao'] == '2'


def test_escore_mostra_diferenca():
    r = indicadores('escore', valor='25', media='20', desvio='5', entrada='direto')
    assert r['diferenca'] == '5'


def test_erro_padrao_proporcao_informa_sucesso_e_fracasso():
    r = indicadores('erro_padrao', tipo='proporcao', entrada='direto', n='100', percentual='40')
    assert r['p_pct'] == '40%'
    assert r['q_pct'] == '60%'
    assert r['ep_pct'] == '4,899 p.p.'


def test_amostra_planejamento_nao_converte_estimativa_em_fato():
    r = indicadores('amostra', tipo='proporcao', entrada='direto', percentual='25')
    assert r['p_pct'] == '25%'
    assert r['q_pct'] == '75%'
    assert r['estimativa'].startswith('Proporção prevista')
    assert 'fracassos' not in r


def test_preview_sem_numeros_so_tem_z_para_ic():
    r = indicadores('ic_proporcao', entrada='direto', confianca='95')
    assert r['z'] == '1,96'
    assert 'p_pct' not in r
