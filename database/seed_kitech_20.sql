-- ============================================
-- MIKITECH E-COMMERCE - FULL SEED (20 PER TABLE)
-- ============================================

CREATE DATABASE IF NOT EXISTS kitech
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE kitech;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- USERS (20)
-- ============================================

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('ADMIN','USER','PROVIDER'),
  enabled BOOLEAN,
  phone VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users VALUES
(1,'Admin','System','admin@mikitech.com','hash','ADMIN',1,NULL,NOW(),NOW()),
(2,'Provider','One','prov1@mail.com','hash','PROVIDER',1,'555-001',NOW(),NOW()),
(3,'Provider','Two','prov2@mail.com','hash','PROVIDER',1,'555-002',NOW(),NOW()),
(4,'Provider','Three','prov3@mail.com','hash','PROVIDER',1,'555-003',NOW(),NOW()),
(5,'Provider','Four','prov4@mail.com','hash','PROVIDER',1,'555-004',NOW(),NOW()),
(6,'Provider','Five','prov5@mail.com','hash','PROVIDER',1,'555-005',NOW(),NOW()),
(7,'Provider','Six','prov6@mail.com','hash','PROVIDER',1,'555-006',NOW(),NOW()),
(8,'User','One','user1@mail.com','hash','USER',1,'555-101',NOW(),NOW()),
(9,'User','Two','user2@mail.com','hash','USER',1,'555-102',NOW(),NOW()),
(10,'User','Three','user3@mail.com','hash','USER',1,'555-103',NOW(),NOW()),
(11,'User','Four','user4@mail.com','hash','USER',1,'555-104',NOW(),NOW()),
(12,'User','Five','user5@mail.com','hash','USER',1,'555-105',NOW(),NOW()),
(13,'User','Six','user6@mail.com','hash','USER',1,'555-106',NOW(),NOW()),
(14,'User','Seven','user7@mail.com','hash','USER',1,'555-107',NOW(),NOW()),
(15,'User','Eight','user8@mail.com','hash','USER',1,'555-108',NOW(),NOW()),
(16,'User','Nine','user9@mail.com','hash','USER',1,'555-109',NOW(),NOW()),
(17,'User','Ten','user10@mail.com','hash','USER',1,'555-110',NOW(),NOW()),
(18,'User','Eleven','user11@mail.com','hash','USER',1,'555-111',NOW(),NOW()),
(19,'User','Twelve','user12@mail.com','hash','USER',1,'555-112',NOW(),NOW()),
(20,'User','Thirteen','user13@mail.com','hash','USER',1,'555-113',NOW(),NOW());

-- ============================================
-- CATEGORIES (20)
-- ============================================

DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120),
  slug VARCHAR(140),
  active BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories VALUES
(1,'Procesadores','procesadores',1,NOW()),
(2,'GPUs','gpus',1,NOW()),
(3,'RAM','ram',1,NOW()),
(4,'SSD','ssd',1,NOW()),
(5,'Motherboard','motherboard',1,NOW()),
(6,'PSU','psu',1,NOW()),
(7,'Monitores','monitores',1,NOW()),
(8,'Teclados','teclados',1,NOW()),
(9,'Mouse','mouse',1,NOW()),
(10,'Laptops','laptops',1,NOW()),
(11,'Servidores','servidores',1,NOW()),
(12,'Redes','redes',1,NOW()),
(13,'Cables','cables',1,NOW()),
(14,'Coolers','coolers',1,NOW()),
(15,'Gabinetes','gabinetes',1,NOW()),
(16,'Audio','audio',1,NOW()),
(17,'Camaras','camaras',1,NOW()),
(18,'UPS','ups',1,NOW()),
(19,'Software','software',1,NOW()),
(20,'Accesorios','accesorios',1,NOW());

-- ============================================
-- PRODUCTS (20)
-- ============================================

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  provider_id BIGINT,
  name VARCHAR(255),
  slug VARCHAR(280),
  description TEXT,
  sku VARCHAR(80),
  price DECIMAL(10,2),
  stock INT,
  image_url VARCHAR(500),
  active BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES users(id)
);

