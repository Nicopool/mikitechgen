-- SCRIPT DE POBLACIÓN DE DATOS PARA KITECH (VERSIÓN CORREGIDA)
-- Agrega 30 usuarios, productos, kits y órdenes de ejemplo

USE kitech;

-- ==========================================
-- PASO 1: INSERTAR 10 PROVEEDORES
-- ==========================================
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
('Digital Gear', 'Store', 'proveedor10@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0110')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ==========================================
-- PASO 2: INSERTAR 20 USUARIOS CLIENTES
-- ==========================================
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
('Emma', 'Vargas', 'emma.vargas@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1020')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ==========================================
-- PASO 3: AGREGAR MÁS CATEGORÍAS
-- ==========================================
INSERT INTO categories (name, slug, active) VALUES
('Procesadores', 'procesadores', TRUE),
('Tarjetas Gráficas', 'tarjetas-graficas', TRUE),
('Memorias RAM', 'memorias-ram', TRUE),
('Almacenamiento', 'almacenamiento', TRUE),
('Placas Madre', 'placas-madre', TRUE),
('Fuentes de Poder', 'fuentes-de-poder', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ==========================================
-- PASO 4: OBTENER ID DEL PRIMER PROVEEDOR
-- ==========================================
SET @proveedor1 = (SELECT id FROM users WHERE email = 'proveedor1@mikitech.com' LIMIT 1);
SET @proveedor2 = (SELECT id FROM users WHERE email = 'proveedor2@mikitech.com' LIMIT 1);
SET @proveedor3 = (SELECT id FROM users WHERE email = 'proveedor3@mikitech.com' LIMIT 1);

-- ==========================================
-- PASO 5: AGREGAR PRODUCTOS USANDO IDS REALES
-- ==========================================
INSERT INTO products (provider_id, name, slug, description, sku, price, stock, image_url, active) VALUES
-- Proveedor 1
(@proveedor1, 'AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', 'Procesador de 16 núcleos y 32 hilos', 'CPU-AMD-7950X', 699.99, 15, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', TRUE),
(@proveedor1, 'Intel Core i9-14900K', 'intel-core-i9-14900k', 'Procesador de 24 núcleos Raptor Lake', 'CPU-INT-14900K', 589.99, 20, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', TRUE),

-- Proveedor 2
(@proveedor2, 'NVIDIA RTX 4090', 'nvidia-rtx-4090', 'GPU 24GB GDDR6X', 'GPU-NV-4090', 1599.99, 8, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', TRUE),
(@proveedor2, 'AMD Radeon RX 7900 XTX', 'amd-radeon-rx-7900-xtx', 'GPU 24GB GDDR6', 'GPU-AMD-7900XTX', 999.99, 12, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', TRUE),

-- Proveedor 3
(@proveedor3, 'Corsair Vengeance RGB 32GB', 'corsair-vengeance-rgb-32gb', 'Kit 2x16GB DDR5 6000MHz', 'RAM-COR-32GB', 159.99, 30, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', TRUE),
(@proveedor3, 'G.Skill Trident Z5 64GB', 'gskill-trident-z5-64gb', 'Kit 2x32GB DDR5 7200MHz', 'RAM-GSK-64GB', 299.99, 18, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', TRUE)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ==========================================
-- VERIFICACIÓN FINAL
-- ==========================================
SELECT '========================================' AS '';
SELECT 'RESUMEN DE DATOS INSERTADOS:' AS '';
SELECT '========================================' AS '';
SELECT CONCAT('Total Usuarios: ', COUNT(*)) AS resultado FROM users;
SELECT CONCAT('Proveedores: ', COUNT(*)) AS resultado FROM users WHERE role = 'PROVIDER';
SELECT CONCAT('Clientes: ', COUNT(*)) AS resultado FROM users WHERE role = 'USER';
SELECT CONCAT('Administradores: ', COUNT(*)) AS resultado FROM users WHERE role = 'ADMIN';
SELECT CONCAT('Total Productos: ', COUNT(*)) AS resultado FROM products;
SELECT CONCAT('Total Categorías: ', COUNT(*)) AS resultado FROM categories;
SELECT '========================================' AS '';
SELECT '✓ Datos insertados correctamente!' AS '';
SELECT '========================================' AS '';
