const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

// Import routes
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Check DB Connection
app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({ status: 'ok', message: 'Database connected' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register routes
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
