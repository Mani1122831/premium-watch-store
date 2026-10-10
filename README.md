# TITANOVA — Luxury Horology & E-Commerce

> A premium full-stack luxury watch e-commerce platform combining modern web technologies, secure authentication, MongoDB persistence, and an AI-powered Horological Concierge.

---

## ✨ Overview

**TITANOVA** is a premium luxury watch e-commerce platform designed to deliver a sophisticated digital shopping experience.

The platform combines:

- Premium luxury-watch storefront design
- 22 curated timepieces
- Men's, Women's, and Smart collections
- Product-specific watch photography
- Shopping cart and wishlist functionality
- Secure user authentication
- MongoDB persistence
- JWT-based session authentication
- AI-powered horological assistance
- Product-aware conversational recommendations
- Responsive design for desktop and mobile

The project is built with **React, TypeScript, Tailwind CSS, Express, MongoDB, and Gemini AI**.

---

## 🚀 Key Features

### 🕰️ Luxury Watch Store

- 22 curated timepieces
- Men's, Women's, and Smart collections
- Premium dark luxury aesthetic
- High-resolution product photography
- Product specifications and pricing
- Featured collections and best sellers
- New arrivals presentation

### 🛍️ Shopping Experience

- Add products to cart
- Update quantities
- Remove products
- Real-time subtotal calculation
- Wishlist support
- Persistent wishlist state
- Free shipping threshold for orders above ₹10,000
- Product quick-view and detail navigation

### 🔐 Authentication & Security

- User registration
- User login
- Logout
- Forgot-password interface
- Password visibility controls
- Remember-me option
- Server-side email validation
- Duplicate email prevention
- Password hashing with `bcryptjs`
- JWT-based authentication
- Secure authentication secret managed through environment variables

### 🤖 TITANOVA Horological Concierge

The **TITANOVA Concierge** is an AI-powered shopping assistant designed to help customers explore the watch catalog.

It can assist with:

- Watch models
- Prices
- Materials
- Specifications
- Warranty information
- Shipping information
- Automatic vs Quartz calibres
- Product discovery
- Watch recommendations

### 💬 Rich AI Product Responses

The Concierge can display product-focused responses containing:

- Watch images
- Product names
- Prices in INR (₹)
- Specifications
- Product view actions
- Add-to-cart actions

### 🧠 Dual AI Architecture

TITANOVA uses a dual-engine approach:

- Helps maintain functionality when the external AI service is unavailable

### 👤 Personalized Experience

For authenticated users:

- Personalized greeting
- User-aware Concierge interaction
- Chat session persistence
- MongoDB-backed `chat_sessions` collection

---

## 🏗️ Technology Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express

### Database

- MongoDB

### Authentication

- JSON Web Tokens (JWT)
- bcryptjs

### AI

- Google Gemini API
- Local fallback horological engine

### Development

- npm
- Git
- GitHub

---

## 🎨 Design System

TITANOVA follows a premium luxury-watch visual language.

### Primary Design Characteristics

- Deep charcoal backgrounds
- Warm gold accents
- Elegant serif typography
- Minimal luxury-inspired layouts
- Subtle animations
- Premium product presentation
- Responsive layouts

### Core Palette

```text
Deep Charcoal: #0c0d10
Warm Gold:     #d4a017
Light Gold:    #e2b83d
```

### Typography

**Playfair Display** is used for the luxury serif visual identity.

---

## 📁 Project Architecture

```text
TITANOVA
│
├── Frontend
│   ├── React
│   ├── TypeScript
│   ├── Tailwind CSS
│   └── Vite
│
├── Backend
│   ├── Express
│   ├── Authentication
│   ├── AI integration
│   └── API services
│
└── Database
    └── MongoDB
```

> The exact folder structure may evolve as development continues.

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=titanova_store

AUTH_SECRET=your_jwt_secret_key

AI_API_KEY=your_gemini_api_key
```

### 🔒 Security Notice

Never commit sensitive credentials to GitHub.

Do not expose:

- MongoDB connection strings
- Database passwords
- Gemini API keys
- JWT secrets
- SMTP passwords
- Authentication credentials

Add your environment files to `.gitignore`:

```gitignore
.env
.env.*
node_modules/
dist/
build/
```

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### 2. Enter the project directory

```bash
cd YOUR_REPOSITORY
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create `.env` and add your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=titanova_store
AUTH_SECRET=your_jwt_secret_key
AI_API_KEY=your_gemini_api_key
```

---

## ▶️ Running the Application

### Start the backend

```bash
npm run server
```

### Start the frontend

Open a second terminal:

```bash
npm run dev
```

### Open the application

```text
http://localhost:5173
```

---

## 🔄 Application Flow

```text
User
  │
  ▼
TITANOVA Storefront
  │
  ├── Browse Watches
  │
  ├── View Product
  │
  ├── Add to Cart
  │
  ├── Wishlist
  │
  ├── Authentication
  │
  └── TITANOVA Concierge
          │
          ▼
      Gemini AI
          │
          └── Local fallback engine
          │
          ▼
        Response
          │
          ▼
      Product Recommendations
          │
          ▼
      MongoDB Persistence
