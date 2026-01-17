const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function alignData() {
    const pool = mysql.createPool({
        host: process.env.VITE_DB_HOST || 'localhost',
        user: process.env.VITE_DB_USER || 'root',
        password: process.env.VITE_DB_PASSWORD || 'password',
        database: process.env.VITE_DB_NAME || 'kitech',
    });

    try {
        // server.cjs logic: picks the first provider found
        const [users] = await pool.query("SELECT id, email FROM users WHERE role = 'PROVIDER' ORDER BY id ASC LIMIT 1");

        if (users.length === 0) {
            console.error("No PROVIDER found in DB!");
            return;
        }

        const targetId = users[0].id;
        console.log(`Server maps 'demo-vendor-001' to Provider ID: ${targetId} (${users[0].email})`);

        console.log('Reassigning ALL products/kits to this ID...');

        const [pRes] = await pool.query('UPDATE products SET provider_id = ?', [targetId]);
        console.log(`Products updated: ${pRes.affectedRows}`);

        const [kRes] = await pool.query('UPDATE kits SET provider_id = ?', [targetId]);
        console.log(`Kits updated: ${kRes.affectedRows}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

alignData();
