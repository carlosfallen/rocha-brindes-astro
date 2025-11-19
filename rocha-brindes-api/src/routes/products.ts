// src/routes/products.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { Env } from '../index'
import { authMiddleware } from '../middleware/auth'

const products = new Hono<{ Bindings: Env }>()

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  categories: z.array(z.string()),
  mainImage: z.string().optional(),
  thumbImage: z.string().optional(),
  variations: z.array(z.object({
    color: z.string(),
    imageUrl: z.string(),
    thumbUrl: z.string().optional()
  })).optional()
})

// Listar produtos (público)
products.get('/', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '1000')
    const offset = parseInt(c.req.query('offset') || '0')
    const featured = c.req.query('featured')
    const category = c.req.query('category')
    
    // Verificar cache
    const cacheKey = `products:${limit}:${offset}:${featured}:${category}`
    const cached = await c.env.CACHE.get(cacheKey)
    
    if (cached) {
      return c.json(JSON.parse(cached))
    }

    let query = 'SELECT * FROM products'
    const bindings: any[] = []
    
    if (featured === 'true') {
      query += ' WHERE featured = 1'
    }
    
    if (category) {
      query += featured ? ' AND' : ' WHERE'
      query += ' id IN (SELECT product_id FROM product_categories WHERE category_name = ?)'
      bindings.push(category)
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    bindings.push(limit, offset)

    const { results } = await c.env.DB.prepare(query).bind(...bindings).all()

    // Buscar categorias e variações para cada produto
    const productsWithDetails = await Promise.all(
      results.map(async (product: any) => {
        const { results: categories } = await c.env.DB.prepare(
          'SELECT category_name FROM product_categories WHERE product_id = ?'
        ).bind(product.id).all()

        const { results: variations } = await c.env.DB.prepare(
          'SELECT color, image_url, thumb_url FROM product_variations WHERE product_id = ?'
        ).bind(product.id).all()

        return {
          id: product.id,
          nome: product.name,
          descricao: product.description,
          destaque: Boolean(product.featured),
          imagem_url: product.main_image,
          thumb_url: product.thumb_image,
          categorias: categories.map((c: any) => c.category_name),
          variacoes: variations.map((v: any) => ({
            cor: v.color,
            imagem_url: v.image_url,
            thumb_url: v.thumb_url
          })),
          createdAt: product.created_at
        }
      })
    )

    // Cachear por 5 minutos
    await c.env.CACHE.put(cacheKey, JSON.stringify(productsWithDetails), { expirationTtl: 300 })

    return c.json(productsWithDetails)
  } catch (error) {
    console.error('List products error:', error)
    return c.json({ error: 'Erro ao listar produtos' }, 500)
  }
})

// Buscar produto por ID (público)
products.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    // Verificar cache
    const cacheKey = `product:${id}`
    const cached = await c.env.CACHE.get(cacheKey)
    
    if (cached) {
      return c.json(JSON.parse(cached))
    }

    const product = await c.env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first()

    if (!product) {
      return c.json({ error: 'Produto não encontrado' }, 404)
    }

    const { results: categories } = await c.env.DB.prepare(
      'SELECT category_name FROM product_categories WHERE product_id = ?'
    ).bind(id).all()

    const { results: variations } = await c.env.DB.prepare(
      'SELECT color, image_url, thumb_url FROM product_variations WHERE product_id = ?'
    ).bind(id).all()

    const productDetail = {
      id: product.id,
      nome: product.name,
      descricao: product.description,
      destaque: Boolean(product.featured),
      imagem_url: product.main_image,
      thumb_url: product.thumb_image,
      categorias: categories.map((c: any) => c.category_name),
      variacoes: variations.map((v: any) => ({
        cor: v.color,
        imagem_url: v.image_url,
        thumb_url: v.thumb_url
      })),
      createdAt: product.created_at
    }

    // Cachear por 5 minutos
    await c.env.CACHE.put(cacheKey, JSON.stringify(productDetail), { expirationTtl: 300 })

    return c.json(productDetail)
  } catch (error) {
    console.error('Get product error:', error)
    return c.json({ error: 'Erro ao buscar produto' }, 500)
  }
})

