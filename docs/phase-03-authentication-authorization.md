# Phase 3 — Authentication & Authorization

## 1. Overview

Phase 3 implements authentication and authorization for the Expense Management System backend.

The objective is to authenticate users, protect private API endpoints, and enforce ownership restrictions so users can only access and manage their own data.

## 2. Technology

- Node.js
- Express.js
- PostgreSQL
- bcrypt for password hashing
- JSON Web Token (JWT) for authentication
- Postman for API testing

## 3. Implemented Features

### 3.1 User Registration

- Register a new user account.
- Validate registration input.
- Hash passwords before storing them in the database.

### 3.2 User Login

- Authenticate users using their credentials.
- Verify passwords against their stored hashes.
- Issue a JWT after successful authentication.

### 3.3 JWT Authentication Middleware

- Read the Bearer token from the Authorization header.
- Verify the token using the configured JWT secret.
- Attach the authenticated user's ID to `req.user`.
- Reject requests with missing or invalid tokens.

### 3.4 Current User Endpoint

`GET /api/auth/me`

Returns information for the authenticated user.

### 3.5 Transaction Access Control

Transaction endpoints use authentication middleware.

Implemented endpoints:

| Method | Endpoint                | Purpose                                                |
| ------ | ----------------------- | ------------------------------------------------------ |
| GET    | `/api/transactions`     | Retrieve the authenticated user's transactions         |
| GET    | `/api/transactions/:id` | Retrieve a transaction owned by the authenticated user |
| POST   | `/api/transactions`     | Create a transaction for the authenticated user        |
| PATCH  | `/api/transactions/:id` | Update a transaction owned by the authenticated user   |

Transaction queries enforce user ownership. Category references are also checked against the authenticated user's ownership.

## 4. Validation and Error Handling

The backend validates request input, including transaction dates, amounts, transaction types, and category IDs.

Transaction updates preserve fields omitted from a PATCH request. Explicitly invalid values are rejected by validation.

The API uses HTTP status codes to distinguish successful requests, validation errors, authentication failures, and resources that cannot be found.

## 5. Testing

The following scenarios have been tested manually using Postman:

- Successful user registration and login.
- Access to the current-user endpoint with a valid JWT.
- Rejection of requests without a JWT.
- Rejection of invalid JWTs.
- Successful transaction creation and retrieval.
- Transaction ownership restrictions.
- Successful partial transaction updates.
- Rejection of invalid transaction update input.
- Rejection of invalid transaction IDs.

Testing has been performed manually. Automated test coverage has not yet been established.

## 6. Git Workflow

The authentication and transaction update work was developed on feature branches and merged into `main` through GitHub Pull Requests.

- PR #13: Authentication and transaction creation.
- PR #14: Transaction update endpoint.

Commits follow the Conventional Commits format.

## 7. Remaining Work

- Implement and test transaction deletion.
- Review authentication and authorization edge cases.
- Establish automated tests.
- Continue with the remaining transaction CRUD requirements.

Category management, budgets, frontend integration, Docker, and deployment remain part of subsequent development work.

## 8. Phase Status

Authentication and the implemented transaction endpoints have been manually tested. Phase 3 should be marked complete after the remaining scope and security checks have been reviewed.

The transaction CRUD roadmap must remain in progress until the remaining operations are implemented and tested.
