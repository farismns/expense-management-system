# Phase 4B — Financial Summary API

## 1. Overview

Phase 4B implements financial summary endpoints for the Expense Management System. The endpoints aggregate a user's income and expenses over a selected date range and provide expense totals grouped by category.

This phase extends the existing modular Express backend and prepares the API for dashboard visualization in the frontend.

## 2. Scope

- Retrieve total income for a selected period.
- Retrieve total expenses for a selected period.
- Calculate net balance as total income minus total expenses.
- Retrieve expense totals grouped by category.
- Validate date formats and date-range ordering.
- Restrict financial summary data to the authenticated user.

## 3. Architecture

The implementation follows the existing modular Express architecture:

- **Routes:** Define the summary endpoints and apply authentication middleware.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Validate the requested period and coordinate summary operations.
- **Repositories:** Execute parameterized SQL aggregation queries.
- **Validation module:** Validate date formats and ensure the start date does not exceed the end date.
- **Global error handler:** Processes errors forwarded by controllers.

The application registers the summary module under `/api/summary`.

## 4. API Endpoints

All endpoints require a valid JWT access token.

### 4.1 Get Financial Summary

`GET /api/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

Returns total income, total expenses, net balance, and the requested period.

Example response structure:

```json
{
  "status": "success",
  "message": "Financial summary retrieved successfully",
  "data": {
    "summary": {
      "totalIncome": "5000000.00",
      "totalExpense": "1500000.00",
      "netBalance": "3500000.00",
      "period": {
        "startDate": "2026-10-01",
        "endDate": "2026-10-31"
      }
    }
  }
}
```

The monetary values above are illustrative examples, not actual database results.

### 4.2 Get Expenses by Category

`GET /api/summary/expenses-by-category?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

Returns expense totals grouped by category, ordered from the largest total to the smallest.

Each item includes:

- `categoryId`
- `categoryName`
- `totalExpense`

Transactions without a category are grouped under `Uncategorized`.

If no expense transactions exist for the requested period, the endpoint returns an empty `expenses` array.

## 5. Business Rules

- Only transactions belonging to the authenticated user are included.
- The user ID is obtained from `req.user.id`, not from client-supplied query parameters.
- Financial summary calculations include both income and expense transactions.
- Net balance is calculated as total income minus total expenses.
- The expense-by-category endpoint includes only transactions whose type is `expense`.
- The start and end dates are inclusive.
- The requested date range must use valid `YYYY-MM-DD` dates.
- The start date must not be later than the end date.
- Monetary aggregation uses PostgreSQL numeric operations.

## 6. Validation and Error Handling

Invalid date formats, nonexistent calendar dates, or a start date later than the end date should return HTTP `400 Bad Request`.

Requests without valid authentication should be rejected by the authentication middleware.

Unexpected server errors should be handled by the existing global error handler without exposing internal database details.

## 7. Security and Data Isolation

The summary routes apply the authentication middleware before executing summary operations.

Repository queries filter transactions by the authenticated user's ID. The category aggregation also joins categories using both category ID and user ID to preserve ownership boundaries.

Client-supplied query parameters cannot select another user's data.

## 8. Verification and Testing

The developer reported successful manual verification of:

- Financial summary retrieval.
- Expense totals grouped by category.
- Date format validation.
- Invalid calendar date rejection.
- Start-date and end-date ordering validation.
- Authentication and cross-user data isolation checks, when performed.

JavaScript syntax checks were also performed on the summary module and application entry point.

These are manual verification results. Automated test coverage should be documented separately when automated tests are added.

## 9. Files and Modules

- `src/app.js`
- `src/modules/summary/summary.routes.js`
- `src/modules/summary/summary.controller.js`
- `src/modules/summary/summary.service.js`
- `src/modules/summary/summary.repository.js`
- `src/modules/summary/summary.validation.js`

## 10. Completion Checklist

- [x] Financial summary endpoint implemented.
- [x] Expense-by-category endpoint implemented.
- [x] Date-range validation implemented.
- [x] Authentication middleware applied.
- [x] User-scoped aggregation queries implemented.
- [x] Manual endpoint and validation checks reported successful.
- [x] Documentation created.

## 11. Notes

This phase provides backend data for financial dashboard features. Frontend integration, automated tests, and additional API documentation can be addressed in subsequent development work.
