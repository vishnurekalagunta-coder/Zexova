# Zexova

> **TAGLINE:** *Buy Smart. Sell Easy. Discover More.*

**Zexova** (MarketNest) is a unified, commercial-grade full-stack e-commerce and marketplace ecosystem built with **React.js, TypeScript, Tailwind CSS, Framer Motion** and **Java 21 / Spring Boot 3**. 

Unlike conventional e-commerce stores, MarketNest combines four core services into one cohesive platform:
1. **Used Products Marketplace** — Peer-to-peer verified second-hand trade with condition grading and direct price negotiation.
2. **New Products Shopping** — Factory-sealed brand new retail products directly from accredited merchant storefronts.
3. **AI Price Estimator** — Intelligent resale valuation engine that computes fair market value, recommended selling price, quick-sale price, and depreciation rates.
4. **Nearby Store Finder** — Interactive Google Maps Platform integration to locate physical stores with real-time distance calculations and turn-by-turn directions.

---

## Architecture & Technology Stack

### Frontend
- **Framework:** React.js 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom Design System
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router v6
- **HTTP Client:** Axios with JWT request interceptors
- **State & Data:** Context API + TanStack React Query

### Backend
- **Language:** Java 21+ (Compatible with Java 24)
- **Framework:** Spring Boot 3.3.5
- **Security:** Spring Security 6 + JWT (JSON Web Tokens) + BCrypt Hashing
- **ORM / Persistence:** Spring Data JPA + Hibernate
- **Build Tool:** Apache Maven
- **Architecture:** Clean Layered Architecture (`controller/`, `service/`, `engine/`, `repository/`, `entity/`, `dto/`, `security/`, `exception/`, `config/`)

### Database
- **Primary Database:** MySQL 8.0+
- **In-Memory / Dev Dialect:** H2 (MySQL Mode) for out-of-the-box local execution without requiring pre-installed MySQL
- **Schema:** Fully normalized 3NF schema with foreign keys, indexing, and audit timestamps.

---

## Quick Start Guide

### 1. Running the Frontend

From the project root:
```bash
npm run dev
```
*(Or inside `frontend/` folder: `npm run dev`)*

The frontend web app will open at: **`http://localhost:3000`**

To build for production:
```bash
npm run build
```

---

### 2. Running the Java Spring Boot Backend

The backend is configured to run out-of-the-box with embedded MySQL compatibility mode (`dev` profile) or connected directly to a live MySQL 8 database (`mysql` profile).

#### Option A: Quick Standalone Run (Embedded Dev)
```bash
cd backend
mvn spring-boot:run
```
The REST API server will start on port **`8080`**.
- Base API URL: `http://localhost:8080/api`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:marketnestdb`, User: `sa`, Password: empty)

#### Option B: Running with MySQL via Docker Compose
From the root directory:
```bash
docker-compose up -d
```
Then start the backend with the MySQL profile:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

---

## Pre-Configured Demo Accounts

For immediate evaluation and testing, MarketNest includes pre-seeded accounts across all 4 system roles:

| Role | Email | Password | Access & Features |
|------|-------|----------|-------------------|
| **Platform Admin** | `admin@marketnest.com` | `password123` | Full control center, product moderation queue, shop accreditation, security reports |
| **Verified Shop Partner** | `shop@marketnest.com` | `password123` | Retail catalog management, warehouse stock levels, customer reviews, store analytics |
| **Used Item Seller** | `seller@marketnest.com` | `password123` | C2C pre-owned listings, bargaining offers, mark as sold, earnings metrics |
| **Shopper / Customer** | `customer@marketnest.com` | `password123` | Used & new catalog browsing, AI price check, cart, orders, wishlist |

> **Tip:** You can switch between roles in 1-click using the **"Role Switcher"** in the top navigation bar!

---

## 4 Core Pillars Overview

### 1. Used Products Marketplace (`/used-products`)
- 14 specialized categories (Smartphones, Laptops, Gaming Devices, Motorcycles, Kitchen Appliances, Furniture, etc.)
- Multi-faceted filtering by Category, Condition (`LIKE_NEW`, `EXCELLENT`, `GOOD`, `FAIR`, `POOR`), Price range, and City
- Detailed product view with thumbnail image gallery, verified seller card, included accessories checklist, and safety tips
- **Interactive Bargaining & Offer Modal:** Send custom price proposals directly to the seller
- **Report Listing:** Flag incorrect specs, counterfeit goods, or scam behavior to moderation

### 2. New Products Shopping (`/new-products`)
- Factory-sealed retail products from verified merchant storefronts
- Brand warranty badge, stock counters, and GST invoices
- Shopping cart with quantity adjustment, promo codes (`ZEXOVA` for 10% off), itemized subtotals, and checkout flow
- **Razorpay Simulation:** Card, UPI, and Cash on Delivery support with instant confirmation (`/order-success`)

### 3. AI Price Estimator (`/estimator`)
- 8-Step Intelligent Resale Valuation Wizard
- Configurable depreciation engine based on category lifecycle curves, brand liquidity multipliers, physical condition grades, warranty status, and original accessories
- Computes:
  - **Recommended Selling Price**
  - **Quick-Sale Price** (for selling in 24–48 hours)
  - **Estimated Market Price Range** (Min / Max)
  - **Estimated Depreciation Percentage**
  - **Physical Condition Analysis**
  - **Market Demand Score** (`HIGH` / `MODERATE` / `LOW`)
- **1-Click Autofill:** "List My Product for Sale" transfers all estimated specs directly into the Sell Product form (`/sell`)

### 4. Nearby Store Finder (`/nearby-stores`)
- Google Maps Platform geolocation detection with manual fallback
- Radius filter (5 km, 10 km, 20 km, 50 km) and category selection
- Interactive map markers with store flyouts and Haversine distance calculations
- 1-Click **"Get Directions"** linking directly to Google Maps navigation

---

## Environment Variables Configuration

Create a `.env` file in `frontend/` or set environment variables in your deployment environment:

```env
# Frontend
VITE_API_URL=/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here

# Backend (application.yml or system environment)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=marketnest_db
MYSQL_USER=root
MYSQL_PASSWORD=root
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
RAZORPAY_KEY_ID=rzp_test_MarketNestDemoKey
RAZORPAY_KEY_SECRET=rzp_test_secret_123456
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=mock
CLOUDINARY_API_SECRET=mock
```

---

## Verification & Build Status

- **Frontend Build:** `npm run build` generates optimized production assets in `frontend/dist/` without errors.
- **TypeScript:** Strict type-checking verified across all components, pages, and services.
- **REST Endpoints:** Synchronized with frontend Axios services and mock data fallbacks for guaranteed resilience.

