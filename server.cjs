const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
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
                SELECT c.name 
                FROM categories c
                JOIN product_categories pc ON c.id = pc.category_id
                WHERE pc.product_id = ?
                LIMIT 1
            `, [product.id]);

            product.category = cats.length > 0 ? cats[0].name : 'Sin categoría';
            product.id = product.id.toString();
            product.status = product.status ? 'ACTIVE' : 'INACTIVE';
        }

        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
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
                k.image_url as image,
                k.status,
                k.provider_id as vendorId,
                k.created_at,
                k.updated_at
            FROM kits k
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
            kit.originalPrice = kit.price * 1.15; // Calculate 15% markup as original price
        }

        res.json(kits);
    } catch (error) {
        console.error('Error fetching kits:', error);
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
