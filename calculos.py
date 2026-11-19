"""CONTAS DA CALCULADORA — ESTA É A PARTE MAIS IMPORTANTE DO PROJETO.

LEIA PRIMEIRO SE ALGO DER ERRADO:
- A tela NÃO faz contas de estatística. Ela manda valores para este arquivo.
- Cada função tem um título grande e comentários imediatamente acima.
- Para corrigir uma conta, encontre a seção pelo nome da fórmula.
- Não edite o HTML ou o CSS para consertar um resultado matemático.
- Não usamos bibliotecas externas; basta o Python.

As respostas ficam no formato de um dicionário: titulo, resultado, passos etc.
O navegador lê esse dicionário e desenha o visor e o fluxograma.
"""

import math


# ============================================================
# LEITURA DOS NÚMEROS E VERIFICAÇÃO DOS DADOS
# ============================================================

def numero(valor, nome):
    """Transforma texto em número; aceita 1,75 ou 1.75."""
    # O navegador pode mandar números como texto. Tiramos espaços e vírgulas.
    # Ex.: o valor 1,75 passa a ser 1.75, que o Python entende.
    try:
        texto = str(valor).strip().replace(' ', '')
        # Se alguém colar 1.250,50, removemos o ponto de milhar.
        if ',' in texto and '.' in texto:
            texto = texto.replace('.', '')
        resultado = float(texto.replace(',', '.'))
    except (ValueError, TypeError):
        raise ValueError(f'{nome}: digite um número válido.') from None
    # 'NaN' e infinito são números especiais que poderiam estragar as contas.
    if not math.isfinite(resultado):
        raise ValueError(f'{nome}: use um número finito.')
    return resultado


def inteiro(valor, nome):
    """Confere se o valor é inteiro e maior que zero."""
    # Quantidade de alunos / observações não pode ser 2,5 nem negativa.
    n = numero(valor, nome)
    if not n.is_integer() or n < 1:
        raise ValueError(f'{nome}: informe um número inteiro maior que zero.')
    return int(n)


def positivo(valor, nome, aceita_zero=False):
    """Evita desvio-padrão negativo e divisões por zero."""
    n = numero(valor, nome)
    if n < 0 or (n == 0 and not aceita_zero):
        detalhe = 'não negativo' if aceita_zero else 'maior que zero'
        raise ValueError(f'{nome}: o valor deve ser {detalhe}.')
    return n


def lista_numeros(valor, nome, minimo=2):
    """Lê uma sequência separada por ponto e vírgula ou por linhas.

    A vírgula dentro de um valor é decimal: 1,5; 2,5; 3,5.
    """
    if not isinstance(valor, str) or not valor.strip():
        raise ValueError(f'{nome}: informe ao menos dois valores.')
    # Aceitamos dados colados do Excel por linhas, tabulação ou separados por ';'.
    # A vírgula é guardada para o separador DECIMAL brasileiro.
    texto = valor.replace('\r', '\n').replace('\t', ';').replace('\n', ';')
    partes = [parte.strip() for parte in texto.split(';') if parte.strip()]
    if len(partes) < minimo:
        raise ValueError(f'{nome}: informe ao menos {minimo} valor(es), separados por ; (ponto e vírgula).')
    return [numero(parte, f'{nome}, valor {i}') for i, parte in enumerate(partes, 1)]


def z_critico(conf):
    """Usa os mesmos valores arredondados da tabela da professora."""
    confianca = numero(conf, 'Grau de confiança')
    # Os três valores são os da tabela Z usada pela professora.
    # Se outra tabela for exigida, é somente AQUI que devemos alterar.
    tabela = {90: 1.645, 95: 1.96, 99: 2.575}
    if confianca not in tabela:
        raise ValueError('Confiança: selecione 90%, 95% ou 99%.')
    return tabela[int(confianca)]


def texto_num(n, casas=4):
    """Formata um resultado com vírgula decimal, sem zeros desnecessários."""
    if not math.isfinite(n):
        raise ValueError('O resultado ultrapassou o limite numérico. Use valores menores.')
    # Um resultado muito pequeno é mostrado como 0, não como '-0'.
    if abs(n) < 0.5 * 10 ** (-casas):
        n = 0.0
    return f'{n:.{casas}f}'.rstrip('0').rstrip('.').replace('.', ',')


