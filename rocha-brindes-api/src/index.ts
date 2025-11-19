// src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import authRoutes from './routes/auth'
import productRoutes from './routes/products'
import categoryRoutes from './routes/categories'
import configRoutes from './routes/config'

export interface Env {
  DB: D1Database
  CACHE: KVNamespace
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:4321', 'https://seudominio.com'],
  credentials: true,
}))

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Rotas
app.route('/api/auth', authRoutes)
app.route('/api/products', productRoutes)
app.route('/api/categories', categoryRoutes)
app.route('/api/config', configRoutes)

export default app