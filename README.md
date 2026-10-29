# 🏨 HotelPro — Complete Hotel Booking & Management Solution

**HotelPro** is an enterprise-grade, full-stack hotel booking and hospitality management solution built on the **MERN** stack (MongoDB, Express.js, React JSX, Node.js) styled with **Bootstrap 5** and **Custom Luxury CSS**. It streamlines front-desk operations, room inventory, automated reservations, real-time availability tracking, payment processing, housekeeping dispatch, and guest folio management.

---

## 🌟 Key Highlights & Core Capabilities

- **🔐 Enterprise Authentication & Role-Based Access Control**:
  - Secure JSON Web Token (**JWT**) authorization with `bcryptjs` password encryption.
  - Three specialized roles: **General Manager (Admin)**, **Front Desk Supervisor (Staff)**, and **Guest (Traveler)**.
  - 1-Click Demo credential fill on the login screen for instant evaluation.

- **🛎️ Smart Room Inventory & Real-Time Availability**:
  - Dynamic suite categories: *Deluxe King*, *Executive Suite*, *Presidential Suite*, *Premium Double*, *Skyline Penthouse*, *Garden Villa*, *Family Suite*.
  - Prevents double-booking with date-overlap verification algorithms.
  - Operational status management: `Available` 🟢, `Occupied` 🔵, `Cleaning` 🟡, `Maintenance` 🔴.

- **💳 Seamless Multi-Step Booking & Checkout**:
  - Nightly rate calculation, 12% occupancy tax, sanitization fee, and instant total estimation.
  - Simulated payment processing (Credit/Debit Card with live card validation, PayPal Express Sandbox, and Pay on Arrival).
  - Celebration confetti effect upon booking confirmation.

- **📄 Printable Digital Folio & Invoice Voucher**:
  - Itemized receipt formatted with GST/Tax ID, booking reference code, payment transaction ID, and stay duration.
  - Native print-ready layout (`window.print()`) optimized for PDF export and guest check-in desk printouts.

- **🧹 Concierge & Housekeeping Task Board**:
  - Guests and staff can dispatch requests for *Housekeeping*, *Turn-Down Service*, *Room Service*, *Maintenance*, *Luggage Assistance*, and *Wakeup Calls*.
  - Priority management (`Low`, `Medium`, `High`, `Urgent`) with live ticket tracking.

- **📊 Management Console & KPI Analytics**:
  - Real-time dashboard for General Managers and Front Desk Staff: Total Revenue, Occupancy Rate %, Active Keys, Room Status distribution, and one-click **Check-In** and **Check-Out** actions.

- **⚡ Dual-Engine Database Architecture**:
  - **MongoDB Live**: Connects directly to local MongoDB or cloud MongoDB Atlas via `MONGO_URI`.
  - **Zero-Setup Embedded Store**: If MongoDB is not running locally, HotelPro activates its built-in in-memory reactive repository with rich pre-seeded hotel data, enabling immediate run out-of-the-box.

---

## 🛠️ Required Skills & Technology Stack

| Technology | Role in HotelPro |
| :--- | :--- |
| **JavaScript (ES6+)** | Asynchronous control flow, async/await, API communication, and core logic |
| **React JSX** | Modular components, React Router v6, Hooks (`useState`, `useEffect`, `useContext`) |
| **Bootstrap 5** | Responsive layout grid, modals, navigation bars, badges, tables, and dropdowns |
| **Custom CSS3** | Luxury hospitality theme, color palette (midnight navy, gold accents), animations |
| **Node.js** | High-performance asynchronous runtime environment |
| **Express.js** | RESTful API engine, routing, CORS, rate limiting, and middleware pipeline |
| **MongoDB & Mongoose** | NoSQL document modeling (`User`, `Room`, `Booking`, `Review`, `ServiceRequest`) |
| **JSON Web Token (JWT)** | Stateless bearer authorization and secure payload signing |
| **HTML5** | Accessible semantic structure, date inputs, and print view templates |

---

## 📂 Project Architecture

