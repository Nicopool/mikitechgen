-- ============================================
-- MIKITECH E-COMMERCE - BASE DE DATOS COMPLETA
-- Incluye estructura + datos de prueba
-- ============================================

-- Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS kitech 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE kitech;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- ESTRUCTURA DE TABLAS
-- ============================================

-- USUARIOS
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password        VARCHAR(255) NOT NULL,
  role            ENUM('ADMIN','USER','PROVIDER') NOT NULL DEFAULT 'USER',
  enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  phone           VARCHAR(30) NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- CATEGORÍAS
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL UNIQUE,
  slug        VARCHAR(140) NOT NULL UNIQUE,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- PRODUCTOS
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  provider_id  BIGINT NULL,
  name         VARCHAR(255) NOT NULL,
  slug         VARCHAR(280) NOT NULL UNIQUE,
  description  TEXT NULL,
  sku          VARCHAR(80) NULL UNIQUE,
  price        DECIMAL(10,2) NOT NULL,
  stock        INT NOT NULL DEFAULT 0,
  image_url    VARCHAR(500) NULL,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_provider (provider_id),
  INDEX idx_sku (sku),
  INDEX idx_active (active)
) ENGINE=InnoDB;

-- RELACIÓN PRODUCTOS-CATEGORÍAS
DROP TABLE IF EXISTS product_categories;
CREATE TABLE product_categories (
  product_id  BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- PEDIDOS
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT NOT NULL,
  status        ENUM('CREATED','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'CREATED',
  total_amount  DECIMAL(10,2) NOT NULL,
  shipping_address VARCHAR(500) NULL,
  shipping_city    VARCHAR(100) NULL,
  shipping_phone   VARCHAR(50) NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ITEMS DE PEDIDOS
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id    BIGINT NOT NULL,
  product_id  BIGINT NOT NULL,
  quantity    INT NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL,
  subtotal    DECIMAL(10,2) NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_order (order_id)
) ENGINE=InnoDB;

-- ORDENES DE PROVEEDORES
DROP TABLE IF EXISTS vendor_orders;
CREATE TABLE vendor_orders (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id        BIGINT NOT NULL,
  provider_id     BIGINT NOT NULL,
  status          ENUM('PENDING','ACCEPTED','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  total_amount    DECIMAL(10,2) NOT NULL,
  tracking_number VARCHAR(120) NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES users(id),
  INDEX idx_order (order_id),
  INDEX idx_provider (provider_id)
) ENGINE=InnoDB;

-- KITS (Combos de productos)
DROP TABLE IF EXISTS kits;
CREATE TABLE kits (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  provider_id BIGINT NOT NULL,
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(280) NOT NULL UNIQUE,
  description TEXT NULL,
  price       DECIMAL(10,2) NOT NULL,
  status      ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  image_url   VARCHAR(500) NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_provider (provider_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ITEMS DE KITS
DROP TABLE IF EXISTS kit_items;
CREATE TABLE kit_items (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  kit_id      BIGINT NOT NULL,
  product_id  BIGINT NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  FOREIGN KEY (kit_id) REFERENCES kits(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_kit (kit_id)
) ENGINE=InnoDB;

-- REGISTRO DE ACTIVIDAD
DROP TABLE IF EXISTS audit_logs;
CREATE TABLE audit_logs (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT NULL,
  action      VARCHAR(100) NOT NULL,
  entity      VARCHAR(100) NOT NULL,
  entity_id   BIGINT NULL,
  ip          VARCHAR(45) NULL,
  details     TEXT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_entity (entity, entity_id),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

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
-- DATOS: USUARIOS
-- ============================================

-- Admin
INSERT INTO users (first_name, last_name, email, password, role, enabled) VALUES
('Admin','System','admin@mikitech.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De','ADMIN',TRUE);

-- 10 Proveedores
INSERT INTO users (first_name, last_name, email, password, role, enabled, phone) VALUES
('Tech Solutions', 'Pro', 'proveedor1@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0101'),
('Gaming Hardware', 'Store', 'proveedor2@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0102'),
('PC Components', 'Plus', 'proveedor3@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0103'),
('Elite Tech', 'Supplies', 'proveedor4@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0104'),
('Digital Parts', 'Hub', 'proveedor5@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0105'),
('Pro Gamer', 'Shop', 'proveedor6@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0106'),
('Hardware', 'Masters', 'proveedor7@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0107'),
('Tech', 'Warehouse', 'proveedor8@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0108'),
('Component', 'Central', 'proveedor9@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0109'),
('Digital Gear', 'Store', 'proveedor10@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0110');

-- 20 Clientes
INSERT INTO users (first_name, last_name, email, password, role, enabled, phone) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1001'),
('María', 'González', 'maria.gonzalez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1002'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1003'),
('Ana', 'Martínez', 'ana.martinez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1004'),
('Luis', 'García', 'luis.garcia@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1005'),
('Sofía', 'López', 'sofia.lopez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1006'),
('Diego', 'Hernández', 'diego.hernandez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1007'),
('Valentina', 'Díaz', 'valentina.diaz@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1008'),
('Miguel', 'Sánchez', 'miguel.sanchez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1009'),
('Camila', 'Ramírez', 'camila.ramirez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1010'),
('Sebastián', 'Torres', 'sebastian.torres@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1011'),
('Isabella', 'Flores', 'isabella.flores@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1012'),
('Mateo', 'Rivera', 'mateo.rivera@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1013'),
('Lucía', 'Gómez', 'lucia.gomez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1014'),
('Daniel', 'Castro', 'daniel.castro@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1015'),
('Martina', 'Morales', 'martina.morales@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1016'),
('Alejandro', 'Ortiz', 'alejandro.ortiz@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1017'),
('Paula', 'Ruiz', 'paula.ruiz@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1018'),
('Nicolás', 'Méndez', 'nicolas.mendez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1019'),
('Emma', 'Vargas', 'emma.vargas@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1020');

-- ============================================
-- DATOS: CATEGORÍAS
-- ============================================

INSERT INTO categories (name, slug, active) VALUES
('Computadores','computadores',TRUE),
('Periféricos','perifericos',TRUE),
('Componentes','componentes',TRUE),
('Procesadores', 'procesadores', TRUE),
('Tarjetas Gráficas', 'tarjetas-graficas', TRUE),
('Memorias RAM', 'memorias-ram', TRUE),
('Almacenamiento', 'almacenamiento', TRUE),
('Placas Madre', 'placas-madre', TRUE),
('Fuentes de Poder', 'fuentes-de-poder', TRUE);

-- ============================================
-- DATOS: PRODUCTOS
-- ============================================

INSERT INTO products (provider_id, name, slug, description, sku, price, stock, image_url, active) VALUES
-- Productos del proveedor 1 (ID 2)
(2, 'AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', 'Procesador de 16 núcleos y 32 hilos, ideal para gaming y productividad extrema', 'CPU-AMD-7950X', 699.99, 15, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', TRUE),
(2, 'Intel Core i9-14900K', 'intel-core-i9-14900k', 'Procesador de 24 núcleos con tecnología Raptor Lake', 'CPU-INT-14900K', 589.99, 20, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', TRUE),

-- Productos del proveedor 2 (ID 3)
(3, 'NVIDIA RTX 4090', 'nvidia-rtx-4090', 'La tarjeta gráfica más potente del mercado, 24GB GDDR6X', 'GPU-NV-4090', 1599.99, 8, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', TRUE),
(3, 'AMD Radeon RX 7900 XTX', 'amd-radeon-rx-7900-xtx', 'GPU de alto rendimiento con 24GB GDDR6', 'GPU-AMD-7900XTX', 999.99, 12, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', TRUE),

-- Productos del proveedor 3 (ID 4)
(4, 'Corsair Vengeance RGB 32GB', 'corsair-vengeance-rgb-32gb', 'Kit de 2x16GB DDR5 6000MHz con iluminación RGB', 'RAM-COR-32GB', 159.99, 30, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', TRUE),
(4, 'G.Skill Trident Z5 64GB', 'gskill-trident-z5-64gb', 'Kit de 2x32GB DDR5 7200MHz para máximo rendimiento', 'RAM-GSK-64GB', 299.99, 18, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', TRUE),

-- Productos del proveedor 4 (ID 5)
(5, 'Samsung 990 PRO 2TB', 'samsung-990-pro-2tb', 'SSD NVMe Gen4 con velocidades de hasta 7,450 MB/s', 'SSD-SAM-2TB', 249.99, 25, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', TRUE),
(5, 'WD Black SN850X 4TB', 'wd-black-sn850x-4tb', 'SSD NVMe Gen4 de alta capacidad para profesionales', 'SSD-WD-4TB', 449.99, 15, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', TRUE),

-- Productos del proveedor 5 (ID 6)
(6, 'ASUS ROG Strix X670E', 'asus-rog-strix-x670e', 'Placa madre premium con soporte PCIe 5.0 y DDR5', 'MB-ASUS-X670E', 449.99, 10, 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400', TRUE),
(6, 'MSI MPG Z790 Carbon', 'msi-mpg-z790-carbon', 'Placa madre gaming con WiFi 6E integrado', 'MB-MSI-Z790', 389.99, 14, 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400', TRUE),

-- Productos del proveedor 6 (ID 7)
(7, 'Corsair RM1000x', 'corsair-rm1000x', 'Fuente modular 1000W 80+ Gold, totalmente silenciosa', 'PSU-COR-1000W', 189.99, 22, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', TRUE),
(7, 'EVGA SuperNOVA 850W', 'evga-supernova-850w', 'Fuente 850W 80+ Platinum con garantía de 10 años', 'PSU-EVGA-850W', 149.99, 28, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', TRUE);

-- ============================================
-- DATOS: RELACIÓN PRODUCTOS-CATEGORÍAS
-- ============================================

INSERT INTO product_categories (product_id, category_id) VALUES
-- Procesadores (categoría 4)
(1, 4), (2, 4),
-- GPUs (categoría 5)
(3, 5), (4, 5),
-- RAM (categoría 6)
(5, 6), (6, 6),
-- Almacenamiento (categoría 7)
(7, 7), (8, 7),
-- Placas Madre (categoría 8)
(9, 8), (10, 8),
-- Fuentes (categoría 9)
(11, 9), (12, 9);

-- ============================================
-- DATOS: KITS
-- ============================================

INSERT INTO kits (provider_id, name, slug, description, price, status, image_url) VALUES
(2, 'Kit Gaming Extremo', 'kit-gaming-extremo', 'Configuración tope de gama para gaming 4K y streaming profesional', 3299.99, 'ACTIVE', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800'),
(3, 'Kit Workstation Pro', 'kit-workstation-pro', 'Ideal para edición de video, renderizado 3D y desarrollo', 2199.99, 'ACTIVE', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800'),
(4, 'Kit Streamer Starter', 'kit-streamer-starter', 'Todo lo necesario para comenzar tu carrera como streamer', 999.99, 'ACTIVE', 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800');

-- ============================================
-- DATOS: ITEMS DE KITS
-- ============================================

INSERT INTO kit_items (kit_id, product_id, quantity) VALUES
-- Kit Gaming Extremo
(1, 1, 1), -- Ryzen 9
(1, 3, 1), -- RTX 4090
(1, 5, 1), -- RAM 32GB
(1, 7, 1), -- SSD 2TB
-- Kit Workstation Pro
(2, 2, 1), -- Intel i9
(2, 4, 1), -- RX 7900 XTX
(2, 6, 1), -- RAM 64GB
-- Kit Streamer
(3, 1, 1), -- Ryzen 9
(3, 5, 1), -- RAM 32GB
(3, 7, 1); -- SSD 2TB

-- ============================================
-- DATOS: ÓRDENES
-- ============================================

INSERT INTO orders (user_id, status, total_amount, shipping_address, shipping_city, shipping_phone) VALUES
(12, 'DELIVERED', 2299.98, 'Calle 123 #45-67', 'Bogotá', '555-1001'),
(13, 'SHIPPED', 3299.99, 'Carrera 7 #89-12', 'Medellín', '555-1002'),
(14, 'PROCESSING', 569.97, 'Avenida 15 #23-45', 'Cali', '555-1003'),
(15, 'PAID', 2199.99, 'Calle 50 #12-34', 'Barranquilla', '555-1004'),
(16, 'CREATED', 639.98, 'Carrera 10 #56-78', 'Cartagena', '555-1005');

-- ============================================
-- DATOS: ITEMS DE ÓRDENES
-- ============================================

INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
-- Orden 1
(1, 1, 1, 699.99, 699.99),
(1, 3, 1, 1599.99, 1599.99),
-- Orden 2 (Kit completo)
(2, 1, 1, 3299.99, 3299.99),
-- Orden 3
(3, 5, 2, 159.99, 319.98),
(3, 7, 1, 249.99, 249.99),
-- Orden 4
(4, 2, 1, 2199.99, 2199.99),
-- Orden 5
(5, 9, 1, 449.99, 449.99),
(5, 11, 1, 189.99, 189.99);

-- ============================================
-- DATOS: AUDIT LOG
-- ============================================

INSERT INTO audit_logs (user_id, action, entity, entity_id, details) VALUES
(1, 'CREATE', 'DATABASE', NULL, 'Base de datos inicializada con datos completos'),
(1, 'SEED', 'USERS', NULL, '31 usuarios creados (1 admin, 10 proveedores, 20 clientes)'),
(1, 'SEED', 'PRODUCTS', NULL, '12 productos creados'),
(1, 'SEED', 'KITS', NULL, '3 kits creados'),
(1, 'SEED', 'ORDERS', NULL, '5 órdenes creadas');

-- ============================================
-- RESUMEN FINAL
-- ============================================

SELECT '============================================' AS '';
SELECT 'BASE DE DATOS MIKITECH - INSTALACIÓN COMPLETA' AS '';
SELECT '============================================' AS '';
SELECT CONCAT('✓ Total Usuarios: ', COUNT(*)) AS resultado FROM users;
SELECT CONCAT('  - Administradores: ', COUNT(*)) AS resultado FROM users WHERE role = 'ADMIN';
SELECT CONCAT('  - Proveedores: ', COUNT(*)) AS resultado FROM users WHERE role = 'PROVIDER';
SELECT CONCAT('  - Clientes: ', COUNT(*)) AS resultado FROM users WHERE role = 'USER';
SELECT CONCAT('✓ Total Productos: ', COUNT(*)) AS resultado FROM products;
SELECT CONCAT('✓ Total Categorías: ', COUNT(*)) AS resultado FROM categories;
SELECT CONCAT('✓ Total Kits: ', COUNT(*)) AS resultado FROM kits;
SELECT CONCAT('✓ Total Órdenes: ', COUNT(*)) AS resultado FROM orders;
SELECT '============================================' AS '';
SELECT '✓ Base de datos lista para usar!' AS '';
SELECT '============================================' AS '';
SELECT '' AS '';
SELECT 'CREDENCIALES DE ACCESO:' AS '';
SELECT '  Admin: admin@mikitech.com / password: admin123' AS '';
SELECT '  Proveedor: proveedor1@mikitech.com / password: proveedor123' AS '';
SELECT '  Cliente: juan.perez@email.com / password: cliente123' AS '';
SELECT '' AS '';
SELECT 'PRÓXIMO PASO: Iniciar el servidor backend con: npm run server' AS '';
