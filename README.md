# 🛍️ ShopNow – E-commerce Web Application

A full-stack, single-page e-commerce application built with **React**, **Node.js/Express**, and **MongoDB**.  
Implements user authentication, product management with advanced filters, and a persistent shopping cart.

---

## ✨ Features

- **Secure JWT authentication** – signup, login, protected API routes  
- **Product CRUD** with category, price-range & text search filters  
- **Shopping cart API** – add, update, remove, clear (cart persists across logouts)  
- **Responsive React UI** – professional layout, mobile-first design  
- **State management with Context API** – global auth & cart state  
- **Toast notifications** for key user actions  
- **Sample data seeding** on first server start

---

## ⚙️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router 6, Axios, CSS |
| Backend    | Node.js 16+, Express 4              |
| Database   | MongoDB + Mongoose 7                |
| Auth       | JSON Web Tokens, bcryptjs           |
| Utilities  | express-validator, cors, dotenv     |

---
## 🧪 Sample Accounts

| Role | Email                  | Password |
|------|------------------------|----------|
| User | user@example.com       | Passw0rd |

Create additional accounts via the **Sign-Up** page.
---

## 🛠️ Scripts

| Location | Command          | Purpose                    |
|----------|------------------|----------------------------|
| backend  | `npm run dev`    | Start API with nodemon     |
| backend  | `npm start`      | Start API (production)     |
| frontend | `npm start`      | React dev server           |
| frontend | `npm run build`  | Create production build    |

---

## 📦 Deployment

1. **Backend** – deploy to Render / Railway / Heroku.  
   - Set `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`.  
2. **Frontend** – deploy `frontend/build` to Netlify or Vercel.  
   - If backend URL differs, set `REACT_APP_API_URL`.

---

