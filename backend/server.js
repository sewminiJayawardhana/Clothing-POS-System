const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Check DB Connection
app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({ status: 'ok', message: 'Database connected' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Products routes
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Products');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/:code', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Products WHERE product_code = ?', [req.params.code]);
        if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    const { product_code, name, category, retail_price, wholesale_price, stock_qty } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Products (product_code, name, category, retail_price, wholesale_price, stock_qty) VALUES (?, ?, ?, ?, ?, ?)',
            [product_code, name, category, retail_price, wholesale_price, stock_qty || 0]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, retail_price, wholesale_price, stock_qty } = req.body;
    try {
        await db.query(
            'UPDATE Products SET name = ?, category = ?, retail_price = ?, wholesale_price = ?, stock_qty = ? WHERE id = ?',
            [name, category, retail_price, wholesale_price, stock_qty, id]
        );
        res.json({ message: 'Product updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Suppliers routes
app.get('/api/suppliers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Suppliers');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/suppliers', async (req, res) => {
    const { supplier_name, contact_person, phone, address } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Suppliers (supplier_name, contact_person, phone, address) VALUES (?, ?, ?, ?)',
            [supplier_name, contact_person, phone, address]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Employees routes
app.get('/api/employees', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Employees');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/employees', async (req, res) => {
    const { name, email, role, phone, status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Employees (name, email, role, phone, status) VALUES (?, ?, ?, ?, ?)',
            [name, email, role, phone, status || 'Active']
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, phone, status } = req.body;
    try {
        await db.query(
            'UPDATE Employees SET name = ?, email = ?, role = ?, phone = ?, status = ? WHERE id = ?',
            [name, email, role, phone, status, id]
        );
        res.json({ message: 'Employee updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM Employees WHERE id = ?', [req.params.id]);
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sales & Checkout routes
app.post('/api/checkout', async (req, res) => {
    const { sale_type, total_amount, discount, items } = req.body;
    
    // Ensure total_amount is calculated or handle it empty
    
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert into Sales
        const [saleResult] = await connection.query(
            'INSERT INTO Sales (sale_type, total_amount, discount) VALUES (?, ?, ?)',
            [sale_type, total_amount, discount || 0]
        );
        const saleId = saleResult.insertId;

        // 2. Process items
        for (let item of items) {
            await connection.query(
                'INSERT INTO Sale_Items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                [saleId, item.id, item.quantity, item.price]
            );

            // 3. Deduct stock
            await connection.query(
                'UPDATE Products SET stock_qty = stock_qty - ? WHERE id = ? AND stock_qty >= ?',
                [item.quantity, item.id, item.quantity]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Sale completed successfully', saleId });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: 'Checkout failed', details: err.message });
    } finally {
        connection.release();
    }
});

// Dashboard Analytics
app.get('/api/analytics', async (req, res) => {
    try {
        // Total daily sales
        const [sales] = await db.query(`
            SELECT DATE(timestamp) as date, SUM(total_amount) as total_revenue
            FROM Sales
            GROUP BY DATE(timestamp)
            ORDER BY date DESC LIMIT 7
        `);
        // Low stock alerts
        const [lowStock] = await db.query('SELECT * FROM Products WHERE stock_qty < 10');

        res.json({ sales, lowStock });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
