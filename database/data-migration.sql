-- DATOS GENERADOS DESDE MYSQL PARA SUPABASE
-- Fecha: 2026-01-16T22:20:29.690Z

-- USUARIOS (31)
INSERT INTO users (id, first_name, last_name, email, password, role, enabled, phone, created_at, updated_at) VALUES
(1, 'Admin', 'System', 'admin@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'ADMIN', TRUE, NULL, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(2, 'Tech Solutions', 'Pro', 'proveedor1@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0101', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(3, 'Gaming Hardware', 'Store', 'proveedor2@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0102', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(4, 'PC Components', 'Plus', 'proveedor3@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0103', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(5, 'Elite Tech', 'Supplies', 'proveedor4@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0104', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(6, 'Digital Parts', 'Hub', 'proveedor5@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0105', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(7, 'Pro Gamer', 'Shop', 'proveedor6@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0106', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(8, 'Hardware', 'Masters', 'proveedor7@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0107', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(9, 'Tech', 'Warehouse', 'proveedor8@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0108', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(10, 'Component', 'Central', 'proveedor9@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0109', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(11, 'Digital Gear', 'Store', 'proveedor10@mikitech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'PROVIDER', TRUE, '555-0110', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(12, 'Juan', 'Pérez', 'juan.perez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1001', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(13, 'María', 'González', 'maria.gonzalez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1002', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(14, 'Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1003', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(15, 'Ana', 'Martínez', 'ana.martinez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1004', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(16, 'Luis', 'García', 'luis.garcia@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1005', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(17, 'Sofía', 'López', 'sofia.lopez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1006', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(18, 'Diego', 'Hernández', 'diego.hernandez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1007', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(19, 'Valentina', 'Díaz', 'valentina.diaz@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1008', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(20, 'Miguel', 'Sánchez', 'miguel.sanchez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1009', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(21, 'Camila', 'Ramírez', 'camila.ramirez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1010', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(22, 'Sebastián', 'Torres', 'sebastian.torres@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1011', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(23, 'Isabella', 'Flores', 'isabella.flores@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1012', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(24, 'Mateo', 'Rivera', 'mateo.rivera@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1013', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(25, 'Lucía', 'Gómez', 'lucia.gomez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1014', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(26, 'Daniel', 'Castro', 'daniel.castro@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1015', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(27, 'Martina', 'Morales', 'martina.morales@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1016', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(28, 'Alejandro', 'Ortiz', 'alejandro.ortiz@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1017', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(29, 'Paula', 'Ruiz', 'paula.ruiz@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1018', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(30, 'Nicolás', 'Méndez', 'nicolas.mendez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1019', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(31, 'Emma', 'Vargas', 'emma.vargas@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj2De', 'USER', TRUE, '555-1020', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z')
ON CONFLICT (email) DO NOTHING;

-- CATEGORÍAS (9)
INSERT INTO categories (id, name, slug, active, created_at) VALUES
(1, 'Computadores', 'computadores', TRUE, '2026-01-16T12:40:51.000Z'),
(2, 'Periféricos', 'perifericos', TRUE, '2026-01-16T12:40:51.000Z'),
(3, 'Componentes', 'componentes', TRUE, '2026-01-16T12:40:51.000Z'),
(4, 'Procesadores', 'procesadores', TRUE, '2026-01-16T12:40:51.000Z'),
(5, 'Tarjetas Gráficas', 'tarjetas-graficas', TRUE, '2026-01-16T12:40:51.000Z'),
(6, 'Memorias RAM', 'memorias-ram', TRUE, '2026-01-16T12:40:51.000Z'),
(7, 'Almacenamiento', 'almacenamiento', TRUE, '2026-01-16T12:40:51.000Z'),
(8, 'Placas Madre', 'placas-madre', TRUE, '2026-01-16T12:40:51.000Z'),
(9, 'Fuentes de Poder', 'fuentes-de-poder', TRUE, '2026-01-16T12:40:51.000Z')
ON CONFLICT (slug) DO NOTHING;

-- PRODUCTOS (12)
INSERT INTO products (id, provider_id, name, slug, description, sku, price, stock, image_url, active, created_at, updated_at) VALUES
(1, 2, 'AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', 'Procesador de 16 núcleos y 32 hilos, ideal para gaming y productividad extrema', 'CPU-AMD-7950X', 699.99, 15, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(2, 2, 'Intel Core i9-14900K', 'intel-core-i9-14900k', 'Procesador de 24 núcleos con tecnología Raptor Lake', 'CPU-INT-14900K', 589.99, 20, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(3, 3, 'NVIDIA RTX 4090', 'nvidia-rtx-4090', 'La tarjeta gráfica más potente del mercado, 24GB GDDR6X', 'GPU-NV-4090', 1599.99, 8, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(4, 3, 'AMD Radeon RX 7900 XTX', 'amd-radeon-rx-7900-xtx', 'GPU de alto rendimiento con 24GB GDDR6', 'GPU-AMD-7900XTX', 999.99, 12, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(5, 4, 'Corsair Vengeance RGB 32GB', 'corsair-vengeance-rgb-32gb', 'Kit de 2x16GB DDR5 6000MHz con iluminación RGB', 'RAM-COR-32GB', 159.99, 30, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(6, 4, 'G.Skill Trident Z5 64GB', 'gskill-trident-z5-64gb', 'Kit de 2x32GB DDR5 7200MHz para máximo rendimiento', 'RAM-GSK-64GB', 299.99, 18, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(7, 5, 'Samsung 990 PRO 2TB', 'samsung-990-pro-2tb', 'SSD NVMe Gen4 con velocidades de hasta 7,450 MB/s', 'SSD-SAM-2TB', 249.99, 25, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(8, 5, 'WD Black SN850X 4TB', 'wd-black-sn850x-4tb', 'SSD NVMe Gen4 de alta capacidad para profesionales', 'SSD-WD-4TB', 449.99, 15, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(9, 6, 'ASUS ROG Strix X670E', 'asus-rog-strix-x670e', 'Placa madre premium con soporte PCIe 5.0 y DDR5', 'MB-ASUS-X670E', 449.99, 10, 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(10, 6, 'MSI MPG Z790 Carbon', 'msi-mpg-z790-carbon', 'Placa madre gaming con WiFi 6E integrado', 'MB-MSI-Z790', 389.99, 14, 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(11, 7, 'Corsair RM1000x', 'corsair-rm1000x', 'Fuente modular 1000W 80+ Gold, totalmente silenciosa', 'PSU-COR-1000W', 189.99, 22, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(12, 7, 'EVGA SuperNOVA 850W', 'evga-supernova-850w', 'Fuente 850W 80+ Platinum con garantía de 10 años', 'PSU-EVGA-850W', 149.99, 28, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', TRUE, '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z')
ON CONFLICT (sku) DO NOTHING;

-- RELACIONES (12)
INSERT INTO product_categories (product_id, category_id) VALUES
(1, 4),
(2, 4),
(3, 5),
(4, 5),
(5, 6),
(6, 6),
(7, 7),
(8, 7),
(9, 8),
(10, 8),
(11, 9),
(12, 9)
ON CONFLICT DO NOTHING;

-- KITS (3)
INSERT INTO kits (id, provider_id, name, slug, description, price, status, image_url, created_at, updated_at) VALUES
(1, 2, 'Kit Gaming Extremo', 'kit-gaming-extremo', 'Configuración tope de gama para gaming 4K y streaming profesional', 3299.99, 'ACTIVE', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(2, 3, 'Kit Workstation Pro', 'kit-workstation-pro', 'Ideal para edición de video, renderizado 3D y desarrollo', 2199.99, 'ACTIVE', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(3, 4, 'Kit Streamer Starter', 'kit-streamer-starter', 'Todo lo necesario para comenzar tu carrera como streamer', 999.99, 'ACTIVE', 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z')
ON CONFLICT (slug) DO NOTHING;

-- KIT ITEMS (10)
INSERT INTO kit_items (id, kit_id, product_id, quantity) VALUES
(1, 1, 1, 1),
(2, 1, 3, 1),
(3, 1, 5, 1),
(4, 1, 7, 1),
(5, 2, 2, 1),
(6, 2, 4, 1),
(7, 2, 6, 1),
(8, 3, 1, 1),
(9, 3, 5, 1),
(10, 3, 7, 1)
ON CONFLICT DO NOTHING;

-- ÓRDENES (5)
INSERT INTO orders (id, user_id, status, total_amount, shipping_address, shipping_city, shipping_phone, created_at, updated_at) VALUES
(1, 12, 'DELIVERED', 2299.98, 'Calle 123 #45-67', 'Bogotá', '555-1001', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(2, 13, 'SHIPPED', 3299.99, 'Carrera 7 #89-12', 'Medellín', '555-1002', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(3, 14, 'PROCESSING', 569.97, 'Avenida 15 #23-45', 'Cali', '555-1003', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(4, 15, 'PAID', 2199.99, 'Calle 50 #12-34', 'Barranquilla', '555-1004', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z'),
(5, 16, 'CREATED', 639.98, 'Carrera 10 #56-78', 'Cartagena', '555-1005', '2026-01-16T12:40:51.000Z', '2026-01-16T12:40:51.000Z')
ON CONFLICT DO NOTHING;

-- ORDER ITEMS (8)
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal, created_at) VALUES
(1, 1, 1, 1, 699.99, 699.99, '2026-01-16T12:40:51.000Z'),
(2, 1, 3, 1, 1599.99, 1599.99, '2026-01-16T12:40:51.000Z'),
(3, 2, 1, 1, 3299.99, 3299.99, '2026-01-16T12:40:51.000Z'),
(4, 3, 5, 2, 159.99, 319.98, '2026-01-16T12:40:51.000Z'),
(5, 3, 7, 1, 249.99, 249.99, '2026-01-16T12:40:51.000Z'),
(6, 4, 2, 1, 2199.99, 2199.99, '2026-01-16T12:40:51.000Z'),
(7, 5, 9, 1, 449.99, 449.99, '2026-01-16T12:40:51.000Z'),
(8, 5, 11, 1, 189.99, 189.99, '2026-01-16T12:40:51.000Z')
ON CONFLICT DO NOTHING;

