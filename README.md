# Finance Data Processing and Access Control Backend

A TypeScript + Express + Prisma backend for a finance dashboard system with role-based access control, financial record management, and dashboard analytics.

This project was built as a practical backend assignment focused on API design, business logic, validation, data modeling, and access control.

## 1. Project Summary

The system supports:

- User registration and login
- Role-based authorization (`VIEWER`, `ANALYST`, `ADMIN`)
- User management (role updates and active/inactive status)
- Financial record CRUD with soft delete
- Dashboard analytics endpoints (summary, category totals, trends, recent activity)
- Validation and consistent API responses

## 2. Tech Stack

- Runtime: Node.js
- Language: TypeScript
- Framework: Express
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Auth: JWT (stored in HTTP-only cookie)
- Password hashing: bcryptjs

## 3. Architecture

Main folders:

- `src/modules/auth` - registration and login
- `src/modules/user` - admin user management
- `src/modules/records` - financial records CRUD
- `src/modules/dashboard` - summary and analytics APIs
- `src/middlewares` - authentication and role authorization
- `src/validator` - request validation schemas
- `src/utils` - API response/error helpers and JWT utilities
- `prisma` - database schema and migrations

## 4. Data Model

### User

- `id` (UUID)
- `name`
- `email` (unique)
- `password` (hashed)
- `role` (`VIEWER | ANALYST | ADMIN`)
- `isActive` (boolean)
- `createdAt`, `updatedAt`

### FinancialRecord

- `id` (UUID)
- `amount` (float)
- `type` (`INCOME | EXPENSE`)
- `category` (string)
- `date` (DateTime)
- `notes` (optional)
- `createdById` (relation to User)
- `createdAt`, `updatedAt`
- `deletedAt` (used for soft delete)

## 5. Access Control Design

Authentication is enforced using a JWT token from cookie (`COOKIE_NAME`, default `token`).

Authorization is role-based via middleware:

- `VIEWER`: read-only access to records list/details
- `ANALYST`: read records + dashboard analytics
- `ADMIN`: full access (records mutation + user management)

### Route Access Matrix

- `POST /auth/register`: Public
- `POST /auth/login`: Public
- `GET /users`: `ADMIN`
- `PATCH /users/:id/role`: `ADMIN`
- `PATCH /users/:id/isActive`: `ADMIN`
- `POST /records`: `ADMIN`
- `GET /records`: Authenticated (`VIEWER`, `ANALYST`, `ADMIN`)
- `GET /records/:id`: Authenticated (`VIEWER`, `ANALYST`, `ADMIN`)
- `PATCH /records/:id`: `ADMIN`
- `DELETE /records/:id`: `ADMIN` (soft delete)
- `GET /dashboard/summary`: `ADMIN`, `ANALYST`
- `GET /dashboard/by-category`: `ADMIN`, `ANALYST`
- `GET /dashboard/trends`: `ADMIN`, `ANALYST`
- `GET /dashboard/recent`: `ADMIN`, `ANALYST`

## 6. API Response Pattern

All endpoints return a consistent response shape:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "error": null
}
```

On failure:

```json
{
  "success": false,
  "message": "...",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

Common error codes used:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `INVALID_CREDENTIALS`
- `ACCOUNT_INACTIVE`
- `RECORD_NOT_FOUND`
- `USER_NOT_FOUND`
- `INTERNAL_SERVER_ERROR`

## 7. Validation and Reliability

Validation is done using Zod schemas before hitting core service logic.

Examples:

- Register: name length, valid email, password length, valid role enum
- Login: valid email and password constraints
- Record create/update: positive amount, valid transaction type, category length, date coercion
- UUID validation for record/user id route params

Additional reliability behavior:

- Inactive users cannot log in
- Duplicate email registration is blocked
- Record delete is implemented as soft delete via `deletedAt`
- Soft-deleted records are excluded from read and analytics queries

## 8. Dashboard Analytics Implemented

- Total income
- Total expense
- Net balance (`income - expense`)
- Category-wise totals grouped by category and type
- Monthly trends (SQL aggregation by `YYYY-MM` and type)
- Recent records (latest 10)

## 9. Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL

### Environment Variables

Create `.env` in the project root:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/finance_db?schema=public"
PORT=5000
JWT_SECRET=<your_jwt_secret>
COOKIE_NAME=token
```

### Install and run

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Build

```bash
npm run build
```

Server default base URL:

- `http://localhost:5000` (or `PORT` value)

## 10. API Endpoints (Quick Reference)

### Auth

#### POST `/auth/register`

Request body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "secret123",
  "role": "ADMIN"
}
```

#### POST `/auth/login`

Request body:

```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

On successful login/register, JWT is set in HTTP-only cookie.

### Users (Admin)

#### GET `/users`

Fetch all users (without passwords).

#### PATCH `/users/:id/role`

```json
{
  "role": "ANALYST"
}
```

#### PATCH `/users/:id/isActive`

```json
{
  "isActive": false
}
```

### Records

#### POST `/records` (Admin)

```json
{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "April salary"
}
```

#### GET `/records`

Returns all non-deleted records sorted by date desc.

#### GET `/records/:id`

Returns one non-deleted record by UUID.

#### PATCH `/records/:id` (Admin)

```json
{
  "category": "Freelance",
  "notes": "Updated note"
}
```

#### DELETE `/records/:id` (Admin)

Soft deletes record by setting `deletedAt`.

### Dashboard (Admin, Analyst)

#### GET `/dashboard/summary`

Returns:

- `totalIncome`
- `totalExpense`
- `netBalance`

#### GET `/dashboard/by-category`

Returns grouped totals by category and transaction type.

#### GET `/dashboard/trends`

Returns monthly totals for income/expense.

#### GET `/dashboard/recent`

Returns latest 10 non-deleted records.

## 11. Assignment Requirement Mapping

1. User and role management: Implemented
2. Financial records CRUD: Implemented (with soft delete)
3. Dashboard summary APIs: Implemented
4. Access control logic: Implemented via auth + role middlewares
5. Validation and error handling: Implemented via Zod + standardized API responses
6. Data persistence: Implemented with PostgreSQL + Prisma

## 12. Assumptions and Tradeoffs

- Authentication uses cookie-based JWT for simplicity.
- The current record listing endpoint returns all records without pagination.
- Filtering by date/category/type can be added through query params in `GET /records` as a natural extension.
- No automated tests included due to scope/time constraints.

## 13. Future Improvements

- Query-based filtering and pagination for records
- Refresh tokens and logout endpoint
- Rate limiting and request logging
- Unit/integration tests
- Swagger/OpenAPI documentation
- Dockerized local setup

---

If needed for evaluation, I can also provide a Postman collection and short API demo flow.
