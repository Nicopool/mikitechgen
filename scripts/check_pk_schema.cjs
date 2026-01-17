const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkSchema() {
    const pool = mysql.createPool({
        host: process.env.VITE_DB_HOST || 'localhost',
        user: process.env.VITE_DB_USER || 'root',
        password: process.env.VITE_DB_PASSWORD || 'password',
        database: process.env.VITE_DB_NAME || 'kitech',
    });

    try {
        console.log('--- PRODUCTS ---');
        const [products] = await pool.query('SELECT * FROM products LIMIT 1');
        if (products.length > 0) console.log('Products keys:', Object.keys(products[0]));
        else console.log('No products found');

        console.log('--- KITS ---');
        const [kits] = await pool.query('SELECT * FROM kits LIMIT 1');
        if (kits.length > 0) console.log('Kits keys:', Object.keys(kits[0]));
        else console.log('No kits found');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkSchema();