def saida(titulo, resultado, formula, passos, explicacao, detalhes=None, aviso=''):
    """Padroniza os dados entregues à tela do PC e do celular."""
    # Todas as fórmulas devolvem as mesmas chaves, facilitando a interface.
    return dict(titulo=titulo, resultado=resultado, formula=formula,
                passos=passos, explicacao=explicacao, detalhes=detalhes or [], aviso=aviso)


# ============================================================
# FUNCIONAMENTO REFERENTE À FÓRMULA DE CORRELAÇÃO DE PEARSON
# r = soma((x - média_x)(y - média_y)) /
#     raiz(soma((x - média_x)²) * soma((y - média_y)²))
# ============================================================

def somas_pares(dados, permitir_y_constante=False):
    """Calcula as médias e as somas que correlação e regressão compartilham."""
    # Cada posição das listas forma um par: primeiro X com primeiro Y.
    xs = lista_numeros(dados.get('x', ''), 'Valores de X')
    ys = lista_numeros(dados.get('y', ''), 'Valores de Y')
    if len(xs) != len(ys):
        raise ValueError('X e Y devem ter a mesma quantidade de valores.')
    # 1) Encontramos as médias das duas colunas.
    media_x = math.fsum(xs) / len(xs)
    media_y = math.fsum(ys) / len(ys)
    # 2) Calculamos as três somas que a fórmula usa.
    # sxx: dispersão de X; syy: dispersão de Y; sxy: como variam juntos.
    sxx = math.fsum((x - media_x) ** 2 for x in xs)
    syy = math.fsum((y - media_y) ** 2 for y in ys)
    sxy = math.fsum((x - media_x) * (y - media_y) for x, y in zip(xs, ys))
    if not all(math.isfinite(v) for v in (sxx, syy, sxy)):
        raise ValueError('Os valores são grandes demais. Use números menores.')
    if sxx <= 0 or (syy <= 0 and not permitir_y_constante):
        raise ValueError('Não é possível calcular: X e Y precisam variar (não podem ser constantes).')
    # Quando Y é constante, a reta existe, mas o coeficiente r não é definido.
    # 3) Dividimos a variação conjunta pelo produto dos desvios.
    # O max/min mantém r entre -1 e +1, inclusive se houver arredondamento.
    r = None if syy <= 0 else max(-1.0, min(1.0, sxy / math.sqrt(sxx * syy)))
    return xs, ys, media_x, media_y, sxx, sxy, r


def correlacao(dados):
    """Calcula r e descreve a força/direção da relação linear."""
    xs, ys, mx, my, sxx, sxy, r = somas_pares(dados)
    # A intensidade vem do tamanho de r, sem considerar o sinal.
    # O sinal serve somente para dizer se a direção é positiva ou negativa.
    intensidade = 'forte' if abs(r) >= 0.7 else 'moderada' if abs(r) >= 0.3 else 'fraca'
    direcao = 'positiva' if r > 0 else 'negativa' if r < 0 else 'nula'
    if abs(r) >= 1 - 1e-12:
        intensidade = 'perfeita'
    interpretacao = ('Sem correlação linear.' if abs(r) < 1e-12
                     else f'Correlação {intensidade} {direcao}. Correlação não comprova causalidade.')
    return saida('Correlação de Pearson', f'r = {texto_num(r, 6)}',
                 'r = Σ[(xi − x̄)(yi − ȳ)] / √(Σ(xi − x̄)² × Σ(yi − ȳ)²)',
                 [f'1. Pares observados: {len(xs)}',
                  f'2. Média de X = {texto_num(mx)}; média de Y = {texto_num(my)}',
                  f'3. Soma dos produtos dos desvios = {texto_num(sxy)}',
                  f'4. Coeficiente r = {texto_num(r, 6)}'], interpretacao)


# ============================================================
# FUNCIONAMENTO REFERENTE À FÓRMULA DE REGRESSÃO LINEAR SIMPLES
# a = soma((x - média_x)(y - média_y)) / soma((x - média_x)²)
# b = média_y - a * média_x
# y previsto = a * x novo + b
# ============================================================

