import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Search, Plus, Trash2, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

const POS = () => {
    const { products, fetchProducts } = useContext(AppContext);
    const [cart, setCart] = useState([]);
    const [searchCode, setSearchCode] = useState('');
    const [saleType, setSaleType] = useState('Retail');
    const [discountType, setDiscountType] = useState('none');
    const [discountValue, setDiscountValue] = useState(0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchCode) return;
        const product = products.find(p => p.product_code.toLowerCase() === searchCode.toLowerCase());
        if (product) {
            addToCart(product);
        } else {
            alert('Product not found!');
        }
        setSearchCode('');
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => 
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) return;
        setCart(cart.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const totals = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => {
            const price = saleType === 'Retail' ? parseFloat(item.retail_price) : parseFloat(item.wholesale_price);
            return sum + (price * item.quantity);
        }, 0);

        let discountAmt = 0;
        if (discountType === 'percentage') {
            discountAmt = subtotal * (discountValue / 100);
        } else if (discountType === 'fixed') {
            discountAmt = parseFloat(discountValue) || 0;
        }

        const total = Math.max(0, subtotal - discountAmt);

        return { subtotal, discountAmt, total };
    }, [cart, saleType, discountType, discountValue]);

    const handleCheckout = async () => {
        if (cart.length === 0) return alert('Cart is empty!');
        
        const payload = {
            sale_type: saleType,
            total_amount: totals.total,
            discount: totals.discountAmt,
            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: saleType === 'Retail' ? item.retail_price : item.wholesale_price
            }))
        };

        try {
            await axios.post('http://localhost:5000/api/checkout', payload);
            alert('Checkout successful!');
            setCart([]);
            setDiscountValue(0);
            fetchProducts(); // Refresh stock
        } catch (err) {
            console.error(err);
            alert('Checkout failed!');
        }
    };

    return (
        <div className="space-y-6">
            <div className="pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Sales Interface
                </h2>
                <p className="text-gray-500 mt-1 text-sm font-medium">Process retail and wholesale orders efficiently.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Products Cart */}
                <div className="flex-1 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-fit">
                    <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">Shopping Cart</h3>
                        
                        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl shadow-inner">
                            <button 
                                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${saleType === 'Retail' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                onClick={() => setSaleType('Retail')}
                            >
                                RETAIL
                            </button>
                            <button 
                                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${saleType === 'Wholesale' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                                onClick={() => setSaleType('Wholesale')}
                            >
                                WHOLESALE
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="mt-8 flex gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" 
                                placeholder="Scan or enter product code..." 
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center">
                            <Plus className="w-5 h-5 mr-2" /> Add Item
                        </button>
                    </form>

                    <div className="mt-8 overflow-auto max-h-[500px]">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item Name</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Price</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity</th>
                                    <th className="px-4 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtotal</th>
                                    <th className="px-4 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {cart.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-16 text-center text-gray-400 italic font-medium">Your cart is currently empty</td>
                                    </tr>
                                ) : cart.map((item, idx) => {
                                    const price = saleType === 'Retail' ? parseFloat(item.retail_price) : parseFloat(item.wholesale_price);
                                    return (
                                        <tr key={idx} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="px-4 py-5 whitespace-nowrap">
                                                <div className="font-bold text-gray-900">{item.name}</div>
                                                <div className="text-[10px] font-mono text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-1">{item.product_code}</div>
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-gray-700 font-semibold">Rs {price.toFixed(2)}</td>
                                            <td className="px-4 py-5 whitespace-nowrap">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-600 transition-colors shadow-sm">-</button>
                                                    <span className="w-6 text-center font-bold">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-600 transition-colors shadow-sm">+</button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-right font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Rs {(price * item.quantity).toFixed(2)}</td>
                                            <td className="px-4 py-5 whitespace-nowrap text-center">
                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-96 bg-gray-900 text-white p-8 rounded-3xl shadow-2xl flex flex-col h-fit">
                    <h3 className="text-xl font-bold mb-8 flex items-center">
                        <CreditCard className="w-6 h-6 mr-3 text-blue-400" />
                        Order Summary
                    </h3>
                    
                    <div className="space-y-6 mb-8 flex-1">
                        <div className="flex justify-between text-gray-400 font-medium">
                            <span>Gross Amount</span>
                            <span className="text-gray-100 italic">Rs {totals.subtotal.toFixed(2)}</span>
                        </div>

                        <div className="pt-6 border-t border-gray-800">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Apply Discount</label>
                            <div className="flex gap-2">
                                <select 
                                    className="bg-gray-800 text-white rounded-xl px-3 py-2.5 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold cursor-pointer"
                                    value={discountType}
                                    onChange={(e) => setDiscountType(e.target.value)}
                                >
                                    <option value="none">None</option>
                                    <option value="percentage">%</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                                <input 
                                    type="number" 
                                    className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2.5 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold placeholder-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    disabled={discountType === 'none'}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {totals.discountAmt > 0 && (
                            <div className="flex justify-between text-green-400 font-bold bg-green-400/10 p-3 rounded-xl border border-green-400/20">
                                <span>Discount Total</span>
                                <span>- Rs {totals.discountAmt.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-800 pt-6 pb-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Net Payable Amount</span>
                            <span className="text-4xl font-black text-white">
                                <span className="text-sm font-medium text-blue-400 mr-2 italic font-mono">LKR</span>
                                {totals.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button onClick={handleCheckout} className="w-full flex justify-center items-center py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-900/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                            <ShieldCheck className="w-6 h-6 mr-2" />
                            PAY NOW
                        </button>
                        <button className="w-full flex justify-center items-center py-4 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-2xl font-bold transition-all border border-gray-800">
                            <Banknote className="w-5 h-5 mr-2" />
                            Cash Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POS;