```

---

## 🧩 Core MongoDB Collections

### `users`

Stores registered user information and authentication-related data.

### `chat_sessions`

Stores authenticated user Concierge chat sessions.

---

## 🖼️ Product Experience

Each watch is presented as an individual product within the TITANOVA catalog.

The product experience is designed to support:

- Product-specific imagery
- Product specifications
- Pricing
- Product details
- Shopping actions
- AI-assisted discovery

> Product media should always remain mapped to the correct product.

---

## 🤖 AI Concierge Design

The TITANOVA Concierge follows a catalog-focused architecture.

```text
Customer Question
       │
       ▼
AI Concierge
       │
       ├── Catalog Information
       ├── Product Details
       ├── Pricing
       ├── Specifications
       └── Shopping Context
       │
       ▼
Generated Response
       │
       ▼
Product Cards / Recommendations
```

The AI experience is designed to keep responses grounded in the available watch catalog and platform information.

---

## 🛡️ Security Principles

TITANOVA follows several application security practices:

- Password hashing with `bcryptjs`
- JWT-based authentication
- Environment-based secret management
- Server-side validation
- Duplicate account prevention
- Sensitive credentials excluded from client bundles

---

## 📱 Responsive Experience

The storefront is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

The AI Concierge also adapts to smaller screens while maintaining a compact shopping experience.

---

## 📸 Screenshots

Add your real project screenshots here:

```markdown
![Homepage](./screenshots/homepage.png)

![Product Page](./screenshots/product-page.png)

![AI Concierge](./screenshots/ai-concierge.png)

![Shopping Cart](./screenshots/cart.png)
```

Recommended screenshots:

1. Homepage
2. Watch collection
3. Product detail page
4. AI Concierge
5. Shopping cart
6. Login
7. Mobile responsive view

---

## 🎥 Demo

### Live Demo

[Visit TITANOVA](YOUR_LIVE_DEMO_URL)

### GitHub Repository

[View Source Code](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY)

---

## 🧪 Development Checklist

Before deployment, verify:

- [ ] Frontend builds successfully
- [ ] Backend starts successfully
- [ ] MongoDB connection works
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Forgot-password flow works
- [ ] Cart functionality works
- [ ] Wishlist functionality works
- [ ] Product pages work
- [ ] AI Concierge works
- [ ] Product images load correctly
- [ ] Responsive layout works
- [ ] No secrets are committed
- [ ] No broken links remain
- [ ] No critical browser console errors remain

---

## 🔮 Future Enhancements

Potential future improvements include:

- Advanced product filtering
- Watch comparison
- Interactive 3D product visualization
- Exploded-view watch assembly
- Product-specific assembly videos
- Advanced AI recommendations
- Order tracking
- Admin dashboard
- Inventory management
- Payment gateway integration
- Customer reviews and ratings
- Enhanced analytics

---

## 👨‍💻 Project Purpose

TITANOVA was developed as a full-stack portfolio project to explore the integration of:

**Modern frontend development + backend APIs + MongoDB + authentication + AI-powered commerce.**

The project demonstrates how AI can be integrated into an e-commerce workflow to create a more interactive and personalized shopping experience.

---

## 📌 Important Note

TITANOVA is a portfolio/development project.

Product information, images, pricing, policies, and AI responses should be reviewed and verified before being used in a production commercial environment.

---

## 📄 License

This project is available under the license specified in the repository.

If no license has been added yet, add one before presenting the repository as an open-source project.

---

## ⭐ Support

If you find the project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 🔖 GitHub Topics

```text
react
typescript
tailwindcss
vite
express
nodejs
mongodb
jwt
bcryptjs
gemini-ai
artificial-intelligence
ecommerce
luxury-watch
watch-store
full-stack
ai-assistant
```

---

## 📝 GitHub Repository Description

Use this as the GitHub repository description:

> Premium AI-powered luxury watch e-commerce platform built with React, TypeScript, Express, MongoDB, and Gemini AI.

# ⌚ Premium Watch Store

A premium e-commerce website designed to deliver a modern luxury watch shopping experience.

## 🌐 Live Demo

**Website:** https://premium-watch-store-phi.vercel.app/login

## ✨ Features

- User registration and login
- Premium watch product catalog
- Product search and filtering
- Watch product details and images
- Responsive user interface
- AI-powered chatbot (if enabled in the deployed version)
- Secure authentication and shopping experience

## 🛠️ Technologies Used

- Frontend: React.js, HTML, CSS, JavaScript
- Backend: Node.js and Express.js (if configured)
- Database: MongoDB (if configured)
- Deployment: Vercel

## 🚀 Run Locally

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Open the project folder in VS Code.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the frontend and backend using the commands configured in your project.

## 👨‍💻 Developer

**Manikanta**  
B.Tech — Computer Science and Engineering  
Kallam Haranadha Reddy Institute of Technology

---

*Experience premium watch shopping through a modern digital storefront.*

