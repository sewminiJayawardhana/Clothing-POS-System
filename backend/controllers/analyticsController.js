const Analytics = require('../models/analyticsModel');

// Get analytics dashboard data
const getAnalytics = async (req, res) => {
    try {
        const sales = await Analytics.getDailyRevenue(7);
        const lowStock = await Analytics.getLowStockAlerts(10);

        res.json({ sales, lowStock });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAnalytics
};
