import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Package, Truck, Search, Plus, X } from 'lucide-react';

const Inventory = () => {
    const { products, fetchProducts } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('cards'); // 'table' or 'cards'
    // Product form
    const [pForm, setPForm] = useState({ product_code: '', name: '', category: '', price: '', image_url: '', stock_qty: '' });

    const filteredProducts = products;

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/products', pForm);
            alert('Product added successfully!');
            setPForm({ product_code: '', name: '', category: '', price: '', image_url: '', stock_qty: '' });
            fetchProducts();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to add product');
        }
    };

    const defaultImage = "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=400";

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4">
            {/* Header Section */}
            <div className="pb-6 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Product Directory
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Browse and manage your available inventory.</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button 
                        onClick={() => setViewMode('cards')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'cards' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500'}`}
                    >
                        Card View
                    </button>
                    <button 
                        onClick={() => setViewMode('table')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500'}`}
                    >
                        Table View
                    </button>
                </div>
            </div>

            {/* List Header with ADD NEW */}
            <div className="flex justify-end pr-2">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center px-10 py-3 rounded-2xl font-bold text-white shadow-xl shadow-blue-200 dark:shadow-blue-900/40 bg-blue-600 hover:bg-blue-700 transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Product
                </button>
            </div>

            {viewMode === 'table' ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock Level</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredProducts.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic font-medium">No products found.</td></tr>
                                ) : filteredProducts.map(p => (
                                    <tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <img src={p.image_url || defaultImage} alt="" className="w-10 h-10 rounded-lg object-cover shadow-sm bg-gray-100" />
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">{p.name}</div>
                                                    <div className="text-[10px] font-mono text-gray-400 mt-0.5">{p.product_code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                                {p.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                            Rs {parseFloat(p.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                                                parseFloat(p.stock_qty) <= 10 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                            }`}>
                                                {p.stock_qty} in stock
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-gray-500 italic font-medium">No products found matching your search.</div>
                    ) : filteredProducts.map(p => (
                        <div key={p.id} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-300 group">
                            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img 
                                    src={p.image_url || defaultImage} 
                                    alt={p.name} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 dark:text-blue-400 shadow-sm">
                                    {p.category || 'General'}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-1 flex justify-between">
                                    <span>{p.product_code}</span>
                                    <span className={`font-bold ${parseFloat(p.stock_qty) <= 10 ? 'text-red-500' : 'text-green-500'}`}>
                                        {p.stock_qty} LEFT
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">{p.name}</h3>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 mr-1 italic">Rs</span>
                                        {parseFloat(p.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL WINDOW FOR ADDING NEW PRODUCT */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden transform animate-in fade-in zoom-in duration-200">
                        <div className="h-2 w-full bg-blue-600"></div>
                        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Product</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the item specifications below.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleProductSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">SKU / Code</label>
                                        <input required type="text" placeholder="SH-XXX" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" value={pForm.product_code} onChange={e => setPForm({...pForm, product_code: e.target.value})} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                                        <input type="text" placeholder="General" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={pForm.category} onChange={e => setPForm({...pForm, category: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Product Name</label>
                                    <input required type="text" placeholder="Description of the item" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" value={pForm.name} onChange={e => setPForm({...pForm, name: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Upload Product Image</label>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl transition-all hover:border-blue-500 group">
                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                                            {pForm.image_url ? (
                                                <img src={pForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Plus className="w-6 h-6 text-gray-300 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                id="p-image-upload" 
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setPForm({ ...pForm, image_url: reader.result });
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <label htmlFor="p-image-upload" className="block text-sm font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                                                {pForm.image_url ? 'Change Image' : 'Choose File'}
                                            </label>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Accepts JPG, PNG. Max 5MB.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Price (LKR)</label>
                                        <input required type="number" step="0.01" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={pForm.price} onChange={e => setPForm({...pForm, price: e.target.value})} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Initial Stock</label>
                                        <input required type="number" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={pForm.stock_qty} onChange={e => setPForm({...pForm, stock_qty: e.target.value})} />
                                    </div>
                                </div>
                                <div className="pt-6 flex gap-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 rounded-2xl font-bold transition-all transform active:scale-95">Cancel</button>
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
