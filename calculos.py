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


def saida(titulo, resultado, formula, passos, explicacao, detalhes=None, aviso='', valores_calculados=None):
    """Padroniza os dados entregues à tela do PC e do celular."""
    # Todas as fórmulas devolvem as mesmas chaves, facilitando a interface.
    return dict(titulo=titulo, resultado=resultado, formula=formula,
                passos=passos, explicacao=explicacao, detalhes=detalhes or [], aviso=aviso,
                valores_calculados=valores_calculados or {})


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
# DOIS MODOS DE ENTRADA — DADOS PRONTOS OU VALORES DA AMOSTRA
# ============================================================
# "direto": o exercício já informa média, desvio ou total.
# "lista": o exercício fornece as observações individuais.
# Os dois modos terminam nas mesmas fórmulas para não criar
# resultados diferentes conforme a forma de digitar os dados.


def modo_entrada(dados):
    """Confere o botão escolhido no navegador e bloqueia modos inválidos."""
    modo = dados.get('entrada', 'direto')
    if modo not in ('direto', 'lista'):
        raise ValueError('Escolha dados informados ou lista de valores.')
    return modo


def resumo_de_valores(dados, nome='Valores da amostra', dispersao='amostral'):
    """Da lista de números, extrai n, média e desvio sem pedir contas extras.

    Se for AMOSTRAL, o divisor da variância é (n - 1): DESVPAD.A.
    Se for POPULACIONAL, o divisor é n: DESVPAD.P.
    A média e a contagem são iguais nos dois casos.
    """
    if dispersao not in ('amostral', 'populacional'):
        raise ValueError('Tipo de desvio: escolha amostral ou populacional.')
    minimo = 2 if dispersao == 'amostral' else 1
    valores = lista_numeros(dados.get('valores', ''), nome, minimo)
    n = len(valores)
    media = math.fsum(valores) / n
    soma_quadrados = math.fsum((x - media) ** 2 for x in valores)
    desvio = math.sqrt(soma_quadrados / (n - 1 if dispersao == 'amostral' else n))
    if not all(math.isfinite(v) for v in (media, soma_quadrados, desvio)):
        raise ValueError('Valores muito grandes. Revise os números informados.')
    return media, desvio, n


def media_desvio_da_questao(dados, pede_tamanho=True):
    """Obtém média/desvio/n da lista OU lê os três valores informados.

    Esta função é usada no intervalo da média, escore Z e erro-padrão.
    Assim, não precisamos reescrever a conta da média em cada função.
    """
    if modo_entrada(dados) == 'lista':
        tipo = dados.get('tipo_dispersao', 'amostral')
        return (*resumo_de_valores(dados, dispersao=tipo), tipo)
    media = numero(dados.get('media', ''), 'Média')
    desvio = positivo(dados.get('desvio', ''), 'Desvio-padrão', aceita_zero=True)
    n = inteiro(dados.get('n', ''), 'Tamanho da amostra') if pede_tamanho else None
    return media, desvio, n, 'informado'


def eventos_binarios(dados):
    """Conta respostas 1/0, sim/não ou verdadeiro/falso copiadas do Excel.

    Essa lista serve para PROPORÇÕES, pois cada item precisa indicar
    presença (1/sim) ou ausência (0/não) da característica.
    NÃO confunda esta lista com uma amostra de valores contínuos.
    """
    valor = dados.get('valores', '')
    if not isinstance(valor, str) or not valor.strip():
        raise ValueError('Informe as observações como 1/0 ou sim/não.')
    partes = [p.strip().lower() for p in valor.replace('\r', '\n').replace('\t', ';').replace('\n', ';').split(';') if p.strip()]
    positivos = {'1', 'sim', 's', 'verdadeiro', 'true'}
    negativos = {'0', 'não', 'nao', 'n', 'falso', 'false'}
    for i, item in enumerate(partes, 1):
        if item not in positivos | negativos:
            raise ValueError(f'Item {i}: use somente 1/0 ou sim/não na lista de proporção.')
    if not partes:
        raise ValueError('Informe pelo menos uma observação.')
    sucessos = sum(item in positivos for item in partes)
    return sucessos, len(partes)