def regressao(dados):
    """Ajusta a reta por mínimos quadrados e faz previsão opcional."""
    xs, ys, mx, my, sxx, sxy, r = somas_pares(dados, permitir_y_constante=True)
    # 1) Inclinação: quanto Y varia quando X aumenta uma unidade.
    a = sxy / sxx
    # 2) Intercepto: o Y que a reta prevê quando X vale zero.
    b = my - a * mx
    equacao = f'ŷ = {texto_num(a, 6)} × x {"+" if b >= 0 else "−"} {texto_num(abs(b), 6)}'
    passos = [f'1. Média de X = {texto_num(mx)}; média de Y = {texto_num(my)}',
              f'2. Inclinação a = {texto_num(sxy)} / {texto_num(sxx)} = {texto_num(a, 6)}',
              f'3. Intercepto b = ȳ − a × x̄ = {texto_num(b, 6)}',
              f'4. Equação: {equacao}']
    detalhes = ([f'r = {texto_num(r, 6)}', f'R² = {texto_num(r*r, 6)}']
                if r is not None else ['r e R² não definidos (Y constante)'])
    # 3) A professora pode pedir apenas a equação.
    # Se o campo de novo X estiver vazio, NÃO fazemos uma previsão extra.
    novo = str(dados.get('prever', '')).strip()
    if novo:
        x_novo = numero(novo, 'Valor X para previsão')
        previsto = a * x_novo + b
        passos.append(f'5. Previsão para x = {texto_num(x_novo)}: ŷ = {texto_num(previsto, 6)}')
        detalhes.insert(0, f'Previsão de Y = {texto_num(previsto, 6)}')
    return saida('Regressão linear simples', equacao,
                 'a = Σ[(xi − x̄)(yi − ȳ)] / Σ(xi − x̄)²; b = ȳ − ax̄; ŷ = ax + b',
                 passos, 'A reta prevê Y a partir de X. Evite prever muito fora dos X observados.', detalhes)


# ============================================================
# FUNCIONAMENTO REFERENTE À FÓRMULA DE IC PARA A MÉDIA
# Margem E = z * desvio_padrao / raiz(n)
# IC = (média - E, média + E)
# ============================================================

def ic_media(dados):
    """Calcula o intervalo Z para a média, conforme os exercícios da aula."""
    media = numero(dados.get('media', ''), 'Média')
    dp = positivo(dados.get('desvio', ''), 'Desvio-padrão', aceita_zero=True)
    n = inteiro(dados.get('n', ''), 'Tamanho da amostra')
    z = z_critico(dados.get('confianca', 95))
    # 1) Escolher z (confiança) e calcular a margem de erro.
    # Aumentar o n diminui a margem porque n fica dentro da raiz.
    erro = z * dp / math.sqrt(n)
    # 2) Subtrair e somar essa margem à média para achar os limites.
    inferior, superior = media - erro, media + erro
    aviso = ('A aula utiliza o valor Z. Se o desvio for AMOSTRAL e n ≤ 30, '
             'pode ser necessário usar a distribuição t de Student.' if n <= 30 else '')
    return saida('Intervalo de confiança da média',
                 f'IC = ({texto_num(inferior, 6)}; {texto_num(superior, 6)})',
                 'E = z × σ / √n; IC = (x̄ − E; x̄ + E)',
                 [f'1. Valor crítico z = {texto_num(z, 3)}',
                  f'2. Margem de erro E = {texto_num(z, 3)} × {texto_num(dp)} / √{n} = {texto_num(erro, 6)}',
                  f'3. Limite inferior = {texto_num(media)} − {texto_num(erro, 6)} = {texto_num(inferior, 6)}',
                  f'4. Limite superior = {texto_num(media)} + {texto_num(erro, 6)} = {texto_num(superior, 6)}'],
                 'Este intervalo foi estimado para a média populacional.',
                 [f'Margem de erro: ±{texto_num(erro, 6)}'], aviso)


# ============================================================
# FUNCIONAMENTO REFERENTE À FÓRMULA DE IC PARA A PROPORÇÃO
# p = sucessos / n
# E = z * raiz(p * (1-p) / n)
# IC = (p - E, p + E)
# ============================================================

