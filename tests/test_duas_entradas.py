"""Testes dos modos novos. Executar com python -m unittest discover -s tests -v.

A versão Excel deve produzir a mesma conta, seja a professora fornecendo
os dados resumidos, seja a turma colando as observações originais.
"""
import math
import statistics
import unittest
from calculos import calcular


class DuasFormasDePreencher(unittest.TestCase):
    def comparar_resultados(self, a, b):
        # Testa o texto principal e também os resultados numéricos da planilha.
        self.assertEqual(calcular(a)['resultado'], calcular(b)['resultado'])

    def test_ic_media_pronto_da_imagem(self):
        resultado = calcular(dict(formula='ic_media', entrada='direto', media='159',
                                  desvio='12,42', n='10', confianca='95'))
        self.assertEqual('7,70', resultado['valores_calculados']['margem'])
        self.assertEqual('151,30 a 166,70', resultado['valores_calculados']['intervalo'])

    def test_ic_media_modo_lista_vs_pronto(self):
        valores = [2, 4, 6, 8]
        lista = dict(formula='ic_media', entrada='lista', valores='2;4;6;8',
                     tipo_dispersao='amostral', confianca=95)
        direto = dict(formula='ic_media', entrada='direto', media=5,
                      desvio=statistics.stdev(valores), n=4, confianca=95)
        self.comparar_resultados(lista, direto)
        r = calcular(lista)
        self.assertEqual('4', r['valores_calculados']['n'])
        self.assertEqual('5', r['valores_calculados']['media'])
        self.assertIn('2,581989', r['valores_calculados']['desvio'])
        self.assertIn('t de Student', r['aviso'])

    def test_ic_media_populacional_da_lista(self):
        r = calcular(dict(formula='ic_media', entrada='lista', valores='2;4;6;8',
                          tipo_dispersao='populacional', confianca='95'))
        self.assertEqual('2,236068', r['valores_calculados']['desvio'])
        self.assertEqual('', r['aviso'])

    def test_ic_proporcao_contagem_vs_lista(self):
        lista = dict(formula='ic_proporcao', entrada='lista',
                     valores='sim; não; sim; não; sim; não; sim; não; não; não', confianca=95)
        pronto = dict(formula='ic_proporcao', entrada='direto', n=10, sucessos=4, confianca=95)
        self.comparar_resultados(lista, pronto)
        r = calcular(lista)
        self.assertEqual('4', r['valores_calculados']['sucessos'])
        self.assertEqual('40%', r['valores_calculados']['p'])

    def test_ic_proporcao_percentual_vs_lista(self):
        lista = dict(formula='ic_proporcao', entrada='lista', valores='1;1;1;0;0;0;0;0;0;0')
        porcentagem = dict(formula='ic_proporcao', entrada='direto', n=10, percentual=30)
        self.comparar_resultados(lista, porcentagem)

    def test_escore_lista_e_resumo(self):
        lista = dict(formula='escore', entrada='lista', valor=10, valores='2;4;6;8',
                     tipo_dispersao='amostral')
        resumo = dict(formula='escore', entrada='direto', valor=10,
                      media=5, desvio=statistics.stdev([2,4,6,8]))
        self.comparar_resultados(lista, resumo)

    def test_erro_padrao_media(self):
        lista = dict(formula='erro_padrao', tipo='media', entrada='lista',
                     valores='2;4;6;8', tipo_dispersao='amostral')
        direto = dict(formula='erro_padrao', tipo='media', entrada='direto',
                      desvio=statistics.stdev([2,4,6,8]), n=4)
        self.comparar_resultados(lista, direto)

    def test_erro_padrao_proporcao(self):
        lista = dict(formula='erro_padrao', tipo='proporcao', entrada='lista', valores='1;0;1;0')
        direto = dict(formula='erro_padrao', tipo='proporcao', entrada='direto', percentual=50, n=4)
        self.comparar_resultados(lista, direto)

    def test_amostra_media_piloto(self):
        lista = dict(formula='amostra', tipo='media', entrada='lista', valores='2;4;6;8',
                     tipo_dispersao='amostral', erro=1, confianca=95)
        direto = dict(formula='amostra', tipo='media', entrada='direto',
                      desvio=statistics.stdev([2,4,6,8]), erro=1, confianca=95)
        self.comparar_resultados(lista, direto)

    def test_amostra_proporcao_piloto(self):
        lista = dict(formula='amostra', tipo='proporcao', entrada='lista',
                     valores='1;1;1;0;0;0;0;0;0;0', erro=3, confianca=95)
        direto = dict(formula='amostra', tipo='proporcao', entrada='direto',
                      percentual=30, erro=3, confianca=95)
        self.comparar_resultados(lista, direto)

    def test_proporcao_auxiliar(self):
        lista = dict(formula='proporcao_amostral', entrada='lista', valores='sim;não;sim;não')
        direto = dict(formula='proporcao_amostral', entrada='direto', sucessos=2, n=4)
        self.comparar_resultados(lista, direto)

    def test_lista_1_amostral_falha(self):
        with self.assertRaisesRegex(ValueError, '2 valor'):
            calcular(dict(formula='ic_media', entrada='lista', valores='4'))

    def test_binario_invalido_falha(self):
        with self.assertRaisesRegex(ValueError, 'Item 3'):
            calcular(dict(formula='ic_proporcao', entrada='lista', valores='1;0;50'))

    def test_escore_desvio_zero_falha(self):
        with self.assertRaisesRegex(ValueError, 'maior que zero'):
            calcular(dict(formula='escore', entrada='lista', valores='3;3;3', valor=5))

    def test_selecionou_modo_invalido(self):
        with self.assertRaisesRegex(ValueError, 'Escolha dados'):
            calcular(dict(formula='ic_media', entrada='automagico', media=5, desvio=1, n=10))

    def test_ic_media_sem_lista_nao_exige_valores(self):
        self.assertIn('7,70', calcular(dict(formula='ic_media',media=159,desvio='12,42',n=10))['valores_calculados']['margem'])

    def test_ic_lista_sem_dados_nao_gera_resposta_falsa(self):
        with self.assertRaises(ValueError):
            calcular(dict(formula='ic_media', entrada='lista', valores=''))


if __name__ == '__main__':
    unittest.main()
