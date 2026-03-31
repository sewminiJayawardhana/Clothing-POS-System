import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Truck, Search, Plus, X, Phone, User, MapPin } from 'lucide-react';

const Suppliers = () => {
    const { suppliers, fetchSuppliers } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Supplier form
    const [sForm, setSForm] = useState({ supplier_name: '', contact_person: '', phone: '', address: '' });

    const handleSupplierSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/suppliers', sForm);
            alert('Supplier added successfully!');
            setSForm({ supplier_name: '', contact_person: '', phone: '', address: '' });
            fetchSuppliers();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to add supplier');
        }
    };

    const filteredSuppliers = suppliers.filter(s => 
        s.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4">
            {/* Header Section */}
            <div className="pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Supplier Directory
                </h2>
                <p className="text-gray-500 mt-1 text-sm font-medium">Manage your product vendors and contact details.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                <div className="relative flex-grow max-w-md">
                    <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by vendor name or contact person..." 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white shadow-lg bg-indigo-600 hover:bg-indigo-700 transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Register New Supplier
                </button>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supplier Name</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Contact</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business Address</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredSuppliers.length === 0 ? (
                                <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-500 italic font-medium">No vendors found matching your search.</td></tr>
                            ) : filteredSuppliers.map(s => (
                                <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mr-3 shadow-inner">
                                                {s.supplier_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{s.supplier_name}</div>
                                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mt-0.5">Supplier ID: #S{s.id.toString().padStart(3, '0')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center text-gray-700 font-semibold">
                                                <User className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                                                <span>{s.contact_person}</span>
                                            </div>
                                            <div className="flex items-center text-indigo-600 font-mono text-sm">
                                                <Phone className="w-3.5 h-3.5 mr-2 text-indigo-300" />
                                                <span>{s.phone || 'No phone'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-start text-gray-500 text-sm max-w-sm italic leading-relaxed">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-300 mt-0.5 flex-shrink-0" />
                                            <span>{s.address || 'No address registered for this vendor.'}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL WINDOW FOR ADDING NEW SUPPLIER */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    
                    <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden transform animate-in fade-in zoom-in duration-200">
                        <div className="h-2 w-full bg-indigo-600"></div>
                        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Register New Supplier</h3>
                                <p className="text-sm text-gray-500">Add a new product source to your directory.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSupplierSubmit} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Supplier Business Name</label>
                                    <input required type="text" placeholder="e.g. Acme Fabric Industries" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-bold" 
                                        value={sForm.supplier_name} onChange={e => setSForm({...sForm, supplier_name: e.target.value})} 
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Contact Person</label>
                                        <input type="text" placeholder="e.g. Mark Stevens" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                            value={sForm.contact_person} onChange={e => setSForm({...sForm, contact_person: e.target.value})} 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                                        <input type="text" placeholder="+94 XX XXX XXX" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono" 
                                            value={sForm.phone} onChange={e => setSForm({...sForm, phone: e.target.value})} 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Business Address</label>
                                    <textarea rows="3" placeholder="Enter full business location..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                        value={sForm.address} onChange={e => setSForm({...sForm, address: e.target.value})} 
                                    ></textarea>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-all transform active:scale-95">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all transform active:scale-95">
                                        Finish & Add Supplier
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

export default Suppliers;
