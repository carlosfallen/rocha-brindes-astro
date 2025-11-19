// src/middleware/auth.ts
import { Context, Next } from 'hono'
import { Env } from '../index'
import { verifyToken } from '../utils/jwt'

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return c.json({ error: 'Token não fornecido' }, 401)
  }

  const decoded = await verifyToken(token, c.env.JWT_SECRET)
  
  if (!decoded) {
    return c.json({ error: 'Token inválido' }, 401)
  }

  c.set('user', decoded)
  await next()
}