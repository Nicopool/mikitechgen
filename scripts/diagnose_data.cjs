const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function diagnose() {
    const pool = mysql.createPool({
        host: process.env.VITE_DB_HOST || 'localhost',
        user: process.env.VITE_DB_USER || 'root',
        password: process.env.VITE_DB_PASSWORD || 'password',
        database: process.env.VITE_DB_NAME || 'kitech',
    });

    try {
        console.log('--- VENDORS ---');
        const [users] = await pool.query("SELECT id, email, role FROM users WHERE role = 'VENDOR' OR role = 'PROVIDER'");
        console.log(JSON.stringify(users, null, 2));

        console.log('\n--- PRODUCTS PER VENDOR ---');
        const [products] = await pool.query('SELECT provider_id, COUNT(*) as count FROM products WHERE provider_id = 2 GROUP BY provider_id');
        console.log(JSON.stringify(products, null, 2));

        console.log('\n--- KITS PER VENDOR ---');
        const [kits] = await pool.query('SELECT provider_id, COUNT(*) as count FROM kits WHERE provider_id = 2 GROUP BY provider_id');
        console.log(JSON.stringify(kits, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

diagnose();
