# 🌾 AgriRent — Agri Equipment Rental System

A full-stack marketplace connecting farmers who need short-term access to agricultural equipment with owners who have machinery available for rent. AgriRent is built as a **production-style MVP** to demonstrate clean architecture, authentication, role-based authorization, and full-stack engineering practices—not just a basic CRUD application.

## 🌐 Live Demo

* **Frontend (Vercel):** https://agri-rental-nu.vercel.app/
* **Backend API (Render):** https://agri-rental.onrender.com
* **API Documentation:** https://agri-rental.onrender.com/docs

---

## Overview

Purchasing agricultural machinery such as tractors, harvesters, and seed drills is expensive for many farmers, while equipment owners often leave machinery unused between seasons.

AgriRent solves both problems by providing a rental marketplace where:

* **Equipment Owners** can list, manage, and rent out their machinery.
* **Farmers** can browse, search, and book equipment only for the days they need.

This project focuses on building a realistic end-to-end rental platform with clean backend architecture and modern frontend practices.

---

# Features

## Authentication

* JWT-based authentication
* Secure password hashing using bcrypt
* Register as Owner or Farmer
* Protected routes
* Role-based authorization
* Persistent login

---

## Equipment Management

Owners can:

* Create equipment listings
* Update listings
* Delete listings
* Toggle equipment availability

Public users can:

* Browse equipment
* Search by keyword
* Filter by category
* Filter by location
* Sort by price
* Paginate results

Filter state persists using URL query parameters.

---

## Booking System

Farmers can:

* Request equipment for a selected date range
* View booking status
* Track booking history

Owners can:

* View booking requests
* Approve bookings
* Reject bookings

Server-side booking logic includes:

* Booking overlap detection
* Automatic total price calculation
* Ownership validation

---

## User Experience

* Responsive design
* Dark mode
* Loading skeletons
* Toast notifications
* Empty states
* Custom 404 page
* Pagination (10 items per page)

---

# Technology Stack

| Layer          | Technology                                        |
| -------------- | ------------------------------------------------- |
| Frontend       | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Forms          | React Hook Form + Zod                             |
| HTTP           | Axios (Centralized instance + Auth Interceptor)   |
| State          | React Context API (Authentication only)           |
| Backend        | FastAPI                                           |
| ORM            | SQLAlchemy                                        |
| Validation     | Pydantic                                          |
| Authentication | JWT (python-jose), bcrypt (passlib)               |
| Database (MVP) | SQLite                                            |

> **Note:** SQLite is intentionally used for this MVP because it requires zero setup, making the project easy to run locally and evaluate. For a real production deployment, a managed PostgreSQL database such as **Neon PostgreSQL** is recommended for scalability, concurrency, backups, and reliability.

---

# Architecture

```text
Next.js (Client Components)
        │
        │ Axios + JWT Bearer Token
        ▼
FastAPI
Routers
        │
        ▼
Service Layer
(Business Logic)
        │
        ▼
SQLAlchemy ORM
        │
        ▼
SQLite (MVP)
```

Business logic—including booking validation, overlap detection, ownership checks, and price calculation—is isolated inside the **service layer**, keeping API routes thin and maintainable.

---

# Folder Structure

```text
client/
  app/
    login/
    register/
    equipment/[id]/
    dashboard/
      owner/
      farmer/

  components/
    auth/
    equipment/
    booking/
    dashboard/
    ui/

  context/
  services/
  types/
  constants/
  lib/

server/
  app/
    auth/
    database/
    models/
    routers/
    schemas/
    services/

  seed.py
```

---

# Database Schema

### users

* id
* name
* email (unique)
* password (hashed)
* role
* created_at

### equipment

* id
* owner_id (FK)
* title
* description
* category
* location
* price_per_day
* availability
* image
* created_at

### bookings

* id
* equipment_id (FK)
* farmer_id (FK)
* start_date
* end_date
* total_price
* status
* created_at

---

# Authentication Flow

```text
Register
    ↓
Hash Password (bcrypt)
    ↓
Store User
    ↓
Generate JWT

Login
    ↓
Verify Password
    ↓
Generate JWT

Client
    ↓
Store JWT
    ↓
Authorization: Bearer <token>

Server
    ↓
Decode JWT
    ↓
Load User
    ↓
Authorize Request
```

---

# API Endpoints

| Method | Endpoint                  | Auth   | Description              |
| ------ | ------------------------- | ------ | ------------------------ |
| POST   | `/api/auth/register`      | No     | Register                 |
| POST   | `/api/auth/login`         | No     | Login                    |
| GET    | `/api/auth/me`            | Yes    | Current user             |
| GET    | `/api/equipment`          | No     | Browse equipment         |
| GET    | `/api/equipment/{id}`     | No     | Equipment details        |
| POST   | `/api/equipment`          | Owner  | Create equipment         |
| PUT    | `/api/equipment/{id}`     | Owner  | Update equipment         |
| DELETE | `/api/equipment/{id}`     | Owner  | Delete equipment         |
| GET    | `/api/users/me/equipment` | Owner  | Owner listings           |
| POST   | `/api/booking`            | Farmer | Create booking           |
| GET    | `/api/bookings`           | Yes    | User bookings            |
| PATCH  | `/api/booking/{id}`       | Owner  | Approve / Reject booking |

---

# Local Installation

## Backend

```bash
cd server

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env

python seed.py    # Optional

uvicorn app.main:app --reload --port 8000
```

Swagger API:

```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd client

npm install

cp .env.local.example .env.local

npm run dev
```

Application:

```
http://localhost:3000
```

---

# Demo Accounts

After running the seed script:

Password for all accounts:

```
password123
```

Example accounts:

```
owner1@example.com

farmer1@example.com
```

The seed script creates:

* 5 Owners
* 10 Farmers

---

# Environment Variables

## server/.env

```env
SECRET_KEY=change-this-to-a-random-secret-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./agri_rental.db
CORS_ORIGINS=http://localhost:3000
```

## client/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For deployment, update `NEXT_PUBLIC_API_URL` to your Render backend URL.

---

# Deployment

## Frontend

* Platform: **Vercel**
* URL: https://agri-rental-nu.vercel.app/

## Backend

* Platform: **Render**
* URL: https://agri-rental.onrender.com

The frontend communicates with the deployed FastAPI backend through environment variables.

---

# Future Improvements

* Replace SQLite with Neon PostgreSQL
* Move JWT from localStorage to httpOnly cookies
* Image upload support (Cloudinary/S3)
* Email notifications
* Reviews and ratings
* Payment integration
* Live availability derived from bookings
* Booking cancellation and refund workflow
* Admin dashboard
* Unit and integration testing

---

# Author

Built as a **production-style Full-Stack MVP** showcasing modern web development practices with Next.js, FastAPI, JWT authentication, layered backend architecture, and role-based access control.

The project intentionally uses **SQLite** to keep local setup simple and make evaluation effortless. For production-scale deployments, the backend is designed to be easily migrated to **PostgreSQL (Neon)** or another managed relational database with minimal changes.

