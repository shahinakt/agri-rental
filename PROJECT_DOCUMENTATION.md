# Project Documentation — Agri Equipment Rental System

## 1. Introduction

AgriRent is a two-sided marketplace web application that connects agricultural equipment owners with farmers who need short-term access to machinery such as tractors, harvesters, and tillers. This document covers the requirements, architecture, and design decisions behind the MVP implementation.

## 2. Problem Statement

Farming equipment is expensive to buy outright and is often used only for short, seasonal windows. This creates two mismatched needs:

- **Owners** have equipment sitting idle for much of the year and no simple way to rent it out.
- **Farmers** need occasional access to machinery but can't justify the capital cost of ownership.

AgriRent bridges this gap with a listing-and-booking platform.

## 3. Objectives

- Let equipment owners list, edit, and manage their inventory
- Let farmers discover equipment through search, filtering, and sorting
- Provide a booking workflow with clear status tracking (pending/approved/rejected)
- Enforce data integrity — no double-booking, no client-controlled pricing
- Deliver a UI/UX that feels like a real product, not a prototype

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR1 | Users can register as either an Owner or a Farmer |
| FR2 | Users can log in and receive a JWT for authenticated requests |
| FR3 | Owners can create, update, and delete their own equipment listings |
| FR4 | Anyone can browse and view equipment detail pages |
| FR5 | Farmers can search by name, filter by category/location, and sort by price |
| FR6 | Results are paginated (10 per page) with filters preserved across pages |
| FR7 | Farmers can request a booking for a date range on available equipment |
| FR8 | The system must reject bookings that overlap an existing pending/approved booking |
| FR9 | Owners can approve or reject pending booking requests for their equipment |
| FR10 | Farmers can view their booking history and current status |

## 5. Non-Functional Requirements

- **Maintainability** — feature-based folder structure, single-responsibility services
- **Type safety** — TypeScript on the frontend, Pydantic on the backend, shared shape via typed interfaces
- **Performance** — SQLite is sufficient for MVP scale; indexed columns on frequently filtered fields (category, location, email)
- **Usability** — responsive layout, dark mode, loading states, empty states
- **Security** — passwords hashed with bcrypt, JWT-protected mutations, ownership checks before any write/delete

## 6. Architecture

The system follows a conventional three-tier architecture:

```
Presentation (Next.js) → API (FastAPI) → Persistence (SQLite via SQLAlchemy)
```

**Backend layering:**
- `routers/` — HTTP concerns only: parse request, call a service, return a response
- `services/` — business rules: booking overlap detection, price computation, ownership enforcement
- `models/` — SQLAlchemy ORM table definitions
- `schemas/` — Pydantic request/response contracts, decoupled from ORM models

This separation means business logic (e.g. "can this booking be approved?") lives in exactly one place and isn't duplicated across route handlers.

**Frontend layering:**
- `app/` — routes only; pages compose components and call services
- `components/` — feature-based (`equipment/`, `booking/`, `dashboard/`, `auth/`) plus a shared `ui/` kit
- `services/` — one axios wrapper per backend resource; components never call axios directly
- `context/` — a single `AuthContext`; all other state is local or derived from the URL

## 7. Technology Stack

See README.md for the full stack table. Key rationale:

- **SQLite over Postgres/MySQL** — zero external service dependency for local dev and grading; the schema is simple enough that a migration path is trivial later.
- **Context API over Redux/Zustand** — the only genuinely global state is "who is logged in." Everything else (filters, pagination, form state) is either local to a component or already lives in the URL.
- **URL-driven filter state** — browsing filters are stored in query params rather than React state, so pagination, back-button navigation, and shareable/bookmarkable searches work without extra code.

## 8. Database Design

**users**
| Column | Type | Notes |
|---|---|---|
| id | int, PK | |
| name | string | |
| email | string, unique | |
| password | string | bcrypt hash |
| role | enum | owner / farmer |
| created_at | datetime | |

**equipment**
| Column | Type | Notes |
|---|---|---|
| id | int, PK | |
| owner_id | int, FK → users.id | |
| title | string | |
| description | text | |
| category | enum | tractor, harvester, rotavator, seeder, power_tiller, cultivator, sprayer |
| location | string | indexed for filtering |
| price_per_day | float | |
| availability | boolean | owner-controlled toggle |
| image | string | external URL |
| created_at | datetime | |

**bookings**
| Column | Type | Notes |
|---|---|---|
| id | int, PK | |
| equipment_id | int, FK → equipment.id | |
| farmer_id | int, FK → users.id | |
| start_date | date | |
| end_date | date | |
| status | enum | pending / approved / rejected |
| total_price | float | computed server-side |
| created_at | datetime | |

## 9. Authentication Flow

1. User registers with name, email, password, and role
2. Password is hashed with bcrypt before storage — plaintext is never persisted
3. Server issues a JWT containing the user id and role, signed with a secret key
4. Client stores the token and attaches it as `Authorization: Bearer <token>` on every request via an axios interceptor
5. Protected endpoints use a `get_current_user` dependency to decode and validate the token; owner-only endpoints additionally use a `require_role("owner")` dependency
6. A 401 response anywhere in the app triggers the client to clear stored credentials

## 10. Folder Structure

See README.md — reproduced there in full with both `client/` and `server/` trees.

## 11. API Design

Endpoints follow REST conventions with resource-based URLs and standard HTTP verbs (see README.md for the full table). Response bodies are validated against Pydantic schemas, so the API contract is enforced independently of the ORM layer — changing an internal model field doesn't silently change the public API shape.

## 12. Design Decisions

- **Availability is an explicit owner toggle**, not derived live from bookings. This keeps the mental model simple for the MVP: an owner can pull a listing offline (maintenance, personal use) independent of whether it has bookings. A future iteration could compute "available on date X" from the booking table directly.
- **Booking overlap prevention** is enforced in the service layer with a date-range intersection query against any `pending` or `approved` booking — rejected/cancelled bookings don't block new requests.
- **Price is always computed server-side** from `price_per_day × days`, never trusted from the client, to prevent tampering.
- **Equipment deletion is blocked** if there's an active (pending/approved) booking against it, rather than cascading the delete, to avoid silently orphaning a farmer's in-flight booking.

## 13. Challenges

- Balancing "production-quality" scope against MVP scope — the brief explicitly asks to avoid over-engineering (no Redux, no microservices, no Docker), so the main challenge was keeping the service layer expressive without adding unnecessary abstraction layers.
- Keeping filter/pagination state in the URL (rather than component state) required a small amount of extra wiring in the browse page but pays off in correctness (shareable URLs, working back button) with no additional state management library.

## 14. Future Improvements

See README.md § Future Improvements.

## 15. Conclusion

AgriRent demonstrates a complete, coherent full-stack slice: authenticated roles, CRUD with ownership rules, a booking workflow with real business-logic guarantees (no double-booking, server-computed pricing), and a UI that handles loading, empty, and error states throughout. The codebase favors clarity and small, single-responsibility modules over premature abstraction, in line with the project's explicit goal of looking like a well-run startup MVP rather than an academic exercise.
