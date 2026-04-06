import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/suppliers');
            setSuppliers(res.data);
        } catch (err) {
            console.error('Failed to fetch suppliers', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error('Failed to fetch employees', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
        fetchEmployees();
    }, []);

    return (
        <AppContext.Provider value={{ 
            products, suppliers, employees, 
            fetchProducts, fetchSuppliers, fetchEmployees, 
            loading, isDarkMode, setIsDarkMode 
        }}>
            {children}
        </AppContext.Provider>
    );
};