INSERT INTO products VALUES
(1,2,'Ryzen 7','ryzen-7','CPU','SKU1',299.99,10,'img',1,NOW(),NOW()),
(2,2,'Ryzen 9','ryzen-9','CPU','SKU2',499.99,10,'img',1,NOW(),NOW()),
(3,3,'RTX 4070','rtx-4070','GPU','SKU3',599.99,5,'img',1,NOW(),NOW()),
(4,3,'RTX 4090','rtx-4090','GPU','SKU4',1599.99,2,'img',1,NOW(),NOW()),
(5,4,'RAM 16GB','ram-16','RAM','SKU5',79.99,30,'img',1,NOW(),NOW()),
(6,4,'RAM 32GB','ram-32','RAM','SKU6',149.99,20,'img',1,NOW(),NOW()),
(7,5,'SSD 1TB','ssd-1tb','SSD','SKU7',99.99,25,'img',1,NOW(),NOW()),
(8,5,'SSD 2TB','ssd-2tb','SSD','SKU8',179.99,15,'img',1,NOW(),NOW()),
(9,6,'MB X570','mb-x570','MB','SKU9',199.99,8,'img',1,NOW(),NOW()),
(10,6,'MB Z790','mb-z790','MB','SKU10',299.99,6,'img',1,NOW(),NOW()),
(11,7,'PSU 750W','psu-750','PSU','SKU11',129.99,12,'img',1,NOW(),NOW()),
(12,7,'PSU 1000W','psu-1000','PSU','SKU12',199.99,7,'img',1,NOW(),NOW()),
(13,2,'Monitor 27','monitor-27','MON','SKU13',249.99,9,'img',1,NOW(),NOW()),
(14,3,'Teclado Mec','teclado','KEY','SKU14',89.99,40,'img',1,NOW(),NOW()),
(15,4,'Mouse Gamer','mouse','MOU','SKU15',49.99,50,'img',1,NOW(),NOW()),
(16,5,'Gabinete','case','CASE','SKU16',99.99,10,'img',1,NOW(),NOW()),
(17,6,'Cooler','cooler','COOL','SKU17',39.99,20,'img',1,NOW(),NOW()),
(18,7,'UPS','ups','UPS','SKU18',149.99,5,'img',1,NOW(),NOW()),
(19,2,'Webcam','webcam','CAM','SKU19',59.99,18,'img',1,NOW(),NOW()),
(20,3,'Audifonos','audio','AUD','SKU20',69.99,22,'img',1,NOW(),NOW());

-- ============================================
-- PRODUCT_CATEGORIES (20)
-- ============================================

DROP TABLE IF EXISTS product_categories;
CREATE TABLE product_categories (
  product_id BIGINT,
  category_id BIGINT,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO product_categories VALUES
(1,1),(2,1),(3,2),(4,2),(5,3),
(6,3),(7,4),(8,4),(9,5),(10,5),
(11,6),(12,6),(13,7),(14,8),(15,9),
(16,15),(17,14),(18,18),(19,17),(20,16);

-- ============================================
-- ORDERS (20)
-- ============================================

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  status ENUM('CREATED','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED'),
  total_amount DECIMAL(10,2),
  shipping_address VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO orders VALUES
(1,8,'DELIVERED',299.99,'Addr','City','555',NOW(),NOW()),
(2,9,'PAID',599.99,'Addr','City','555',NOW(),NOW()),
(3,10,'CREATED',149.99,'Addr','City','555',NOW(),NOW()),
(4,11,'SHIPPED',179.99,'Addr','City','555',NOW(),NOW()),
(5,12,'PROCESSING',499.99,'Addr','City','555',NOW(),NOW()),
(6,13,'DELIVERED',89.99,'Addr','City','555',NOW(),NOW()),
(7,14,'PAID',249.99,'Addr','City','555',NOW(),NOW()),
(8,15,'CREATED',79.99,'Addr','City','555',NOW(),NOW()),
(9,16,'SHIPPED',129.99,'Addr','City','555',NOW(),NOW()),
(10,17,'DELIVERED',199.99,'Addr','City','555',NOW(),NOW()),
(11,18,'CREATED',49.99,'Addr','City','555',NOW(),NOW()),
(12,19,'PAID',99.99,'Addr','City','555',NOW(),NOW()),
(13,20,'DELIVERED',39.99,'Addr','City','555',NOW(),NOW()),
(14,8,'PROCESSING',69.99,'Addr','City','555',NOW(),NOW()),
(15,9,'SHIPPED',149.99,'Addr','City','555',NOW(),NOW()),
(16,10,'CREATED',59.99,'Addr','City','555',NOW(),NOW()),
(17,11,'PAID',299.99,'Addr','City','555',NOW(),NOW()),
(18,12,'DELIVERED',179.99,'Addr','City','555',NOW(),NOW()),
(19,13,'CANCELLED',249.99,'Addr','City','555',NOW(),NOW()),
(20,14,'DELIVERED',499.99,'Addr','City','555',NOW(),NOW());

-- ============================================
-- ORDER_ITEMS (20)
-- ============================================

DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT,
  product_id BIGINT,
  quantity INT,
  unit_price DECIMAL(10,2),
  subtotal DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO order_items VALUES
(1,1,1,1,299.99,299.99,NOW()),
(2,2,3,1,599.99,599.99,NOW()),
(3,3,6,1,149.99,149.99,NOW()),
(4,4,8,1,179.99,179.99,NOW()),
(5,5,2,1,499.99,499.99,NOW()),
(6,6,14,1,89.99,89.99,NOW()),
(7,7,13,1,249.99,249.99,NOW()),
(8,8,5,1,79.99,79.99,NOW()),
(9,9,11,1,129.99,129.99,NOW()),
(10,10,12,1,199.99,199.99,NOW()),
(11,11,15,1,49.99,49.99,NOW()),
(12,12,16,1,99.99,99.99,NOW()),
(13,13,17,1,39.99,39.99,NOW()),
(14,14,20,1,69.99,69.99,NOW()),
(15,15,18,1,149.99,149.99,NOW()),
(16,16,19,1,59.99,59.99,NOW()),
(17,17,1,1,299.99,299.99,NOW()),
(18,18,8,1,179.99,179.99,NOW()),
(19,19,13,1,249.99,249.99,NOW()),
(20,20,2,1,499.99,499.99,NOW());

-- ============================================
-- VENDOR_ORDERS (20)
-- ============================================

DROP TABLE IF EXISTS vendor_orders;
CREATE TABLE vendor_orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT,
  provider_id BIGINT,
  status ENUM('CREATED','PENDING','ACCEPTED','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED'),
  total_amount DECIMAL(10,2),
  tracking_number VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (provider_id) REFERENCES users(id)
);

