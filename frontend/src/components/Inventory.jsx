import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Package, Truck, Search, Plus, X } from 'lucide-react';

const Inventory = () => {
    const { products, fetchProducts } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Product form
    const [pForm, setPForm] = useState({ product_code: '', name: '', category: '', retail_price: '', wholesale_price: '', stock_qty: '' });

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.product_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/products', pForm);
            alert('Product added successfully!');
            setPForm({ product_code: '', name: '', category: '', retail_price: '', wholesale_price: '', stock_qty: '' });
            fetchProducts();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to add product');
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4">
            {/* Header Section */}
            <div className="pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Inventory Management
                </h2>
                <p className="text-gray-500 mt-1 text-sm font-medium">Manage your product directory and stock levels.</p>
            </div>

            {/* List Header with Search and ADD NEW */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                <div className="relative flex-grow max-w-md">
                    <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search products by name or SKU..." 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white shadow-lg bg-blue-600 hover:bg-blue-700 transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Product
                </button>
            </div>

            {/* Directory Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Details</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pricing Model</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock Level</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredProducts.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic font-medium">No products found matching your search.</td></tr>
                            ) : filteredProducts.map(p => (
                                <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</div>
                                        <div className="text-xs font-mono text-blue-600 mt-1 bg-blue-50 inline-block px-2 py-0.5 rounded border border-blue-100">{p.product_code}</div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-semibold">
                                            {p.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between w-32 border-b border-gray-50 pb-0.5">
                                                <span className="text-gray-400 text-[10px] font-bold uppercase">Retail</span>
                                                <span className="text-gray-900 font-bold">Rs {parseFloat(p.retail_price).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between w-32 pt-0.5">
                                                <span className="text-gray-400 text-[10px] font-bold uppercase">Wholesale</span>
                                                <span className="text-indigo-600 font-bold">Rs {parseFloat(p.wholesale_price).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden font-bold">
                                                <div 
                                                    className={`h-full rounded-full ${parseFloat(p.stock_qty) <= 10 ? 'bg-red-500' : 'bg-green-500'}`}
                                                    style={{ width: `${Math.min(100, (parseFloat(p.stock_qty) / 50) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                                                parseFloat(p.stock_qty) <= 10 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
                                            }`}>
                                                {p.stock_qty} unit(s)
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL WINDOW FOR ADDING NEW PRODUCT */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden transform animate-in fade-in zoom-in duration-200">
                        <div className="h-2 w-full bg-blue-600"></div>
                        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Create New Product</h3>
                                <p className="text-sm text-gray-500">Fill in the item specifications below.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleProductSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">SKU / Code</label>
                                        <input required type="text" placeholder="SH-XXX" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" value={pForm.product_code} onChange={e => setPForm({...pForm, product_code: e.target.value})} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                                        <input type="text" placeholder="General" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={pForm.category} onChange={e => setPForm({...pForm, category: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Product Name</label>
                                    <input required type="text" placeholder="Description of the item" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" value={pForm.name} onChange={e => setPForm({...pForm, name: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Retail Price (LKR)</label>
                                        <input required type="number" step="0.01" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={pForm.retail_price} onChange={e => setPForm({...pForm, retail_price: e.target.value})} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Wholesale Price (LKR)</label>
                                        <input required type="number" step="0.01" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-indigo-600" value={pForm.wholesale_price} onChange={e => setPForm({...pForm, wholesale_price: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Initial Stock Quantity</label>
                                    <input required type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={pForm.stock_qty} onChange={e => setPForm({...pForm, stock_qty: e.target.value})} />
                                </div>
                                <div className="pt-6 flex gap-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-all transform active:scale-95">Cancel</button>
                                    <button type="submit" className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg transition-all transform active:scale-95">Save Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
