// src/core/lib/api.ts
const API_URL = import.meta.env.PUBLIC_API_URL || 'https://rocha-brindes-api.seu-usuario.workers.dev/api'

class ApiClient {
  private token: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
      throw new Error(error.error || 'Erro na requisição')
    }

    return response.json()
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setToken(data.token)
    return data
  }

  async logout() {
    this.clearToken()
  }

  async verifyToken() {
    return this.request<{ valid: boolean; user: any }>('/auth/verify')
  }

  // Products
  async getProducts(params?: { limit?: number; offset?: number; featured?: boolean; category?: string }) {
    const query = new URLSearchParams()
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.offset) query.append('offset', params.offset.toString())
    if (params?.featured) query.append('featured', 'true')
    if (params?.category) query.append('category', params.category)
    
    return this.request<any[]>(`/products?${query}`)
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`)
  }

  async createProduct(product: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
  }

  async updateProduct(id: string, product: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Categories
  async getCategories() {
    return this.request<any[]>('/categories')
  }

  async createCategory(category: any) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    })
  }

  async deleteCategory(id: string) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    })
  }

  // Config
  async getConfig(key: string) {
    return this.request<any>(`/config/${key}`)
  }

  async setConfig(key: string, value: any) {
    return this.request(`/config/${key}`, {
      method: 'POST',
      body: JSON.stringify({ value }),
    })
  }
}

export const api = new ApiClient()