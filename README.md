# Expense Management System

A full-stack expense management system built with React, Node.js, Express.js, and PostgreSQL.

This project follows a **Learning by Doing** approach. Each development phase focuses on requirement analysis, implementation, debugging, testing, documentation, and code review. The goal is to build a maintainable application while developing practical software engineering skills.

## Tech Stack

- **Frontend:** React and Vite
- **Backend:** Node.js and Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT
- **API Testing:** Postman
- **Version Control:** Git and GitHub
- **Containerization:** Docker (planned)

## Project Roadmap

- [x] Phase 0 — Requirement & Problem Analysis
- [x] Phase 1 — Database Design
- [x] Phase 2 — Backend Setup & Express REST API Foundation
- [x] Phase 3 — Authentication, Authorization & Transaction CRUD
- [x] Phase 4 — Categories, Budgets & Business Logic
- [x] Phase 5 — React Frontend (static verification complete)
- [ ] Phase 6 — Frontend ↔ Backend Integration (live API verification pending)
- [ ] Phase 7 — Testing & Debugging (automated tests pending)
- [ ] Phase 8 — Docker
- [ ] Phase 9 — Deployment
- [ ] Phase 10 — Advanced Challenges

## Run locally

1. Copy `backend/.env.example` to `backend/.env`, set database values and a strong `JWT_SECRET`.
2. Ensure the PostgreSQL schema documented in `docs/phase-01-database-design.md` is available.
3. In `backend`, run `npm install` then `npm run dev`.
4. In `frontend`, create `.env` with `VITE_API_BASE_URL=http://localhost:3000/api`, then run `npm install` and `npm run dev`.

## Security Principles

- Store passwords securely using password hashing.
- Protect private API endpoints with authentication middleware.
- Enforce authorization so users can only access and manage their own data.
- Validate incoming requests and handle errors consistently.
- Keep credentials and environment-specific configuration out of version control.

## Documentation

- [Phase 0 — Requirement & Problem Analysis](./docs/phase-00-requirement-analysis.md)
- [Phase 1 — Database Design](./docs/phase-01-database-design.md)
- [Phase 2 — Backend Setup](./docs/phase-02-backend-setup.md)
- [Phase 3 — Authentication, Authorization & Transaction CRUD](./docs/phase-03-authentication-authorization-CRUD.md)
- [Phase 4 — Categories, Budgets & Business Logic](./docs/phase-04-categories-budgets-business-logic.md)
- [Phase 4B — Financial Summary API](./docs/phase-04b-financial-summary.md)
- [Phase 5 — React Frontend](./docs/phase-05-react-frontend.md)
- [Phase 6 — Integration](./docs/phase-06-integration.md)
- [Phase 7 — Testing](./docs/phase-07-testing.md)

## Verification

`npm run lint` and `npm run build` pass in the frontend. Live API testing needs a configured PostgreSQL database; see Phase 6 and Phase 7 for exact scope.