def ic_proporcao(dados):
    """Aceita a quantidade de sucessos OU a proporção informada em %."""
    n = inteiro(dados.get('n', ''), 'Tamanho da amostra')
    sucessos = str(dados.get('sucessos', '')).strip()
    # A pessoa pode informar uma CONTAGEM ou uma PORCENTAGEM.
    # A interface deixa só um desses modos visível por vez.
    if sucessos:
        k = numero(sucessos, 'Quantidade de sucessos')
        if not k.is_integer() or not 0 <= k <= n:
            raise ValueError('Sucessos: informe uma contagem inteira entre 0 e n.')
        p = k / n
        origem = f'{int(k)} / {n}'
    else:
        percentual = numero(dados.get('percentual', ''), 'Proporção em %')
        if not 0 <= percentual <= 100:
            raise ValueError('Proporção em %: informe um valor entre 0 e 100.')
        p = percentual / 100
        origem = f'{texto_num(percentual)}% / 100'
    z = z_critico(dados.get('confianca', 95))
    # Aqui p está entre 0 e 1, não entre 0 e 100.
    # A margem de erro também sai em proporção; no visor viramos %.
    erro = z * math.sqrt(p * (1 - p) / n)
    inferior, superior = p - erro, p + erro
    aviso = ('A aproximação normal pode ser inadequada se n×p ou n×(1−p) for pequeno; '
             'nesses casos, considere um intervalo binomial alternativo.'
             if min(n*p, n*(1-p)) < 5 else '')
    return saida('Intervalo de confiança da proporção',
                 f'IC = ({texto_num(inferior*100, 4)}%; {texto_num(superior*100, 4)}%)',
                 'p = sucessos / n; E = z × √[p(1 − p) / n]; IC = (p − E; p + E)',
                 [f'1. Proporção p = {origem} = {texto_num(p, 6)} ({texto_num(p*100, 4)}%)',
                  f'2. Valor crítico z = {texto_num(z, 3)}',
                  f'3. Margem E = {texto_num(z, 3)} × √[{texto_num(p, 6)} × (1 − {texto_num(p, 6)}) / {n}] = {texto_num(erro, 6)}',
                  f'4. IC = ({texto_num(inferior, 6)}; {texto_num(superior, 6)})'],
                 'O intervalo estima a proporção populacional.',
                 [f'p = {texto_num(p*100, 4)}%', f'Margem: ±{texto_num(erro*100, 4)} pontos percentuais'], aviso)


# ============================================================
# FUNCIONAMENTO REFERENTE À FÓRMULA DO ESCORE Z
# z = (valor_observado - média) / desvio_padrao
# ============================================================

def escore(dados):
    """Mede quantos desvios-padrão um valor se afasta da média."""
    x = numero(dados.get('valor', ''), 'Valor observado')
    media = numero(dados.get('media', ''), 'Média')
    dp = positivo(dados.get('desvio', ''), 'Desvio-padrão')
    # 1) Subtraímos a média para descobrir a distância.
    # 2) Dividimos pelo desvio para medir essa distância em desvios-padrão.
    z = (x - media) / dp
    classificacao = ('Incomum (|z| > 2)' if abs(z) > 2
                     else 'No limite (|z| = 2)' if math.isclose(abs(z), 2, abs_tol=1e-10)
                     else 'Dentro do padrão (|z| < 2)')
    direcao = 'acima' if z > 0 else 'abaixo' if z < 0 else 'exatamente na média'
    explicacao = (f'O valor está {texto_num(abs(z), 4)} desvios-padrão '
                  + (f'{direcao} da média.' if z != 0 else '(z = 0).')
                  + ' Estar acima ou abaixo não significa ser bom ou ruim por si só.')
    return saida('Escore Z', f'z = {texto_num(z, 6)}',
                 'z = (x − μ) / σ',
                 [f'1. Diferença x − μ = {texto_num(x)} − {texto_num(media)} = {texto_num(x-media)}',
                  f'2. Dividir pelo desvio-padrão: z = {texto_num(x-media)} / {texto_num(dp)} = {texto_num(z, 6)}',
                  f'3. Classificação: {classificacao}'], explicacao, [classificacao])


# ============================================================
# FUNCIONAMENTO REFERENTE À FÓRMULA DO TAMANHO DA AMOSTRA
# Para média: n = (z * desvio_padrao / erro_desejado)²
# Para proporção: n = z² * p * (1-p) / erro_desejado²
# Sempre arredondamos n para cima.
# ============================================================

