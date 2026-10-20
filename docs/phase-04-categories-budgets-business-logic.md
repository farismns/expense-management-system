# Phase 4 — Categories, Budgets & Business Logic

## 1. Overview

Phase 4 implements category and budget management for the Expense Management System. This phase extends the existing authentication and transaction modules with user-scoped categories, budget management, input validation, and business rules enforced at the application and database levels.

## 2. Scope

### Categories

- Create a category.
- Retrieve all categories belonging to the authenticated user.
- Retrieve a category by ID.
- Update a category.
- Delete a category when it is not referenced by transactions or budgets.
- Prevent duplicate category names for the same user.

### Budgets

- Create a budget.
- Retrieve all budgets belonging to the authenticated user.
- Retrieve a budget by ID.
- Update a budget.
- Delete a budget.
- Validate budget amounts, dates, and category ownership.
- Prevent overlapping budget periods for the same user and category.
- Calculate budget usage using expense transactions within the budget period.

## 3. Architecture

The implementation follows the existing modular Express architecture.

- **Routes:** Define HTTP endpoints for categories and budgets.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Apply validation, ownership checks, and business rules.
- **Repositories:** Execute database operations using parameterized SQL queries.
- **Validation modules:** Validate incoming category and budget data.
- **Global error handler:** Standardizes API error responses.

The application registers the category and budget routes under `/api/categories` and `/api/budgets`, respectively.

## 4. Authentication and Data Isolation

Category and budget operations are scoped to the authenticated user's ID.

- Users can only list their own categories and budgets.
- Queries for individual resources include the authenticated user's ID.
- A resource belonging to another user is treated as not found.
- A budget's category must belong to the same authenticated user.
- Client input cannot be used to override the authenticated user's ownership scope.

## 5. Category Business Rules

- Category names are validated and trimmed before storage.
- Category names must be unique for the same user.
- Duplicate category names return HTTP `409 Conflict`.
- Missing or inaccessible categories return HTTP `404 Not Found`.
- Categories referenced by transactions or budgets cannot be deleted; the API returns HTTP `409 Conflict`.

The database uniqueness constraint `uq_categories_user_name` enforces per-user category-name uniqueness.

## 6. Budget Business Rules

- Budget amounts must be greater than zero.
- The start date must not be later than the end date.
- The selected category must belong to the authenticated user.
- A user cannot create overlapping budget periods for the same category.
- Date ranges are inclusive.
- Budget usage counts only expense transactions associated with the budget category and occurring within the budget period.
- Users cannot retrieve, update, or delete another user's budget.

Overlapping budget periods return HTTP `409 Conflict`. Missing or inaccessible budgets and categories return HTTP `404 Not Found`.

## 7. Database Constraints

The database enforces important integrity rules:

- Foreign keys associate categories and budgets with their owners.
- Category names are unique per user.
- Budget amounts must be positive.
- Budget end dates cannot precede start dates.
- Budget category references must point to existing categories.
- A PostgreSQL GiST exclusion constraint named `ex_budgets_no_overlapping_period` prevents overlapping date ranges for the same user and category.

The exclusion constraint uses PostgreSQL's `btree_gist` extension and an inclusive date range.

## 8. Error Handling

The implementation maps known database errors to meaningful HTTP responses:

| Condition                                       |               HTTP status |
| ----------------------------------------------- | ------------------------: |
| Invalid input                                   |           400 Bad Request |
| Resource not found or inaccessible              |             404 Not Found |
| Duplicate category or overlapping budget period |              409 Conflict |
| Unexpected server error                         | 500 Internal Server Error |

Unexpected server errors return a generic message rather than exposing internal error details.

## 9. Verification and Testing

The developer reported successful manual verification of the following:

- Category create, read, update, and delete operations.
- Category validation and duplicate-name handling.
- Budget create, read, update, and delete operations.
- Budget amount and date validation.
- Category ownership validation.
- Overlapping budget-period rejection.
- Cross-user access isolation for budgets.
- Budget usage calculations limited to expense transactions within the selected period.
- JavaScript syntax checks for the application, category, and budget files.

These are manual verification results; automated test coverage should be documented separately when automated tests are added.

## 10. Files and Modules

The phase adds or updates the following areas:

- `src/app.js`
- `src/modules/categories/`
- `src/modules/budgets/`

The category module contains route, controller, service, repository, and validation responsibilities. The budget module contains the corresponding budget management responsibilities.

## 11. Completion Checklist

- [x] Category CRUD implemented and manually verified.
- [x] Budget CRUD implemented and manually verified.
- [x] User ownership checks applied.
- [x] Category and budget validation implemented.
- [x] Duplicate categories handled.
- [x] Overlapping budget periods prevented.
- [x] Budget usage business logic verified.
- [x] Syntax checks completed.
- [x] Documentation saved in the repository.
- [x] Final diff and whitespace checks completed.
- [x] Changes committed using Conventional Commits.

## 12. Notes

This phase extends the backend business logic. Automated tests, API documentation, and further hardening can be addressed in subsequent development work.
