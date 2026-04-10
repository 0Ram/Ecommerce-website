# 🛍️ ShopNow — Premium E-Commerce Web Application

A full-stack, production-ready e-commerce application built with **React**, **Node.js/Express**, and **MongoDB**. Features a premium dark-themed UI, secure JWT authentication, admin dashboard for product management, and a complete shopping experience.

---

## ✨ Features

### 🛒 Customer Features
- **Product Browsing** — 32+ HD products across 6 categories with search, category, and price filters
- **Secure Authentication** — JWT-based signup/login with encrypted passwords (bcrypt)
- **Shopping Cart** — Add, update quantity, remove items with real-time totals
- **Wishlist** — Save products for later with one-click add/remove
- **Checkout & Orders** — Complete order flow with shipping details and order history
- **User Profile** — View account info and manage settings

### ⚙️ Admin Features
- **Admin Dashboard** (`/admin`) — Overview with stats: total products, users, orders, categories
- **Product Management** (`/admin/products`) — Full CRUD table with search, edit, and delete
- **Add/Edit Products** (`/admin/products/new`) — Rich form with image preview, category dropdown, and validation
- **Role-Based Access** — Only admin accounts can access the admin panel

### 🎨 Design & UX
- **Dark-mode-first** premium theme with glassmorphism and gradient accents
- **Micro-animations** — Hover effects, smooth transitions, and loading states
- **Fully responsive** — Mobile-first design with hamburger menu
- **Toast notifications** — Real-time feedback for all user actions

---

## ⚙️ Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | React 19, React Router 6, Axios, Context API |
| Backend    | Node.js, Express 4, REST API                  |
| Database   | MongoDB Atlas + Mongoose 7                    |
| Auth       | JSON Web Tokens (JWT), bcryptjs               |
| Styling    | Vanilla CSS (dark theme, CSS variables)       |
| Utilities  | express-validator, cors, dotenv, react-toastify |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/0Ram/Ecommerce-website.git
cd Ecommerce-website
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

### 4. Run the Application
```bash
# Terminal 1 — Start Backend
cd backend
npm start

# Terminal 2 — Start Frontend
cd frontend
npm start
```

The app will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001

---

## 🔐 Sample Accounts

| Role  | Email                  | Password   | Access Level             |
|-------|------------------------|------------|--------------------------|
| Admin | admin@shopnow.com      | admin123   | Full access + Admin Panel |
| User  | *(create via Sign Up)* | *(any)*    | Shopping features only    |

> **Admin users** see an **⚙️ Admin** button in the navigation bar, which links to the Admin Dashboard.

---

## 📁 Project Structure

```
Ecommerce-website/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Auth, Product, Order, Wishlist logic
│   ├── middleware/      # auth.js (JWT), adminAuth.js (role check)
│   ├── models/          # User, Product, Order, Wishlist, Cart
│   ├── routes/          # API route definitions
│   ├── server.js        # Entry point + product seeding
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/       # AdminDashboard, AdminProducts, ProductForm
│   │   │   ├── Auth/        # Login, Signup
│   │   │   ├── Cart/        # Shopping cart
│   │   │   ├── Checkout/    # Checkout flow
│   │   │   ├── Home/        # Landing page
│   │   │   ├── Layout/      # Header, Footer, Layout wrapper
│   │   │   ├── Orders/      # Order history
│   │   │   ├── Products/    # ProductList, ProductDetail
│   │   │   ├── Profile/     # User profile
│   │   │   ├── Wishlist/    # Saved products
│   │   │   └── common/      # ProtectedRoute, AdminRoute
│   │   ├── context/         # AuthContext, CartContext, WishlistContext
│   │   ├── services/        # API service (Axios)
│   │   └── styles/          # Global CSS
│   └── public/
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint              | Access  | Description            |
|--------|-----------------------|---------|------------------------|
| POST   | `/api/auth/register`  | Public  | Register new user      |
| POST   | `/api/auth/login`     | Public  | Login & get JWT token  |
| GET    | `/api/auth/profile`   | Auth    | Get user profile       |
| GET    | `/api/auth/admin/stats` | Admin | Get admin dashboard stats |

### Products
| Method | Endpoint              | Access  | Description            |
|--------|-----------------------|---------|------------------------|
| GET    | `/api/products`       | Public  | List products (with filters) |
| GET    | `/api/products/:id`   | Public  | Get single product     |
| POST   | `/api/products`       | Admin   | Create new product     |
| PUT    | `/api/products/:id`   | Admin   | Update product         |
| DELETE | `/api/products/:id`   | Admin   | Delete product         |

### Cart, Orders, Wishlist
| Method | Endpoint              | Access  | Description            |
|--------|-----------------------|---------|------------------------|
| GET/POST | `/api/cart`         | Auth    | Get/update cart        |
| GET/POST | `/api/orders`       | Auth    | Get/create orders      |
| GET/POST | `/api/wishlist`     | Auth    | Get/toggle wishlist    |

---

## 🛠️ Scripts

| Location | Command          | Purpose                    |
|----------|------------------|----------------------------|
| backend  | `npm start`      | Start API server           |
| backend  | `npm run dev`    | Start with nodemon (dev)   |
| frontend | `npm start`      | React dev server           |
| frontend | `npm run build`  | Create production build    |

---

## 📦 Deployment

### Backend (Render / Railway)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`
4. Deploy

### Frontend (Vercel / Netlify)
1. Run `npm run build` in the frontend folder
2. Deploy the `frontend/build` folder
3. Set `REACT_APP_API_URL` to your deployed backend URL

---

## 🛡️ Admin Dashboard Guide

1. Login with `admin@shopnow.com` / `admin123`
2. Click **⚙️ Admin** in the navigation bar
3. **Dashboard** — View store stats (products, users, orders, categories)
4. **Manage Products** — Search, edit ✏️, or delete 🗑️ any product
5. **Add Product** — Fill the form with name, description, price, category, stock, rating, and image URL
6. **Image Tip** — Go to [unsplash.com](https://unsplash.com), find an image, copy the URL, and paste it in the form

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
