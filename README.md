# TITANOVA - Luxury Horology & E-Commerce

A premier luxury watch e-commerce platform built with React, TypeScript, Tailwind CSS, an Express backend, MongoDB database persistence, and a grounded AI Horological Concierge.

---

## Architecture & Features

### 1. Storefront & Visual Experience
- **22 Bespoke Timepieces:** High-resolution dark studio watch photography across Men's, Women's, and Smart horological collections.
- **Classic Luxury Aesthetic:** Deep charcoal (#0c0d10), warm golds (#d4a017 / #e2b83d), Playfair Display serif typography, and subtle float animations.
- **Cart & Wishlist:** Real-time cart drawer, subtotal calculations, free shipping threshold (₹10,000+), and persistent wishlists.

### 2. Authentication & Patron Security
- **MongoDB Persistence:** User records securely stored in the `users` collection with `bcryptjs` password hashing (salt rounds: 10).
- **Session Tokens:** Secure JSON Web Tokens (JWT) signed via `AUTH_SECRET` for stateful sessions.
- **Validation:** Server-side email format verification, minimum length requirements, and duplicate email prevention.
- **Sign In & Sign Up:** Show/hide password toggles, "Remember me" option, and forgot password UI.
- **Header Integration:** Interactive patron dropdown with profile access, order history, quick concierge trigger, and sign out.
- **Demo Patron Credentials:**
  - Email: `demo@titanova.com`
  - Password: `demo123`

### 3. AI Shopping Assistant (TITANOVA Concierge)
- **Compact Floating Widget:** Fixed in the bottom-right corner (~380px–400px wide, ~560px tall), non-intrusive on desktop and responsive on mobile.
- **Catalog Grounded Knowledge:** Answers inquiries on models, prices, materials, warranty policies, shipping terms, and automatic vs. quartz calibres without hallucination.
- **Rich Product Cards:** Dynamically embeds product cards inside the chat with actual watch photography, prices in ₹, specifications, "View" link, and "Add to Cart" action.
- **Personalized Memory:** Greets authenticated users by name and persists chat sessions to the MongoDB `chat_sessions` collection.
- **Dual Engine Architecture:**
  - **Gemini AI API:** Leverages Google Gemini models when `AI_API_KEY` is provided in `.env`.
  - **Local Horological Engine:** Automatic, zero-latency fallback engine when offline or without external keys.

---

## Configuration (`.env`)

Secrets are isolated to the server environment and never exposed in client bundles:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=titanova_store
AUTH_SECRET=your_jwt_secret_key
AI_API_KEY=your_gemini_api_key_optional
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Backend & Frontend

Start the backend API server:
```bash
npm run server
```

In a second terminal, start the Vite development server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.
