-- ============================================
-- MIKITECH - MIGRACIÓN A SUPABASE (PostgreSQL)
-- Conversión completa de MySQL a PostgreSQL
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ESTRUCTURA DE TABLAS
-- ============================================

-- USUARIOS
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN','USER','PROVIDER')),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  phone VARCHAR(30),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- CATEGORÍAS
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(140) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTOS
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  provider_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL UNIQUE,
  description TEXT,
  sku VARCHAR(80) UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_provider ON products(provider_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- RELACIÓN PRODUCTOS-CATEGORÍAS
CREATE TABLE IF NOT EXISTS product_categories (
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- PEDIDOS
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED')),
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address VARCHAR(500),
  shipping_city VARCHAR(100),
  shipping_phone VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para orders
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- ITEMS DE PEDIDOS
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ORDENES DE PROVEEDORES
CREATE TABLE IF NOT EXISTS vendor_orders (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider_id BIGINT NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','ACCEPTED','SHIPPED','DELIVERED','CANCELLED')),
  total_amount DECIMAL(10,2) NOT NULL,
  tracking_number VARCHAR(120),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para vendor_orders
CREATE INDEX IF NOT EXISTS idx_vendor_orders_order ON vendor_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_provider ON vendor_orders(provider_id);

-- KITS (Combos de productos)
CREATE TABLE IF NOT EXISTS kits (
  id BIGSERIAL PRIMARY KEY,
  provider_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
  image_url VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para kits
CREATE INDEX IF NOT EXISTS idx_kits_provider ON kits(provider_id);
CREATE INDEX IF NOT EXISTS idx_kits_status ON kits(status);

-- ITEMS DE KITS
CREATE TABLE IF NOT EXISTS kit_items (
  id BIGSERIAL PRIMARY KEY,
  kit_id BIGINT NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1
);

-- Índices para kit_items
CREATE INDEX IF NOT EXISTS idx_kit_items_kit ON kit_items(kit_id);

-- REGISTRO DE ACTIVIDAD
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id BIGINT,
  ip VARCHAR(45),
  details TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_orders_updated_at BEFORE UPDATE ON vendor_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kits_updated_at BEFORE UPDATE ON kits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VISTAS DE REPORTES
-- ============================================

CREATE OR REPLACE VIEW report_daily_sales AS
SELECT
  DATE(o.created_at) AS date,
  COUNT(DISTINCT o.id) AS total_orders,
  SUM(o.total_amount) AS total_revenue,
  COUNT(DISTINCT o.user_id) AS unique_customers
FROM orders o
WHERE o.status NOT IN ('CANCELLED')
GROUP BY DATE(o.created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW report_top_products AS
SELECT
  p.id,
  p.name,
  p.sku,
  p.price,
  SUM(oi.quantity) AS units_sold,
  SUM(oi.subtotal) AS total_revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN orders o ON o.id = oi.order_id
WHERE o.status NOT IN ('CANCELLED')
GROUP BY p.id, p.name, p.sku, p.price
ORDER BY units_sold DESC
LIMIT 20;

CREATE OR REPLACE VIEW report_provider_sales AS
SELECT
  u.id AS provider_id,
  CONCAT(u.first_name, ' ', u.last_name) AS provider_name,
  u.email AS provider_email,
  COUNT(DISTINCT vo.id) AS total_orders,
  SUM(vo.total_amount) AS total_revenue,
  vo.status AS order_status
FROM vendor_orders vo
JOIN users u ON u.id = vo.provider_id
GROUP BY u.id, u.first_name, u.last_name, u.email, vo.status
ORDER BY total_revenue DESC;

CREATE OR REPLACE VIEW report_user_registrations AS
SELECT
  DATE(created_at) AS registration_date,
  role,
  COUNT(*) AS new_users
FROM users
GROUP BY DATE(created_at), role
ORDER BY registration_date DESC;

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública de productos y categorías
CREATE POLICY "Public read access for products" ON products
    FOR SELECT USING (active = true);

CREATE POLICY "Public read access for categories" ON categories
    FOR SELECT USING (active = true);

-- Políticas para proveedores (pueden editar sus propios productos)
CREATE POLICY "Providers can manage their products" ON products
    FOR ALL USING (
        auth.uid()::text = provider_id::text OR
        (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'ADMIN'
    );

-- Políticas para usuarios (pueden ver sus propias órdenes)
CREATE POLICY "Users can view their orders" ON orders
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR
        (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'ADMIN'
    );

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Admin
INSERT INTO users (first_name, last_name, email, password, role, enabled) VALUES
('Admin','System','admin@mikitech.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De','ADMIN',TRUE)
ON CONFLICT (email) DO NOTHING;

-- Categorías
INSERT INTO categories (name, slug, active) VALUES
('Computadores','computadores',TRUE),
('Periféricos','perifericos',TRUE),
('Componentes','componentes',TRUE),
('Procesadores', 'procesadores', TRUE),
('Tarjetas Gráficas', 'tarjetas-graficas', TRUE),
('Memorias RAM', 'memorias-ram', TRUE),
('Almacenamiento', 'almacenamiento', TRUE),
('Placas Madre', 'placas-madre', TRUE),
('Fuentes de Poder', 'fuentes-de-poder', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Audit log inicial
INSERT INTO audit_logs (user_id, action, entity, entity_id, details) VALUES
(1, 'CREATE', 'DATABASE', NULL, 'Base de datos Supabase inicializada')
ON CONFLICT DO NOTHING;
