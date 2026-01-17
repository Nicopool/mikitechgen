const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3005', 'http://localhost:3006'],
    credentials: true
}));
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.VITE_DB_HOST || 'localhost',
    port: process.env.VITE_DB_PORT || 3306,
    user: process.env.VITE_DB_USER || 'root',
    password: process.env.VITE_DB_PASSWORD || 'root',
    database: process.env.VITE_DB_NAME || 'kitech',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL database successfully!');
        console.log(`📊 Database: kitech`);
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error connecting to MySQL:', err.message);
        console.error('💡 Make sure MySQL is running and credentials are correct');
    });

const bcrypt = require('bcryptjs');

// ... (existing imports)

// ============= AUTH ENDPOINTS =============

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user info (excluding password)
        const userProfile = {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role === 'PROVIDER' ? 'VENDOR' : user.role, // Map role
            status: user.enabled ? 'ACTIVE' : 'INACTIVE',
            phone: user.phone
        };

        res.json({ user: userProfile });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= USERS ENDPOINTS =============

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, first_name, last_name, email, role, enabled as status, phone, created_at, updated_at 
            FROM users 
            ORDER BY created_at DESC
        `);

        // Transform to match frontend format
        const users = rows.map(u => ({
            id: u.id.toString(),
            email: u.email,
            name: `${u.first_name} ${u.last_name}`,
            role: u.role,
            status: u.enabled ? 'ACTIVE' : 'INACTIVE',
            phone: u.phone,
            createdAt: u.created_at
        }));

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        const updates = [];
        const values = [];

        if (name) {
            // Split name into first_name and last_name
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            updates.push('first_name = ?', 'last_name = ?');
            values.push(firstName, lastName);
        }

        if (email) { updates.push('email = ?'); values.push(email); }
        if (phone) { updates.push('phone = ?'); values.push(phone); }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        await pool.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= PRODUCTS ENDPOINTS =============

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.slug,
                p.sku,
                p.price,
                p.stock,
                p.description,
                p.image_url as image,
                p.active as status,
                p.provider_id as vendorId,
                CONCAT(u.first_name, ' ', u.last_name) as vendorName,
                p.created_at,
                p.updated_at
            FROM products p
            LEFT JOIN users u ON p.provider_id = u.id
            ORDER BY p.created_at DESC
        `);

        // Get categories for each product
        for (let product of rows) {
            const [cats] = await pool.query(`
                SELECT c.id, c.name 
                FROM categories c
                JOIN product_categories pc ON c.id = pc.category_id
                WHERE pc.product_id = ?
                LIMIT 1
            `, [product.id]);

            if (cats.length > 0) {
                product.category = cats[0].name;
                product.categoryId = cats[0].id.toString();
            } else {
                product.category = 'Sin categoría';
                product.categoryId = null;
            }
            product.id = product.id.toString();
            product.vendorId = product.vendorId ? product.vendorId.toString() : null;
            product.status = product.status ? 'ACTIVE' : 'INACTIVE';
        }

        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create product
