"""Fórmulas de Estatística Aplicada usadas na calculadora.

Este arquivo concentra TODAS as contas. A interface apenas envia os dados.
Não é necessário instalar bibliotecas externas.
"""

import math


# ============================================================
# LEITURA DOS NÚMEROS E VERIFICAÇÃO DOS DADOS
# ============================================================

def numero(valor, nome):
    """Transforma texto em número; aceita 1,75 ou 1.75."""
    try:
        texto = str(valor).strip().replace(' ', '')
        # Se alguém colar 1.250,50, removemos o ponto de milhar.
        if ',' in texto and '.' in texto:
            texto = texto.replace('.', '')
        resultado = float(texto.replace(',', '.'))
    except (ValueError, TypeError):
        raise ValueError(f'{nome}: digite um número válido.') from None
    if not math.isfinite(resultado):
        raise ValueError(f'{nome}: use um número finito.')
    return resultado


def inteiro(valor, nome):
    """Confere se o valor é inteiro e maior que zero."""
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


def lista_numeros(valor, nome):
    """Lê uma sequência separada por ponto e vírgula ou por linhas.

    A vírgula dentro de um valor é decimal: 1,5; 2,5; 3,5.
    """
    if not isinstance(valor, str) or not valor.strip():
        raise ValueError(f'{nome}: informe ao menos dois valores.')
    texto = valor.replace('\r', '\n').replace('\t', ';').replace('\n', ';')
    partes = [parte.strip() for parte in texto.split(';') if parte.strip()]
    if len(partes) < 2:
        raise ValueError(f'{nome}: separe ao menos dois valores por ; (ponto e vírgula).')
    return [numero(parte, f'{nome}, valor {i}') for i, parte in enumerate(partes, 1)]


def z_critico(conf):
    """Usa os mesmos valores arredondados da tabela da professora."""
    confianca = numero(conf, 'Grau de confiança')
    tabela = {90: 1.645, 95: 1.96, 99: 2.575}
    if confianca not in tabela:
        raise ValueError('Confiança: selecione 90%, 95% ou 99%.')
    return tabela[int(confianca)]


def texto_num(n, casas=4):
    """Formata um resultado com vírgula decimal, sem zeros desnecessários."""
    if not math.isfinite(n):
        raise ValueError('O resultado ultrapassou o limite numérico. Use valores menores.')
    if abs(n) < 0.5 * 10 ** (-casas):
        n = 0.0
    return f'{n:.{casas}f}'.rstrip('0').rstrip('.').replace('.', ',')


def saida(titulo, resultado, formula, passos, explicacao, detalhes=None, aviso=''):
    """Padroniza os dados entregues à tela do PC e do celular."""
    return dict(titulo=titulo, resultado=resultado, formula=formula,
                passos=passos, explicacao=explicacao, detalhes=detalhes or [], aviso=aviso)


# ============================================================
# FUNCIONAMENTO REFERENTE À FÓRMULA DE CORRELAÇÃO DE PEARSON
# r = soma((x - média_x)(y - média_y)) /
#     raiz(soma((x - média_x)²) * soma((y - média_y)²))
# ============================================================

def somas_pares(dados, permitir_y_constante=False):
    """Calcula as médias e as somas que correlação e regressão compartilham."""
    xs = lista_numeros(dados.get('x', ''), 'Valores de X')
    ys = lista_numeros(dados.get('y', ''), 'Valores de Y')
    if len(xs) != len(ys):
        raise ValueError('X e Y devem ter a mesma quantidade de valores.')
    media_x = math.fsum(xs) / len(xs)
    media_y = math.fsum(ys) / len(ys)
    sxx = math.fsum((x - media_x) ** 2 for x in xs)
    syy = math.fsum((y - media_y) ** 2 for y in ys)
    sxy = math.fsum((x - media_x) * (y - media_y) for x, y in zip(xs, ys))
    if not all(math.isfinite(v) for v in (sxx, syy, sxy)):
        raise ValueError('Os valores são grandes demais. Use números menores.')
    if sxx <= 0 or (syy <= 0 and not permitir_y_constante):
        raise ValueError('Não é possível calcular: X e Y precisam variar (não podem ser constantes).')
    # Quando Y é constante, a reta existe, mas o coeficiente r não é definido.
    r = None if syy <= 0 else max(-1.0, min(1.0, sxy / math.sqrt(sxx * syy)))
    return xs, ys, media_x, media_y, sxx, sxy, r


def correlacao(dados):
    """Calcula r e descreve a força/direção da relação linear."""
    xs, ys, mx, my, sxx, sxy, r = somas_pares(dados)
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
    a = sxy / sxx
    b = my - a * mx
    equacao = f'ŷ = {texto_num(a, 6)} × x {"+" if b >= 0 else "−"} {texto_num(abs(b), 6)}'
    passos = [f'1. Média de X = {texto_num(mx)}; média de Y = {texto_num(my)}',
              f'2. Inclinação a = {texto_num(sxy)} / {texto_num(sxx)} = {texto_num(a, 6)}',
              f'3. Intercepto b = ȳ − a × x̄ = {texto_num(b, 6)}',
              f'4. Equação: {equacao}']
    detalhes = ([f'r = {texto_num(r, 6)}', f'R² = {texto_num(r*r, 6)}']
                if r is not None else ['r e R² não definidos (Y constante)'])
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
    erro = z * dp / math.sqrt(n)
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
        p, erro = pct / 100, erro_pct / 100
        valor = (z*z*p*(1-p)) / (erro*erro)
        formula = 'n = z² × p × (1 − p) / E²'
        conta = f'{texto_num(z, 3)}² × {texto_num(p)} × {texto_num(1-p)} / {texto_num(erro, 6)}²'
    else:
        raise ValueError('Escolha média ou proporção para o tamanho da amostra.')
    if not math.isfinite(valor) or valor > 10**12:
        raise ValueError('A amostra calculada é grande demais. Revise os dados.')
    n = max(1, math.ceil(valor))
    return saida('Tamanho mínimo da amostra', f'n = {n:,}'.replace(',', '.') + ' observações',
                 formula,
                 [f'1. Valor crítico z = {texto_num(z, 3)}',
                  f'2. Aplicar a fórmula: {conta} = {texto_num(valor, 6)}',
                  f'3. Arredondar sempre para cima: n = {n}'],
                 'O tamanho da amostra é arredondado para cima para cumprir a margem de erro.')


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
}


def calcular(dados):
    """Escolhe a fórmula solicitada e devolve um resultado legível."""
    if not isinstance(dados, dict):
        raise ValueError('Envie os dados da calculadora em formato válido.')
    escolha = dados.get('formula', '')
    if escolha not in FORMULAS:
        raise ValueError('Selecione uma das fórmulas disponíveis.')
    return FORMULAS[escolha](dados)
