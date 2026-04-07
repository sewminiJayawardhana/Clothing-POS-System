import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AlertCircle, TrendingUp, DollarSign, PackageSearch } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
    const [analytics, setAnalytics] = useState({ sales: [], lowStock: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/analytics');
                setAnalytics(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

    const salesData = {
        labels: analytics.sales.map(s => {
            const date = new Date(s.date);
            return date.toLocaleDateString();
        }).slice().reverse(),
        datasets: [
            {
                label: 'Daily Revenue (Rs.)',
                data: analytics.sales.map(s => parseFloat(s.total_revenue)).slice().reverse(),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderRadius: 6,
            },
        ],
    };

    const totalRevenue = analytics.sales.reduce((sum, s) => sum + parseFloat(s.total_revenue), 0);
    const lowStockCount = analytics.lowStock.length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600 mb-6">
                Business Analytics
            </h2>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-800 flex items-center shadow-md hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mr-4">
                        <TrendingUp className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Revenue (7 Days)</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">Rs. {totalRevenue.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-800 flex items-center shadow-md hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mr-4">
                        <DollarSign className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sales Entries</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.sales.length}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-800 flex items-center shadow-md hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mr-4">
                        <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Low Stock Alerts</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{lowStockCount} items</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 shadow-sm">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-emerald-500 dark:text-emerald-400" />
                        Revenue Trend
                    </h3>
                    <div className="h-80 flex items-center justify-center">
                        {analytics.sales.length > 0 ? (
                            <Bar 
                                data={salesData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: { 
                                        legend: { display: false },
                                        tooltip: {
                                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                            titleColor: '#fff',
                                            bodyColor: '#fff',
                                            padding: 12,
                                            cornerRadius: 8
                                        }
                                    },
                                    scales: {
                                        y: { 
                                            beginAtZero: true, 
                                            grid: { borderDash: [4, 4], color: 'rgba(156, 163, 175, 0.1)' },
                                            ticks: { color: 'rgba(156, 163, 175, 0.8)' }
                                        },
                                        x: { 
                                            grid: { display: false },
                                            ticks: { color: 'rgba(156, 163, 175, 0.8)' }
                                        }
                                    }
                                }} 
                            />
                        ) : (
                            <p className="text-gray-500 italic">No sales data available yet.</p>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts Section */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-800 flex flex-col h-[400px]">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center pb-4 border-b dark:border-gray-800">
                        <AlertCircle className="w-5 h-5 mr-2 text-red-500 dark:text-red-400" />
                        Low Stock Items
                        <span className="ml-auto bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 py-0.5 px-2.5 rounded-full text-xs font-medium">
                            &lt; 10 units
                        </span>
                    </h3>
                    <div className="flex-1 overflow-auto -mx-2 px-2 pb-4">
                        {analytics.lowStock.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3 shadow-[inset_0_2px_4px_rgba(34,197,94,0.1)]">
                                    <PackageSearch className="w-8 h-8 text-green-500 dark:text-green-400" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">All stock levels are healthy</p>
                                <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">No items below threshold</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {analytics.lowStock.map(p => (
                                    <div key={p.id} className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-700 transition-colors">{p.name}</h4>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center space-x-2">
                                                    <span className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded border dark:border-gray-700 mr-2 font-mono shadow-sm">{p.product_code}</span>
                                                    {p.category && <span>{p.category}</span>}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 shadow-sm">
                                                    {p.stock_qty} left
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
