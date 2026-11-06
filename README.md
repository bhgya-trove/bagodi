# BAGODI Shopping Mall — Premium E-Commerce Website
> **Powered by Techmasters · Bidar, Karnataka, India**

A premium, modern, fully responsive fashion e-commerce demonstration website developed for **BAGODI Shopping Mall**, an established clothing and readymade garments retail center located in Bidar, Karnataka, India.

---

## 🌟 Features

- **Continuous Hero Slideshow**: Smooth 5-second automatic Ken Burns zoom and crossfade animations.
- **Three-Department Catalogue**: Streamlined focus on **Men**, **Women**, and **Kids** clothing.
- **Product Presentation**: Dual-image hover transitions, available size indicators, color previews, and real-time inventory badges (`In Stock`, `Only X left`, `Out of Stock`).
- **Dynamic Favourites / Wishlist**: Real-time heart toggle with immediate navbar count badge updates.
- **Variant-Enforced Shopping Bag**: Requires size and colour selection before adding to cart, with variant stock validation.
- **4-Step Checkout Flow**:
  - Customer details validation (10-digit Indian mobile number).
  - Delivery address validation (6-digit Indian PIN code).
  - Order review with garment variant details and pricing breakdown.
  - Cash on Delivery (COD) support.
- **Order Confirmation & Tracking**: Generates unique Order IDs (`BAG-2026-XXXXX`), auto-deducts inventory, and provides printable tax invoices.
- **Customer Order History**: Filter and track orders across all lifecycle statuses (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`).
- **Store Admin ERP**: Complete management suite for incoming orders, variant inventory matrix, customer profiles, promotional coupons, and store settings.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/) with LocalStorage persistence
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation
```bash
git clone https://github.com/bhgya-trove/bagodi.git
cd bagodi
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
```

---

## 🔐 Demo Credentials

- **Admin ERP Dashboard**: `/admin`
  - **Email**: `admin@bagodi.com`
  - **Password**: `admin`
- **Customer Accounts**: Can be created directly on the `/register` page.

---

## 📍 Store Location
**BAGODI Shopping Mall**  
Opposite Shivaji Statue, Main Market Commercial Road,  
Bidar, Karnataka - 585401, India.
