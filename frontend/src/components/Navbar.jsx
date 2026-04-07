import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, PackageSearch } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', name: 'POS (Sales)', icon: ShoppingCart },
        { path: '/inventory', name: 'Inventory', icon: PackageSearch },
        { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    ];

    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex shrink-0 items-center">
                        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
                            Shan Clothing
                        </Link>
                    </div>
                    <div className="flex space-x-8">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                                        isActive 
                                        ? 'border-emerald-500 text-gray-900' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
