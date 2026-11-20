"""A professora pode falar mil duzentos e cinquenta e o aluno digitar 1.250."""
import pytest
from calculos import numero

@pytest.mark.parametrize('texto,valor',[
    ('1.250',1250), ('2.305',2305), ('10.000',10000),
    ('1.250,50',1250.5), ('0.130',.13), ('1,250',1.25), ('12.34',12.34)
])
def test_milhares_e_decimais_br(texto,valor):
    assert numero(texto,'Valor')==pytest.approx(valor)
