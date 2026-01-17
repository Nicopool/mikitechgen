/**
 * Script de verificación de migración a Supabase
 * Verifica que todos los datos se hayan migrado correctamente
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Credenciales de Supabase no configuradas');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
    console.log('🔍 Verificando migración a Supabase...\n');

    try {
        // Verificar usuarios
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*', { count: 'exact' });

        if (usersError) {
            console.error('❌ Error al verificar usuarios:', usersError);
        } else {
            console.log(`✅ Usuarios: ${users.length} registros`);
            console.log(`   - Roles: ${[...new Set(users.map(u => u.role))].join(', ')}`);
        }

        // Verificar categorías
        const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('*', { count: 'exact' });

        if (categoriesError) {
            console.error('❌ Error al verificar categorías:', categoriesError);
        } else {
            console.log(`✅ Categorías: ${categories.length} registros`);
            console.log(`   - Nombres: ${categories.map(c => c.name).join(', ')}`);
        }

        // Verificar productos
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*', { count: 'exact' });

        if (productsError) {
            console.error('❌ Error al verificar productos:', productsError);
        } else {
            console.log(`✅ Productos: ${products.length} registros`);
            console.log(`   - Activos: ${products.filter(p => p.active).length}`);
            console.log(`   - Inactivos: ${products.filter(p => !p.active).length}`);
        }

        // Verificar relaciones producto-categoría
        const { data: productCategories, error: pcError } = await supabase
            .from('product_categories')
            .select('*', { count: 'exact' });

        if (pcError) {
            console.error('❌ Error al verificar relaciones:', pcError);
        } else {
            console.log(`✅ Relaciones Producto-Categoría: ${productCategories.length} registros`);
        }

        // Verificar kits
        const { data: kits, error: kitsError } = await supabase
            .from('kits')
            .select('*', { count: 'exact' });

        if (kitsError) {
            console.error('❌ Error al verificar kits:', kitsError);
        } else {
            console.log(`✅ Kits: ${kits.length} registros`);
        }

        // Verificar órdenes
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*', { count: 'exact' });

        if (ordersError) {
            console.error('❌ Error al verificar órdenes:', ordersError);
        } else {
            console.log(`✅ Órdenes: ${orders.length} registros`);
            console.log(`   - Estados: ${[...new Set(orders.map(o => o.status))].join(', ')}`);
        }

        // Verificar items de órdenes
        const { data: orderItems, error: orderItemsError } = await supabase
            .from('order_items')
            .select('*', { count: 'exact' });

        if (orderItemsError) {
            console.error('❌ Error al verificar items de órdenes:', orderItemsError);
        } else {
            console.log(`✅ Items de Órdenes: ${orderItems.length} registros`);
        }

        // Verificar audit logs
        const { data: auditLogs, error: auditError } = await supabase
            .from('audit_logs')
            .select('*', { count: 'exact' });

        if (auditError) {
            console.error('❌ Error al verificar audit logs:', auditError);
        } else {
            console.log(`✅ Audit Logs: ${auditLogs.length} registros`);
        }

        console.log('\n🎉 Verificación completada!');
        console.log('\n📊 Resumen Total:');
        console.log(`   - ${users?.length || 0} usuarios`);
        console.log(`   - ${categories?.length || 0} categorías`);
        console.log(`   - ${products?.length || 0} productos`);
        console.log(`   - ${productCategories?.length || 0} relaciones producto-categoría`);
        console.log(`   - ${kits?.length || 0} kits`);
        console.log(`   - ${orders?.length || 0} órdenes`);
        console.log(`   - ${orderItems?.length || 0} items de órdenes`);
        console.log(`   - ${auditLogs?.length || 0} audit logs`);

    } catch (error) {
        console.error('\n❌ Error durante la verificación:', error);
        throw error;
    }
}

// Ejecutar verificación
verifyMigration()
    .then(() => {
        console.log('\n✨ Proceso completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Error fatal:', error);
        process.exit(1);
    });
