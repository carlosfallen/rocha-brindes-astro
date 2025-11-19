-- src/db/schema.sql

-- Tabela de usuários (administradores)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  product_count INTEGER DEFAULT 0,
  popular BOOLEAN DEFAULT 0,
  image_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  featured BOOLEAN DEFAULT 0,
  main_image TEXT,
  thumb_image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias por produto
CREATE TABLE IF NOT EXISTS product_categories (
  product_id TEXT,
  category_name TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_name)
);

-- Tabela de variações de produtos
CREATE TABLE IF NOT EXISTS product_variations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL,
  color TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumb_url TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabela de configurações gerais
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_variations_product ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_popular ON categories(popular);

-- Inserir usuário admin padrão (senha: admin123)
INSERT OR IGNORE INTO users (email, password_hash, name, role) 
VALUES ('admin@rochabrindes.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'admin');