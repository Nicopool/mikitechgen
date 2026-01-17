
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;

console.log('--- DIAGNÓSTICO DE CONEXIÓN ---');
console.log('URL:', supabaseUrl);
console.log('KEY (Service):', supabaseKey ? supabaseKey.substring(0, 15) + '...' : 'INDEFINIDA');

if (!supabaseKey) {
    console.error('❌ ERROR: No hay Service Key definida en .env.local');
    process.exit(1);
}

// Advertencia sobre el formato
if (!supabaseKey.startsWith('ey')) {
    console.log('\n⚠️  ADVERTENCIA DE FORMATO:');
    console.log('   La llave actual empieza con "' + supabaseKey.substring(0, 5) + '..."');
    console.log('   Las llaves estándar de Supabase (JWT) usualmente empiezan con "ey..."');
    console.log('   Sin embargo, probaremos si funciona...\n');
} else {
    console.log('✅ FORMATO DE LLAVE: Correcto (parece un JWT).\n');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('1️⃣  PRUEBA DE LECTURA (READ)...');
    // Intentamos leer una tabla que debería existir (users o cualquier otra)
    // Usamos 'products' que es menos sensible si 'users' no existe
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('   ❌ FALLÓ LA LECTURA:', error.message);
        console.log('   (Es posible que las tablas no existan aún)');
    } else {
        console.log('   ✅ LECTURA EXITOSA: La conexión funciona y puede leer.');
    }

    console.log('\n2️⃣  PRUEBA DE ESCRITURA (WRITE)...');
    console.log('   Intentando crear un registro de prueba en "audit_logs"...');

    // Intentamos insertar un log falso
    const testLog = {
        action: 'TEST_CONNECTION_CHECK',
        entity: 'SYSTEM',
        entity_id: 999999,
        details: 'Prueba de escritura',
        created_at: new Date().toISOString()
    };

    const { error: writeError } = await supabase.from('audit_logs').insert(testLog);

    if (writeError) {
        console.error('   ❌ FALLÓ LA ESCRITURA:', writeError.message);
        console.log('\n🔴 DIAGNÓSTICO FINAL:');
        console.log('   Tu llave conecta, pero NO TIENE PERMISOS DE ESCRITURA o la tabla no existe.');
        console.log('   Si la tabla existe, entonces estás usando la llave Incorrecta (Anon) en lugar de la Service Role.');
    } else {
        console.log('   ✅ ESCRITURA EXITOSA: Tienes permisos de administrador.');
        console.log('\n🟢 DIAGNÓSTICO FINAL:');
        console.log('   Tu llave es correcta y tiene permisos completos.');

        // Limpieza
        await supabase.from('audit_logs').delete().eq('entity_id', 999999);
    }
}

testConnection();
