# Phase 3 — Authentication, Authorization & Transaction CRUD

## Objective

Implement secure user authentication, JWT-based authorization, and transaction CRUD endpoints with user ownership enforcement.

## Authentication

- User registration and login.
- Password hashing and verification.
- JWT generation and verification.
- Authentication middleware for protected endpoints.
- Authenticated user profile endpoint.

## Transaction API

| Method | Endpoint                | Description                                    |
| ------ | ----------------------- | ---------------------------------------------- |
| POST   | `/api/transactions`     | Create a transaction                           |
| GET    | `/api/transactions`     | Retrieve the authenticated user's transactions |
| GET    | `/api/transactions/:id` | Retrieve a transaction by ID                   |
| PATCH  | `/api/transactions/:id` | Partially update a transaction                 |
| DELETE | `/api/transactions/:id` | Delete a transaction                           |

All transaction endpoints require authentication.

## Security and Validation

- Transactions are scoped to the authenticated user.
- Database queries enforce transaction ownership.
- Transaction IDs and request payloads are validated.
- Category ownership is checked when creating or updating transactions.
- Passwords are hashed and never returned in API responses.
- Missing or invalid authentication credentials are rejected.
- Transactions that do not exist or do not belong to the authenticated user return `404 Not Found`.

## Testing

- Registration and login.
- JWT validation and protected endpoints.
- Transaction creation, retrieval, update, and deletion.
- Invalid transaction IDs and invalid request payloads.
- Transaction ownership enforcement.
- Verification that deleted transactions no longer appear in the transaction list.

## Completion Criteria

- [x] Authentication and authorization functionality is implemented.
- [x] Transaction GET, POST, PATCH, and DELETE endpoints are implemented.
- [x] Ownership enforcement is verified.
- [x] Manual API tests are completed.
- [x] Documentation is reviewed and committed.
- [x] Project roadmap is updated.
