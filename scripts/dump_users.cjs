const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function findUser() {
    const pool = mysql.createPool({
        host: process.env.VITE_DB_HOST || 'localhost',
        user: process.env.VITE_DB_USER || 'root',
        password: process.env.VITE_DB_PASSWORD || 'password',
        database: process.env.VITE_DB_NAME || 'kitech',
    });

    try {
        const fs = require('fs');
        const [users] = await pool.query("SELECT id, first_name, last_name, email, role FROM users");
        const content = users.map(u => `USER: ${u.id} | ${u.first_name} ${u.last_name} | ${u.email} | ${u.role}`).join('\n');
        fs.writeFileSync('users_dump.txt', content);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

findUser();
