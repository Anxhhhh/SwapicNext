# 🔄 SWAPIC — A Kinder Marketplace

> **Trade what you have, get what you need.** One community platform with four ways to transact: **Buy, Sell, Rent, or Barter**.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-green?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2340?style=for-the-badge&logo=razorpay)](https://razorpay.com/)

---

## 🌟 Overview

**Swapic** is a next-generation peer-to-peer circular economy marketplace designed to reduce waste and bring communities together. Unlike traditional e-commerce platforms that force cash transactions, Swapic empowers users to choose how they transact for every single item:

- 🛒 **Buy**: Purchase pre-loved or new items directly.
- 🏷️ **Sell**: List items to find them a new home and earn money.
- 🏠 **Rent**: Borrow high-value gear, gadgets, or tools for short-term daily use without buying.
- 🤝 **Barter**: Exchange an item you already own for something you need.

---

## ⚡ Key Features

### 1. Hybrid Item Swap + Cash Top-Up
When swapping items of different values, Swapic calculates the point or valuation difference. The buyer can automatically top up the remaining amount with real-time **Razorpay** payments, making trades fair and seamless.

### 2. Location-Aware Search & Distance Ranking
- Integrated Indian city switcher covering all major metropolitan and Tier-2 hubs.
- Browser GPS auto-detection with reverse geocoding to find items within 1 km, 5 km, 10 km, 25 km, or 50 km.

### 3. Fully Responsive & Mobile-First
- **Slide-Over Navigation Drawer**: Instant mobile access to search, city selection, category navigation, and profile.
- **Mobile Bottom-Sheet Filters**: Filter products without layout squishing.
- **Sticky Product Action Bar**: Instant thumb-access to Buy, Rent, or Propose Swap on phones.
- **Cross-Device Ready**: Pixel-perfect from 320px compact phones (iPhone SE) to 4K desktop screens.

### 4. Robust Authentication & Security
- **Firebase Auth**: Instant Google One-Tap sign-in and email/password authentication.
- **Demo Accounts**: Instant demo and admin testing credentials.
- **JWT & Role-based Access**: Protected trade proposals, wishlist saves, and listing management.

---

## 🏗️ Repository Architecture

This repository is structured as a full-stack monorepo:

```
SwapicNext/
├── client/                     # Next.js 16 App Router Frontend
│   ├── app/                    # Next.js App Router (page.tsx, layout.tsx, icon.svg)
│   │   ├── create/             # Create listing page
│   │   ├── explore/            # Marketplace explore & filter page
│   │   ├── item/[id]/          # Dynamic listing detail view
│   │   ├── login/              # Sign in / Register view
│   │   └── profile/            # User profile, trade offers, and wishlist
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Hero, FourWays, etc.)
│   │   ├── store/              # Zustand state stores (authStore, locationStore, listingStore)
│   │   ├── utils/              # Axios API client, Razorpay checkout handlers
│   │   └── firebase.ts         # Firebase client configuration
│   └── public/                 # Static assets, vector icons, SVG illustrations
│
└── server/                     # Express & TypeScript Backend
    ├── src/
    │   ├── config/             # Database & Firebase admin configuration
    │   ├── controllers/        # Auth, Listings, Trades, and Payments controllers
    │   ├── models/             # Mongoose schemas (User, Listing, Trade, VerificationCode)
    │   ├── routes/             # RESTful API route definitions
    │   └── utils/              # Emailer, Razorpay helpers, token generators
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection URI
- **npm** or **pnpm** / **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/SwapicNext.git
cd SwapicNext
```

### 2. Configure Backend Environment
Navigate to `server/` and create a `.env` file:
```bash
cd server
cp .env.example .env
```
Fill in the following variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/swapic
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:3000
```

### 3. Configure Frontend Environment
Navigate to `client/` and create a `.env.local` file:
```bash
cd ../client
cp .env.example .env.local
```
Fill in the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Install Dependencies & Run

#### Run the Server:
```bash
cd server
npm install
npm run dev
```
*Server starts on `http://localhost:5000`*

#### Run the Client:
```bash
cd client
npm install
npm run dev
```
*Client starts on `http://localhost:3000`*

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/firebase` | Exchange Firebase ID token for Swapic JWT | No |
| `POST` | `/api/auth/demo-login` | Instant demo login for testing | No |
| `GET` | `/api/listings` | Fetch filtered & sorted marketplace listings | No |
| `GET` | `/api/listings/:id` | Fetch listing details by ID | No |
| `POST` | `/api/listings` | Create a new listing (Sell, Rent, Barter) | Yes |
| `POST` | `/api/listings/:id/save`| Toggle item in user wishlist | Yes |
| `POST` | `/api/trades` | Propose an item barter + optional cash top-up | Yes |
| `GET` | `/api/trades/incoming` | Get incoming trade proposals | Yes |
| `GET` | `/api/trades/outgoing` | Get sent trade proposals | Yes |
| `PATCH`| `/api/trades/:id/respond`| Accept or decline a trade proposal | Yes |
| `POST` | `/api/payments/order` | Create a Razorpay checkout order | Yes |

---

## 🧪 Build & Test Verification

Verify both client and server build cleanly for production:

```bash
# Build frontend
npm --prefix client run build

# Build backend
npm --prefix server run build
```

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute with attribution.
