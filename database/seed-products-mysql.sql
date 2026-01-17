-- Seed de Productos para Mikitech MySQL Database
-- Ejecutar después de que la base de datos esté creada
-- Este script inserta productos de muestra para probar el CRUD

USE kitech;

-- Verificar que existen proveedores
-- Si no hay proveedores, se necesita ejecutar primero
-- SELECT id FROM users WHERE role = 'PROVIDER' LIMIT 1;

-- Crear categorías si no existen
INSERT IGNORE INTO categories (name, slug, active) VALUES
('Componentes', 'componentes', 1),
('Periféricos', 'perifericos', 1),
('Audio', 'audio', 1),
('Monitores', 'monitores', 1),
('Almacenamiento', 'almacenamiento', 1),
('Networking', 'networking', 1),
('Procesadores', 'procesadores', 1),
('Tarjetas Gráficas', 'tarjetas-graficas', 1),
('Memorias RAM', 'memorias-ram', 1),
('Placas Madre', 'placas-madre', 1),
('Fuentes de Poder', 'fuentes-de-poder', 1),
('Refrigeración', 'refrigeracion', 1);

-- Obtener el ID del primer proveedor disponible
SET @provider_id = (SELECT id FROM users WHERE role = 'PROVIDER' LIMIT 1);

-- PRODUCTOS DE EJEMPLO
-- Procesadores
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', 'CPU-AMD-7950X', 699.99, 15, 'Procesador de 16 núcleos y 32 hilos, ideal para gaming y productividad extrema. Frecuencia base de 4.5GHz.', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', 1, @provider_id),
('Intel Core i9-14900K', 'intel-core-i9-14900k', 'CPU-INT-14900K', 589.99, 20, 'Procesador de 24 núcleos con tecnología Raptor Lake. Ideal para gaming extremo y creación de contenido.', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', 1, @provider_id),
('AMD Ryzen 7 7800X3D', 'amd-ryzen-7-7800x3d', 'CPU-AMD-7800X3D', 449.99, 18, 'Procesador gaming con 3D V-Cache para máximo rendimiento en juegos. 8 núcleos y 16 hilos.', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', 1, @provider_id),
('Intel Core i5-14600K', 'intel-core-i5-14600k', 'CPU-INT-14600K', 319.99, 25, 'Excelente procesador mid-range con 14 núcleos. Perfecto para gaming 1440p.', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', 1, @provider_id);

-- Tarjetas Gráficas
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('NVIDIA RTX 4090', 'nvidia-rtx-4090', 'GPU-NV-4090', 1599.99, 8, 'La tarjeta gráfica más potente del mercado. 24GB GDDR6X, perfecta para gaming 4K y ray tracing.', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', 1, @provider_id),
('AMD Radeon RX 7900 XTX', 'amd-radeon-rx-7900-xtx', 'GPU-AMD-7900XTX', 999.99, 12, 'GPU de alto rendimiento con 24GB GDDR6. Excelente para gaming 4K y aplicaciones profesionales.', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', 1, @provider_id),
('NVIDIA RTX 4070 Ti', 'nvidia-rtx-4070-ti', 'GPU-NV-4070TI', 799.99, 16, 'GPU de gama alta para gaming 1440p y 4K. 12GB GDDR6X con DLSS 3.', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', 1, @provider_id),
('AMD Radeon RX 7800 XT', 'amd-radeon-rx-7800-xt', 'GPU-AMD-7800XT', 549.99, 20, 'Tarjeta gráfica perfecta para gaming 1440p de alta calidad. 16GB GDDR6.', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400', 1, @provider_id);

-- Memorias RAM
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('Corsair Vengeance RGB 32GB', 'corsair-vengeance-rgb-32gb', 'RAM-COR-32GB', 159.99, 30, 'Kit de 2x16GB DDR5 6000MHz con iluminación RGB dinámica. Ideal para gaming y multitarea.', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', 1, @provider_id),
('G.Skill Trident Z5 64GB', 'gskill-trident-z5-64gb', 'RAM-GSK-64GB', 299.99, 18, 'Kit de 2x32GB DDR5 7200MHz para máximo rendimiento. Perfecto para workstations.', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', 1, @provider_id),
('Kingston Fury Beast 16GB', 'kingston-fury-beast-16gb', 'RAM-KNG-16GB', 79.99, 40, 'Kit de 2x8GB DDR4 3200MHz con disipador de calor. Excelente calidad-precio.', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', 1, @provider_id),
('Corsair Dominator Platinum RGB 32GB', 'corsair-dominator-platinum-32gb', 'RAM-COR-DOM-32GB', 239.99, 22, 'RAM premium DDR5 6400MHz con iluminación RGB CAPELLIX. 2x16GB.', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', 1, @provider_id);

-- Almacenamiento
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('Samsung 990 PRO 2TB', 'samsung-990-pro-2tb', 'SSD-SAM-2TB', 249.99, 25, 'SSD NVMe Gen4 con velocidades de hasta 7,450 MB/s. Ideal para gaming y creación de contenido.', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', 1, @provider_id),
('WD Black SN850X 4TB', 'wd-black-sn850x-4tb', 'SSD-WD-4TB', 449.99, 15, 'SSD NVMe Gen4 de alta capacidad para profesionales. Velocidades de hasta 7,300 MB/s.', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', 1, @provider_id),
('Crucial P5 Plus 1TB', 'crucial-p5-plus-1tb', 'SSD-CRU-1TB', 129.99, 35, 'SSD NVMe Gen4 con excelente relación precio-rendimiento. Hasta 6,600 MB/s.', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', 1, @provider_id),
('Kingston KC3000 2TB', 'kingston-kc3000-2tb', 'SSD-KNG-2TB', 199.99, 28, 'SSD PCIe 4.0 NVMe con tecnología 3D TLC NAND. Velocidades de hasta 7,000 MB/s.', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', 1, @provider_id);

-- Placas Madre
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('ASUS ROG Strix X670E', 'asus-rog-strix-x670e', 'MB-ASUS-X670E', 449.99, 10, 'Placa madre premium con soporte PCIe 5.0 y DDR5. Ideal para builds de alta gama.', 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400', 1, @provider_id),
('MSI MPG Z790 Carbon', 'msi-mpg-z790-carbon', 'MB-MSI-Z790', 389.99, 14, 'Placa madre gaming con WiFi 6E integrado. Soporte para Intel 13th y 14th Gen.', 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400', 1, @provider_id),
('Gigabyte B650 AORUS Elite', 'gigabyte-b650-aorus-elite', 'MB-GIG-B650', 219.99, 18, 'Excelente placa mid-range con soporte DDR5 y PCIe 4.0. Perfecta para Ryzen 7000.', 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400', 1, @provider_id),
('ASRock Z790 Taichi', 'asrock-z790-taichi', 'MB-ASR-Z790', 429.99, 12, 'Placa madre premium con diseño único. Soporte PCIe 5.0 y DDR5 hasta 7200MHz.', 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400', 1, @provider_id);

-- Fuentes de Poder
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('Corsair RM1000x', 'corsair-rm1000x', 'PSU-COR-1000W', 189.99, 22, 'Fuente modular 1000W 80+ Gold totalmente silenciosa. Garantía de 10 años.', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 1, @provider_id),
('EVGA SuperNOVA 850W', 'evga-supernova-850w', 'PSU-EVGA-850W', 149.99, 28, 'Fuente 850W 80+ Platinum con garantía de 10 años. Totalmente modular.', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 1, @provider_id),
('Seasonic Focus GX-750', 'seasonic-focus-gx-750', 'PSU-SSC-750W', 119.99, 32, 'PSU 750W 80+ Gold con certificación Cybenetics. Muy eficiente y silenciosa.', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 1, @provider_id),
('be quiet! Straight Power 11 850W', 'bequiet-straight-power-850w', 'PSU-BQ-850W', 169.99, 20, 'Fuente premium alemana 850W 80+ Platinum. Extremadamente silenciosa.', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 1, @provider_id);

-- Periféricos - Mouses
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('Logitech G Pro X Superlight', 'logitech-gpro-x-superlight', 'MOUSE-LOG-GPRO', 159.99, 35, 'Mouse gaming inalámbrico ultra ligero (63g). Sensor HERO 25K y batería de 70 horas.', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', 1, @provider_id),
('Razer DeathAdder V3 Pro', 'razer-deathadder-v3-pro', 'MOUSE-RZR-DAV3', 149.99, 40, 'Mouse ergonómico inalámbrico con sensor Focus Pro 30K. 90 horas de batería.', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', 1, @provider_id),
('SteelSeries Aerox 3 Wireless', 'steelseries-aerox-3-wireless', 'MOUSE-SS-AX3', 99.99, 45, 'Mouse ultra ligero con diseño perforado. Solo 66g con batería de 200 horas.', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', 1, @provider_id);

-- Periféricos - Teclados
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('Corsair K70 RGB TKL', 'corsair-k70-rgb-tkl', 'KB-COR-K70TKL', 169.99, 25, 'Teclado mecánico TKL con switches Cherry MX Red. RGB por tecla programable.', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', 1, @provider_id),
('Ducky One 3 SF', 'ducky-one-3-sf', 'KB-DCK-ONE3SF', 139.99, 30, 'Teclado compacto 65% con switches Cherry MX. Calidad de construcción premium.', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', 1, @provider_id),
('Keychron Q1 Pro', 'keychron-q1-pro', 'KB-KCH-Q1PRO', 199.99, 20, 'Teclado mecánico inalámbrico QMK/VIA personalizable. Construcción de aluminio.', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', 1, @provider_id);

-- Monitores
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('ASUS ROG Swift PG27AQDM', 'asus-rog-swift-pg27aqdm', 'MON-ASUS-PG27', 899.99, 12, 'Monitor OLED 27" 1440p 240Hz. Tiempo de respuesta de 0.03ms. HDR10.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', 1, @provider_id),
('LG 27GR95QE-B', 'lg-27gr95qe-b', 'MON-LG-27GR', 999.99, 10, 'Monitor OLED gaming 27" 1440p 240Hz. Cobertura DCI-P3 del 98.5%.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', 1, @provider_id),
('Samsung Odyssey G7', 'samsung-odyssey-g7', 'MON-SAM-G7', 649.99, 15, 'Monitor curvo 32" 1440p 240Hz. Pantalla QLED con HDR600.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', 1, @provider_id),
('Dell S2722DGM', 'dell-s2722dgm', 'MON-DELL-S27', 299.99, 22, 'Monitor gaming 27" 1440p 165Hz VA. Excelente relación calidad-precio.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', 1, @provider_id);

-- Audio - Headsets
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('SteelSeries Arctis Nova Pro Wireless', 'steelseries-arctis-nova-pro-wireless', 'AUD-SS-NOVA', 349.99, 18, 'Headset premium inalámbrico con estación base. Audio Hi-Res y ANC.', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400', 1, @provider_id),
('HyperX Cloud Alpha Wireless', 'hyperx-cloud-alpha-wireless', 'AUD-HX-ALPHA', 199.99, 25, 'Headset inalámbrico con 300 horas de batería. Audio DTS Headphone:X.', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400', 1, @provider_id),
('Logitech G Pro X Wireless', 'logitech-gpro-x-wireless', 'AUD-LOG-GPROX', 229.99, 20, 'Headset profesional con Blue VO!CE. Usado por e-sports pros.', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400', 1, @provider_id);

-- Networking
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('ASUS RT-AX86U Pro', 'asus-rt-ax86u-pro', 'NET-ASUS-AX86', 249.99, 15, 'Router WiFi 6 gaming con AiMesh. Velocidades de hasta 5700 Mbps.', 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400', 1, @provider_id),
('TP-Link Archer AX73', 'tp-link-archer-ax73', 'NET-TPL-AX73', 149.99, 20, 'Router WiFi 6 AX5400. Ideal para gaming y streaming 4K.', 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400', 1, @provider_id);

-- Refrigeración
INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES
('NZXT Kraken Z73 RGB', 'nzxt-kraken-z73-rgb', 'COOL-NZXT-Z73', 299.99, 14, 'AIO 360mm con pantalla LCD personalizable. RGB Aer RGB 2 fans.', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400', 1, @provider_id),
('Corsair iCUE H150i Elite', 'corsair-icue-h150i-elite', 'COOL-COR-H150', 189.99, 18, 'AIO 360mm con radiador de cobre. RGB dinámico y software iCUE.', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400', 1, @provider_id),
('Arctic Liquid Freezer II 280', 'arctic-liquid-freezer-ii-280', 'COOL-ARC-LF280', 119.99, 22, 'AIO 280mm con excelente rendimiento de refrigeración. Muy silencioso.', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400', 1, @provider_id);

-- Ahora asociar productos con categorías
-- Primero obtenemos los IDs de las categorías
SET @cat_procesadores = (SELECT id FROM categories WHERE name = 'Procesadores' LIMIT 1);
SET @cat_gpu = (SELECT id FROM categories WHERE name = 'Tarjetas Gráficas' LIMIT 1);
SET @cat_ram = (SELECT id FROM categories WHERE name = 'Memorias RAM' LIMIT 1);
SET @cat_almacenamiento = (SELECT id FROM categories WHERE name = 'Almacenamiento' LIMIT 1);
SET @cat_placas = (SELECT id FROM categories WHERE name = 'Placas Madre' LIMIT 1);
SET @cat_psu = (SELECT id FROM categories WHERE name = 'Fuentes de Poder' LIMIT 1);
SET @cat_perifericos = (SELECT id FROM categories WHERE name = 'Periféricos' LIMIT 1);
SET @cat_monitores = (SELECT id FROM categories WHERE name = 'Monitores' LIMIT 1);
SET @cat_audio = (SELECT id FROM categories WHERE name = 'Audio' LIMIT 1);
SET @cat_networking = (SELECT id FROM categories WHERE name = 'Networking' LIMIT 1);
SET @cat_refrigeracion = (SELECT id FROM categories WHERE name = 'Refrigeración' LIMIT 1);

-- Asociar productos con sus categorías
-- Procesadores
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT p.id, @cat_procesadores FROM products p WHERE p.sku LIKE 'CPU-%';

-- Tarjetas Gráficas
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT p.id, @cat_gpu FROM products p WHERE p.sku LIKE 'GPU-%';

-- Memorias RAM
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT p.id, @cat_ram FROM products p WHERE p.sku LIKE 'RAM-%';

-- Almacenamiento
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT p.id, @cat_almacenamiento FROM products p WHERE p.sku LIKE 'SSD-%';

-- Placas Madre
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT p.id, @cat_placas FROM products p WHERE p.sku LIKE 'MB-%';

-- Fuentes de Poder
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT p.id, @cat_psu FROM products p WHERE p.sku LIKE 'PSU-%';

-- Periféricos (Mouse y Teclados)
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT p.id, @cat_perifericos FROM products p WHERE p.sku LIKE 'MOUSE-%' OR p.sku LIKE 'KB-%';

-- Monitores
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT p.id, @cat_monitores FROM products p WHERE p.sku LIKE 'MON-%';

-- Audio
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT p.id, @cat_audio FROM products p WHERE p.sku LIKE 'AUD-%';

-- Networking
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT p.id, @cat_networking FROM products p WHERE p.sku LIKE 'NET-%';

-- Refrigeración
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT p.id, @cat_refrigeracion FROM products p WHERE p.sku LIKE 'COOL-%';

-- Verificación
SELECT COUNT(*) as 'Total de Productos Insertados' FROM products;
SELECT COUNT(*) as 'Total de Categorías' FROM categories;
SELECT COUNT(*) as 'Total de Asociaciones Producto-Categoría' FROM product_categories;
