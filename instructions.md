# Project Plan: Shan Clothing POS System

A comprehensive Point of Sale (POS) and Inventory Management System designed for **Shan Clothing**, supporting both Retail and Wholesale operations.

---

## 1. Business Requirements (Business Logic)

### A. Inventory & Product Management
* **Product Coding:** Start the process by entering a unique product code (SKU/Barcode).
* **Pricing Tiers:** Support for two pricing models: **Retail Price** and **Wholesale Price**.
* **Stock Tracking:** Real-time updates when sales occur or new stocks arrive from suppliers.
* **Supplier Management:** Maintain a database of Garment suppliers and track purchase orders.

### B. Sales & Billing
* **Hybrid Sales:** Ability to toggle between Retail and Wholesale modes during checkout.
* **Discounts:** Option to apply percentage or fixed-amount discounts.
* **Payment Methods:** Support for Cash and Card payments.
* **Receipt Generation:** Printing or digital generation of bills for customers.

### C. Reporting
* **Daily Sales:** Summary of total revenue and profit for the day.
* **Low Stock Alerts:** Notifications when items go below a certain threshold.
* **Supplier Reports:** History of purchases made from specific garments.

---

## 2. Technical Requirements

### A. Tech Stack
* **Frontend:** React.js (Single Page Application)
* **Styling:** Tailwind CSS (Responsive and Modern UI)
* **Backend:** Node.js with Express (to connect Frontend and DB)
* **Database:** MySQL (Relational DB for structured data)
* **State Management:** React Context API or Redux Toolkit

### B. Database Schema (Tables)
1.  **Products:** `id`, `product_code`, `name`, `category`, `retail_price`, `wholesale_price`, `stock_qty`.
2.  **Suppliers:** `id`, `supplier_name`, `contact_person`, `phone`, `address`.
3.  **Sales:** `id`, `sale_type` (Retail/Wholesale), `total_amount`, `discount`, `timestamp`.
4.  **Sale_Items:** `id`, `sale_id`, `product_id`, `quantity`, `unit_price`.

---

## 3. Functional Instructions for Development

### Phase 1: Setup & DB Design
1. Initialize a React project with Tailwind CSS.
2. Set up the MySQL database with the tables mentioned above.
3. Create a Node.js/Express server to handle API requests.

### Phase 2: Inventory Module
1. Create a form to add new products/suppliers.
2. Implement the "Product Code Search" functionality where entering a code fetches all details from the DB.

### Phase 3: Sales Interface (POS Screen)
1. Build a POS dashboard with a search bar for Product Codes.
2. Create a "Cart" system that calculates totals based on the selected mode (Retail or Wholesale).
3. Implement a "Checkout" button that updates the MySQL `stock_qty` and records the sale.

### Phase 4: Reporting & UI
1. Create a "Dashboard" to visualize sales using charts (e.g., Chart.js).
2. Ensure the UI is clean and fast for high-traffic shop hours.