def proporcao_da_questao(dados):
    """Devolve (proporção decimal, n, contagem, origem) de qualquer modo."""
    if modo_entrada(dados) == 'lista':
        k, n = eventos_binarios(dados)
        return k / n, n, k, f'{k} de {n} valores'
    n = inteiro(dados.get('n', ''), 'Tamanho da amostra')
    # No modo direto aceitamos a quantidade OU a porcentagem.
    if str(dados.get('sucessos', '')).strip():
        k = numero(dados['sucessos'], 'Quantidade com característica')
        if not k.is_integer() or not 0 <= k <= n:
            raise ValueError('Quantidade com característica: use um inteiro entre 0 e n.')
        return k / n, n, int(k), f'{int(k)} / {n}'
    pct = numero(dados.get('percentual', ''), 'Proporção em %')
    if not 0 <= pct <= 100:
        raise ValueError('Proporção: informe de 0% a 100%.')
    return pct / 100, n, None, f'{texto_num(pct)}%'


def resumo_mostrado(media=None, desvio=None, n=None, p=None, sucessos=None):
    """Números já formatados para preencher as células coloridas da tela."""
    linhas = {}
    if media is not None:
        linhas['media'] = texto_num(media, 6)
    if desvio is not None:
        linhas['desvio'] = texto_num(desvio, 6)
    if n is not None:
        linhas['n'] = str(n)
    if p is not None:
        linhas['p'] = f'{texto_num(100 * p, 4)}%'
    if sucessos is not None:
        linhas['sucessos'] = str(sucessos)
    return linhas


# ============================================================
# FUNCIONAMENTO REFERENTE À FÓRMULA DE IC PARA A MÉDIA
# Margem E = z * desvio_padrao / raiz(n)
# IC = (média - E, média + E)
# ============================================================

def ic_media(dados):
    """Intervalo Z da média: aceita resumo pronto ou lista de observações."""
    entrada = modo_entrada(dados)
    media, dp, n, tipo_dp = media_desvio_da_questao(dados)
    z = z_critico(dados.get('confianca', 95))

    # A fórmula do Excel INT.CONFIANÇA usa o desvio e o tamanho já prontos.
    # Quando há lista, primeiro calculamos esses dados automaticamente.
    erro = z * dp / math.sqrt(n)
    inferior, superior = media - erro, media + erro

    aviso = ''
    if tipo_dp == 'amostral' and n <= 30:
        aviso = ('A aula usa intervalo Z; para amostras pequenas com desvio ' 
                 'AMOSTRAL, confira se a professora exige t de Student.')
    elif tipo_dp == 'informado' and n <= 30:
        aviso = ('Para n pequeno, confirme se o desvio informado é ' 
                 'populacional (σ). Se for amostral (s), pode ser necessário t de Student.')
    passos = []
    if entrada == 'lista':
        passos += [f'1. Da lista: n = {n}; média = {texto_num(media, 6)}; '
                   f'desvio {tipo_dp} = {texto_num(dp, 6)}']
    else:
        passos += [f'1. Dados informados: média = {texto_num(media)}; '
                   f'desvio = {texto_num(dp)}; n = {n}']
    passos += [f'2. Grau de confiança: {dados.get("confianca", 95)}% → z = {texto_num(z, 3)}',
              f'3. Margem E = {texto_num(z, 3)} × {texto_num(dp, 6)} ÷ √{n} = {texto_num(erro, 6)}',
              f'4. Limite inferior: {texto_num(media, 6)} − {texto_num(erro, 6)} = {texto_num(inferior, 6)}',
              f'5. Limite superior: {texto_num(media, 6)} + {texto_num(erro, 6)} = {texto_num(superior, 6)}']
    valores = resumo_mostrado(media=media, desvio=dp, n=n)
    # O fluxograma usa estes valores; a tela apenas exibe o que o Python manda.
    valores.update(z=texto_num(z, 3),
                   inferior=texto_num(inferior, 6), superior=texto_num(superior, 6),
                   margem=f'{erro:.2f}'.replace('.', ','),
                   intervalo=f'{inferior:.2f} a {superior:.2f}'.replace('.', ','))
    return saida('Intervalo de confiança da média',
                 f'IC = ({texto_num(inferior, 6)}; {texto_num(superior, 6)})',
                 'E = z × σ / √n; IC = (x̄ − E; x̄ + E)', passos,
                 'O intervalo estima a média verdadeira da população.',
                 [f'Margem de erro: ±{texto_num(erro, 6)}'], aviso, valores)

