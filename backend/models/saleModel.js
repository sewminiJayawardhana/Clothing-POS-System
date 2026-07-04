const Sale = {
    // Create a new sales header (must be run within a transaction connection)
    create: async (connection, totalAmount, discount) => {
        const [result] = await connection.query(
            'INSERT INTO Sales (total_amount, discount) VALUES (?, ?)',
            [totalAmount, discount || 0]
        );
        return result.insertId;
    },

    // Insert an item sold (must be run within a transaction connection)
    createItem: async (connection, saleId, productId, quantity, unitPrice) => {
        const [result] = await connection.query(
            'INSERT INTO Sale_Items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
            [saleId, productId, quantity, unitPrice]
        );
        return result.insertId;
    }
};

module.exports = Sale;
