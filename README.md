# 🌾 AgriRent — Agri Equipment Rental System

A full-stack marketplace connecting farmers who need short-term access to agricultural equipment with owners who have machinery to rent out. Built as a clean, production-style MVP — not a college CRUD assignment.

## Overview

Buying a tractor or harvester outright is expensive for most farmers, and equipment often sits idle between seasons for owners. AgriRent solves both problems: **owners** list and manage equipment, **farmers** browse, search, and book it for the days they need.

## Features

**Authentication**
- JWT-based register/login with bcrypt password hashing
- Role selection at signup (Owner or Farmer)
- Protected routes and role-based authorization on both client and server

**Equipment**
- Full CRUD for owners (create, edit, delete, toggle availability)
- Public browse grid with search, category/location filters, and price sorting
- Filters persist across pagination via URL query params

**Booking**
- Farmers request a date range; total price is calculated server-side
- Overlap detection prevents double-booking the same equipment
- Owners approve or reject pending requests
- Farmers track booking status (Pending / Approved / Rejected)

**UX polish**
- Dark mode and fully responsive layout
- Loading skeletons, toast notifications, empty states, custom 404
- Pagination with page numbers + prev/next, 10 items per page

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Forms | React Hook Form + Zod |
| HTTP | Axios (centralized instance with auth interceptor) |
| State | React Context API (auth only) |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Database | SQLite |

## Architecture

```
Next.js (client components, URL-driven filter state)
        │  axios + JWT bearer token
        ▼
FastAPI  routers → services → models
        │  SQLAlchemy ORM
        ▼
SQLite
```

Routers stay thin (parse → delegate → respond). All business logic — booking overlap checks, price calculation, ownership checks — lives in the **service layer**, keeping route handlers readable and logic testable in isolation.

## Folder Structure

```
client/
  app/                  # Next.js App Router pages
    login/ register/
    equipment/[id]/
    dashboard/owner/  dashboard/farmer/
  components/
    auth/ equipment/ booking/ dashboard/ ui/
  context/              # AuthContext (the only global state)
  services/             # axios instance + one wrapper per resource
  types/                # shared TS interfaces
  constants/            # centralized config values
  lib/                  # formatting + class-name helpers

server/
  app/
    models/             # SQLAlchemy ORM models
    schemas/            # Pydantic request/response schemas
    routers/            # thin FastAPI route handlers
    services/           # business logic
    auth/               # JWT + password hashing + dependencies
    database/           # engine/session setup
  seed.py               # demo data generator
```

## Database Schema

**users** — id, name, email (unique), password (hashed), role, created_at
**equipment** — id, owner_id (FK), title, description, category, location, price_per_day, availability, image, created_at
**bookings** — id, equipment_id (FK), farmer_id (FK), start_date, end_date, status, total_price, created_at

## Authentication Flow

```
Register → hash password (bcrypt) → store user → issue JWT
Login    → verify password → issue JWT
Client   → stores token → sends as Authorization: Bearer <token>
Server   → decodes token on each request → loads user → checks role for protected actions
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Log in, get JWT |
| GET | `/api/auth/me` | ✔ | Current user |
| GET | `/api/equipment` | — | List/search/filter/sort/paginate |
| GET | `/api/equipment/{id}` | — | Equipment detail |
| POST | `/api/equipment` | Owner | Create listing |
| PUT | `/api/equipment/{id}` | Owner | Update listing |
| DELETE | `/api/equipment/{id}` | Owner | Delete listing |
| GET | `/api/users/me/equipment` | Owner | Own listings |
| POST | `/api/booking` | Farmer | Request booking |
| GET | `/api/bookings` | ✔ | Own bookings (role-aware) |
| PATCH | `/api/booking/{id}` | Owner | Approve/reject |

## Installation

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python seed.py                # optional: generates demo data
uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd client
npm install
cp .env.local.example .env.local
npm run dev
```

App available at `http://localhost:3000`.

### Demo accounts (after seeding)

All seeded accounts use password `password123`, e.g. `owner1@example.com`, `farmer1@example.com` (5 owners, 10 farmers total).

## Environment Variables

**server/.env**
```
SECRET_KEY=change-this-to-a-random-secret-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./agri_rental.db
CORS_ORIGINS=http://localhost:3000
```

**client/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Future Improvements

- Move JWT storage from localStorage to httpOnly cookies
- Real image uploads instead of externally hosted URLs
- Email notifications on booking status changes
- Reviews/ratings for equipment and owners
- Payment integration for booking deposits
- Server-side computed live availability (booking-derived, not just owner toggle)

## Author

Built as a full-stack MVP demonstrating clean architecture, role-based auth, and production-style engineering practices.
