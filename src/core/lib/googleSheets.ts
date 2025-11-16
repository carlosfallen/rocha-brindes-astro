// core/lib/googleSheets.ts
const SHEET_ID = '1t7T-5mU4ET0kjqd8x_sXlEwunwogCBrlqFnYpVaoyvE'
const API_KEY = 'AIzaSyAWUmt2UDeXxY1my2ajGU5bAMSjuU0L14o'
const RANGE = 'produtos!A:Z'

export interface SheetProductGroup {
  baseSku: string
  nome: string
  descricao: string
  categorias: string[]
  destaque: boolean
  variacoes: Array<{ cor: string }>
}

function normalize(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim()
}

function stripColorFromName(nome: string, cor: string): string {
  if (!nome || !cor) return nome
  const regex = new RegExp(`\\s+${cor}$`, 'i') // remove " PRETO" do final, por ex.
  return nome.replace(regex, '').trim()
}

export async function fetchProductGroupFromSheet(
  inputCode: string
): Promise<SheetProductGroup | null> {
  const raw = inputCode.trim()
  if (!raw) return null

  // 1000_115_3 => baseSku = 1000_115
  const parts = raw.split('_')
  const baseSku =
    parts.length > 2 ? parts.slice(0, parts.length - 1).join('_') : raw

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(
    RANGE
  )}?key=${API_KEY}`

  const res = await fetch(url)
  if (!res.ok) {
    console.error('Erro ao buscar planilha:', await res.text())
    throw new Error('Não foi possível acessar a planilha do Google Sheets')
  }

  const data = await res.json()
  const values: string[][] = data.values || []
  if (!values.length) return null

  const [header, ...rows] = values

  console.log('Header da planilha:', header)
  console.log('Primeira linha de dados:', rows[0])

  const normalizeHeader = (h: string) => normalize(h || '')

  // 🟢 AGORA ACEITA "id" COMO CÓDIGO
  const idxCodigo = header.findIndex((h) => {
    const normalized = normalizeHeader(h)
    return ['ID', 'CODIGO', 'CÓDIGO', 'SKU', 'COD', 'CODE'].includes(normalized)
  })

  const idxNome = header.findIndex((h) => {
    const normalized = normalizeHeader(h)
    return ['NOME', 'PRODUTO', 'DESCRICAO_CURTA', 'NAME'].includes(normalized)
  })

  const idxDescricao = header.findIndex((h) => {
    const normalized = normalizeHeader(h)
    return ['DESCRICAO', 'DESCRIÇÃO', 'DESC', 'DESCRIPTION'].includes(normalized)
  })

  // 🟢 SUA COLUNA DE COR É "variacoes"
  const idxCor = header.findIndex((h) => {
    const normalized = normalizeHeader(h)
    return [
      'COR',
      'CORES',
      'VARIACAO',
      'VARIACOES', // <= aqui entra "variacoes"
      'VARIAÇÃO',
      'COLOR',
    ].includes(normalized)
  })

  // 🟢 SUA COLUNA DE CATEGORIA É "Categoria"
  const idxCategoria = header.findIndex((h) => {
    const normalized = normalizeHeader(h)
    return ['CATEGORIA', 'CATEGORIAS', 'GRUPO', 'CATEGORY'].includes(normalized)
  })

  const idxDestaque = header.findIndex((h) => {
    const normalized = normalizeHeader(h)
    return ['DESTAQUE', 'HIGHLIGHT', 'FEATURED'].includes(normalized)
  })

  if (idxCodigo === -1) {
    console.error(
      'Colunas disponíveis:',
      header.map((h, i) => `${i}: ${h}`)
    )
    throw new Error(
      `Coluna de código/SKU não encontrada na planilha. Colunas disponíveis: ${header.join(
        ', '
      )}`
    )
  }

  // 🔍 Filtra todas as linhas desse "produto base" (1000_115)
  const matchedRows = rows.filter((r) => {
    const cell = (r[idxCodigo] || '').trim()
    if (!cell) return false
    return cell === baseSku || cell.startsWith(baseSku + '_')
  })

  if (!matchedRows.length) {
    return null
  }

  let nomeBase = ''
  let descricao = ''
  const categoriasSet = new Set<string>()
  let destaque = false
  const variacoes: Array<{ cor: string }> = []

  for (const row of matchedRows) {
    const nomeRaw = idxNome >= 0 ? (row[idxNome] || '').trim() : ''
    const descricaoRaw =
      idxDescricao >= 0 ? (row[idxDescricao] || '').trim() : ''
    const corRaw = idxCor >= 0 ? (row[idxCor] || '').trim() : ''
    const categoriaRaw =
      idxCategoria >= 0 ? (row[idxCategoria] || '').trim() : ''
    const destaqueRaw =
      idxDestaque >= 0 ? (row[idxDestaque] || '').trim() : ''

    // Nome base sem a cor no final (COPO TX-1 PRETO -> COPO TX-1)
    if (!nomeBase && nomeRaw) {
      nomeBase = corRaw ? stripColorFromName(nomeRaw, corRaw) : nomeRaw
    }

    // Descrição: pega da primeira linha que tiver
    if (!descricao && descricaoRaw) {
      descricao = descricaoRaw
    }

    // Categorias (pode ter mais de uma separada por vírgula)
    if (categoriaRaw) {
      categoriaRaw
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
        .forEach((c) => categoriasSet.add(c))
    }

    // Destaque (se alguma linha marcar)
    if (
      typeof destaqueRaw === 'string' &&
      ['SIM', 'TRUE', '1', 'YES', 'S'].includes(normalize(destaqueRaw))
    ) {
      destaque = true
    }

    // Variações: uma por cor
    if (corRaw && !variacoes.find((v) => v.cor === corRaw)) {
      variacoes.push({ cor: corRaw })
    }
  }

  const categorias = Array.from(categoriasSet)

  return {
    baseSku,
    nome: nomeBase || baseSku,
    descricao,
    categorias,
    destaque,
    variacoes,
  }
}
