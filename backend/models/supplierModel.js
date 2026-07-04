const db = require('../db');

const Supplier = {
    // Find all suppliers
    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM Suppliers');
        return rows;
    },

    // Create a supplier
    create: async (supplierData) => {
        const { supplier_name, contact_person, phone, address, supplied_products } = supplierData;
        const [result] = await db.query(
            'INSERT INTO Suppliers (supplier_name, contact_person, phone, address, supplied_products) VALUES (?, ?, ?, ?, ?)',
            [supplier_name, contact_person, phone, address, supplied_products]
        );
        return { id: result.insertId, ...supplierData };
    }
};

module.exports = Supplier;