app.post('/api/products', async (req, res) => {
    try {
        const { name, sku, price, stock, category, description, image, status, vendorId } = req.body;

        // Validation
        if (!name || !sku) {
            return res.status(400).json({ error: 'Name and SKU are required' });
        }

        // Resolve vendorId - handle demo IDs and string IDs
        let resolvedProviderId = null;
        if (vendorId) {
            // Check if vendorId is numeric
            const numericId = parseInt(vendorId);
            if (!isNaN(numericId) && numericId > 0) {
                resolvedProviderId = numericId;
            } else if (typeof vendorId === 'string' && vendorId.startsWith('demo-')) {
                // For demo IDs, find a real provider or use the first available
                const [providers] = await pool.query(
                    "SELECT id FROM users WHERE role = 'PROVIDER' LIMIT 1"
                );
                if (providers.length > 0) {
                    resolvedProviderId = providers[0].id;
                }
            }
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Convert status to boolean (ACTIVE = 1, INACTIVE = 0)
        const active = status === 'ACTIVE' ? 1 : 0;

        // Insert product
        const [result] = await pool.query(
            'INSERT INTO products (name, slug, sku, price, stock, description, image_url, active, provider_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, slug, sku, price || 0, stock || 0, description || '', image || '', active, resolvedProviderId]
        );

        const productId = result.insertId;

        // Associate with category if provided
        if (category) {
            // Find or create category
            const [categoryRows] = await pool.query('SELECT id FROM categories WHERE name = ?', [category]);
            let categoryId;

            if (categoryRows.length > 0) {
                categoryId = categoryRows[0].id;
            } else {
                // Create new category
                const categorySlug = category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                const [catResult] = await pool.query(
                    'INSERT INTO categories (name, slug, active) VALUES (?, ?, 1)',
                    [category, categorySlug]
                );
                categoryId = catResult.insertId;
            }

            // Link product to category
            await pool.query(
                'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)',
                [productId, categoryId]
            );
        }

        console.log(`✅ Product created: ${name} (ID: ${productId}, Provider: ${resolvedProviderId || 'none'})`);

        res.status(201).json({
            id: productId.toString(),
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sku, price, stock, category, description, image, status } = req.body;

        // Generate slug if name is updated
        const slug = name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : undefined;

        // Convert status to boolean
        const active = status === 'ACTIVE' ? 1 : 0;

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (name) { updates.push('name = ?'); values.push(name); }
        if (slug) { updates.push('slug = ?'); values.push(slug); }
        if (sku) { updates.push('sku = ?'); values.push(sku); }
        if (price !== undefined) { updates.push('price = ?'); values.push(price); }
        if (stock !== undefined) { updates.push('stock = ?'); values.push(stock); }
        if (description !== undefined) { updates.push('description = ?'); values.push(description); }
        if (image !== undefined) { updates.push('image_url = ?'); values.push(image); }
        if (status) { updates.push('active = ?'); values.push(active); }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        await pool.query(
            `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= KITS ENDPOINTS =============

// Get all kits
app.get('/api/kits', async (req, res) => {
    try {
        const [kits] = await pool.query(`
            SELECT 
                k.id,
                k.name,
                k.slug,
                k.description,
                k.price,
                c.id as categoryId,
                c.name as categoryName,
                k.image_url as image,
                k.status,
                k.provider_id as vendorId,
                k.created_at,
                k.updated_at
            FROM kits k
            LEFT JOIN categories c ON k.category_id = c.id
            ORDER BY k.created_at DESC
        `);

        // Get products for each kit
        for (let kit of kits) {
            const [items] = await pool.query(`
                SELECT product_id as productId, quantity
                FROM kit_items
                WHERE kit_id = ?
            `, [kit.id]);

            kit.products = items;
            kit.id = kit.id.toString();
            kit.vendorId = kit.vendorId ? kit.vendorId.toString() : null;
            kit.categoryId = kit.categoryId ? kit.categoryId.toString() : null; // Ensure string for frontend
            kit.category = kit.categoryName || 'General'; // Fallback category name
            kit.originalPrice = kit.price * 1.15; // Calculate 15% markup as original price
        }

        res.json(kits);
    } catch (error) {
        console.error('Error fetching kits:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create kit
app.post('/api/kits', async (req, res) => {
    try {
        const { name, description, products, price, originalPrice, image, status, vendorId } = req.body;

        // Validation
        if (!name || !vendorId || !products || products.length === 0) {
            return res.status(400).json({ error: 'Name, vendorId, and products are required' });
        }

        // Generate slug
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Convert status to string (default 'ACTIVE')
        const kitStatus = status || 'ACTIVE';

        // Generate default image if not provided
        // Use local default-kit.png (Nano Banana Pro style) as requested
        const defaultImage = 'http://localhost:3005/default-kit.png';
        const kitImage = image || defaultImage;

        // Insert kit
        const [result] = await pool.query(
            'INSERT INTO kits (name, slug, description, price, image_url, status, provider_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, slug, description || '', price || 0, kitImage, kitStatus, vendorId]
        );

        const kitId = result.insertId;

        // Insert kit items
        for (const product of products) {
            await pool.query(
                'INSERT INTO kit_items (kit_id, product_id, quantity) VALUES (?, ?, ?)',
                [kitId, product.productId, product.quantity || 1]
            );
        }

        res.status(201).json({
            id: kitId.toString(),
            message: 'Kit created successfully'
        });
    } catch (error) {
        console.error('Error creating kit:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update kit details (including items)
app.put('/api/kits/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, products, price, originalPrice, image, status } = req.body;

        if (!name || !products || products.length === 0) {
            return res.status(400).json({ error: 'Name and products are required' });
        }

        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Update kit basic info
        await pool.query(
            'UPDATE kits SET name = ?, slug = ?, description = ?, price = ?, status = ?, image_url = COALESCE(?, image_url) WHERE id = ?',
            [name, slug, description || '', price || 0, status || 'ACTIVE', image, id]
        );

        // Update items: Delete all and re-insert
        await pool.query('DELETE FROM kit_items WHERE kit_id = ?', [id]);

        for (const product of products) {
            await pool.query(
                'INSERT INTO kit_items (kit_id, product_id, quantity) VALUES (?, ?, ?)',
                [id, product.productId, product.quantity || 1]
            );
        }

        res.json({ message: 'Kit updated successfully' });
    } catch (error) {
        console.error('Error updating kit:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update kit image only
app.put('/api/kits/:id/image', async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL is required' });
        }

        await pool.query(
            'UPDATE kits SET image_url = ? WHERE id = ?',
            [imageUrl, id]
        );

        res.json({ message: 'Kit image updated successfully' });
    } catch (error) {
        console.error('Error updating kit image:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete kit
app.delete('/api/kits/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // First delete kit items
        await pool.query('DELETE FROM kit_items WHERE kit_id = ?', [id]);

        // Then delete the kit
        await pool.query('DELETE FROM kits WHERE id = ?', [id]);

        res.json({ message: 'Kit deleted successfully' });
    } catch (error) {
        console.error('Error deleting kit:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= ORDERS ENDPOINTS =============

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const [orders] = await pool.query(`
            SELECT 
                o.id,
                o.user_id as userId,
                CONCAT(u.first_name, ' ', u.last_name) as userName,
                u.email as userEmail,
                o.total_amount as totalAmount,
                o.status,
                o.shipping_address,
                o.shipping_city,
                o.shipping_phone,
                o.created_at as createdAt,
                o.updated_at as updatedAt
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);

        // Get items for each order
        for (let order of orders) {
            const [items] = await pool.query(`
                SELECT 
                    oi.product_id as productId,
                    p.name as productName,
                    oi.quantity,
                    oi.unit_price as price,
                    p.provider_id as vendorId,
                    CONCAT(u.first_name, ' ', u.last_name) as vendorName
                FROM order_items oi
                LEFT JOIN products p ON oi.product_id = p.id
                LEFT JOIN users u ON p.provider_id = u.id
                WHERE oi.order_id = ?
            `, [order.id]);

            order.items = items;
            order.id = order.id.toString();
            order.userId = order.userId.toString();
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= CATEGORIES ENDPOINTS =============

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, name as label, slug, active
            FROM categories
            WHERE active = TRUE
        `);

        const categories = rows.map(c => ({
            id: c.id.toString(),
            label: c.label,
            icon: 'category',
            color: 'black'
        }));

        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create category
app.post('/api/categories', async (req, res) => {
    try {
        const { name, slug, active } = req.body;
        // Simple validation
        if (!name || !slug) {
            return res.status(400).json({ error: 'Name and slug are required' });
        }

        const [result] = await pool.query(
            'INSERT INTO categories (name, slug, active) VALUES (?, ?, ?)',
            [name, slug, active ? 1 : 0]
        );

        res.status(201).json({ id: result.insertId, message: 'Category created successfully' });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete category
app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= PRODUCTS ENDPOINTS (DELETE) =============

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= USERS ENDPOINTS (PATCH STATUS) =============

// Update user status (Approve/Reject/Suspend)
app.patch('/api/users/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expecting 'ACTIVE', 'SUSPENDED', 'REJECTED'

        let enabled = 1;
        if (status === 'SUSPENDED' || status === 'REJECTED' || status === 'INACTIVE') {
            enabled = 0;
        }

        // We update the 'enabled' field based on status, 
        // Note: You might want to store the actual text status if your DB supports it, 
        // but the current schema uses boolean 'enabled'. 
        // If you need more states, you should update the DB schema. 
        // For now, mapping ACTIVE -> enabled=1, others -> enabled=0.

        // However, the frontend sends 'ACTIVE'/'REJECTED'. 
        // Let's assume we proceed with just toggling enabled for now 
        // OR ideally, we should update the table to support ENUM status if it doesn't.
        // Checking schema: role is ENUM, enabled is BOOLEAN.
        // For 'REJECTED' we might just disable them.

        await pool.query('UPDATE users SET enabled = ? WHERE id = ?', [enabled, id]);

        res.json({ message: `User status updated to ${status}` });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: error.message });
    }
});


// ============= USERS ENDPOINTS (PATCH ROLE) =============

// Update user role
app.patch('/api/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // Expecting 'USER', 'PROVIDER', 'ADMIN'

        if (!['USER', 'PROVIDER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be USER, PROVIDER, or ADMIN' });
        }

        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);

        console.log(`✅ User role updated: ID ${id} -> ${role}`);
        res.json({ message: `User role updated to ${role}` });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= PRODUCTS ENDPOINTS (PATCH STATUS) =============

// Toggle product status (Activate/Deactivate)
app.patch('/api/products/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expecting 'ACTIVE' or 'INACTIVE'

        const active = status === 'ACTIVE' ? 1 : 0;

        await pool.query('UPDATE products SET active = ? WHERE id = ?', [active, id]);

        console.log(`✅ Product status updated: ID ${id} -> ${status}`);
        res.json({ message: `Product ${status === 'ACTIVE' ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= CATEGORIES ENDPOINTS (UPDATE) =============

// Update category
app.put('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const updates = [];
        const values = [];

        if (name) { updates.push('name = ?'); values.push(name); }
        if (slug) { updates.push('slug = ?'); values.push(slug); }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        await pool.query(
            `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        console.log(`✅ Category updated: ID ${id}`);
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: error.message });
    }
});

// Toggle category status
app.patch('/api/categories/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body; // Expecting boolean or 'ACTIVE'/'INACTIVE'

        const activeValue = (active === true || active === 'ACTIVE') ? 1 : 0;

        await pool.query('UPDATE categories SET active = ? WHERE id = ?', [activeValue, id]);

        console.log(`✅ Category status updated: ID ${id} -> ${activeValue ? 'ACTIVE' : 'INACTIVE'}`);
        res.json({ message: `Category ${activeValue ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        console.error('Error updating category status:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= STATS ENDPOINTS =============

// Get dashboard stats
app.get('/api/stats/dashboard', async (req, res) => {
    try {
        const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "USER"');
        const [vendorCount] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "PROVIDER"');
        const [productCount] = await pool.query('SELECT COUNT(*) as count FROM products');
        const [orderCount] = await pool.query('SELECT COUNT(*) as count FROM orders');
        const [totalSales] = await pool.query('SELECT SUM(total_amount) as total FROM orders WHERE status = "DELIVERED"');

        res.json({
            users: userCount[0].count,
            vendors: vendorCount[0].count,
            products: productCount[0].count,
            orders: orderCount[0].count,
            totalSales: parseFloat(totalSales[0].total) || 0
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============= REPORTS ENDPOINTS =============

// Get top vendors by sales
app.get('/api/reports/top-vendors', async (req, res) => {
    try {
        const [vendors] = await pool.query(`
            SELECT 
                u.id,
                CONCAT(u.first_name, ' ', u.last_name) as name,
                u.email,
                COUNT(DISTINCT oi.order_id) as totalOrders,
                SUM(oi.quantity * oi.unit_price) as totalSales,
                COUNT(DISTINCT p.id) as totalProducts
            FROM users u
            LEFT JOIN products p ON u.id = p.provider_id
            LEFT JOIN order_items oi ON p.id = oi.product_id
            WHERE u.role = 'PROVIDER'
            GROUP BY u.id, u.first_name, u.last_name, u.email
            ORDER BY totalSales DESC
            LIMIT 10
        `);

        const formattedVendors = vendors.map(v => ({
            id: v.id.toString(),
            name: v.name,
            email: v.email,
            totalOrders: v.totalOrders || 0,
            totalSales: parseFloat(v.totalSales) || 0,
            totalProducts: v.totalProducts || 0
        }));

        res.json(formattedVendors);
    } catch (error) {
        console.error('Error fetching top vendors:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get top categories by sales
app.get('/api/reports/top-categories', async (req, res) => {
    try {
        const [categories] = await pool.query(`
            SELECT 
                c.id,
                c.name,
                COUNT(DISTINCT p.id) as totalProducts,
                COUNT(DISTINCT oi.order_id) as totalOrders,
                SUM(oi.quantity * oi.unit_price) as totalSales
            FROM categories c
            LEFT JOIN product_categories pc ON c.id = pc.category_id
            LEFT JOIN products p ON pc.product_id = p.id
            LEFT JOIN order_items oi ON p.id = oi.product_id
            GROUP BY c.id, c.name
            ORDER BY totalSales DESC
            LIMIT 10
        `);

        const formattedCategories = categories.map(c => ({
            id: c.id.toString(),
            name: c.name,
            totalProducts: c.totalProducts || 0,
            totalOrders: c.totalOrders || 0,
            totalSales: parseFloat(c.totalSales) || 0
        }));

        res.json(formattedCategories);
    } catch (error) {
        console.error('Error fetching top categories:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get orders by status
app.get('/api/reports/orders-by-status', async (req, res) => {
    try {
        const [statusData] = await pool.query(`
            SELECT 
                status,
                COUNT(*) as count,
                SUM(total_amount) as totalAmount
            FROM orders
            GROUP BY status
            ORDER BY count DESC
        `);

        const formattedData = statusData.map(s => ({
            status: s.status,
            count: s.count,
            totalAmount: parseFloat(s.totalAmount) || 0
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching orders by status:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get critical inventory (low stock products)
app.get('/api/reports/critical-inventory', async (req, res) => {
    try {
        const threshold = parseInt(req.query.threshold) || 10;

        const [products] = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.sku,
                p.stock,
                p.price,
                CONCAT(u.first_name, ' ', u.last_name) as vendorName,
                c.name as category
            FROM products p
            LEFT JOIN users u ON p.provider_id = u.id
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE p.stock <= ? AND p.active = 1
            ORDER BY p.stock ASC
        `, [threshold]);

        const formattedProducts = products.map(p => ({
            id: p.id.toString(),
            name: p.name,
            sku: p.sku || 'N/A',
            stock: p.stock,
            price: parseFloat(p.price),
            vendorName: p.vendorName || 'N/A',
            category: p.category || 'Sin categoría'
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Error fetching critical inventory:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get vendor performance
app.get('/api/reports/vendor-performance/:vendorId', async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Get vendor basic info
        const [vendorInfo] = await pool.query(`
            SELECT 
                id,
                CONCAT(first_name, ' ', last_name) as name,
                email,
                created_at as joinDate
            FROM users
            WHERE id = ? AND role = 'PROVIDER'
        `, [vendorId]);

        if (vendorInfo.length === 0) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        // Get sales stats
        const [salesStats] = await pool.query(`
            SELECT 
                COUNT(DISTINCT oi.order_id) as totalOrders,
                SUM(oi.quantity * oi.unit_price) as totalSales,
                AVG(oi.unit_price) as avgOrderValue
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            WHERE p.provider_id = ?
        `, [vendorId]);

        // Get product count
        const [productStats] = await pool.query(`
            SELECT 
                COUNT(*) as totalProducts,
                SUM(stock) as totalStock
            FROM products
            WHERE provider_id = ? AND active = 1
        `, [vendorId]);

        res.json({
            vendor: {
                id: vendorInfo[0].id.toString(),
                name: vendorInfo[0].name,
                email: vendorInfo[0].email,
                joinDate: vendorInfo[0].joinDate
            },
            performance: {
                totalOrders: salesStats[0].totalOrders || 0,
                totalSales: parseFloat(salesStats[0].totalSales) || 0,
                avgOrderValue: parseFloat(salesStats[0].avgOrderValue) || 0,
                totalProducts: productStats[0].totalProducts || 0,
                totalStock: productStats[0].totalStock || 0
            }
        });
    } catch (error) {
        console.error('Error fetching vendor performance:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Mikitech API is running', database: 'kitech' });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('========================================');
    console.log('🚀 Mikitech API Server');
    console.log('========================================');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`📊 Database: kitech`);
    console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
    console.log('========================================');
    console.log('');
});
