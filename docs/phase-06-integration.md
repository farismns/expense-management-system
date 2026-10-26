# Phase 6 — Frontend and Backend Integration

## Contract verification

The frontend base URL defaults to `http://localhost:3000/api` and may be
overridden with `VITE_API_BASE_URL`. Authenticated calls include a Bearer JWT.
Verified contracts are category create/update/delete (`POST`, `PATCH`,
`DELETE /categories/:id`) and budget list/create/update/delete (`GET`, `POST`,
`PUT`, `DELETE /budgets/:id`). Budget responses return arrays directly in
`data`; category responses return `data.categories`.

The dashboard consumes the backend's camelCase summary contract:
`totalIncome`, `totalExpense`, `netBalance`, `categoryId`, `categoryName`, and
`totalExpense`.

## Configuration and status

Set `VITE_API_BASE_URL` in `frontend/.env`. Set `FRONTEND_ORIGIN` and a long,
random `JWT_SECRET` in the backend environment. Never commit a real `.env`.

Frontend lint/build and backend syntax checks pass. Live endpoint verification
is pending because this audit did not start a configured database-backed API.

## My Profile

`GET /api/users/me` returns the authenticated user's permitted fields: `id`,
`email`, and `fullname`. `PATCH /api/users/me` accepts exactly `email` and
`fullname`; both are normalized and validated. The JWT subject determines the
account, so callers cannot supply or modify another user's ID. Duplicate emails
return `409 Conflict`. Password hashes and JWTs are never returned.

The protected `/profile` frontend route provides read and edit modes, disables
saving without changes, and handles loading, validation, API, and network
errors.
