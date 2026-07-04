const db = require('../db');

const Employee = {
    // Find all employees
    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM Employees');
        return rows;
    },

    // Create a new employee
    create: async (employeeData) => {
        const { name, email, role, phone, status } = employeeData;
        const [result] = await db.query(
            'INSERT INTO Employees (name, email, role, phone, status) VALUES (?, ?, ?, ?, ?)',
            [name, email, role, phone, status || 'Active']
        );
        return { id: result.insertId, ...employeeData };
    },

    // Update an employee
    update: async (id, employeeData) => {
        const { name, email, role, phone, status } = employeeData;
        const [result] = await db.query(
            'UPDATE Employees SET name = ?, email = ?, role = ?, phone = ?, status = ? WHERE id = ?',
            [name, email, role, phone, status, id]
        );
        return result.affectedRows > 0;
    },

    // Delete an employee
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM Employees WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Employee;
