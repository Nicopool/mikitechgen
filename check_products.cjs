const mysql = require('mysql2/promise');

async function checkProducts() {
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'kitech'
        });

        // Check products with suspicious images
        const [rows] = await pool.query("SELECT id, name, image FROM products WHERE image IS NULL OR image = '' OR image LIKE '%localhost%'");
        console.log(`Found ${rows.length} products with missing/broken images.`);

        if (rows.length > 0) {
            console.log("Samples:");
            rows.slice(0, 5).forEach(r => console.log(`- [${r.id}] ${r.name} (${r.image})`));
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkProducts();