def tamanho_amostra(dados):
    """Define quantas observações são necessárias com o erro informado."""
    z = z_critico(dados.get('confianca', 95))
    tipo = dados.get('tipo', 'media')
    if tipo == 'media':
        dp = positivo(dados.get('desvio', ''), 'Desvio-padrão')
        erro = positivo(dados.get('erro', ''), 'Margem de erro')
        # Média: primeiro calculamos z vezes o desvio, dividido pelo erro.
        # Depois elevamos ao quadrado para obter a quantidade necessária.
        valor = (z * dp / erro) ** 2
        formula = 'n = (z × σ / E)²'
        conta = f'({texto_num(z, 3)} × {texto_num(dp)} / {texto_num(erro)})²'
    elif tipo == 'proporcao':
        erro_pct = positivo(dados.get('erro', ''), 'Margem de erro em %')
        if erro_pct > 100:
            raise ValueError('Margem de erro em %: informe até 100%.')
        p_texto = str(dados.get('percentual', '')).strip()
        pct = numero(p_texto, 'Proporção estimada em %') if p_texto else 50.0
        if not 0 < pct < 100:
            raise ValueError('Proporção estimada: use um valor entre 0% e 100%.')
        # Porcentagens como 3% precisam ser divididas por 100.
        # Se p não foi informado, usamos 50%, que exige a maior amostra.
        p, erro = pct / 100, erro_pct / 100
        valor = (z*z*p*(1-p)) / (erro*erro)
        formula = 'n = z² × p × (1 − p) / E²'
        conta = f'{texto_num(z, 3)}² × {texto_num(p)} × {texto_num(1-p)} / {texto_num(erro, 6)}²'
    else:
        raise ValueError('Escolha média ou proporção para o tamanho da amostra.')
    if not math.isfinite(valor) or valor > 10**12:
        raise ValueError('A amostra calculada é grande demais. Revise os dados.')
    # Nunca arredonde para baixo! Uma parte decimal já exige mais um item.
    n = max(1, math.ceil(valor))
    return saida('Tamanho mínimo da amostra', f'n = {n:,}'.replace(',', '.') + ' observações',
                 formula,
                 [f'1. Valor crítico z = {texto_num(z, 3)}',
                  f'2. Aplicar a fórmula: {conta} = {texto_num(valor, 6)}',
                  f'3. Arredondar sempre para cima: n = {n}'],
                 'O tamanho da amostra é arredondado para cima para cumprir a margem de erro.')


# ============================================================
# CÁLCULOS AUXILIARES — QUANDO A QUESTÃO DÁ OS VALORES BRUTOS
# Estas contas preparam os números usados em intervalo de confiança,
# regressão e escore. Não exigem bibliotecas externas.
# ============================================================


def dados_de_uma_amostra(dados, minimo=2):
    """Lê os números e devolve a quantidade, a média e a soma quadrática.

    Usamos uma função comum para não ter cópias diferentes da mesma
    conta em média, variância e desvio-padrão.
    """
    valores = lista_numeros(dados.get('valores', ''), 'Valores da amostra', minimo)
    n = len(valores)
    media = math.fsum(valores) / n
    # Para cada valor: tirar a média, elevar ao quadrado e somar.
    quadrados = math.fsum((valor - media) ** 2 for valor in valores)
    if not all(math.isfinite(v) for v in (media, quadrados)):
        raise ValueError('Os números são grandes demais. Use valores menores.')
    return n, media, quadrados


# ============================================================
# FÓRMULA DA MÉDIA ARITMÉTICA AMOSTRAL
# x̄ = (x1 + x2 + ... + xn) / n
# ============================================================

def media_amostral(dados):
    """Soma os valores da amostra e divide pela quantidade de números."""
    n, media, _ = dados_de_uma_amostra(dados, minimo=1)
    valores = lista_numeros(dados.get('valores', ''), 'Valores da amostra', minimo=1)
    soma = math.fsum(valores)
    return saida('Média amostral', f'x̄ = {texto_num(media, 6)}', 'x̄ = Σxi / n',
                 [f'1. Valores recebidos: {n} observação(ões)',
                  f'2. Quantidade n = {n}',
                  f'3. Soma dos valores Σx = {texto_num(soma, 6)}',
                  f'4. Divisão: {texto_num(soma, 6)} ÷ {n}',
                  f'5. Média amostral x̄ = {texto_num(media, 6)}'],
                 'A média é a soma de todos os valores dividida pela quantidade.',
                 [f'n = {n}'])


# ============================================================
# FÓRMULA DA VARIÂNCIA
# AMOSTRAL: s² = Σ(xi − x̄)² / (n − 1)
# POPULACIONAL: σ² = Σ(xi − μ)² / N
# ============================================================