# ============================================================
# FUNCIONAMENTO REFERENTE À FÓRMULA DE IC PARA A PROPORÇÃO
# p = sucessos / n
# E = z * raiz(p * (1-p) / n)
# IC = (p - E, p + E)
# ============================================================

def ic_proporcao(dados):
    """Intervalo da proporção: aceita contagem, percentual ou lista 1/0."""
    entrada = modo_entrada(dados)
    p, n, k, origem = proporcao_da_questao(dados)
    z = z_critico(dados.get('confianca', 95))
    erro = z * math.sqrt(p * (1 - p) / n)
    inferior, superior = p - erro, p + erro
    aviso = ('Com poucas ocorrências, o intervalo normal pode ser inadequado; '
             'confira se a questão pede outro método.'
             if min(n * p, n * (1 - p)) < 5 else '')
    passos = [f'1. {"Da lista" if entrada == "lista" else "Dados informados"}: '
              f'p = {origem} = {texto_num(p, 6)}; n = {n}',
              f'2. Confiança = {dados.get("confianca", 95)}%; z = {texto_num(z, 3)}',
              f'3. Margem E = {texto_num(z, 3)} × √[{texto_num(p, 6)} × '
              f'(1 − {texto_num(p, 6)}) / {n}] = {texto_num(erro, 6)}',
              f'4. Limite inferior = {texto_num(inferior * 100, 4)}%',
              f'5. Limite superior = {texto_num(superior * 100, 4)}%']
    valores = resumo_mostrado(n=n, p=p, sucessos=k)
    # Para o Node-RED, p, z, margem e limites ficam separados.
    valores.update(z=texto_num(z, 3),
                   inferior=f'{texto_num(inferior * 100, 4)}%',
                   superior=f'{texto_num(superior * 100, 4)}%',
                   margem=f'{erro * 100:.2f}'.replace('.', ',') + ' p.p.',
                   intervalo=f'{inferior * 100:.2f}% a {superior * 100:.2f}%'.replace('.', ','))
    return saida('Intervalo de confiança da proporção',
                 f'IC = ({texto_num(inferior * 100, 4)}%; {texto_num(superior * 100, 4)}%)',
                 'p = sucessos / n; E = z × √[p(1 − p) / n]; IC = (p − E; p + E)',
                 passos, 'Este intervalo estima a proporção na população.',
                 [f'p = {texto_num(p * 100, 4)}%',
                  f'Margem: ±{texto_num(erro * 100, 4)} pontos percentuais'], aviso, valores)

# ============================================================
# FUNCIONAMENTO REFERENTE À FÓRMULA DO ESCORE Z
# z = (valor_observado - média) / desvio_padrao
# ============================================================

