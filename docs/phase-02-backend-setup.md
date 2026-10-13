# Phase 2 — Backend Setup

## 1. Objective

Set up the Node.js and Express backend foundation for the Expense Management System and establish a connection with the PostgreSQL database.

## 2. Technology Stack

- Node.js
- Express.js
- PostgreSQL
- `pg` for PostgreSQL connectivity
- `dotenv` for environment variable management
- `nodemon` for development server restarts
- ES Modules for JavaScript module management

## 3. Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── middlewares/
│   │   └── error-handler.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## 4. Application Architecture

### `src/app.js`

Responsible for configuring the Express application, registering middleware, defining the health check endpoint, handling unknown endpoints, and registering the centralized error handler.

### `src/server.js`

Acts as the application entry point. It loads environment variables, verifies the PostgreSQL connection, and starts the HTTP server.

### `src/config/database.js`

Creates and exports a PostgreSQL connection pool using the `pg` package and environment variables.

### `src/middlewares/error-handler.js`

Provides centralized error handling and returns consistent JSON error responses.

## 5. Environment Configuration

The backend uses environment variables to configure the application and database connection.

Required variables:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

The `.env` file contains local configuration and must not be committed to version control. The `.env.example` file documents the required variables without exposing actual credentials.

## 6. Database Connection

The PostgreSQL connection is managed through a shared connection pool.

During startup, the application executes:

```sql
SELECT 1;
```

The server starts accepting HTTP requests only after the database connectivity check succeeds.

## 7. API Health Check

**Endpoint:** `GET /api/health`

Expected successful response:

```json
{
  "status": "ok",
  "message": "Expense Management System API is running"
}
```

Expected HTTP status: `200 OK`.

## 8. Error Handling

Unknown endpoints are forwarded to the centralized error handler with HTTP status `404`.

Expected response:

```json
{
  "status": "error",
  "message": "Endpoint not found"
}
```

Unexpected server errors return HTTP status `500` with a generic error message.

The error handler is registered after the application routes and the unknown-endpoint middleware.

## 9. Development Commands

Start the development server:

```bash
npm run dev
```

## 10. Verification Checklist

- [x] Express server starts successfully.
- [x] PostgreSQL connection succeeds during startup.
- [x] `GET /api/health` returns `200 OK`.
- [x] Unknown endpoints return `404 Not Found` with JSON.
- [x] Environment variables are configured correctly.
- [x] `.env` and `node_modules/` are excluded from Git.
- [x] Phase 2 documentation is complete.

## 11. Implementation Notes

The current backend establishes the application foundation. Business features such as authentication, transaction management, category management, and budget management will be implemented in subsequent phases.

The application currently uses a shared PostgreSQL connection pool and centralized error-handling middleware to support maintainability and consistent request processing.
