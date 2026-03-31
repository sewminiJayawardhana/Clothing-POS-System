# Shan Clothing POS System

This project contains a full-stack Point of Sale (POS) and Inventory Management System built with React, Node.js, Express, and MySQL according to the project plan.

## Project Architecture

1.  **Frontend (React + Vite + Tailwind CSS)**: 
    *   Responsive and modern UI.
    *   State management via Context API (`src/context/AppContext.jsx`).
    *   React Router is used to build a SPA with 3 main screens: POS (Sales Interface), Inventory, and Dashboard.

2.  **Backend (Node.js + Express)**:
    *   RESTful API connecting the frontend with MySQL.
    *   `mysql2` package manages the database connection pools.
    *   Handles all CRUD operations for Products, Suppliers, and Checkout processes.

3.  **Database (MySQL)**:
    *   Initialization script included to structure tables correctly.

## Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   MySQL Server running locally or remotely

### 1. Database Setup
1.  Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or terminal).
2.  Execute the script located at `backend/database.sql` to create the `shans_pos` database and its tables.

### 2. Backend Setup
1.  Open a terminal and navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Open `backend/.env` and update the database connection variables if necessary (e.g., if your MySQL password is not blank).
3.  Start the Node.js server:
    ```bash
    node server.js
    ```
    *(The backend will run on http://localhost:5000)*

### 3. Frontend Setup
1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Start the Vite development server:
    ```bash
    npm run dev
    ```
3.  Open the provided localhost link (usually http://localhost:5173) in your browser.

## Features Built
*   **Inventory Module**: Add New Products (Retail/Wholesale prices) and manage Suppliers.
*   **POS Screen**: Search by product code, auto-calculate cart totals, apply discounts, select Retail vs Wholesale billing, and reduce stock quantity upon checkout.
*   **Dashboard**: Visualize Revenue trends with dynamic charts (Chart.js) and monitor Low Stock Alerts. 
