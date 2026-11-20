"""Conferência dos 44 exercícios recebidos — sem inventar gabarito.

Cada ID é o mesmo usado no arquivo de enunciados. O teste verifica se a
calculadora consegue receber a entrada necessária e devolve saída coerente.
Não substitui a interpretação do professor em perguntas opinativas.
"""
import math
import pytest
from calculos import calcular

# Uma única função deixa os testes semelhantes a preencher uma linha no Excel.
def resolver(formula, **campos):
    return calcular({'formula': formula, **campos})

# Pares vindos das questões D1, D2, D3 do PDF.
D1X = '100;200;300;400;500;600'
D1Y = '50;80;130;190;260;350'
D2X = '3;5;8;10;12;15'
D2Y = '2;4;7;9;11;13'
D3X = '50;80;100;150;200;250;300;350;400;450;500'
D3Y = '110;165;200;280;380;490;560;600;700;830;1290'

# Trinta linhas da aba Amostra (correlação/regressão).
SEXO = 'M;F;M;F;F;F;M;M;M;M;F;M;M;M;F;M;M;F;F;M;M;M;F;F;M;F;F;M;F;M'
IDADE = '12;13;13;13;14;15;16;15;17;18;18;19;20;20;20;21;22;22;23;25;30;32;32;33;33;33;35;38;38;40'
TEMPO = '20;20;21;22;24;25;26;27;27;30;30;30;30;32;35;34;30;30;38;40;40;40;44;36;38;30;44;48;40;60'

# A: tamanho de amostra, B: média, C: proporção, D: correlação/regressão,
# E/F: planilhas de IC. A questão G tem vários subitens.
QUESTOES = {
 'A1':('amostra',dict(tipo='media',desvio='1250',erro='100',confianca='95')),
 'A2':('amostra',dict(tipo='media',desvio='1250',erro='100',confianca='95',comparar_confiancas='sim')),
 'A3':('amostra',dict(tipo='proporcao',percentual='30',erro='2',confianca='95')),
 'A4':('amostra',dict(tipo='proporcao',percentual='15',erro='3',confianca='95')),
 'B1':('ic_media',dict(media='1,75',desvio='0,13',n='40',confianca='95')),
 'B2':('ic_media',dict(media='1,75',desvio='0,13',n='40',confianca='90')),
 'B3':('ic_media',dict(media='1,75',desvio='0,13',n='40',confianca='99')),
 'B4':('ic_media',dict(media='1,75',desvio='0,13',n='40',confianca='99',comparar_n='100')),
 'B5':('ic_media',dict(media='320',desvio='45',n='50',confianca='95')),
 'B6':('ic_media',dict(media='2,8',desvio='0,4',n='36',confianca='99')),
 'B7':('ic_media',dict(media='18,5',desvio='4,2',n='60',confianca='90')),
 'C1':('ic_proporcao',dict(n='2200',sucessos='860',confianca='95')),
 'C2':('ic_proporcao',dict(n='100',sucessos='40',confianca='90')),
 'C3':('ic_proporcao',dict(n='500',sucessos='35',confianca='95')),
 'C4':('ic_proporcao',dict(n='1000',sucessos='89',confianca='95')),
 'C5':('ic_proporcao',dict(n='200',sucessos='34',confianca='95',referencia='20',tipo_referencia='maximo')),
 'C6':('ic_proporcao',dict(n='500',sucessos='315',confianca='99')),
 'C7':('ic_proporcao',dict(n='800',sucessos='560',confianca='95')),
 'D1':('regressao',dict(x=D1X,y=D1Y)),
 'D2':('regressao',dict(x=D2X,y=D2Y)),
 'D3':('regressao',dict(x=D3X,y=D3Y)),
 'E0':('ic_media',dict(media='1,75',desvio='0,13',n='40',confianca='95')),
 'E1':('ic_media',dict(media='140,8',desvio='6,5',n='50',confianca='95')),
 'E2':('ic_media',dict(media='77,6',desvio='14,2',n='150',confianca='95')),
 'E3':('ic_media',dict(media='3,50',desvio='0,50',n='50',confianca='95')),
 'E4':('ic_media',dict(media='8,2',desvio='1,1',n='75',confianca='90')),
 'E5':('ic_media',dict(media='350',desvio='100',n='64',confianca='95',referencia='400')),
 'E6':('ic_media',dict(media='148',desvio='3,3',n='50',confianca='95',referencia='150')),
 'E7':('ic_media',dict(media='32,2',desvio='4,3',n='45',confianca='95',referencia='33')),
 'E8':('ic_media',dict(media='124',desvio='7,23',n='40',confianca='95',referencia='120',tipo_referencia='maximo')),
 'E9':('ic_media',dict(media='45,5',desvio='5',n='100',confianca='99',referencia='50')),
 'F0':('ic_proporcao',dict(n='2200',sucessos='860',confianca='95')),
 'F1':('ic_proporcao',dict(n='1000',sucessos='89',confianca='95')),
 # F2 pede a fração de peixes PRÓPRIOS: 100−18 = 82.
 'F2':('ic_proporcao',dict(n='100',sucessos='82',confianca='99')),
 'F3':('ic_proporcao',dict(n='2305',modo='porcentagem',percentual='40',confianca='95')),
 'F4':('ic_proporcao',dict(n='500',sucessos='155',confianca='95',referencia='25',tipo_referencia='minimo')),
 'F5':('ic_proporcao',dict(n='500',sucessos='155',confianca='99',referencia='25',tipo_referencia='minimo')),
 'F6':('ic_proporcao',dict(n='100',sucessos='45',confianca='95',referencia='50',tipo_referencia='diferente')),
 'G1':('classificacao',dict(variavel='sexo')),
 'G2':('frequencia',dict(formato='categorica',valores=SEXO)),
 'G3':('frequencia',dict(formato='classes',valores=TEMPO,classes='5')),
 'G4':('descritiva',dict(valores=TEMPO)),
 'G5':('boxplot',dict(valores=TEMPO)),
 'G6':('regressao',dict(x=IDADE,y=TEMPO,prever='50',prever_y='50')),
}

