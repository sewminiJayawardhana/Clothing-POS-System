import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, PackageSearch, Users, Truck, LogOut } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', name: 'POS (Sales)', icon: ShoppingCart },
        { path: '/inventory', name: 'Inventory', icon: PackageSearch },
        { path: '/suppliers', name: 'Suppliers', icon: Truck },
        { path: '/employees', name: 'Employees', icon: Users },
        { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white shadow-2xl flex flex-col z-50">
            {/* Logo Area */}
            <div className="p-6">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Shan Clothing
                </Link>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">POS & Inventory v1.0</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 mt-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                            }`}
                        >
                            <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="font-semibold text-sm">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-gray-800">
                <button className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="font-semibold text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
