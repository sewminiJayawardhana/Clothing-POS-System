const db = require('../db');

const Analytics = {
    // Get daily sales revenue for the past N days
    getDailyRevenue: async (limit = 7) => {
        const [rows] = await db.query(`
            SELECT DATE(timestamp) as date, SUM(total_amount) as total_revenue
            FROM Sales
            GROUP BY DATE(timestamp)
            ORDER BY date DESC LIMIT ?
        `, [limit]);
        return rows;
    },

    // Get products with stock quantity below threshold
    getLowStockAlerts: async (threshold = 10) => {
        const [rows] = await db.query('SELECT * FROM Products WHERE stock_qty < ?', [threshold]);
        return rows;
    }
};

module.exports = Analytics;
