const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function runUpdate() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'kitech',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log('Connected to database...');

        const sqlPath = path.join(__dirname, '..', 'database', 'update_kit_images.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL script...');
        const [result] = await pool.query(sql);
        console.log('Result:', result);

        console.log('Database updated successfully.');
        await pool.end();
    } catch (error) {
        console.error('Error updating database:', error);
        process.exit(1);
    }
}

runUpdate();
