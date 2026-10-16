# Phase 3 — Authentication, Authorization & Transaction CRUD

## 1. Overview

Phase 3 implements authentication, authorization, and transaction CRUD functionality for the Expense Management System backend.

The objective is to authenticate users, protect private API endpoints, enforce ownership restrictions, and provide complete transaction management operations.

Users must only be able to access and manage their own data.

## 2. Technology

- Node.js
- Express.js
- PostgreSQL
- bcrypt for password hashing
- JSON Web Token (JWT) for authentication
- Postman for API testing
- Git and GitHub for version control

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

### 3.5 Transaction Management

Transaction endpoints use authentication middleware and enforce user ownership restrictions.

| Method | Endpoint                | Purpose                                                | Status      |
| ------ | ----------------------- | ------------------------------------------------------ | ----------- |
| GET    | `/api/transactions`     | Retrieve the authenticated user's transactions         | Implemented |
| GET    | `/api/transactions/:id` | Retrieve a transaction owned by the authenticated user | Implemented |
| POST   | `/api/transactions`     | Create a transaction for the authenticated user        | Implemented |
| PATCH  | `/api/transactions/:id` | Update a transaction owned by the authenticated user   | Implemented |
| DELETE | `/api/transactions/:id` | Delete a transaction owned by the authenticated user   | Pending     |

Transaction queries must enforce user ownership. Category references must also be checked against the authenticated user's ownership.

## 4. Validation and Error Handling

The backend validates request input, including transaction dates, amounts, transaction types, and category IDs.

Transaction updates preserve fields omitted from a PATCH request. Invalid values must be rejected by validation.

The API uses appropriate HTTP status codes to distinguish successful requests, validation errors, authentication failures, and resources that cannot be found.

Deletion must also enforce transaction ownership and prevent users from deleting transactions belonging to other users.

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

The DELETE endpoint and its related scenarios remain to be implemented and tested.

Testing has been performed manually. Automated test coverage has not yet been established.

## 6. Git Workflow

The authentication and transaction management work is developed using feature branches and merged into `main` through GitHub Pull Requests.

- PR #13: Authentication and transaction creation.
- PR #14: Transaction update endpoint.
- Pending: Transaction deletion endpoint.

Commits follow the Conventional Commits format.

## 7. Remaining Work

- Implement and test transaction deletion.
- Review authentication and authorization edge cases.
- Verify transaction CRUD operations and ownership restrictions.
- Establish automated tests.

Category management, budgets, and related business logic are part of Phase 4. React frontend development, frontend-backend integration, testing and debugging, Docker, and deployment remain part of subsequent phases.

## 8. Phase Status

Authentication, authorization, and the existing transaction endpoints have been implemented and manually tested according to the current development progress.

Phase 3 remains in progress until transaction deletion, the required security checks, and the relevant testing have been completed.

The phase documentation and roadmap must be updated when the remaining work has been verified.
