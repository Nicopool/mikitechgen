const mysql = require('mysql2/promise');

async function checkKits() {
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'kitech'
        });

        const [rows] = await pool.query("SELECT id, name, image_url FROM kits");
        console.log("--- Current Kit Images ---");
        rows.forEach(r => {
            console.log(`[${r.id}] ${r.name}: ${r.image_url ? r.image_url.substring(0, 50) + '...' : 'NULL'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkKits();
