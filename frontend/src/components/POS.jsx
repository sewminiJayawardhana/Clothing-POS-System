import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Search, Plus, Trash2, CreditCard, Banknote, ShieldCheck, PauseCircle, PlayCircle, History, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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
        if (cart.length === 0) return toast.error('Cart is empty!');

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
            toast.success('Checkout successful!');
            setCart([]);
            setDiscountValue(0);
            fetchProducts(); // Refresh stock
        } catch (err) {
            console.error(err);
            toast.error('Checkout failed!');
        }
    };

    const handleHoldCart = () => {
        if (cart.length === 0) return toast.error('Cart is empty!');
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

    const performResume = (held, tId) => {
        if (tId) toast.dismiss(tId);
        setCart(held.items);
        setDiscountType(held.discountType);
        setDiscountValue(held.discountValue);
        setHeldCarts(heldCarts.filter(c => c.id !== held.id));
    };

    const handleResumeCart = (held) => {
        if (cart.length > 0) {
            toast((t) => (
                <div className="flex flex-col gap-3">
                    <p className="text-gray-900 dark:text-white font-semibold">Replace current cart with held active cart?</p>
                    <div className="flex flex-wrap gap-2 justify-end mt-1">
                        <button 
                            onClick={() => toast.dismiss(t.id)} 
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => performResume(held, t.id)} 
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                        >
                            Yes, Replace
                        </button>
                    </div>
                </div>
            ), { duration: Infinity, id: `resumeConfirm-${held.id}` });
            return;
        }
        performResume(held);
    };

    const handleDeleteHeldCart = (id) => {
        setHeldCarts(heldCarts.filter(c => c.id !== id));
    };

    const defaultImage = "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=400";

    const filteredProducts = useMemo(() => {
        if (!searchCode.trim()) return products;
        return products.filter(p => 
            p.name.toLowerCase().includes(searchCode.toLowerCase()) || 
            p.product_code.toLowerCase().includes(searchCode.toLowerCase())
        );
    }, [products, searchCode]);

    return (
        <div className="flex flex-col gap-6">
            {/* Held Transactions - Top Bar */}
            {heldCarts.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-5 rounded-3xl animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <History className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm">Active Held Carts ({heldCarts.length})</h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                        {heldCarts.map(held => (
                            <div key={held.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 min-w-[280px] hover:shadow-md transition-all">
                                <div className="flex-1">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{held.timestamp}</div>
                                    <div className="text-lg font-black text-gray-900 dark:text-white">Rs {held.total.toFixed(2)}</div>
                                    <div className="text-xs text-gray-500 font-medium">{held.items.length} item(s)</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleResumeCart(held)} className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all"><PlayCircle className="w-5 h-5" /></button>
                                    <button onClick={() => handleDeleteHeldCart(held.id)} className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all"><XCircle className="w-5 h-5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
                {/* LEFT: Product Browser (Grid) */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="relative flex-1 group">
                            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search products by identity..." 
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 rounded-2xl outline-none transition-all font-bold"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                        {filteredProducts.length === 0 ? (
                            <div className="col-span-full py-20 text-center opacity-40 italic font-bold">No products matching your search criteria.</div>
                        ) : filteredProducts.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => addToCart(p)}
                                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-900/30 transition-all group cursor-pointer active:scale-95"
                            >
                                <div className="h-32 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                                    <img src={p.image_url || defaultImage} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
                                        {p.category || 'GEN'}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{p.name}</h4>
                                    <div className="flex justify-between items-end">
                                        <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">Rs {parseFloat(p.price).toFixed(2)}</div>
                                        <div className={`text-[8px] font-bold ${p.stock_qty < 10 ? 'text-red-500' : 'text-gray-400'}`}>{p.stock_qty} IN STOCK</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Cart + Summary Sidebar */}
                <div className="lg:col-span-5 xl:col-span-4 w-full sticky top-8">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[calc(100vh-140px)]">
                        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                                <CreditCard className="w-5 h-5 mr-3 text-emerald-600" />
                                Active Order
                            </h3>
                            <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black">
                                {cart.length} ITEMS
                            </span>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="py-12 text-center text-gray-400 dark:text-gray-500 italic text-sm font-bold opacity-60">
                                    Select items from the browser to start an order.
                                </div>
                            ) : cart.map((item) => (
                                <div key={item.id} className="flex gap-3 group">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                                        <img src={item.image_url || defaultImage} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h5 className="text-[11px] font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{item.name}</h5>
                                            <span className="text-[11px] font-black text-gray-900 dark:text-white leading-none">Rs {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-700 font-bold text-xs hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">-</button>
                                                <span className="text-xs font-bold dark:text-white">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-700 font-bold text-xs hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">+</button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Footer */}
                        <div className="p-6 bg-gray-50/80 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span>Rs {totals.subtotal.toFixed(2)}</span>
                                </div>
                                
                                <div className="flex gap-2">
                                    <select
                                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-[10px] font-black uppercase rounded-xl px-3 border border-gray-100 dark:border-gray-700 focus:border-emerald-500 outline-none transition-all cursor-pointer shadow-sm"
                                        value={discountType}
                                        onChange={(e) => setDiscountType(e.target.value)}
                                    >
                                        <option value="none">PROMO</option>
                                        <option value="percentage">%</option>
                                        <option value="fixed">VAL</option>
                                    </select>
                                    <input
                                        type="number"
                                        className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2 border border-gray-100 dark:border-gray-700 focus:border-emerald-500 outline-none text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm placeholder-gray-400"
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                        disabled={discountType === 'none'}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between items-end">
                                <div>
                                    <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 italic">Total Amount</div>
                                    <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                                        <span className="text-xs font-medium mr-1">Rs</span>
                                        {totals.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 pt-2">
                                <button onClick={handleHoldCart} className="col-span-1 p-3 bg-amber-100/50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center border border-amber-200/50">
                                    <PauseCircle className="w-5 h-5" />
                                </button>
                                <button onClick={handleCheckout} className="col-span-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-none transition-all active:scale-95">
                                    <ShieldCheck className="w-5 h-5 mr-2" />
                                    CHECKOUT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POS;
