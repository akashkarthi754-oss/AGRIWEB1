# AgriConnect Backend & REST API

Production-ready Node.js 20, Express, and MongoDB with Mongoose backend, JWT authentication, role-based access control, and complete agricultural value chain REST API endpoints.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- MongoDB (Local instance or MongoDB Atlas URI; falls back automatically to embedded in-memory MongoDB)

### 2. Environment Configuration
Copy `.env.example` to `.env` or set the environment variables:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/agriconnect
JWT_SECRET=agriconnect_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
UPLOAD_DIR=uploads
VITE_API_URL=/api
VITE_USE_MOCK=false
ADMIN_INVITE_CODE=AGRICONNECT_ADMIN_2026
```

### 3. Running the Server & Seeding
```bash
# Install dependencies
npm install

# Seed demo users across 4 roles, produce lots, buyer requirements, and market data
npm run seed

# Start the full-stack server (Vite frontend + Express backend)
npm run dev
```

---

## 👥 Seeded Accounts

| Role | Identifier / Phone | Email | Password | Purpose |
|------|--------------------|-------|----------|---------|
| **Farmer** | `9876543210` | `farmer@agriconnect.com` | `Demo@1234` | Produce lot listings, matches, net realisation, storage advice |
| **Buyer** | `9876543211` | `buyer1@agriconnect.com` | `Demo@1234` | Procurement requirements, delivery receipt confirmation |
| **Buyer 2** | `9876543212` | `buyer2@agriconnect.com` | `Demo@1234` | Retail wholesale buyer requirement creation |
| **Transporter** | `9876543213` | `transporter@agriconnect.com` | `Demo@1234` | Fleet bookings, GPS tracking updates, transit jobs |
| **Admin** | `9876500000` | `admin@agriconnect.com` | `Admin@1234` | User management, account activation, system governance |

---

## 📡 REST API Endpoints Specification

### 1. Auth & Users (`/api/auth`, `/api/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | Public | Register new user `{name, email, phone, password, role, location, details}` |
| `POST` | `/api/auth/login` | Public | Authenticate with email/phone and password → returns JWT `{token, user}` |
| `POST` | `/api/auth/logout` | Public | Sign out endpoint (token cleared from client) |
| `GET` | `/api/auth/me` | Bearer JWT | Returns current authenticated user profile from MongoDB |
| `GET` | `/api/users/profile` | Bearer JWT | Retrieve full profile with role details |
| `PUT` | `/api/users/profile` | Bearer JWT | Update user details, location, and organization in MongoDB |

### 2. Admin User Management (`/api/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/admin/users` | Admin JWT | List all users and statistical aggregates (farmers, buyers, transporters, active/inactive) |
| `GET` | `/api/admin/users/:id` | Admin JWT | Retrieve single user details |
| `PUT` | `/api/admin/users/:id/status` | Admin JWT | Activate or deactivate user account `{ isActive: boolean }` |

### 3. Produce / Lots (`/api/lots`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/lots` | Farmer/Admin JWT | Create produce listing (enforces `farmerId = req.user._id`) |
| `GET` | `/api/lots/mine` | Farmer/Admin JWT | Get listings owned by the logged-in farmer |
| `GET` | `/api/lots/:id` | Public | Retrieve single produce lot |
| `PUT` | `/api/lots/:id` | Farmer/Admin JWT | Update produce lot (ownership enforced) |
| `DELETE` | `/api/lots/:id` | Farmer/Admin JWT | Delete produce lot (ownership enforced) |

### 4. Buyer Requirements (`/api/requirements`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/requirements` | Buyer/Admin JWT | Create procurement requirement (enforces `buyerId = req.user._id`) |
| `GET` | `/api/requirements/mine` | Buyer/Admin JWT | Get requirements owned by the logged-in buyer |
| `GET` | `/api/requirements/:id` | Public | Retrieve requirement by ID |
| `PUT` | `/api/requirements/:id` | Buyer/Admin JWT | Update requirement (ownership enforced) |
| `DELETE` | `/api/requirements/:id` | Buyer/Admin JWT | Delete requirement (ownership enforced) |

### 5. Transporter & Bookings (`/api/bookings`, `/api/lots/:id/vehicle-recommendation`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/lots/:id/vehicle-recommendation` | Public | Recommend optimal vehicle by weight and distance |
| `POST` | `/api/bookings` | Bearer JWT | Book vehicle transit |
| `GET` | `/api/bookings/mine` | Bearer JWT | View assigned transport bookings |
| `PUT` | `/api/bookings/:id/status` | Transporter/Admin JWT | Update booking status (`BOOKED` → `PICKED_UP` → `IN_TRANSIT` → `DELIVERED`) |
| `GET` | `/api/bookings/:id/tracking` | Public | Stepper status and GPS coordinates |
| `PUT` | `/api/bookings/:id/location` | Transporter/Admin JWT | Update real-time GPS coordinates |
| `POST` | `/api/bookings/:id/confirm-receipt` | Buyer/Admin JWT | Confirm delivery with quantity/grade tolerance check |

---

## 🔒 Security & Data Protection
1. **Password Hashing**: Salted bcrypt password hashes (`bcrypt.genSalt(10)`). Passwords are never stored or returned in plain text.
2. **JWT Authorization**: Signed with `JWT_SECRET` (`7d` expiry). Payload contains `{ id, role, email, name }`.
3. **Role Authorization**: `roleRequired('farmer' | 'buyer' | 'transporter' | 'admin')` verifies role on protected endpoints.
4. **Data Ownership**: Farmer listings and buyer requirements strictly verify and set the owner's MongoDB `_id` on the server.
5. **Admin Access Guard**: Admin registration requires `ADMIN_INVITE_CODE`.
