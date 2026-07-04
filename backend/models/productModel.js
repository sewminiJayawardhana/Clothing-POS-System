const db = require('../db');

const Product = {
    // Find all products
    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM Products');
        return rows;
    },

    // Find product by code
    findByCode: async (code) => {
        const [rows] = await db.query('SELECT * FROM Products WHERE product_code = ?', [code]);
        return rows[0] || null;
    },

    // Create a product
    create: async (productData) => {
        const { product_code, name, category, price, image_url, stock_qty } = productData;
        const [result] = await db.query(
            'INSERT INTO Products (product_code, name, category, price, image_url, stock_qty) VALUES (?, ?, ?, ?, ?, ?)',
            [product_code, name, category, price, image_url, stock_qty || 0]
        );
        return { id: result.insertId, ...productData };
    },

    // Update a product
    update: async (id, productData) => {
        const { name, category, price, image_url, stock_qty } = productData;
        const [result] = await db.query(
            'UPDATE Products SET name = ?, category = ?, price = ?, image_url = ?, stock_qty = ? WHERE id = ?',
            [name, category, price, image_url, stock_qty, id]
        );
        return result.affectedRows > 0;
    },

    // Decrement stock during checkout, using a specific connection for transaction safety
    decrementStock: async (connection, id, quantity) => {
        const [result] = await connection.query(
            'UPDATE Products SET stock_qty = stock_qty - ? WHERE id = ? AND stock_qty >= ?',
            [quantity, id, quantity]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Product;