def medidas_de_dispersao(dados, calcular_desvio):
    """Resolve variância ou desvio-padrão e explica a escolha do divisor."""
    tipo = dados.get('tipo', 'amostral')
    if tipo not in ('amostral', 'populacional'):
        raise ValueError('Escolha amostral ou populacional.')
    # A variância AMOSTRAL só existe se houver pelo menos dois valores.
    # Na população inteira, um valor isolado pode ter variância zero.
    minimo = 2 if tipo == 'amostral' else 1
    n, media, soma_quadrados = dados_de_uma_amostra(dados, minimo)
    divisor = n - 1 if tipo == 'amostral' else n
    variancia = soma_quadrados / divisor
    resultado = math.sqrt(variancia) if calcular_desvio else variancia
    nome = 'Desvio-padrão' if calcular_desvio else 'Variância'
    simbolo = ('s' if tipo == 'amostral' else 'σ')
    if not calcular_desvio:
        simbolo += '²'
    divisor_texto = f'n − 1 = {divisor}' if tipo == 'amostral' else f'N = {n}'
    formula_variancia = 'Σ(xi − x̄)² / (n − 1)' if tipo == 'amostral' else 'Σ(xi − μ)² / N'
    formula = ('√[' + formula_variancia + ']') if calcular_desvio else formula_variancia
    passos = [f'1. Quantidade de valores = {n}',
              f'2. Média = {texto_num(media, 6)}',
              f'3. Soma dos desvios ao quadrado = {texto_num(soma_quadrados, 6)}',
              f'4. Divisor: {divisor_texto}; variância = {texto_num(variancia, 6)}',
              f'5. {nome} {simbolo} = {texto_num(resultado, 6)}']
    explicacao = ('No cálculo amostral, divide-se por n − 1 para estimar a dispersão da população.'
                  if tipo == 'amostral' else 'No cálculo populacional, divide-se pela quantidade total N.')
    return saida(nome + ' ' + tipo, f'{simbolo} = {texto_num(resultado, 6)}',
                 f'{simbolo} = {formula}', passos, explicacao,
                 [f'Média = {texto_num(media, 6)}', f'n = {n}', f'Variância = {texto_num(variancia, 6)}'])


def variancia(dados):
    """Variância: mede a dispersão ao quadrado."""
    return medidas_de_dispersao(dados, calcular_desvio=False)


def desvio_padrao(dados):
    """Desvio-padrão: raiz quadrada da variância."""
    return medidas_de_dispersao(dados, calcular_desvio=True)


# ============================================================
# FÓRMULA DA PROPORÇÃO AMOSTRAL
# p̂ = quantidade com característica / quantidade total
# ============================================================

def proporcao_amostral(dados):
    """Converte uma contagem dentro de um total em proporção e porcentagem."""
    n = inteiro(dados.get('n', ''), 'Quantidade total')
    k = numero(dados.get('sucessos', ''), 'Quantidade com a característica')
    if not k.is_integer() or k < 0 or k > n:
        raise ValueError('A quantidade com a característica deve ser inteira e estar entre 0 e n.')
    k = int(k)
    p = k / n
    pct = p * 100
    return saida('Proporção amostral', f'p̂ = {texto_num(pct, 4)}%', 'p̂ = k / n',
                 [f'1. Quantidade total n = {n}',
                  f'2. Quantidade com a característica k = {k}',
                  '3. Separar a parte do total: k / n',
                  f'4. Proporção p̂ = {k} ÷ {n} = {texto_num(p, 6)}',
                  f'5. Porcentagem = {texto_num(pct, 4)}%'],
                 'A proporção indica qual parte do total tem a característica.',
                 [f'Proporção decimal = {texto_num(p, 6)}'])


# ============================================================
# FÓRMULA DO ERRO-PADRÃO
# MÉDIA: EP = desvio-padrão / √n
# PROPORÇÃO: EP = √[p(1 − p)/n]
# ============================================================

