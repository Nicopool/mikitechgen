const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function fixData() {
    const pool = mysql.createPool({
        host: process.env.VITE_DB_HOST || 'localhost',
        user: process.env.VITE_DB_USER || 'root',
        password: process.env.VITE_DB_PASSWORD || 'password',
        database: process.env.VITE_DB_NAME || 'kitech',
    });

    try {
        // 1. Find the Demo Vendor
        const [users] = await pool.query("SELECT id, email, role FROM users WHERE email LIKE '%demo%' OR role = 'VENDOR' OR role = 'PROVIDER' LIMIT 5");

        console.log('Found potential vendors:', JSON.stringify(users, null, 2));

        if (users.length === 0) {
            console.log('No vendor found. Creating one...');
            // Create demo vendor logic if needed, but likely one exists.
            return;
        }

        // Prefer one with 'demo' in email
        let targetVendor = users.find(u => u.email.includes('demo'));
        if (!targetVendor) targetVendor = users[0];

        console.log(`Target Vendor: ID ${targetVendor.id} (${targetVendor.email})`);

        // 2. Assign ALL products to this vendor
        console.log('Updating products...');
        const [prodResult] = await pool.query('UPDATE products SET provider_id = ?', [targetVendor.id]);
        console.log(`Updated ${prodResult.affectedRows} products.`);

        // 3. Assign ALL kits to this vendor
        console.log('Updating kits...');
        const [kitResult] = await pool.query('UPDATE kits SET provider_id = ?', [targetVendor.id]);
        console.log(`Updated ${kitResult.affectedRows} kits.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

fixData();
