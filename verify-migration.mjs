/**
 * Script para verificar la migración a Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Faltan credenciales de Supabase');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
    console.log('🔍 Verificando migración a Supabase...\n');

    try {
        // Verificar usuarios
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, email, role, enabled');

        if (usersError) {
            console.error('❌ Error al obtener usuarios:', usersError);
        } else {
            console.log(`✅ Usuarios: ${users.length}`);
            console.log(`   - Admins: ${users.filter(u => u.role === 'ADMIN').length}`);
            console.log(`   - Proveedores: ${users.filter(u => u.role === 'PROVIDER').length}`);
            console.log(`   - Usuarios: ${users.filter(u => u.role === 'USER').length}`);
            console.log(`   - Activos: ${users.filter(u => u.enabled).length}\n`);
        }

        // Verificar categorías
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('id, name, active');

        if (catError) {
            console.error('❌ Error al obtener categorías:', catError);
        } else {
            console.log(`✅ Categorías: ${categories.length}`);
            categories.forEach(cat => {
                console.log(`   - ${cat.name} ${cat.active ? '✓' : '✗'}`);
            });
            console.log();
        }

        // Verificar productos
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('id, name, price, stock, active');

        if (prodError) {
            console.error('❌ Error al obtener productos:', prodError);
        } else {
            console.log(`✅ Productos: ${products.length}`);
            console.log(`   - Activos: ${products.filter(p => p.active).length}`);
            console.log(`   - En stock: ${products.filter(p => p.stock > 0).length}`);
            console.log(`   - Precio promedio: $${(products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length).toFixed(2)}\n`);
        }

        // Verificar kits
        const { data: kits, error: kitsError } = await supabase
            .from('kits')
            .select('id, name, price, status');

        if (kitsError) {
            console.error('❌ Error al obtener kits:', kitsError);
        } else {
            console.log(`✅ Kits: ${kits.length}`);
            kits.forEach(kit => {
                console.log(`   - ${kit.name}: $${kit.price} (${kit.status})`);
            });
            console.log();
        }

        // Verificar órdenes
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('id, status, total_amount');

        if (ordersError) {
            console.error('❌ Error al obtener órdenes:', ordersError);
        } else {
            console.log(`✅ Órdenes: ${orders.length}`);
            console.log(`   - Creadas: ${orders.filter(o => o.status === 'CREATED').length}`);
            console.log(`   - Pagadas: ${orders.filter(o => o.status === 'PAID').length}`);
            console.log(`   - Enviadas: ${orders.filter(o => o.status === 'SHIPPED').length}`);
            console.log(`   - Entregadas: ${orders.filter(o => o.status === 'DELIVERED').length}`);
            console.log(`   - Total vendido: $${orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0).toFixed(2)}\n`);
        }

        console.log('🎉 ¡Verificación completada!\n');
        console.log('📊 Tu base de datos en Supabase está lista para usar.');
        console.log('🔗 URL del proyecto: ' + supabaseUrl);

    } catch (error) {
        console.error('❌ Error durante la verificación:', error);
        process.exit(1);
    }
}

verifyMigration();
