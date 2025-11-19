// src/utils/jwt.ts
export async function generateToken(payload: any, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const exp = now + (7 * 24 * 60 * 60) // 7 dias

  const jwtPayload = { ...payload, iat: now, exp }

  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(jwtPayload))
  const unsignedToken = `${encodedHeader}.${encodedPayload}`

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(unsignedToken)
  )

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
  return `${unsignedToken}.${encodedSignature}`
}

export async function verifyToken(token: string, secret: string): Promise<any> {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.')
    
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const signature = Uint8Array.from(atob(encodedSignature), c => c.charCodeAt(0))
    const data = encoder.encode(`${encodedHeader}.${encodedPayload}`)

    const isValid = await crypto.subtle.verify('HMAC', key, signature, data)
    
    if (!isValid) return null

    const payload = JSON.parse(atob(encodedPayload))
    
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}