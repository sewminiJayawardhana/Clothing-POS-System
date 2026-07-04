const Supplier = require('../models/supplierModel');

// Get all suppliers
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new supplier
const createSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json(supplier);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getSuppliers,
    createSupplier
};
