"""Testes da calculadora com exercícios dos slides da professora.

Rodar: python -m unittest discover -s tests -v
Não exige pytest ou outras bibliotecas.
"""

import json
import math
import os
import sys
import threading
import unittest
from http.server import ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import Request, urlopen

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from calculos import calcular, somas_pares, texto_num, z_critico
from app import Atendente


class CalculosDaAula(unittest.TestCase):
    """Revisão 1: conferir cada fórmula contra os exemplos do material."""

    def test_escore_servidor(self):
        r = calcular(dict(formula='escore', valor=280, media=200, desvio=40))
        self.assertEqual('z = 2', r['resultado'])
        self.assertIn('No limite', r['detalhes'][0])

    def test_escore_ram(self):
        self.assertEqual('z = 3', calcular(dict(formula='escore',valor='5,5',media=4,desvio='0,5'))['resultado'])

    def test_escore_negativo(self):
        self.assertEqual('z = -2', calcular(dict(formula='escore',valor=20,media=30,desvio=5))['resultado'])

    def test_correlacao_servidor(self):
        x = '100;200;300;400;500;600'
        y = '50;80;130;190;260;350'
        r = somas_pares(dict(x=x, y=y))[-1]
        self.assertAlmostEqual(0.9865208973698818, r, places=8)
        self.assertIn('positiva', calcular(dict(formula='correlacao',x=x,y=y))['explicacao'])

    def test_correlacao_negativa_perfeita(self):
        self.assertEqual('r = -1', calcular(dict(formula='correlacao',x='1;2;3',y='3;2;1'))['resultado'])

    def test_regressao_servidor(self):
        r = calcular(dict(formula='regressao',x='100;200;300;400;500;600',y='50;80;130;190;260;350',prever=700))
        self.assertIn('0,6',r['resultado'])
        self.assertIn('33,333333',r['resultado'])
        self.assertIn('386,666667', r['detalhes'][0])

    def test_regressao_y_constante(self):
        r = calcular(dict(formula='regressao', x='1;2;3', y='5;5;5'))
        self.assertEqual('ŷ = 0 × x + 5', r['resultado'])
        self.assertIn('não definidos', r['detalhes'][0])

    def test_regressao_pares(self):
        r = calcular(dict(formula='regressao', x='1;2;3', y='3;5;7',prever=4))
        self.assertEqual('ŷ = 2 × x + 1',r['resultado'])
        self.assertIn('9',r['detalhes'][0])

    def test_ic_media_servidor(self):
        r = calcular(dict(formula='ic_media', media=320, desvio=45, n=50,confianca=95))
        self.assertIn('307,526636',r['resultado'])
        self.assertIn('332,473364',r['resultado'])

    def test_ic_media_ram(self):
        r = calcular(dict(formula='ic_media', media='2,8',desvio='0,4',n=36,confianca=99))
        self.assertIn('2,628333', r['resultado'])
        self.assertIn('2,971667', r['resultado'])

    def test_ic_proporcao_bugs(self):
        r = calcular(dict(formula='ic_proporcao',n=200,sucessos=34,confianca=95))
        self.assertIn('11,794%', r['resultado'])
        self.assertIn('22,206%', r['resultado'])

    def test_ic_proporcao_percentual(self):
        r = calcular(dict(formula='ic_proporcao',n=200,percentual='17',confianca='95'))
        self.assertIn('11,794%',r['resultado'])

    def test_ic_proporcao_2fa(self):
        r = calcular(dict(formula='ic_proporcao',n=500,sucessos=315,confianca=99))
        self.assertIn('63%', r['detalhes'][0])

    def test_amostra_media(self):
        self.assertIn('601', calcular(dict(formula='amostra',tipo='media',desvio=1250,erro=100,confianca=95))['resultado'])

    def test_amostra_proporcao(self):
        self.assertIn('2017', calcular(dict(formula='amostra',tipo='proporcao',percentual=30,erro=2,confianca=95))['resultado'].replace('.',''))
        self.assertIn('545', calcular(dict(formula='amostra',tipo='proporcao',percentual=15,erro=3,confianca=95))['resultado'])

    def test_amostra_proporcao_conservadora(self):
        self.assertIn('1068', calcular(dict(formula='amostra',tipo='proporcao',erro=3,confianca=95))['resultado'].replace('.',''))

    def test_tabela_valor_critico(self):
        self.assertEqual(1.645, z_critico(90))
        self.assertEqual(1.96, z_critico(95))
        self.assertEqual(2.575, z_critico(99))


