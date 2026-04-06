import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import Suppliers from './components/Suppliers';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
        {/* Fixed Sidebar */}
        <Sidebar />
        
        {/* Main Content Area: Shifted to the right to clear fixed sidebar */}
        <main className="flex-grow ml-64 min-h-screen">
          <div className="container mx-auto py-10 px-8">
            <Routes>
              <Route path="/" element={<POS />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