// Criar produto (admin)
products.post('/', authMiddleware, zValidator('json', productSchema), async (c) => {
  try {
    const data = c.req.valid('json')
    
    await c.env.DB.prepare(
      'INSERT INTO products (id, name, description, featured, main_image, thumb_image) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      data.id,
      data.name,
      data.description || null,
      data.featured ? 1 : 0,
      data.mainImage || null,
      data.thumbImage || null
    ).run()

    // Inserir categorias
    if (data.categories.length > 0) {
      const stmt = c.env.DB.prepare(
        'INSERT INTO product_categories (product_id, category_name) VALUES (?, ?)'
      )
      await c.env.DB.batch(
        data.categories.map(cat => stmt.bind(data.id, cat))
      )
    }

    // Inserir variações
    if (data.variations && data.variations.length > 0) {
      const stmt = c.env.DB.prepare(
        'INSERT INTO product_variations (product_id, color, image_url, thumb_url) VALUES (?, ?, ?, ?)'
      )
      await c.env.DB.batch(
        data.variations.map(v => stmt.bind(data.id, v.color, v.imageUrl, v.thumbUrl || null))
      )
    }

    // Limpar cache
    await c.env.CACHE.delete(`products:*`)
    
    return c.json({ message: 'Produto criado com sucesso', id: data.id })
  } catch (error) {
    console.error('Create product error:', error)
    return c.json({ error: 'Erro ao criar produto' }, 500)
  }
})

// Atualizar produto (admin)
products.put('/:id', authMiddleware, zValidator('json', productSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const data = c.req.valid('json')
    
    await c.env.DB.prepare(
      'UPDATE products SET name = ?, description = ?, featured = ?, main_image = ?, thumb_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(
      data.name,
      data.description || null,
      data.featured ? 1 : 0,
      data.mainImage || null,
      data.thumbImage || null,
      id
    ).run()

    // Atualizar categorias
    await c.env.DB.prepare('DELETE FROM product_categories WHERE product_id = ?').bind(id).run()
    
    if (data.categories.length > 0) {
      const stmt = c.env.DB.prepare(
        'INSERT INTO product_categories (product_id, category_name) VALUES (?, ?)'
      )
      await c.env.DB.batch(
        data.categories.map(cat => stmt.bind(id, cat))
      )
    }

    // Atualizar variações
    await c.env.DB.prepare('DELETE FROM product_variations WHERE product_id = ?').bind(id).run()
    
    if (data.variations && data.variations.length > 0) {
      const stmt = c.env.DB.prepare(
        'INSERT INTO product_variations (product_id, color, image_url, thumb_url) VALUES (?, ?, ?, ?)'
      )
      await c.env.DB.batch(
        data.variations.map(v => stmt.bind(id, v.color, v.imageUrl, v.thumbUrl || null))
      )
    }

    // Limpar cache
    await c.env.CACHE.delete(`product:${id}`)
    await c.env.CACHE.delete(`products:*`)
    
    return c.json({ message: 'Produto atualizado com sucesso' })
  } catch (error) {
    console.error('Update product error:', error)
    return c.json({ error: 'Erro ao atualizar produto' }, 500)
  }
})

// Deletar produto (admin)
products.delete('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id')
    
    await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
    
    // Limpar cache
    await c.env.CACHE.delete(`product:${id}`)
    await c.env.CACHE.delete(`products:*`)
    
    return c.json({ message: 'Produto deletado com sucesso' })
  } catch (error) {
    console.error('Delete product error:', error)
    return c.json({ error: 'Erro ao deletar produto' }, 500)
  }
})

export default products