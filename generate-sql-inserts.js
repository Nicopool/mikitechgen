
/**
 * Script Generador de SQL de Datos
 * Lee datos de MySQL y genera sentencias INSERT para Supabase
 */

import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

// Configuración MySQL
const mysqlConfig = {
    host: process.env.VITE_DB_HOST || 'localhost',
    port: process.env.VITE_DB_PORT || 3306,
    user: process.env.VITE_DB_USER || 'root',
    password: process.env.VITE_DB_PASSWORD || 'root',
    database: process.env.VITE_DB_NAME || 'kitech',
};

function formatValue(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (val instanceof Date) return `'${val.toISOString()}'`;
    // Escapar comillas simples para SQL
    return `'${String(val).replace(/'/g, "''")}'`;
}

async function generateSQL() {
    let connection;
    let sqlOutput = `-- DATOS GENERADOS DESDE MYSQL PARA SUPABASE\n`;
    sqlOutput += `-- Fecha: ${new Date().toISOString()}\n\n`;

    try {
        console.log('📊 Conectando a MySQL...');
        connection = await mysql.createConnection(mysqlConfig);
        console.log('✅ Conectado.');

        // 1. Usuarios
        console.log('Generando SQL para Usuarios...');
        const [users] = await connection.query('SELECT * FROM users');
        if (users.length > 0) {
            sqlOutput += `-- USUARIOS (${users.length})\n`;
            sqlOutput += `INSERT INTO users (id, first_name, last_name, email, password, role, enabled, phone, created_at, updated_at) VALUES\n`;

            const userValues = users.map(u => {
                const enabled = (u.enabled === 1 || u.enabled === true) ? 'TRUE' : 'FALSE';
                return `(${u.id}, ${formatValue(u.first_name)}, ${formatValue(u.last_name)}, ${formatValue(u.email)}, ${formatValue(u.password)}, ${formatValue(u.role)}, ${enabled}, ${formatValue(u.phone)}, ${formatValue(u.created_at)}, ${formatValue(u.updated_at)})`;
            });
            sqlOutput += userValues.join(',\n') + '\nON CONFLICT (email) DO NOTHING;\n\n';
        }

        // 2. Categorías
        console.log('Generando SQL para Categorías...');
        const [categories] = await connection.query('SELECT * FROM categories');
        if (categories.length > 0) {
            sqlOutput += `-- CATEGORÍAS (${categories.length})\n`;
            sqlOutput += `INSERT INTO categories (id, name, slug, active, created_at) VALUES\n`;

            const catValues = categories.map(c => {
                const active = (c.active === 1 || c.active === true) ? 'TRUE' : 'FALSE';
                return `(${c.id}, ${formatValue(c.name)}, ${formatValue(c.slug)}, ${active}, ${formatValue(c.created_at)})`;
            });
            sqlOutput += catValues.join(',\n') + '\nON CONFLICT (slug) DO NOTHING;\n\n';
        }

        // 3. Productos
        console.log('Generando SQL para Productos...');
        const [products] = await connection.query('SELECT * FROM products');
        if (products.length > 0) {
            sqlOutput += `-- PRODUCTOS (${products.length})\n`;
            sqlOutput += `INSERT INTO products (id, provider_id, name, slug, description, sku, price, stock, image_url, active, created_at, updated_at) VALUES\n`;

            const prodValues = products.map(p => {
                const active = (p.active === 1 || p.active === true) ? 'TRUE' : 'FALSE';
                return `(${p.id}, ${formatValue(p.provider_id)}, ${formatValue(p.name)}, ${formatValue(p.slug)}, ${formatValue(p.description)}, ${formatValue(p.sku)}, ${p.price}, ${p.stock}, ${formatValue(p.image_url)}, ${active}, ${formatValue(p.created_at)}, ${formatValue(p.updated_at)})`;
            });
            sqlOutput += prodValues.join(',\n') + '\nON CONFLICT (sku) DO NOTHING;\n\n';
        }

        // 4. Relaciones Producto-Categoría
        console.log('Generando SQL para Relaciones...');
        const [prodCats] = await connection.query('SELECT * FROM product_categories');
        if (prodCats.length > 0) {
            sqlOutput += `-- RELACIONES (${prodCats.length})\n`;
            sqlOutput += `INSERT INTO product_categories (product_id, category_id) VALUES\n`;

            const pcValues = prodCats.map(pc => {
                return `(${pc.product_id}, ${pc.category_id})`;
            });
            sqlOutput += pcValues.join(',\n') + '\nON CONFLICT DO NOTHING;\n\n';
        }

        // 5. Kits
        console.log('Generando SQL para Kits...');
        const [kits] = await connection.query('SELECT * FROM kits');
        if (kits.length > 0) {
            sqlOutput += `-- KITS (${kits.length})\n`;
            sqlOutput += `INSERT INTO kits (id, provider_id, name, slug, description, price, status, image_url, created_at, updated_at) VALUES\n`;

            const kitValues = kits.map(k => {
                return `(${k.id}, ${formatValue(k.provider_id)}, ${formatValue(k.name)}, ${formatValue(k.slug)}, ${formatValue(k.description)}, ${k.price}, ${formatValue(k.status)}, ${formatValue(k.image_url)}, ${formatValue(k.created_at)}, ${formatValue(k.updated_at)})`;
            });
            sqlOutput += kitValues.join(',\n') + '\nON CONFLICT (slug) DO NOTHING;\n\n';
        }

        // 6. Kit Items
        console.log('Generando SQL para Items de Kits...');
        const [kitItems] = await connection.query('SELECT * FROM kit_items');
        if (kitItems.length > 0) {
            sqlOutput += `-- KIT ITEMS (${kitItems.length})\n`;
            sqlOutput += `INSERT INTO kit_items (id, kit_id, product_id, quantity) VALUES\n`;

            const kiValues = kitItems.map(ki => {
                return `(${ki.id}, ${ki.kit_id}, ${ki.product_id}, ${ki.quantity})`;
            });
            sqlOutput += kiValues.join(',\n') + '\nON CONFLICT DO NOTHING;\n\n';
        }

        // 7. Órdenes
        console.log('Generando SQL para Órdenes...');
        const [orders] = await connection.query('SELECT * FROM orders');
        if (orders.length > 0) {
            sqlOutput += `-- ÓRDENES (${orders.length})\n`;
            sqlOutput += `INSERT INTO orders (id, user_id, status, total_amount, shipping_address, shipping_city, shipping_phone, created_at, updated_at) VALUES\n`;

            const orderValues = orders.map(o => {
                return `(${o.id}, ${o.user_id}, ${formatValue(o.status)}, ${o.total_amount}, ${formatValue(o.shipping_address)}, ${formatValue(o.shipping_city)}, ${formatValue(o.shipping_phone)}, ${formatValue(o.created_at)}, ${formatValue(o.updated_at)})`;
            });
            sqlOutput += orderValues.join(',\n') + '\nON CONFLICT DO NOTHING;\n\n';
        }

        // 8. Order Items
        console.log('Generando SQL para Items de Órdenes...');
        const [orderItems] = await connection.query('SELECT * FROM order_items');
        if (orderItems.length > 0) {
            sqlOutput += `-- ORDER ITEMS (${orderItems.length})\n`;
            sqlOutput += `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal, created_at) VALUES\n`;

            const oiValues = orderItems.map(oi => {
                return `(${oi.id}, ${oi.order_id}, ${oi.product_id}, ${oi.quantity}, ${oi.unit_price}, ${oi.subtotal}, ${formatValue(oi.created_at)})`;
            });
            sqlOutput += oiValues.join(',\n') + '\nON CONFLICT DO NOTHING;\n\n';
        }

        // Guardar archivo
        await fs.writeFile('database/data-migration.sql', sqlOutput);
        console.log('\n🎉 Archivo generado exitosamente: database/data-migration.sql');
        console.log('👉 Copia el contenido de este archivo en Supabase SQL Editor para insertar los datos.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

generateSQL();
