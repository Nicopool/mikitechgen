const mysql = require('mysql2/promise');

async function fixKitImages() {
    console.log('🔄 Iniciando actualización masiva de imágenes de kits...');

    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'kitech'
        });

        // Curated list of high-quality tech/gaming setup images from Unsplash
        const kitImages = [
            'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800', // Desk setup
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800', // Gaming
            'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800', // Clean desk
            'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=800', // Hardware
            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', // Retro
            'https://images.unsplash.com/photo-1552831388-6a0b3575b32a?auto=format&fit=crop&q=80&w=800', // Circuit
            'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800'  // Mouse/Keyboard
        ];

        const [kits] = await pool.query("SELECT id FROM kits");
        console.log(`📋 Encontrados ${kits.length} kits para revisar.`);

        let updatedCount = 0;
        for (let i = 0; i < kits.length; i++) {
            const kit = kits[i];
            // Assign a random image from our curated list to make it look diverse
            const randomImage = kitImages[i % kitImages.length];

            await pool.query(
                "UPDATE kits SET image_url = ? WHERE id = ?",
                [randomImage, kit.id]
            );
            updatedCount++;
        }

        console.log(`✅ ¡Éxito! Se actualizaron ${updatedCount} kits con imágenes de alta calidad.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fatal:', error);
        process.exit(1);
    }
}

fixKitImages();