INSERT INTO vendor_orders VALUES
(1,1,2,'DELIVERED',299.99,'TRK1',NOW(),NOW()),
(2,2,3,'PAID',599.99,'TRK2',NOW(),NOW()),
(3,3,4,'CREATED',149.99,'TRK3',NOW(),NOW()),
(4,4,5,'SHIPPED',179.99,'TRK4',NOW(),NOW()),
(5,5,2,'PROCESSING',499.99,'TRK5',NOW(),NOW()),
(6,6,3,'DELIVERED',89.99,'TRK6',NOW(),NOW()),
(7,7,2,'PAID',249.99,'TRK7',NOW(),NOW()),
(8,8,4,'CREATED',79.99,'TRK8',NOW(),NOW()),
(9,9,5,'SHIPPED',129.99,'TRK9',NOW(),NOW()),
(10,10,6,'DELIVERED',199.99,'TRK10',NOW(),NOW()),
(11,11,7,'CREATED',49.99,'TRK11',NOW(),NOW()),
(12,12,2,'PAID',99.99,'TRK12',NOW(),NOW()),
(13,13,3,'DELIVERED',39.99,'TRK13',NOW(),NOW()),
(14,14,4,'PROCESSING',69.99,'TRK14',NOW(),NOW()),
(15,15,5,'SHIPPED',149.99,'TRK15',NOW(),NOW()),
(16,16,6,'CREATED',59.99,'TRK16',NOW(),NOW()),
(17,17,2,'PAID',299.99,'TRK17',NOW(),NOW()),
(18,18,3,'DELIVERED',179.99,'TRK18',NOW(),NOW()),
(19,19,4,'CANCELLED',249.99,'TRK19',NOW(),NOW()),
(20,20,5,'DELIVERED',499.99,'TRK20',NOW(),NOW());

-- ============================================
-- KITS (20)
-- ============================================

DROP TABLE IF EXISTS kits;
CREATE TABLE kits (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  provider_id BIGINT,
  name VARCHAR(255),
  slug VARCHAR(280),
  description TEXT,
  price DECIMAL(10,2),
  status ENUM('ACTIVE','INACTIVE'),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES users(id)
);

