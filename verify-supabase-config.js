/**
 * Script de verificación de configuración de Supabase
 * Verifica que todas las credenciales y configuraciones estén correctas
 */

require('dotenv').config({ path: '.env.local' });

const checks = {
    passed: [],
    failed: [],
    warnings: []
};

console.log('\n🔍 VERIFICACIÓN DE CONFIGURACIÓN DE SUPABASE\n');
console.log('='.repeat(50));

// Check 1: Supabase URL
console.log('\n1️⃣ Verificando VITE_SUPABASE_URL...');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL_HERE') {
    checks.failed.push('VITE_SUPABASE_URL no está configurada');
    console.log('   ❌ FALTA: Debes configurar VITE_SUPABASE_URL en .env.local');
    console.log('   💡 Obtén tu URL en: https://supabase.com/dashboard/project/_/settings/api');
} else if (!supabaseUrl.includes('supabase.co')) {
    checks.warnings.push('VITE_SUPABASE_URL parece incorrecta');
    console.log('   ⚠️  ADVERTENCIA: La URL no parece ser de Supabase');
    console.log(`   📝 URL actual: ${supabaseUrl}`);
} else {
    checks.passed.push('VITE_SUPABASE_URL configurada correctamente');
    console.log('   ✅ Configurada correctamente');
    console.log(`   📝 URL: ${supabaseUrl}`);
}

// Check 2: Anon Key
console.log('\n2️⃣ Verificando VITE_SUPABASE_ANON_KEY...');
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!anonKey || anonKey.length < 100) {
    checks.failed.push('VITE_SUPABASE_ANON_KEY no está configurada o es inválida');
    console.log('   ❌ FALTA: Debes configurar VITE_SUPABASE_ANON_KEY en .env.local');
} else {
    checks.passed.push('VITE_SUPABASE_ANON_KEY configurada');
    console.log('   ✅ Configurada correctamente');
    console.log(`   📝 Key: ${anonKey.substring(0, 30)}...`);
}

// Check 3: Service Role Key (para migración)
console.log('\n3️⃣ Verificando VITE_SUPABASE_SERVICE_KEY...');
const serviceKey = process.env.VITE_SUPABASE_SERVICE_KEY;
if (!serviceKey || serviceKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
    checks.warnings.push('VITE_SUPABASE_SERVICE_KEY no configurada (necesaria para migración)');
    console.log('   ⚠️  ADVERTENCIA: Service key no configurada');
    console.log('   💡 Necesaria solo para ejecutar npm run migrate:supabase');
    console.log('   💡 Obtén tu service_role key en: https://supabase.com/dashboard/project/_/settings/api');
} else {
    checks.passed.push('VITE_SUPABASE_SERVICE_KEY configurada');
    console.log('   ✅ Configurada correctamente');
    console.log(`   📝 Key: ${serviceKey.substring(0, 30)}...`);
}

// Check 4: MySQL Config (para migración)
console.log('\n4️⃣ Verificando configuración MySQL (para migración)...');
const mysqlHost = process.env.VITE_DB_HOST;
const mysqlDb = process.env.VITE_DB_NAME;
if (mysqlHost && mysqlDb) {
    checks.passed.push('Configuración MySQL presente');
    console.log('   ✅ Configuración MySQL encontrada');
    console.log(`   📝 Host: ${mysqlHost}`);
    console.log(`   📝 Database: ${mysqlDb}`);
} else {
    checks.warnings.push('Configuración MySQL no encontrada');
    console.log('   ⚠️  MySQL no configurado (opcional si ya migraste)');
}

// Check 5: Verificar archivos necesarios
console.log('\n5️⃣ Verificando archivos necesarios...');
const fs = require('fs');
const requiredFiles = [
    'database/supabase-migration.sql',
    'migrate-to-supabase.js',
    'lib/supabase.ts',
    'contexts/DataContextSupabase.tsx'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        checks.passed.push(`Archivo ${file} existe`);
        console.log(`   ✅ ${file}`);
    } else {
        checks.failed.push(`Archivo ${file} no encontrado`);
        console.log(`   ❌ ${file} NO ENCONTRADO`);
    }
});

// Resumen
console.log('\n' + '='.repeat(50));
console.log('\n📊 RESUMEN DE VERIFICACIÓN\n');

console.log(`✅ Verificaciones exitosas: ${checks.passed.length}`);
if (checks.passed.length > 0) {
    checks.passed.forEach(p => console.log(`   • ${p}`));
}

if (checks.warnings.length > 0) {
    console.log(`\n⚠️  Advertencias: ${checks.warnings.length}`);
    checks.warnings.forEach(w => console.log(`   • ${w}`));
}

if (checks.failed.length > 0) {
    console.log(`\n❌ Errores: ${checks.failed.length}`);
    checks.failed.forEach(f => console.log(`   • ${f}`));
}

// Conclusión
console.log('\n' + '='.repeat(50));
console.log('\n🎯 PRÓXIMOS PASOS:\n');

if (checks.failed.length > 0) {
    console.log('❌ HAY ERRORES QUE DEBES CORREGIR:');
    console.log('   1. Abre .env.local');
    console.log('   2. Configura las variables faltantes');
    console.log('   3. Ejecuta este script nuevamente: node verify-supabase-config.js');
} else if (checks.warnings.length > 0 && checks.warnings.some(w => w.includes('SERVICE_KEY'))) {
    console.log('⚠️  CONFIGURACIÓN PARCIAL:');
    console.log('   ✅ Puedes usar Supabase en el frontend');
    console.log('   ❌ NO puedes ejecutar la migración todavía');
    console.log('   💡 Para migrar datos, configura VITE_SUPABASE_SERVICE_KEY');
} else {
    console.log('🎉 ¡TODO ESTÁ CONFIGURADO CORRECTAMENTE!');
    console.log('\n📋 Puedes proceder con:');
    console.log('   1. Ejecutar el script SQL en Supabase SQL Editor');
    console.log('   2. Ejecutar: npm run migrate:supabase');
    console.log('   3. Crear bucket "product-images" en Supabase Storage');
    console.log('   4. Activar replicación en tiempo real');
    console.log('\n📖 Lee RESUMEN-MIGRACION.md para instrucciones detalladas');
}

console.log('\n' + '='.repeat(50) + '\n');

// Exit code
process.exit(checks.failed.length > 0 ? 1 : 0);
