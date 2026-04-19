import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Users, Search, Plus, X, UserPlus, Phone, Mail, ShieldCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Employees = () => {
    const { employees, fetchEmployees } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Employee form
    const [form, setForm] = useState({ name: '', email: '', role: '', phone: '', status: 'Active' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/employees', form);
            toast.success('Employee added successfully!');
            setForm({ name: '', email: '', role: '', phone: '', status: 'Active' });
            fetchEmployees();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to add employee');
        }
    };

    const executeDelete = async (id, tId) => {
        toast.dismiss(tId);
        try {
            await axios.delete(`http://localhost:5000/api/employees/${id}`);
            toast.success('Employee removed successfully!');
            fetchEmployees();
        } catch (err) {
            toast.error('Failed to delete employee');
        }
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-gray-900 dark:text-white font-semibold">Are you sure you want to remove this employee?</p>
                <div className="flex flex-wrap gap-2 justify-end mt-1">
                    <button 
                        onClick={() => toast.dismiss(t.id)} 
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => executeDelete(id, t.id)} 
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                    >
                        Yes, Remove
                    </button>
                </div>
            </div>
        ), { duration: Infinity, id: `deleteConfirm-${id}` });
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Employee Management
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Add, update and monitor your business staff.</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                <div className="relative flex-grow max-w-md">
                    <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search staff by name or role..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white shadow-lg bg-emerald-600 hover:bg-emerald-700 transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Register Employee
                </button>
            </div>

            {/* List Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                        <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name / Profile</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business Role</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredEmployees.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic font-medium">No staff members found matching your search.</td></tr>
                            ) : filteredEmployees.map(emp => (
                                <tr key={emp.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg mr-3 shadow-inner">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">{emp.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5" />
                                            <span className="font-semibold text-gray-700 dark:text-gray-300 uppercase text-[11px] tracking-wider">{emp.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                                                <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                <span>{emp.email || 'No email'}</span>
                                            </div>
                                            <div className="flex items-center text-gray-700 dark:text-gray-300 font-mono">
                                                <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                <span>{emp.phone || 'No phone'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${emp.status === 'Active' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30'
                                            }`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                        <button onClick={() => handleDelete(emp.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all transform active:scale-90">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL WINDOW FOR ADDING NEW EMPLOYEE */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>

                    <div className="relative bg-white dark:bg-gray-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden transform animate-in fade-in zoom-in duration-200">
                        <div className="h-2 w-full bg-emerald-600"></div>
                        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Register New Staff Member</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Add an employee to the system directory.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Staff Member Name</label>
                                    <input required type="text" placeholder="e.g. John Doe" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-semibold"
                                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Work Email</label>
                                        <input type="email" placeholder="john@shanclothing.com" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                                        <input required type="text" placeholder="071-XXX-XXXX" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
                                            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Assigned Role</label>
                                        <select required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                                        >
                                            <option value="">Select Role...</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Cashier">Cashier</option>
                                            <option value="Inventory Handler">Inventory Handler</option>
                                            <option value="Supervisor">Supervisor</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Employment Status</label>
                                        <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 rounded-2xl font-bold transition-all transform active:scale-95">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg  transition-all transform active:scale-95">
                                        Save Member
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
