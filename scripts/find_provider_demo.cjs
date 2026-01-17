const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function findDemo() {
    const pool = mysql.createPool({
        host: process.env.VITE_DB_HOST || 'localhost',
        user: process.env.VITE_DB_USER || 'root',
        password: process.env.VITE_DB_PASSWORD || 'password',
        database: process.env.VITE_DB_NAME || 'kitech',
    });

    try {
        console.log('Searching for PROVEEDOR or DEMO...');
        const [users] = await pool.query("SELECT id, first_name, last_name, email, role FROM users WHERE first_name LIKE '%proveedor%' OR last_name LIKE '%proveedor%' OR first_name LIKE '%demo%' OR last_name LIKE '%demo%'");
        console.log(JSON.stringify(users, null, 2));

        if (users.length === 0) {
            console.log("No user found with name PROVEEDOR or DEMO. Listing all VENDORs:");
            const [vendors] = await pool.query("SELECT id, first_name, last_name, email, role FROM users WHERE role='VENDOR' OR role='PROVIDER'");
            console.log(JSON.stringify(vendors, null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

findDemo();
