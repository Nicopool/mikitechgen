-- Mikitech Database Seed Data
-- Run this after schema.sql to populate with demo data
USE mikitech;

-- Insert 10 Vendors
INSERT INTO profiles (id, email, name, role, status) VALUES
('vendor-001', 'proveedor1@mikitech.com', 'Tech Solutions Pro', 'VENDOR', 'ACTIVE'),
('vendor-002', 'proveedor2@mikitech.com', 'Gaming Hardware Store', 'VENDOR', 'ACTIVE'),
('vendor-003', 'proveedor3@mikitech.com', 'PC Components Plus', 'VENDOR', 'ACTIVE'),
('vendor-004', 'proveedor4@mikitech.com', 'Elite Tech Supplies', 'VENDOR', 'ACTIVE'),
('vendor-005', 'proveedor5@mikitech.com', 'Digital Parts Hub', 'VENDOR', 'ACTIVE'),
('vendor-006', 'proveedor6@mikitech.com', 'Pro Gamer Shop', 'VENDOR', 'ACTIVE'),
('vendor-007', 'proveedor7@mikitech.com', 'Hardware Masters', 'VENDOR', 'ACTIVE'),
('vendor-008', 'proveedor8@mikitech.com', 'Tech Warehouse', 'VENDOR', 'ACTIVE'),
('vendor-009', 'proveedor9@mikitech.com', 'Component Central', 'VENDOR', 'ACTIVE'),
('vendor-010', 'proveedor10@mikitech.com', 'Digital Gear Store', 'VENDOR', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert 20 Users
INSERT INTO profiles (id, email, name, role, status) VALUES
('user-001', 'juan.perez@email.com', 'Juan Pérez', 'USER', 'ACTIVE'),
('user-002', 'maria.gonzalez@email.com', 'María González', 'USER', 'ACTIVE'),
('user-003', 'carlos.rodriguez@email.com', 'Carlos Rodríguez', 'USER', 'ACTIVE'),
('user-004', 'ana.martinez@email.com', 'Ana Martínez', 'USER', 'ACTIVE'),
('user-005', 'luis.garcia@email.com', 'Luis García', 'USER', 'ACTIVE'),
('user-006', 'sofia.lopez@email.com', 'Sofía López', 'USER', 'ACTIVE'),
('user-007', 'diego.hernandez@email.com', 'Diego Hernández', 'USER', 'ACTIVE'),
('user-008', 'valentina.diaz@email.com', 'Valentina Díaz', 'USER', 'ACTIVE'),
('user-009', 'miguel.sanchez@email.com', 'Miguel Sánchez', 'USER', 'ACTIVE'),
('user-010', 'camila.ramirez@email.com', 'Camila Ramírez', 'USER', 'ACTIVE'),
('user-011', 'sebastian.torres@email.com', 'Sebastián Torres', 'USER', 'ACTIVE'),
('user-012', 'isabella.flores@email.com', 'Isabella Flores', 'USER', 'ACTIVE'),
('user-013', 'mateo.rivera@email.com', 'Mateo Rivera', 'USER', 'ACTIVE'),
('user-014', 'lucia.gomez@email.com', 'Lucía Gómez', 'USER', 'ACTIVE'),
('user-015', 'daniel.castro@email.com', 'Daniel Castro', 'USER', 'ACTIVE'),
('user-016', 'martina.morales@email.com', 'Martina Morales', 'USER', 'ACTIVE'),
('user-017', 'alejandro.ortiz@email.com', 'Alejandro Ortiz', 'USER', 'ACTIVE'),
('user-018', 'paula.ruiz@email.com', 'Paula Ruiz', 'USER', 'ACTIVE'),
('user-019', 'nicolas.mendez@email.com', 'Nicolás Méndez', 'USER', 'ACTIVE'),
('user-020', 'emma.vargas@email.com', 'Emma Vargas', 'USER', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Products from different vendors
INSERT INTO products (id, name, sku, price, stock, category, image, status, vendor_id, vendor_name, description) VALUES
-- Vendor 1 Products
('prod-001', 'AMD Ryzen 9 7950X', 'CPU-AMD-7950X', 699.99, 15, 'Procesadores', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', 'ACTIVE', 'vendor-001', 'Tech Solutions Pro', 'Procesador de 16 núcleos y 32 hilos, ideal para gaming y productividad extrema.'),
('prod-002', 'Intel Core i9-14900K', 'CPU-INT-14900K', 589.99, 20, 'Procesadores', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', 'ACTIVE', 'vendor-001', 'Tech Solutions Pro', 'Procesador de 24 núcleos con tecnología Raptor Lake.'),

-- Vendor 2 Products
('prod-003', 'NVIDIA RTX 4090', 'GPU-NV-4090', 1599.99, 8, 'Tarjetas Gráficas', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', 'ACTIVE', 'vendor-002', 'Gaming Hardware Store', 'La tarjeta gráfica más potente del mercado, 24GB GDDR6X.'),
('prod-004', 'AMD Radeon RX 7900 XTX', 'GPU-AMD-7900XTX', 999.99, 12, 'Tarjetas Gráficas', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', 'ACTIVE', 'vendor-002', 'Gaming Hardware Store', 'GPU de alto rendimiento con 24GB GDDR6.'),

-- Vendor 3 Products
('prod-005', 'Corsair Vengeance RGB 32GB', 'RAM-COR-32GB', 159.99, 30, 'Memorias RAM', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', 'ACTIVE', 'vendor-003', 'PC Components Plus', 'Kit de 2x16GB DDR5 6000MHz con iluminación RGB.'),
('prod-006', 'G.Skill Trident Z5 64GB', 'RAM-GSK-64GB', 299.99, 18, 'Memorias RAM', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', 'ACTIVE', 'vendor-003', 'PC Components Plus', 'Kit de 2x32GB DDR5 7200MHz para máximo rendimiento.'),

-- Vendor 4 Products
('prod-007', 'Samsung 990 PRO 2TB', 'SSD-SAM-2TB', 249.99, 25, 'Almacenamiento', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', 'ACTIVE', 'vendor-004', 'Elite Tech Supplies', 'SSD NVMe Gen4 con velocidades de hasta 7,450 MB/s.'),
('prod-008', 'WD Black SN850X 4TB', 'SSD-WD-4TB', 449.99, 15, 'Almacenamiento', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', 'ACTIVE', 'vendor-004', 'Elite Tech Supplies', 'SSD NVMe Gen4 de alta capacidad para profesionales.'),

-- Vendor 5 Products
('prod-009', 'ASUS ROG Strix X670E', 'MB-ASUS-X670E', 449.99, 10, 'Placas Madre', 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400', 'ACTIVE', 'vendor-005', 'Digital Parts Hub', 'Placa madre premium con soporte PCIe 5.0 y DDR5.'),
('prod-010', 'MSI MPG Z790 Carbon', 'MB-MSI-Z790', 389.99, 14, 'Placas Madre', 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400', 'ACTIVE', 'vendor-005', 'Digital Parts Hub', 'Placa madre gaming con WiFi 6E integrado.'),

-- Vendor 6 Products
('prod-011', 'Corsair RM1000x', 'PSU-COR-1000W', 189.99, 22, 'Fuentes de Poder', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 'ACTIVE', 'vendor-006', 'Pro Gamer Shop', 'Fuente modular 1000W 80+ Gold, totalmente silenciosa.'),
('prod-012', 'EVGA SuperNOVA 850W', 'PSU-EVGA-850W', 149.99, 28, 'Fuentes de Poder', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 'ACTIVE', 'vendor-006', 'Pro Gamer Shop', 'Fuente 850W 80+ Platinum con garantía de 10 años.'),

-- More products from other vendors
('prod-013', 'AMD Ryzen 7 7800X3D', 'CPU-AMD-7800X3D', 449.99, 18, 'Procesadores', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', 'ACTIVE', 'vendor-007', 'Hardware Masters', 'Procesador gaming con 3D V-Cache para máximo rendimiento.'),
('prod-014', 'NVIDIA RTX 4070 Ti', 'GPU-NV-4070TI', 799.99, 16, 'Tarjetas Gráficas', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', 'ACTIVE', 'vendor-008', 'Tech Warehouse', 'GPU de gama alta para gaming 1440p y 4K.'),
('prod-015', 'Kingston Fury Beast 16GB', 'RAM-KNG-16GB', 79.99, 40, 'Memorias RAM', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', 'ACTIVE', 'vendor-009', 'Component Central', 'Kit de 2x8GB DDR4 3200MHz con disipador de calor.'),
('prod-016', 'Crucial P5 Plus 1TB', 'SSD-CRU-1TB', 129.99, 35, 'Almacenamiento', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', 'ACTIVE', 'vendor-010', 'Digital Gear Store', 'SSD NVMe Gen4 con excelente relación precio-rendimiento.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Kits
INSERT INTO kits (id, name, description, price, original_price, image, status, vendor_id, category) VALUES
('kit-001', 'Kit Gaming Extremo', 'Configuración tope de gama para gaming 4K y streaming profesional.', 3299.99, 3549.93, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800', 'ACTIVE', 'vendor-001', 'Gaming PC'),
('kit-002', 'Kit Workstation Pro', 'Ideal para edición de video, renderizado 3D y desarrollo.', 2199.99, 2339.96, 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800', 'ACTIVE', 'vendor-002', 'Workstation'),
('kit-003', 'Kit Streamer Starter', 'Todo lo necesario para comenzar tu carrera como streamer.', 999.99, 1099.97, 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800', 'ACTIVE', 'vendor-003', 'Streaming'),
('kit-004', 'Kit Office Premium', 'Configuración perfecta para productividad y multitarea.', 1499.99, 1649.95, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800', 'ACTIVE', 'vendor-004', 'Office'),
('kit-005', 'Kit Budget Gaming', 'Gaming 1080p de calidad sin romper el banco.', 799.99, 899.95, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800', 'ACTIVE', 'vendor-005', 'Gaming PC')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Kit Products relationships
INSERT INTO kit_products (kit_id, product_id, quantity) VALUES
-- Kit Gaming Extremo
('kit-001', 'prod-001', 1),
('kit-001', 'prod-003', 1),
('kit-001', 'prod-005', 1),
('kit-001', 'prod-007', 1),
('kit-001', 'prod-009', 1),
('kit-001', 'prod-011', 1),

-- Kit Workstation Pro
('kit-002', 'prod-002', 1),
('kit-002', 'prod-004', 1),
('kit-002', 'prod-006', 1),
('kit-002', 'prod-008', 1),

-- Kit Streamer Starter
('kit-003', 'prod-013', 1),
('kit-003', 'prod-005', 1),
('kit-003', 'prod-007', 1),

-- Kit Office Premium
('kit-004', 'prod-002', 1),
('kit-004', 'prod-015', 2),
('kit-004', 'prod-016', 1),

-- Kit Budget Gaming
('kit-005', 'prod-013', 1),
('kit-005', 'prod-014', 1),
('kit-005', 'prod-015', 1)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);

-- Insert Sample Orders
INSERT INTO orders (id, user_id, user_name, user_email, total_amount, status, created_at) VALUES
('order-001', 'user-001', 'Juan Pérez', 'juan.perez@email.com', 2299.98, 'COMPLETED', '2024-01-10 10:30:00'),
('order-002', 'user-002', 'María González', 'maria.gonzalez@email.com', 3299.99, 'SHIPPED', '2024-01-15 09:15:00'),
('order-003', 'user-003', 'Carlos Rodríguez', 'carlos.rodriguez@email.com', 569.97, 'COMPLETED', '2024-01-14 16:45:00'),
('order-004', 'user-004', 'Ana Martínez', 'ana.martinez@email.com', 2199.99, 'PROCESSING', '2024-01-16 07:00:00'),
('order-005', 'user-005', 'Luis García', 'luis.garcia@email.com', 639.98, 'PENDING', '2024-01-16 11:20:00'),
('order-006', 'user-006', 'Sofía López', 'sofia.lopez@email.com', 999.99, 'COMPLETED', '2024-01-12 14:30:00'),
('order-007', 'user-007', 'Diego Hernández', 'diego.hernandez@email.com', 1499.99, 'SHIPPED', '2024-01-15 16:00:00'),
('order-008', 'user-008', 'Valentina Díaz', 'valentina.diaz@email.com', 799.99, 'COMPLETED', '2024-01-11 09:45:00')
ON DUPLICATE KEY UPDATE total_amount=VALUES(total_amount);

-- Insert Order Items
INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES
-- Order 1
('order-001', 'prod-001', 'AMD Ryzen 9 7950X', 1, 699.99),
('order-001', 'prod-003', 'NVIDIA RTX 4090', 1, 1599.99),

-- Order 2
('order-002', NULL, 'Kit Gaming Extremo', 1, 3299.99),

-- Order 3
('order-003', 'prod-005', 'Corsair Vengeance RGB 32GB', 2, 159.99),
('order-003', 'prod-007', 'Samsung 990 PRO 2TB', 1, 249.99),

-- Order 4
('order-004', NULL, 'Kit Workstation Pro', 1, 2199.99),

-- Order 5
('order-005', 'prod-009', 'ASUS ROG Strix X670E', 1, 449.99),
('order-005', 'prod-011', 'Corsair RM1000x', 1, 189.99),

-- Order 6
('order-006', NULL, 'Kit Streamer Starter', 1, 999.99),

-- Order 7
('order-007', NULL, 'Kit Office Premium', 1, 1499.99),

-- Order 8
('order-008', NULL, 'Kit Budget Gaming', 1, 799.99)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);