@pytest.mark.parametrize('codigo,caso', QUESTOES.items())
def test_enunciado_tem_funcao_e_calcula(codigo, caso):
    formula, campos = caso
    resposta = resolver(formula,**campos)
    assert resposta['titulo'] and resposta['resultado']
    assert len(resposta['passos']) >= 4
    assert isinstance(resposta['valores_calculados'],dict)

# Teste de caminhos complementares dentro de um mesmo enunciado:
# A4 pede proporção conhecida e desconhecida.
def test_a4_proporcao_desconhecida():
    resp=resolver('amostra',tipo='proporcao',erro='3',confianca='95')
    assert '1.068' in resp['resultado']

# A2 compara, numa única tabela, 90%, 95% e 99%.
def test_a2_comparacao_tres_niveis():
    resposta=resolver('amostra',tipo='media',desvio='1250',erro='100',confianca='95',comparar_confiancas='sim')
    assert len(resposta['tabela'])==3
    assert int(resposta['tabela'][0]['Amostra mínima']) <= int(resposta['tabela'][1]['Amostra mínima']) <= int(resposta['tabela'][2]['Amostra mínima'])

def test_b4_compara_n_40_e_100():
    r=resolver('ic_media',media='1,75',desvio='0,13',n='40',confianca='99',comparar_n='100')
    assert len(r['tabela'])==2
    assert r['tabela'][0]['Amostra n']=='40' and r['tabela'][1]['Amostra n']=='100'

# C5: 17% de defeitos na amostra, mas IC superior >20%.
def test_c5_nao_garante_menos_20():
    r=resolver('ic_proporcao',n='200',sucessos='34',confianca='95',referencia='20',tipo_referencia='maximo')
    assert 'não garante' in r['explicacao']

# G6 exige gráfico, equação, extrapolação para 50/70, e idade para 50 h.
def test_g6_tem_grafico_e_previsao_inversa_e_aviso():
    r=resolver('regressao',x=IDADE,y=TEMPO,prever='70',prever_y='50')
    assert r['grafico']['tipo']=='dispersao'
    assert 'extrapolação' in r['aviso'].lower()
    assert 'X estimado' in str(r['detalhes'])

# G1: classificação de todas as variáveis da tabela.
@pytest.mark.parametrize('var,esperado',[
    ('sexo','nominal'),('idade','discreta'),('tempo_acesso','contínua'),
    ('escolaridade','ordinal'),('salario','contínua'),('dependentes','discreta'),('automovel','nominal')])
def test_g1_e_h_classificacoes(var,esperado):
    assert esperado in resolver('classificacao',variavel=var)['resultado']

# G2/G3: 30 observações da planilha e soma das frequências.
def test_g2_frequencias_acumulam_30():
    for formato,valores in [('categorica',SEXO),('exata',TEMPO),('classes',TEMPO)]:
        r=resolver('frequencia',formato=formato,valores=valores)
        assert r['tabela'][-1]['Acumulada Fi']=='30'
        assert r['grafico']['tipo']==('histograma' if formato=='classes' else 'barras')

# G5: tabela com 30 escores, quartis e boxplot.
def test_g5_retorna_quartis_escores():
    r=resolver('boxplot',valores=TEMPO)
    assert len(r['tabela'])==30
    assert r['grafico']['tipo']=='boxplot'
    assert r['grafico']['q1']<=r['grafico']['mediana']<=r['grafico']['q3']

# H: base de dados sem enunciados; permite calcular salários e escolaridade.
def test_h_base_de_trabalhadores_tambem_e_suportada():
    salarios='3400;4300;3500;5000;1621;1621;3578;1621;4705;1621;3450;3350;2500;1621;6000;2800;2900;1621;1621;2300;4500;2570;1621;2350;6300;1621;2450;7250;2800;2900;3100'
    escolaridade='Médio;Superior;Médio;Superior;Fundamental;Fundamental;Médio;Fundamental;Superior;Fundamental;Médio;Médio;Médio;Fundamental;Superior;Médio;Médio;Fundamental;Fundamental;Médio;Superior;Médio;Fundamental;Médio;Superior;Fundamental;Médio;Superior;Médio;Médio;Médio'
    assert len(resolver('descritiva',valores=salarios)['tabela'])>5
    assert resolver('frequencia',formato='categorica',valores=escolaridade)['tabela'][-1]['Acumulada Fi']=='31'

# Dados inválidos devem explicar o problema, e não derrubar o servidor.
@pytest.mark.parametrize('parametros',[
 {'formula':'descritiva','valores':''},
 {'formula':'frequencia','valores':'Sim;Não;Sim','formato':'classes'},
 {'formula':'boxplot','valores':'1'},
 {'formula':'frequencia','valores':'1;2;3','formato':'classes','classes':'0'},
 {'formula':'classificacao','variavel':'inexistente'},
 {'formula':'ic_proporcao','n':'200','sucessos':'34','referencia':'101'},
])
def test_erros_entendiveis(parametros):
    with pytest.raises(ValueError):
        calcular(parametros)
