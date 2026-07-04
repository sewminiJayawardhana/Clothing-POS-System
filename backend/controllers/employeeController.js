const Employee = require('../models/employeeModel');

// Get all employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new employee
const createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an existing employee
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const success = await Employee.update(id, req.body);
        if (!success) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
    try {
        const success = await Employee.delete(req.params.id);
        if (!success) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
