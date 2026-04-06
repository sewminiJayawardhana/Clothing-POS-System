import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Search, Plus, Trash2, CreditCard, Banknote, ShieldCheck, PauseCircle, PlayCircle, History, XCircle } from 'lucide-react';

const POS = () => {
    const { products, fetchProducts } = useContext(AppContext);
    const [cart, setCart] = useState([]);
    const [searchCode, setSearchCode] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [discountType, setDiscountType] = useState('none');
    const [discountValue, setDiscountValue] = useState(0);
    const [heldCarts, setHeldCarts] = useState(() => {
        const saved = localStorage.getItem('heldCarts');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('heldCarts', JSON.stringify(heldCarts));
    }, [heldCarts]);

    const handleSearchInput = (e) => {
        const val = e.target.value;
        setSearchCode(val);
        if (val.trim() === '') {
            setSearchResults([]);
            return;
        }
        const filtered = products.filter(p => 
            p.product_code.toLowerCase().includes(val.toLowerCase()) || 
            p.name.toLowerCase().includes(val.toLowerCase())
        ).slice(0, 8); // Limit to 8 results for better UI
        setSearchResults(filtered);
    };

    const handleSelectProduct = (product) => {
        addToCart(product);
        setSearchCode('');
        setSearchResults([]);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchResults.length > 0) {
            handleSelectProduct(searchResults[0]);
        }
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
            const price = parseFloat(item.price);
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
    }, [cart, discountType, discountValue]);

    const handleCheckout = async () => {
        if (cart.length === 0) return alert('Cart is empty!');

        const payload = {
            total_amount: totals.total,
            discount: totals.discountAmt,
            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price
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

    const handleHoldCart = () => {
        if (cart.length === 0) return alert('Cart is empty!');
        const newHold = {
            id: Date.now(),
            items: cart,
            discountType,
            discountValue,
            total: totals.total,
            timestamp: new Date().toLocaleTimeString()
        };
        setHeldCarts([...heldCarts, newHold]);
        setCart([]);
        setDiscountValue(0);
        setDiscountType('none');
    };

    const handleResumeCart = (held) => {
        if (cart.length > 0) {
            if (!window.confirm('Replace current cart with held active cart?')) return;
        }
        setCart(held.items);
        setDiscountType(held.discountType);
        setDiscountValue(held.discountValue);
        setHeldCarts(heldCarts.filter(c => c.id !== held.id));
    };

    const handleDeleteHeldCart = (id) => {
        setHeldCarts(heldCarts.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-8">
            {/* Held Carts Panel */}
            {heldCarts.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-6 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <History className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <h3 className="font-bold text-amber-800 dark:text-amber-300">Held Transactions ({heldCarts.length})</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {heldCarts.map(held => (
                            <div key={held.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 min-w-[280px]">
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{held.timestamp}</div>
                                    <div className="text-lg font-black text-gray-900 dark:text-white">Rs {held.total.toFixed(2)}</div>
                                    <div className="text-[10px] text-gray-500 font-medium">{held.items.length} item(s)</div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleResumeCart(held)}
                                        className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                                        title="Resume"
                                    >
                                        <PlayCircle className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteHeldCart(held.id)}
                                        className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                        title="Discard"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Sales Interface
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Process customer orders efficiently.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Products Cart */}
                <div className="flex-1 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 h-fit">
                    <div className="flex justify-between items-center pb-6 border-b border-gray-50 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Shopping Cart</h3>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col relative">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-medium"
                                    placeholder="Live Search (Name or SKU)..."
                                    value={searchCode}
                                    onChange={handleSearchInput}
                                    autoComplete="off"
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
                                <Plus className="w-5 h-5 mr-1" /> Add
                            </button>
                        </div>

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute top-14 left-0 right-0 z-[60] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden mt-1 transform animate-in slide-in-from-top-2 duration-200">
                                {searchResults.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handleSelectProduct(p)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-left transition-colors border-b last:border-0 border-gray-100 dark:border-gray-700/50 group"
                                    >
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {p.name}
                                            </div>
                                            <div className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">
                                                {p.product_code}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-gray-900 dark:text-gray-100">
                                                Rs {parseFloat(p.price).toFixed(2)}
                                            </div>
                                            <div className={`text-[10px] font-bold ${p.stock_qty < 10 ? 'text-red-500' : 'text-green-500'}`}>
                                                {p.stock_qty} in stock
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </form>

                    <div className="mt-8 overflow-auto max-h-[500px]">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item Name</th>
                                    <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Price</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity</th>
                                    <th className="px-4 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtotal</th>
                                    <th className="px-4 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {cart.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-16 text-center text-gray-400 italic font-medium">Your cart is currently empty</td>
                                    </tr>
                                ) : cart.map((item, idx) => {
                                    const price = parseFloat(item.price);
                                    return (
                                        <tr key={idx} className="hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors group">
                                            <td className="px-4 py-5 whitespace-nowrap">
                                                <div className="font-bold text-gray-900 dark:text-gray-100">{item.name}</div>
                                                <div className="text-[10px] font-mono text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded inline-block mt-1">{item.product_code}</div>
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-gray-700 dark:text-gray-300 font-semibold">Rs {price.toFixed(2)}</td>
                                            <td className="px-4 py-5 whitespace-nowrap">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-400 transition-colors shadow-sm">-</button>
                                                    <span className="w-6 text-center font-bold dark:text-gray-200">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-400 transition-colors shadow-sm">+</button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 whitespace-nowrap text-right font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Rs {(price * item.quantity).toFixed(2)}</td>
                                            <td className="px-4 py-5 whitespace-nowrap text-center">
                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
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
                <div className="w-full lg:w-96 bg-white dark:bg-gray-900 dark:text-white p-8 rounded-3xl shadow-2xl flex flex-col h-fit border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-8 flex items-center text-gray-800 dark:text-white">
                        <CreditCard className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
                        Order Summary
                    </h3>

                    <div className="space-y-6 mb-8 flex-1">
                        <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium">
                            <span>Gross Amount</span>
                            <span className="text-gray-900 dark:text-gray-100 italic font-bold">Rs {totals.subtotal.toFixed(2)}</span>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Apply Discount</label>
                            <div className="flex gap-2">
                                <select
                                    className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-3 py-2.5 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold cursor-pointer"
                                    value={discountType}
                                    onChange={(e) => setDiscountType(e.target.value)}
                                >
                                    <option value="none">None</option>
                                    <option value="percentage">%</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                                <input
                                    type="number"
                                    className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-4 py-2.5 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none font-bold placeholder-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    disabled={discountType === 'none'}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {totals.discountAmt > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-400/10 p-3 rounded-xl border border-green-200 dark:border-green-400/20">
                                <span>Discount Total</span>
                                <span>- Rs {totals.discountAmt.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6 pb-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Net Payable Amount</span>
                            <span className="text-4xl font-black text-gray-900 dark:text-white">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mr-2 italic font-mono">LKR</span>
                                {totals.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button onClick={handleCheckout} className="w-full flex justify-center items-center py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                            <ShieldCheck className="w-6 h-6 mr-2" />
                            PAY NOW
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={handleHoldCart}
                                className="flex justify-center items-center py-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white rounded-2xl font-bold transition-all border border-amber-100 dark:border-amber-900/30"
                            >
                                <PauseCircle className="w-5 h-5 mr-2" />
                                Hold
                            </button>
                            <button className="flex justify-center items-center py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl font-bold transition-all border border-gray-200 dark:border-gray-700">
                                <Banknote className="w-5 h-5 mr-2" />
                                Cash
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POS;