def escore(dados):
    """Escore Z: permite usar média/desvio prontos ou calculá-los da lista."""
    x = numero(dados.get('valor', ''), 'Valor observado')
    entrada = modo_entrada(dados)
    media, dp, n, tipo = media_desvio_da_questao(dados, pede_tamanho=False)
    if dp == 0:
        raise ValueError('O desvio-padrão deve ser maior que zero para calcular o escore Z.')
    z = (x - media) / dp
    classificacao = ('Incomum (|z| > 2)' if abs(z) > 2
                     else 'No limite (|z| = 2)' if math.isclose(abs(z), 2, abs_tol=1e-10)
                     else 'Dentro do padrão (|z| < 2)')
    direcao = 'acima' if z > 0 else 'abaixo' if z < 0 else 'exatamente na média'
    passos = [f'1. Valor observado x = {texto_num(x)}']
    if entrada == 'lista':
        passos += [f'2. Dos {n} valores: média = {texto_num(media, 6)}; '
                   f'desvio {tipo} = {texto_num(dp, 6)}']
    else:
        passos += [f'2. Média informada = {texto_num(media)}; desvio = {texto_num(dp)}']
    passos += [f'3. Diferença: x − média = {texto_num(x - media, 6)}',
              f'4. Dividir pelo desvio: {texto_num(x - media, 6)} / '
              f'{texto_num(dp, 6)} = {texto_num(z, 6)}',
              f'5. Classificação: {classificacao}']
    return saida('Escore Z', f'z = {texto_num(z, 6)}', 'z = (x − μ) / σ',
                 passos,
                 f'O valor está {texto_num(abs(z), 4)} desvios-padrão '
                 f'{direcao}. Isso não determina se o resultado é bom ou ruim.',
                 [classificacao], valores_calculados=resumo_mostrado(media=media, desvio=dp, n=n))

# ============================================================
# FUNCIONAMENTO REFERENTE À FÓRMULA DO TAMANHO DA AMOSTRA
# Para média: n = (z * desvio_padrao / erro_desejado)²
# Para proporção: n = z² * p * (1-p) / erro_desejado²
# Sempre arredondamos n para cima.
# ============================================================

def tamanho_amostra(dados):
    """Tamanho mínimo: usa desvio/proporção prontos ou uma amostra piloto."""
    entrada = modo_entrada(dados)
    tipo = dados.get('tipo', 'media')
    z = z_critico(dados.get('confianca', 95))
    erro_informado = positivo(dados.get('erro', ''), 'Margem de erro')
    valores = {}

    if tipo == 'media':
        if entrada == 'lista':
            # Uma amostra PILOTO estima o desvio; ela NÃO é a amostra final.
            _, dp, n_piloto = resumo_de_valores(dados, dispersao=dados.get('tipo_dispersao', 'amostral'))
            valores.update(resumo_mostrado(desvio=dp, n=n_piloto))
        else:
            dp = positivo(dados.get('desvio', ''), 'Desvio-padrão')
        calculado = (z * dp / erro_informado) ** 2
        formula = 'n = (z × σ / E)²'
        conta = f'({texto_num(z, 3)} × {texto_num(dp, 6)} / {texto_num(erro_informado)})²'
    elif tipo == 'proporcao':
        if not erro_informado <= 100:
            raise ValueError('Margem de erro percentual: use de 0 a 100.')
        if entrada == 'lista':
            k, n_piloto = eventos_binarios(dados)
            p = k / n_piloto
            valores.update(resumo_mostrado(n=n_piloto, p=p, sucessos=k))
        else:
            pct_texto = str(dados.get('percentual', '')).strip()
            p = numero(pct_texto, 'Proporção em %') / 100 if pct_texto else 0.5
        if not 0 < p < 1:
            raise ValueError('Proporção prevista: use valor maior que 0% e menor que 100%.')
        e = erro_informado / 100
        calculado = z*z*p*(1-p) / (e*e)
        formula = 'n = z² × p × (1 − p) / E²'
        conta = f'{texto_num(z, 3)}² × {texto_num(p, 6)} × (1 − {texto_num(p, 6)}) / {texto_num(e, 6)}²'
    else:
        raise ValueError('Escolha média ou proporção para o tamanho da amostra.')

    if not math.isfinite(calculado) or calculado > 10**12:
        raise ValueError('A quantidade calculada é grande demais. Revise os dados.')
    n_final = max(1, math.ceil(calculado))
    passos = [f'1. Objetivo: {tipo}; modo: {entrada}',
              f'2. Confiança: {dados.get("confianca", 95)}%; z = {texto_num(z, 3)}',
              f'3. Margem máxima E = {texto_num(erro_informado)}',
              f'4. Substituir: {conta} = {texto_num(calculado, 6)}',
              f'5. Arredondar para cima: n = {n_final}']
    return saida('Tamanho mínimo da amostra', f'n = {n_final:,}'.replace(',', '.') + ' observações',
                 formula, passos, 'A quantidade é arredondada para cima.',
                 valores_calculados=valores)

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
    """Proporção simples: permite quantidade/total ou lista 1/0."""
    p, n, k, origem = proporcao_da_questao(dados)
    return saida('Proporção amostral', f'p̂ = {texto_num(p * 100, 4)}%', 'p̂ = k / n',
                 [f'1. Origem: {origem}', f'2. Total n = {n}',
                  f'3. Casos positivos k = {k if k is not None else "não informado"}',
                  f'4. Proporção p = {texto_num(p, 6)}',
                  f'5. Porcentagem = {texto_num(p * 100, 4)}%'],
                 'A proporção mostra a parte do total com uma característica.',
                 valores_calculados=resumo_mostrado(n=n, p=p, sucessos=k))

