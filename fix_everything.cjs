const mysql = require('mysql2/promise');

async function fixAllImages() {
    console.log('🔄 Iniciando reparación total de imágenes (Productos y Kits)...');

    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'kitech'
        });

        // 1. UPDATE PRODUCTS
        // Using image_url which is the standard convention in this DB usually
        // Categorized images
        const productImages = {
            'cpu': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600',
            'gpu': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600',
            'ram': 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=600',
            'storage': 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&q=80&w=600',
            'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600',
            'keyboard': 'https://images.unsplash.com/photo-1587829741301-308231f89013?auto=format&fit=crop&q=80&w=600',
            'mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600',
            'default': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'
        };

        // Try to update with inferred categories based on name
        const [products] = await pool.query("SELECT id, name FROM products");
        console.log(`📦 Procesando ${products.length} productos...`);

        for (const p of products) {
            let img = productImages.default;
            const name = p.name.toLowerCase();

            if (name.includes('ryzen') || name.includes('intel') || name.includes('core') || name.includes('cpu')) img = productImages.cpu;
            else if (name.includes('rtx') || name.includes('gtx') || name.includes('radeon') || name.includes('graphics')) img = productImages.gpu;
            else if (name.includes('ram') || name.includes('ddr') || name.includes('memory')) img = productImages.ram;
            else if (name.includes('ssd') || name.includes('hdd') || name.includes('nvme')) img = productImages.storage;
            else if (name.includes('monitor') || name.includes('display')) img = productImages.monitor;
            else if (name.includes('keyboard') || name.includes('teclado')) img = productImages.keyboard;
            else if (name.includes('mouse') || name.includes('raton')) img = productImages.mouse;

            // Update product (assuming column is image_url based on kits, but let's check error first)
            // If previous error said 'image' is unknown, it's likely image_url
            await pool.query("UPDATE products SET image_url = ? WHERE id = ?", [img, p.id]);
        }
        console.log('✅ Productos actualizados.');

        // 2. RE-UPDATE KITS (Just to be sure)
        const kitImages = [
            'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800'
        ];

        const [kits] = await pool.query("SELECT id FROM kits");
        for (let i = 0; i < kits.length; i++) {
            await pool.query("UPDATE kits SET image_url = ? WHERE id = ?", [kitImages[i % kitImages.length], kits[i].id]);
        }
        console.log('✅ Kits actualizados.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixAllImages();
