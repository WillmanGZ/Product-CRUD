# Product-CRUD
This web application allows you to perform basic CRUD operations (Create, Read, Update, and Delete) on a list of products.

## Features
- Add new products to the list
- View all products in a dynamic table
- Edit existing product details
- Delete products from the list
- Responsive and user-friendly interface

## Getting Started
1. Clone or download this repository.
2. Install dependencies and JSON Server globally if you haven't:
   ```bash
   npm install
   npm install -g json-server
   ```
3. Start the JSON Server with the provided database (e.g., `db.json`):
   ```bash
   json-server --watch db.json --port 3000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open the local address provided by Vite (usually `http://localhost:5173`) in your web browser.
6. Start managing your products! All data will be persisted using JSON Server as a mock backend.

## License
This project is licensed under the MIT License.