```
ProHotel/
├── client/                           # React JSX Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js              # Axios instance with JWT interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state, login, register, profile
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Luxury brand header with role pills
│   │   │   ├── Footer.jsx            # Comprehensive hotel footer
│   │   │   ├── RoomCard.jsx          # Suite display card with amenities
│   │   │   ├── QuickSearch.jsx       # Date & guest availability finder
│   │   │   ├── InvoiceModal.jsx      # Printable official hotel folio
│   │   │   ├── ServiceModal.jsx      # Housekeeping/Concierge modal
│   │   │   └── ProtectedRoute.jsx    # Role-based route guard
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Hero, featured suites, testimonials
│   │   │   ├── RoomsPage.jsx         # Catalog with price/type/capacity filters
│   │   │   ├── RoomDetailPage.jsx    # Gallery, specs, reviews, booking widget
│   │   │   ├── CheckoutPage.jsx      # Multi-step checkout & payment
│   │   │   ├── BookingSuccessPage.jsx# Confirmed booking & confetti
│   │   │   ├── MyBookingsPage.jsx    # Guest portal & active room keys
│   │   │   ├── AdminDashboard.jsx    # KPI metrics, check-in/out, inventory CRUD
│   │   │   ├── LoginPage.jsx         # Auth with 1-click Demo accounts
│   │   │   ├── RegisterPage.jsx      # Guest registration
│   │   │   ├── ProfilePage.jsx       # User contact & security updates
│   │   │   └── NotFoundPage.jsx
│   │   ├── styles/
│   │   │   └── custom.css            # Luxury hospitality styling & animations
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                           # Node.js & Express Backend
│   ├── config/
│   │   └── db.js                     # MongoDB connection & fallback handler
│   ├── controllers/
│   │   ├── authController.js         # Register, login, profile, users
│   │   ├── roomController.js         # Rooms CRUD, availability check
│   │   ├── bookingController.js      # Booking creation, check-in, check-out, cancel
│   │   ├── reviewController.js       # Verified guest reviews
│   │   ├── serviceController.js      # Housekeeping tickets
│   │   └── dashboardController.js    # Operational KPIs and statistics
│   ├── data/
│   │   └── initialData.js            # Initial luxury rooms, users, bookings
│   ├── middleware/
│   │   ├── auth.js                   # JWT verification & role authorization
│   │   └── error.js                  # Centralized error handler
│   ├── models/
│   │   ├── User.js                   # Mongoose schema for accounts
│   │   ├── Room.js                   # Mongoose schema for suites
│   │   ├── Booking.js                # Mongoose schema for reservations
│   │   ├── Review.js                 # Mongoose schema for ratings
│   │   └── ServiceRequest.js         # Mongoose schema for housekeeping tasks
│   ├── routes/                       # Express route routers
│   ├── services/
│   │   └── dataStore.js              # Hybrid data layer (Mongo + In-Memory)
│   ├── seed.js                       # CLI script to seed MongoDB
│   ├── server.js                     # Server entrypoint
│   ├── .env                          # Configuration variables
│   └── package.json
│
├── package.json                      # Monorepo orchestration (concurrently)
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on v24)
- **npm** v9+
- *(Optional)* Local **MongoDB** service or a **MongoDB Atlas** cluster URI

### 2. Installation
From the root project directory:
```bash
# Install root orchestration tools
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Launching HotelPro
From the root directory, launch both backend and frontend concurrently:
```bash
npm run dev
```
- **Backend API**: runs at [http://localhost:5000](http://localhost:5000)
- **Frontend Web Application**: runs at [http://localhost:5173](http://localhost:5173)

---

## 🔑 Pre-Configured Demo Accounts

On the **Login** page (`/login`), click any role button to automatically populate credentials:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **General Manager (Admin)** | `admin@hotelpro.com` | `Admin@123` | Full KPI Dashboard, Room Inventory CRUD, Check-In/Out, User Directory |
| **Front Desk (Staff)** | `staff@hotelpro.com` | `Staff@123` | Front Desk Management, Check-In, Check-Out, Housekeeping Task Board |
| **Traveler (Guest)** | `guest@hotelpro.com` | `Guest@123` | Booking Suites, Viewing Invoices, Requesting Housekeeping, Reviews |

---

## 📡 RESTful API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `phone`, `role`)
- `POST /api/auth/login` — Authenticate and receive signed JWT
- `GET /api/auth/me` — Retrieve currently authenticated user profile
- `PUT /api/auth/profile` — Update user profile details
- `PUT /api/auth/change-password` — Change account password
- `GET /api/auth/users` — Retrieve all users (Admin only)

### Rooms (`/api/rooms`)
- `GET /api/rooms` — Query all rooms (supports `roomType`, `minPrice`, `maxPrice`, `guests`, `status`, `checkIn`, `checkOut`)
- `GET /api/rooms/:id` — Room details & reviews
- `GET /api/rooms/:id/availability` — Real-time date availability checker
- `POST /api/rooms` — Create luxury room (Admin only)
- `PUT /api/rooms/:id` — Update room pricing, amenities, or status
- `DELETE /api/rooms/:id` — Remove room from inventory (Admin only)

### Bookings (`/api/bookings`)
- `POST /api/bookings` — Create and confirm reservation with date-conflict validation
- `GET /api/bookings/my-bookings` — Retrieve authenticated user's stays
- `GET /api/bookings` — Retrieve all bookings with guest search & status filter (Admin/Staff)
- `GET /api/bookings/:id` — Retrieve detailed booking folio / invoice
- `PUT /api/bookings/:id/status` — Front desk check-in / check-out operation
- `POST /api/bookings/:id/cancel` — Cancel booking and initiate refund
- `POST /api/bookings/:id/payment` — Process simulated payment

### Housekeeping & Services (`/api/services`)
- `GET /api/services` — List operational tickets (Staff/Admin)
- `POST /api/services` — Dispatch concierge or housekeeping request
- `PUT /api/services/:id` — Mark in-progress or completed

### Dashboard & Analytics (`/api/dashboard`)
- `GET /api/dashboard/stats` — Revenue, Occupancy Rate %, Active Keys, Room Status breakdown

---

## 🛡️ Security & Compliance
- **Password Protection**: Passwords salted and hashed with `bcryptjs` (10 rounds).
- **Stateless Authorization**: JWT signed with secret and checked via `protect` and `authorize` middlewares.
- **Data Integrity**: Input validation on dates (`checkOut > checkIn`), capacity checks, and prevention of double-booking.

---

&copy; HotelPro Solutions. Designed for Modern Hospitality.
