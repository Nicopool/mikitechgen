const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
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

        const sqlPath = path.join(__dirname, '..', 'database', 'add_category_to_kits.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split into separate queries because pool.query might not handle multiple statements at once by default unless configured
        const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

        for (const statement of statements) {
            console.log('Executing:', statement.substring(0, 50) + '...');
            try {
                await pool.query(statement);
            } catch (err) {
                // Ignore if column already exists
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log('Column already exists, skipping.');
                } else {
                    console.warn('Warning executing statement:', err.message);
                }
            }
        }

        console.log('Migration completed.');
        await pool.end();
    } catch (error) {
        console.error('Error running migration:', error);
        process.exit(1);
    }
}

runMigration();