INSERT INTO kits VALUES
(1,2,'Kit 1','kit-1','Combo',999.99,'ACTIVE','img',NOW(),NOW()),
(2,3,'Kit 2','kit-2','Combo',899.99,'ACTIVE','img',NOW(),NOW()),
(3,4,'Kit 3','kit-3','Combo',799.99,'ACTIVE','img',NOW(),NOW()),
(4,5,'Kit 4','kit-4','Combo',699.99,'ACTIVE','img',NOW(),NOW()),
(5,6,'Kit 5','kit-5','Combo',599.99,'ACTIVE','img',NOW(),NOW()),
(6,7,'Kit 6','kit-6','Combo',499.99,'ACTIVE','img',NOW(),NOW()),
(7,2,'Kit 7','kit-7','Combo',1099.99,'ACTIVE','img',NOW(),NOW()),
(8,3,'Kit 8','kit-8','Combo',1199.99,'ACTIVE','img',NOW(),NOW()),
(9,4,'Kit 9','kit-9','Combo',1299.99,'ACTIVE','img',NOW(),NOW()),
(10,5,'Kit 10','kit-10','Combo',1399.99,'ACTIVE','img',NOW(),NOW()),
(11,6,'Kit 11','kit-11','Combo',899.99,'ACTIVE','img',NOW(),NOW()),
(12,7,'Kit 12','kit-12','Combo',999.99,'ACTIVE','img',NOW(),NOW()),
(13,2,'Kit 13','kit-13','Combo',799.99,'ACTIVE','img',NOW(),NOW()),
(14,3,'Kit 14','kit-14','Combo',699.99,'ACTIVE','img',NOW(),NOW()),
(15,4,'Kit 15','kit-15','Combo',599.99,'ACTIVE','img',NOW(),NOW()),
(16,5,'Kit 16','kit-16','Combo',499.99,'ACTIVE','img',NOW(),NOW()),
(17,6,'Kit 17','kit-17','Combo',399.99,'ACTIVE','img',NOW(),NOW()),
(18,7,'Kit 18','kit-18','Combo',299.99,'ACTIVE','img',NOW(),NOW()),
(19,2,'Kit 19','kit-19','Combo',199.99,'ACTIVE','img',NOW(),NOW()),
(20,3,'Kit 20','kit-20','Combo',149.99,'ACTIVE','img',NOW(),NOW());

-- ============================================
-- KIT_ITEMS (20)
-- ============================================

DROP TABLE IF EXISTS kit_items;
CREATE TABLE kit_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  kit_id BIGINT,
  product_id BIGINT,
  quantity INT,
  FOREIGN KEY (kit_id) REFERENCES kits(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO kit_items VALUES
(1,1,1,1),(2,2,2,1),(3,3,3,1),(4,4,4,1),(5,5,5,1),
(6,6,6,1),(7,7,7,1),(8,8,8,1),(9,9,9,1),(10,10,10,1),
(11,11,11,1),(12,12,12,1),(13,13,13,1),(14,14,14,1),(15,15,15,1),
(16,16,16,1),(17,17,17,1),(18,18,18,1),(19,19,19,1),(20,20,20,1);

-- ============================================
-- AUDIT_LOGS (20)
-- ============================================

DROP TABLE IF EXISTS audit_logs;
CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  action VARCHAR(100),
  entity VARCHAR(100),
  entity_id BIGINT,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO audit_logs VALUES
(1,1,'INIT','DB',NULL,'Init',NOW()),
(2,1,'SEED','USERS',NULL,'Users',NOW()),
(3,1,'SEED','CATEGORIES',NULL,'Categories',NOW()),
(4,1,'SEED','PRODUCTS',NULL,'Products',NOW()),
(5,1,'SEED','ORDERS',NULL,'Orders',NOW()),
(6,1,'SEED','VENDOR',NULL,'VendorOrders',NOW()),
(7,2,'LOGIN','USER',2,'Login',NOW()),
(8,3,'LOGIN','USER',3,'Login',NOW()),
(9,4,'LOGIN','USER',4,'Login',NOW()),
(10,5,'LOGIN','USER',5,'Login',NOW()),
(11,6,'LOGIN','USER',6,'Login',NOW()),
(12,7,'LOGIN','USER',7,'Login',NOW()),
(13,8,'CREATE','ORDER',1,'Order',NOW()),
(14,9,'PAY','ORDER',2,'Pay',NOW()),
(15,10,'SHIP','ORDER',3,'Ship',NOW()),
(16,11,'DELIVER','ORDER',4,'Deliver',NOW()),
(17,12,'CANCEL','ORDER',5,'Cancel',NOW()),
(18,13,'REPORT','SYSTEM',NULL,'Report',NOW()),
(19,14,'REPORT','SYSTEM',NULL,'Report',NOW()),
(20,15,'REPORT','SYSTEM',NULL,'Report',NOW());

SET FOREIGN_KEY_CHECKS = 1;
