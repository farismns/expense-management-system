# Phase 5 --- React Frontend

## 1. Overview

This phase introduces the React frontend for the Expense Management
System. The goal is to provide a usable MVP that connects to the
existing Express backend and enables users to review and manage their
financial data through a responsive interface.

**Status:** MVP source code created; review and backend integration
verification are still pending.

## 2. Objectives

-   Build the frontend using React and Vite.
-   Connect the interface to the existing backend API.
-   Provide authentication and core financial-management screens.
-   Apply the seven UI/UX principles: user-centered design, visual
    hierarchy, consistency, feedback, error prevention, accessibility,
    and responsive design.
-   Prepare the frontend for manual and integration testing.

## 3. Technology Stack

-   **React** --- component-based user interface.
-   **Vite** --- development server and build tooling.
-   **JavaScript** --- frontend application logic.
-   **CSS** --- styling and responsive layouts.
-   **Recharts** --- financial charts.
-   **Lucide React** --- interface icons.

## 4. MVP Scope

### 4.1 Authentication

-   Login and registration forms.
-   Client-side validation for required fields, email, and password
    length.
-   JWT attachment to authenticated API requests.
-   Logout and basic handling for expired sessions.

### 4.2 Financial Dashboard

-   Total income, total expenses, and net balance.
-   Date-range selection for financial summaries.
-   Expense breakdown by category.
-   Budget overview and recent transactions.

### 4.3 Transaction Management

-   List transactions.
-   Create income and expense transactions.
-   Edit and delete transactions.
-   Search by description or category.
-   Filter by transaction type.
-   Validate positive amounts and require a category for expense
    transactions.

### 4.4 Category Management

-   List, create, edit, and delete categories.
-   Display API errors when a category cannot be deleted because it is
    referenced by a transaction or budget.

### 4.5 Budget Management

-   List, create, edit, and delete budgets.
-   Select a category and define an amount and date range.
-   Display the budget limit and usage indicators when usage data is
    available.
-   Validate positive amounts and date ranges.
-   Explain that budget periods for the same category must not overlap.

## 5. UI/UX Principles

  -----------------------------------------------------------------------
  Principle                           Implementation in the MVP
  ----------------------------------- -----------------------------------
  **User-centered design**            The dashboard prioritizes financial
                                      information users need to
                                      understand their current position.

  **Visual hierarchy**                Key financial totals are
                                      emphasized, followed by category
                                      charts, budget information, and
                                      transaction tables.

  **Consistency**                     Reusable visual patterns are used
                                      for navigation, buttons, forms,
                                      cards, icons, and status messages.

  **Feedback**                        Loading indicators, success/error
                                      notifications, validation messages,
                                      and empty states communicate
                                      application status.

  **Error prevention**                Forms validate required values,
                                      amounts must be positive, date
                                      ranges are checked, and destructive
                                      actions require confirmation.

  **Accessibility**                   Form labels, accessible names for
                                      icon buttons, keyboard focus
                                      indicators, and announced status
                                      messages are provided.

  **Responsive design**               Layouts adapt to desktop, tablet,
                                      and mobile screens; the sidebar
                                      becomes a toggleable navigation
                                      drawer on smaller screens.
  -----------------------------------------------------------------------

## 6. Backend API Integration

The frontend uses `VITE_API_BASE_URL` as its configurable API base URL.
The default value is `http://localhost:3000/api`.

  -----------------------------------------------------------------------------------------------------------------
  Feature                             HTTP endpoint
  ----------------------------------- -----------------------------------------------------------------------------
  Register                            `POST /auth/register`

  Login                               `POST /auth/login`

  Current user                        `GET /auth/me`

  List transactions                   `GET /transactions`

  Create transaction                  `POST /transactions`

  Update transaction                  `PATCH /transactions/:id`

  Delete transaction                  `DELETE /transactions/:id`

  List categories                     `GET /categories`

  Create category                     `POST /categories`

  Update category                     `PATCH /categories/:id`

  Delete category                     `DELETE /categories/:id`

  List budgets                        `GET /budgets`

  Create budget                       `POST /budgets`

  Update budget                       `PUT /budgets/:id`

  Delete budget                       `DELETE /budgets/:id`

  Financial summary                   `GET /summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

  Expenses by category                `GET /summary/expenses-by-category?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
  -----------------------------------------------------------------------------------------------------------------

Main payload fields follow the backend contracts:

-   **Transaction:** `date`, `amount`, `type`, `category_id`,
    `description`.
-   **Category:** `name`.
-   **Budget:** `category_id`, `amount`, `start_date`, `end_date`.
-   **Summary:** `totalIncome`, `totalExpense`, `netBalance`, and the
    selected period.

The exact response shape for each endpoint must be confirmed against the
running backend during integration testing.

## 7. Running the Frontend Locally

1.  Extract the frontend project.

2.  Ensure the backend is running.

3.  Create a `.env` file based on `.env.example`.

4.  Set the API base URL, for example:

    ``` env
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

5.  Install dependencies:

    ``` bash
    npm install
    ```

6.  Start the development server:

    ``` bash
    npm run dev
    ```

7.  Open the local URL printed by Vite in the terminal.

## 8. Current Limitations and Verification Notes

-   Dependency installation and production build have not yet been
    verified in the artifact-generation environment.
-   End-to-end integration tests against the running backend have not
    yet been completed.
-   Authentication and API response payloads must be verified against
    the actual backend responses.
-   Budget usage indicators depend on the backend returning reliable
    spending/usage data. The frontend cannot infer accurate usage from a
    budget limit alone.
-   JWT is stored in `localStorage` for this MVP. Before production,
    review the authentication architecture and consider secure
    `HttpOnly`/`SameSite` cookies where appropriate.
-   Automated frontend tests, deployment configuration, and a structured
    accessibility audit remain future work.

## 9. Completion Checklist

The phase should not be marked complete until the MVP has been reviewed
and the core integration checks have passed.

-   [ ] Start the frontend locally.
-   [ ] Verify registration and login against the backend.
-   [ ] Verify transaction CRUD operations.
-   [ ] Verify category CRUD operations.
-   [ ] Verify budget CRUD operations and overlapping-period error
    handling.
-   [ ] Verify summary totals and category chart against real API data.
-   [ ] Test desktop and mobile layouts.
-   [ ] Check keyboard navigation, labels, and error feedback.
-   [ ] Fix issues found during testing.
-   [ ] Update this document with final implementation and test results.

## 10. Conclusion and Next Step

The Phase 5 React Frontend MVP establishes the main user-facing
workflows for authentication, financial summaries, transactions,
categories, and budgets. It also applies the seven requested UI/UX
principles.

**Next step:** review the MVP, run it against the backend, resolve
integration issues, and update this document with verified test results
before declaring Phase 5 complete.
