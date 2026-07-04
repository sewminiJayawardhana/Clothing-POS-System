const db = require('../db');
const Sale = require('../models/saleModel');
const Product = require('../models/productModel');

// Checkout transaction logic
const checkout = async (req, res) => {
    const { total_amount, discount, items } = req.body;
    
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert into Sales using Sale model
        const saleId = await Sale.create(connection, total_amount, discount);

        // 2. Process items and deduct stock using Sale and Product models
        for (let item of items) {
            await Sale.createItem(connection, saleId, item.id, item.quantity, item.price);

            // 3. Deduct stock
            const stockDeducted = await Product.decrementStock(connection, item.id, item.quantity);
            if (!stockDeducted) {
                throw new Error(`Insufficient stock or invalid product ID for product ID ${item.id}`);
            }
        }

        await connection.commit();
        res.status(201).json({ message: 'Sale completed successfully', saleId });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: 'Checkout failed', details: err.message });
    } finally {
        connection.release();
    }
};

module.exports = {
    checkout
};
