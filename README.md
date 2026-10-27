# Expense Management System

A full-stack web application for managing personal income, expenses, categories, and budgets, built with React, Node.js, Express.js, and PostgreSQL.

This project follows a **Learning by Doing** approach. Each development phase focuses on requirement analysis, implementation, debugging, testing, documentation, and code review. The goal is to build a maintainable application while developing practical software engineering skills.

## Live Demo

**Try the application:** [Expense Management System](https://frontend-sable-six-56.vercel.app)

The application is deployed on Vercel, with a Node.js and Express.js backend connected to a PostgreSQL database hosted on Neon.

> This is a learning project. Please use test data when exploring the application.

## Features

- User registration and login
- JWT-based authentication
- Income and expense transaction management
- Transaction CRUD operations
- Default and custom categories
- Budget management
- Financial summary dashboard
- User-specific data access and authorization

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon)
- **Authentication:** JSON Web Token (JWT)
- **API Testing:** Postman
- **Version Control:** Git and GitHub
- **Deployment:** Vercel
- **Containerization:** Docker (planned)

## Project Roadmap

- [x] Phase 0 — Requirement & Problem Analysis
- [x] Phase 1 — Database Design
- [x] Phase 2 — Backend Setup & Express REST API Foundation
- [x] Phase 3 — Authentication, Authorization & Transaction CRUD
- [x] Phase 4 — Categories, Budgets & Business Logic
- [x] Phase 4B — Financial Summary API
- [x] Phase 5 — React Frontend
- [x] Phase 6 — Frontend ↔ Backend Integration (production login verified; broader feature verification pending)
- [x] Phase 7 — Testing & Debugging (initial production verification complete; automated tests and broader regression testing pending)
- [ ] Phase 8 — Docker
- [x] Phase 9 — Initial Production Deployment (Vercel and Neon)
- [ ] Phase 10 — Advanced Challenges

## Run Locally

### Prerequisites

- Node.js and npm
- PostgreSQL, either a local instance or a compatible hosted database
- Git

### 1. Clone the repository

```bash
git clone https://github.com/farismns/expense-management-system.git
cd expense-management-system
```

### 2. Configure the backend

Copy `backend/.env.example` to `backend/.env` and configure the required environment variables.

For a local PostgreSQL database, configure the database connection values expected by the backend. For a hosted PostgreSQL database, configure `DATABASE_URL` with the connection string provided by the database provider.

Set a strong `JWT_SECRET` and keep all credentials private.

Ensure the database schema documented in `docs/phase-01-database-design.md` has been created before running the application.

Install dependencies and start the backend:

```bash
cd backend
npm install
npm run dev
```

The backend development server runs on `http://localhost:3000` by default.

### 3. Configure the frontend

Create `frontend/.env` with the following value for local development:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Install dependencies and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

For production, configure `VITE_API_BASE_URL` in the frontend deployment environment to point to the deployed backend API base URL. Because Vite variables are embedded during the build, rebuild and redeploy the frontend after changing them.

## Security Principles

- Store passwords securely using password hashing.
- Protect private API endpoints with authentication middleware.
- Enforce authorization so users can only access and manage their own data.
- Validate incoming requests and handle errors consistently.
- Configure CORS to allow trusted frontend origins.
- Keep credentials and environment-specific configuration out of version control.
- Use test data when evaluating the public demo.

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

## Verification

Frontend linting and production builds have passed during development. The deployed application has been verified to load the backend health endpoint and complete a production login.

Initial production integration is working. However, automated tests, broader end-to-end testing, and regression testing across all features remain ongoing.

See the Phase 6 and Phase 7 documentation for the integration and testing scope.

## Feedback

Feedback, bug reports, and suggestions are welcome. Please open a [GitHub Issue](https://github.com/farismns/expense-management-system/issues) with steps to reproduce any issue you encounter.

## Author

Developed as a Learning by Doing project to strengthen practical skills in full-stack web development, REST API design, authentication, database management, Git workflows, and application deployment.