# ============================================================
# FÓRMULA DO ERRO-PADRÃO
# MÉDIA: EP = desvio-padrão / √n
# PROPORÇÃO: EP = √[p(1 − p)/n]
# ============================================================

def erro_padrao(dados):
    """Erro-padrão: usa dados prontos ou os obtém de observações brutas."""
    tipo = dados.get('tipo', 'media')
    entrada = modo_entrada(dados)
    if tipo == 'media':
        if entrada == 'lista':
            _, dp, n = resumo_de_valores(dados, dispersao=dados.get('tipo_dispersao', 'amostral'))
        else:
            dp = positivo(dados.get('desvio', ''), 'Desvio-padrão', aceita_zero=True)
            n = inteiro(dados.get('n', ''), 'Tamanho da amostra')
        ep = dp / math.sqrt(n)
        valores = resumo_mostrado(desvio=dp, n=n)
        formula = 'EP = s / √n (ou σ / √n)'
        conta = f'{texto_num(dp, 6)} / √{n}'
        resposta = f'EP = {texto_num(ep, 6)}'
    elif tipo == 'proporcao':
        if entrada == 'lista':
            k, n = eventos_binarios(dados)
            p = k / n
        else:
            n = inteiro(dados.get('n', ''), 'Tamanho da amostra')
            pct = numero(dados.get('percentual', ''), 'Proporção em %')
            if not 0 <= pct <= 100:
                raise ValueError('Proporção: informe de 0% a 100%.')
            p = pct / 100
        ep = math.sqrt(p * (1 - p) / n)
        valores = resumo_mostrado(n=n, p=p)
        formula = 'EP = √[p × (1 − p) / n]'
        conta = f'√[{texto_num(p, 6)} × (1 − {texto_num(p, 6)}) / {n}]'
        resposta = f'EP = {texto_num(ep, 6)} ({texto_num(ep*100, 4)} p.p.)'
    else:
        raise ValueError('Escolha média ou proporção para o erro-padrão.')
    return saida('Erro-padrão da ' + ('média' if tipo == 'media' else 'proporção'),
                 resposta, formula,
                 [f'1. Tipo: {tipo}', f'2. Modo: {entrada}; n = {n}',
                  f'3. Fórmula: {conta}', f'4. Resultado: {resposta}'],
                 'Erro-padrão é diferente da margem de erro.', valores_calculados=valores)

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
