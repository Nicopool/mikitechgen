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
        const [rows] = await pool.query('SELECT * FROM users LIMIT 1');
        if (rows.length > 0) {
            console.log('User keys:', Object.keys(rows[0]));
        } else {
            console.log('No users found.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkSchema();
