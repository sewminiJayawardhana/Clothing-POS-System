const Product = require('../models/productModel');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get product by code
const getProductByCode = async (req, res) => {
    try {
        const product = await Product.findByCode(req.params.code);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const success = await Product.update(id, req.body);
        if (!success) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getProducts,
    getProductByCode,
    createProduct,
    updateProduct
};