def erro_padrao(dados):
    """Mostra a dispersão estimada da média ou da proporção amostral."""
    tipo = dados.get('tipo', 'media')
    n = inteiro(dados.get('n', ''), 'Tamanho da amostra')
    if tipo == 'media':
        dp = positivo(dados.get('desvio', ''), 'Desvio-padrão', aceita_zero=True)
        ep = dp / math.sqrt(n)
        formula = 'EP = s / √n (ou σ / √n)'
        passo = f'3. Dividir o desvio pela raiz de n: {texto_num(dp)} / √{n}'
        detalhe = f'Desvio-padrão informado = {texto_num(dp)}'
        resultado = f'EP = {texto_num(ep, 6)}'
    elif tipo == 'proporcao':
        porcentagem = numero(dados.get('percentual', ''), 'Proporção em %')
        if not 0 <= porcentagem <= 100:
            raise ValueError('Proporção: use um valor de 0% a 100%.')
        p = porcentagem / 100
        ep = math.sqrt(p * (1 - p) / n)
        formula = 'EP = √[p̂(1 − p̂) / n]'
        passo = f'3. Substituir: √[{texto_num(p, 6)} × (1 − {texto_num(p, 6)}) / {n}]'
        detalhe = f'Proporção p̂ = {texto_num(porcentagem)}%'
        resultado = f'EP = {texto_num(ep, 6)} ({texto_num(ep*100, 4)} p.p.)'
    else:
        raise ValueError('Escolha média ou proporção para o erro-padrão.')
    return saida('Erro-padrão da ' + ('média' if tipo == 'media' else 'proporção'), resultado,
                 formula, [f'1. Tipo: {"média" if tipo == "media" else "proporção"}',
                           f'2. Tamanho da amostra n = {n}', passo,
                           f'4. Erro-padrão em decimal = {texto_num(ep, 6)}',
                           f'5. Resultado: {resultado}'],
                 'O erro-padrão é usado para calcular a margem de erro do intervalo de confiança.',
                 [detalhe])


# ============================================================
# FUNCIONAMENTO DAS TECLAS COMUNS DA CALCULADORA
# Aqui ficam +, -, ×, ÷ e %. São separadas das fórmulas da disciplina.
# O teclado JavaScript só envia os números; até essa conta é feita no Python.
# ============================================================

def basica(dados):
    """Resolve uma operação pequena do teclado comum."""
    operador = dados.get('operacao', '')
    segundo = numero(dados.get('segundo', ''), 'Número')

    # A tecla % usa um número só. As demais têm primeiro e segundo.
    if operador == 'percentual':
        valor = segundo / 100
        conta = f'{texto_num(segundo)}%'
    else:
        primeiro = numero(dados.get('primeiro', ''), 'Primeiro número')
        if operador == '+':
            valor = primeiro + segundo
            simbolo = '+'
        elif operador == '-':
            valor = primeiro - segundo
            simbolo = '−'
        elif operador == '*':
            valor = primeiro * segundo
            simbolo = '×'
        elif operador == '/':
            if segundo == 0:
                raise ValueError('Não é possível dividir por zero.')
            valor = primeiro / segundo
            simbolo = '÷'
        else:
            raise ValueError('Operação inválida no teclado.')
        conta = f'{texto_num(primeiro)} {simbolo} {texto_num(segundo)}'

    # Reaproveitamos a função de texto para mostrar vírgula decimal.
    resultado = texto_num(valor, 10)
    return {'numero': resultado, 'formula': conta}


# ============================================================
# SELEÇÃO DA FÓRMULA: ESTE É O ÚNICO PONTO DE ENTRADA DA TELA
# ============================================================
FORMULAS = {
    'correlacao': correlacao,
    'regressao': regressao,
    'ic_media': ic_media,
    'ic_proporcao': ic_proporcao,
    'escore': escore,
    'amostra': tamanho_amostra,
    'media_amostral': media_amostral,
    'desvio_padrao': desvio_padrao,
    'variancia': variancia,
    'proporcao_amostral': proporcao_amostral,
    'erro_padrao': erro_padrao,
    'basica': basica,
}


def calcular(dados):
    """Escolhe a fórmula solicitada e devolve um resultado legível."""
    if not isinstance(dados, dict):
        raise ValueError('Envie os dados da calculadora em formato válido.')
    # O botão da interface manda o identificador da fórmula.
    # Exemplo de identificador interno: 'ic_media' (não é um exemplo no app).
    escolha = dados.get('formula', '')
    if escolha not in FORMULAS:
        raise ValueError('Selecione uma das fórmulas disponíveis.')
    return FORMULAS[escolha](dados)