class EntradasInvalidas(unittest.TestCase):
    """Revisão 2: não deixar dados ruins derrubarem o programa."""

    def verificar_erro(self, dados):
        with self.assertRaises(ValueError):
            calcular(dados)

    def test_formula_desconhecida(self):
        self.verificar_erro({'formula':'inexistente'})

    def test_corpo_nao_objeto(self):
        self.verificar_erro([])

    def test_decimal_virgula(self):
        self.assertEqual('z = 1', calcular(dict(formula='escore',valor='1,5',media='1,0',desvio='0,5'))['resultado'])

    def test_desvio_zero(self):
        self.verificar_erro(dict(formula='escore',valor=1,media=1,desvio=0))

    def test_amostra_zero(self):
        self.verificar_erro(dict(formula='ic_media', media=1,desvio=1,n=0))

    def test_amostra_fracionaria(self):
        self.verificar_erro(dict(formula='ic_media',media=1,desvio=1,n='4,5'))

    def test_listas_diferentes(self):
        self.verificar_erro(dict(formula='correlacao',x='1;2;3',y='1;2'))

    def test_variavel_constante(self):
        self.verificar_erro(dict(formula='correlacao',x='1;1;1',y='1;2;3'))

    def test_sucessos_maiores_que_total(self):
        self.verificar_erro(dict(formula='ic_proporcao',n=10,sucessos=11))

    def test_percentual_maior_que_cem(self):
        self.verificar_erro(dict(formula='ic_proporcao',n=10,percentual=150))

    def test_valor_infinito(self):
        self.verificar_erro(dict(formula='escore',valor='inf',media=1,desvio=1))

    def test_confianca_invalida(self):
        self.verificar_erro(dict(formula='ic_media',media=10,desvio=2,n=20,confianca=92))

    def test_margem_zero(self):
        self.verificar_erro(dict(formula='amostra',tipo='media',desvio=2,erro=0))

    def test_texto_numero(self):
        self.assertEqual('1,75',texto_num(1.75))


class ServidorHttp(unittest.TestCase):
    """Confere que a interface recebe respostas reais do Python."""

    @classmethod
    def setUpClass(cls):
        cls.servidor = ThreadingHTTPServer(('127.0.0.1',0),Atendente)
        cls.thread = threading.Thread(target=cls.servidor.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = 'http://127.0.0.1:' + str(cls.servidor.server_port)

    @classmethod
    def tearDownClass(cls):
        cls.servidor.shutdown()
        cls.servidor.server_close()

    def test_pagina(self):
        with urlopen(self.base + '/') as resposta:
            pagina = resposta.read().decode('utf-8')
            self.assertIn('Estatística Aplicada',pagina)
            self.assertEqual(200,resposta.status)

    def test_saude(self):
        with urlopen(self.base + '/api/saude') as resposta:
            self.assertTrue(json.load(resposta)['ok'])

    def test_endpoint_de_calculo(self):
        payload = json.dumps(dict(formula='escore',valor=280,media=200,desvio=40)).encode('utf-8')
        req = Request(self.base+'/api/calcular',data=payload,headers={'Content-Type':'application/json'})
        with urlopen(req) as resposta:
            self.assertEqual('z = 2',json.load(resposta)['resultado'])

    def test_endpoint_valida_erro(self):
        payload = json.dumps(dict(formula='escore',valor=20,media=20,desvio=0)).encode('utf-8')
        req = Request(self.base+'/api/calcular',data=payload,headers={'Content-Type':'application/json'})
        with self.assertRaises(HTTPError) as erro:
            urlopen(req)
        self.assertEqual(400,erro.exception.code)


if __name__ == '__main__':
    unittest.main()
