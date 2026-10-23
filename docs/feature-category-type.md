# Category Type Feature

## 1. Overview

The Category Type feature separates transaction categories into two types: `income` and `expense`.

## 2. Category Attributes

| Attribute    | Description                                                 |
| ------------ | ----------------------------------------------------------- |
| `id`         | Unique category identifier                                  |
| `user_id`    | Owner of the category                                       |
| `name`       | Category name                                               |
| `type`       | `income` or `expense`                                       |
| `is_default` | Indicates whether the category is a system-provided default |

## 3. Business Rules

1. Each category belongs to a user.
2. Category types are limited to `income` and `expense`.
3. Default categories cannot be updated or deleted.
4. Custom categories can be updated or deleted if they are not referenced by transactions or budgets.
5. Category names must be unique per user.
6. A transaction's category must belong to the same user as the transaction.
7. A transaction's category type must match its transaction type.
8. Expense transactions require a category.

## 4. API Behavior

The feature uses the existing category endpoints:

- `GET /api/categories` — retrieve the authenticated user's categories.
- `GET /api/categories/:id` — retrieve a category by ID.
- `POST /api/categories` — create a category with `name` and `type`.
- `PATCH /api/categories/:id` — update a custom category's name.
- `DELETE /api/categories/:id` — delete an eligible custom category.

All endpoints require authentication.

## 5. Error Handling

- `400 Bad Request` — invalid input or category type mismatch.
- `403 Forbidden` — attempting to modify or delete a default category.
- `404 Not Found` — category not found for the authenticated user.
- `409 Conflict` — duplicate category name or category referenced by a transaction or budget.

## 6. Manual Testing

Verify the following scenarios in Postman:

- Retrieve categories for the authenticated user.
- Create `income` and `expense` categories.
- Reject an invalid category type.
- Reject duplicate category names.
- Reject modifications and deletion of default categories.
- Update and delete eligible custom categories.
- Reject transaction creation or updates when category type and transaction type do not match.
- Reject deletion of a category referenced by a transaction or budget.
- Verify that users cannot access another user's categories.

## 7. Implementation Notes

The feature modifies category validation, service, and repository logic, along with transaction validation and service logic. Database constraints enforce category ownership and transaction-category type consistency.

Record the actual migration filename and the date of implementation before finalizing this document.
