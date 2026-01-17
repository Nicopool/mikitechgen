/**
 * Script de migración de MySQL a Supabase
 * Exporta todos los datos de MySQL e importa a Supabase
 */

import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Configuración MySQL
const mysqlConfig = {
    host: process.env.VITE_DB_HOST || 'localhost',
    port: process.env.VITE_DB_PORT || 3306,
    user: process.env.VITE_DB_USER || 'root',
    password: process.env.VITE_DB_PASSWORD || 'root',
    database: process.env.VITE_DB_NAME || 'kitech',
};

// Configuración Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY; // Necesitamos service key, no anon key

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: VITE_SUPABASE_URL y VITE_SUPABASE_SERVICE_KEY deben estar configurados en .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
    let connection;

    try {
        console.log('🚀 Iniciando migración de MySQL a Supabase...\n');

        // Conectar a MySQL
        console.log('📊 Conectando a MySQL...');
        connection = await mysql.createConnection(mysqlConfig);
        console.log('✅ Conectado a MySQL\n');

        // 1. Migrar Usuarios
        console.log('👥 Migrando usuarios...');
        const [users] = await connection.query('SELECT * FROM users ORDER BY id');
        console.log(`   Encontrados ${users.length} usuarios`);

        for (const user of users) {
            const { error } = await supabase.from('users').upsert({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
                role: user.role,
                enabled: user.enabled,
                phone: user.phone,
                created_at: user.created_at,
                updated_at: user.updated_at
            }, { onConflict: 'email' });

            if (error) console.error(`   ⚠️  Error con usuario ${user.email}:`, error.message);
        }
        console.log('✅ Usuarios migrados\n');

        // 2. Migrar Categorías
        console.log('📁 Migrando categorías...');
        const [categories] = await connection.query('SELECT * FROM categories');
        console.log(`   Encontradas ${categories.length} categorías`);

        for (const cat of categories) {
            const { error } = await supabase.from('categories').upsert({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                active: cat.active,
                created_at: cat.created_at
            }, { onConflict: 'slug' });

            if (error) console.error(`   ⚠️  Error con categoría ${cat.name}:`, error.message);
        }
        console.log('✅ Categorías migradas\n');

        // 3. Migrar Productos
        console.log('📦 Migrando productos...');
        const [products] = await connection.query('SELECT * FROM products ORDER BY id');
        console.log(`   Encontrados ${products.length} productos`);

        for (const prod of products) {
            const { error } = await supabase.from('products').upsert({
                id: prod.id,
                provider_id: prod.provider_id,
                name: prod.name,
                slug: prod.slug,
                description: prod.description,
                sku: prod.sku,
                price: prod.price,
                stock: prod.stock,
                image_url: prod.image_url,
                active: prod.active,
                created_at: prod.created_at,
                updated_at: prod.updated_at
            }, { onConflict: 'sku' });

            if (error) console.error(`   ⚠️  Error con producto ${prod.name}:`, error.message);
        }
        console.log('✅ Productos migrados\n');

        // 4. Migrar Relaciones Producto-Categoría
        console.log('🔗 Migrando relaciones producto-categoría...');
        const [prodCats] = await connection.query('SELECT * FROM product_categories');
        console.log(`   Encontradas ${prodCats.length} relaciones`);

        if (prodCats.length > 0) {
            const { error } = await supabase.from('product_categories').upsert(
                prodCats.map(pc => ({
                    product_id: pc.product_id,
                    category_id: pc.category_id
                }))
            );

            if (error) console.error('   ⚠️  Error:', error.message);
        }
        console.log('✅ Relaciones migradas\n');

        // 5. Migrar Kits
        console.log('🎁 Migrando kits...');
        const [kits] = await connection.query('SELECT * FROM kits ORDER BY id');
        console.log(`   Encontrados ${kits.length} kits`);

        for (const kit of kits) {
            const { error } = await supabase.from('kits').upsert({
                id: kit.id,
                provider_id: kit.provider_id,
                name: kit.name,
                slug: kit.slug,
                description: kit.description,
                price: kit.price,
                status: kit.status,
                image_url: kit.image_url,
                created_at: kit.created_at,
                updated_at: kit.updated_at
            }, { onConflict: 'slug' });

            if (error) console.error(`   ⚠️  Error con kit ${kit.name}:`, error.message);
        }
        console.log('✅ Kits migrados\n');

        // 6. Migrar Items de Kits
        console.log('🔗 Migrando items de kits...');
        const [kitItems] = await connection.query('SELECT * FROM kit_items');
        console.log(`   Encontrados ${kitItems.length} items`);

        if (kitItems.length > 0) {
            const { error } = await supabase.from('kit_items').upsert(
                kitItems.map(ki => ({
                    id: ki.id,
                    kit_id: ki.kit_id,
                    product_id: ki.product_id,
                    quantity: ki.quantity
                }))
            );

            if (error) console.error('   ⚠️  Error:', error.message);
        }
        console.log('✅ Items de kits migrados\n');

        // 7. Migrar Órdenes
        console.log('🛒 Migrando órdenes...');
        const [orders] = await connection.query('SELECT * FROM orders ORDER BY id');
        console.log(`   Encontradas ${orders.length} órdenes`);

        for (const order of orders) {
            const { error } = await supabase.from('orders').upsert({
                id: order.id,
                user_id: order.user_id,
                status: order.status,
                total_amount: order.total_amount,
                shipping_address: order.shipping_address,
                shipping_city: order.shipping_city,
                shipping_phone: order.shipping_phone,
                created_at: order.created_at,
                updated_at: order.updated_at
            });

            if (error) console.error(`   ⚠️  Error con orden ${order.id}:`, error.message);
        }
        console.log('✅ Órdenes migradas\n');

        // 8. Migrar Items de Órdenes
        console.log('📋 Migrando items de órdenes...');
        const [orderItems] = await connection.query('SELECT * FROM order_items');
        console.log(`   Encontrados ${orderItems.length} items`);

        if (orderItems.length > 0) {
            const { error } = await supabase.from('order_items').upsert(
                orderItems.map(oi => ({
                    id: oi.id,
                    order_id: oi.order_id,
                    product_id: oi.product_id,
                    quantity: oi.quantity,
                    unit_price: oi.unit_price,
                    subtotal: oi.subtotal,
                    created_at: oi.created_at
                }))
            );

            if (error) console.error('   ⚠️  Error:', error.message);
        }
        console.log('✅ Items de órdenes migrados\n');

        // 9. Migrar Audit Logs
        console.log('📝 Migrando logs de auditoría...');
        const [auditLogs] = await connection.query('SELECT * FROM audit_logs');
        console.log(`   Encontrados ${auditLogs.length} logs`);

        if (auditLogs.length > 0) {
            const { error } = await supabase.from('audit_logs').upsert(
                auditLogs.map(log => ({
                    id: log.id,
                    user_id: log.user_id,
                    action: log.action,
                    entity: log.entity,
                    entity_id: log.entity_id,
                    ip: log.ip,
                    details: log.details,
                    created_at: log.created_at
                }))
            );

            if (error) console.error('   ⚠️  Error:', error.message);
        }
        console.log('✅ Logs migrados\n');

        console.log('🎉 ¡Migración completada exitosamente!');
        console.log('\n📊 Resumen:');
        console.log(`   - ${users.length} usuarios`);
        console.log(`   - ${categories.length} categorías`);
        console.log(`   - ${products.length} productos`);
        console.log(`   - ${kits.length} kits`);
        console.log(`   - ${orders.length} órdenes`);

    } catch (error) {
        console.error('\n❌ Error durante la migración:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n✅ Conexión MySQL cerrada');
        }
    }
}

// Ejecutar migración
migrateData()
    .then(() => {
        console.log('\n✨ Proceso completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Error fatal:', error);
        process.exit(1);
    });
