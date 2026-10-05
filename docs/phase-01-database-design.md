# Phase 1 — Database Design

## 1. Objective

The objective of Phase 1 is to design and implement the PostgreSQL database for the Expense Management System.

This phase focuses on:

- Identifying entities and attributes
- Defining Primary Keys (PK) and Foreign Keys (FK)
- Defining relationships between entities
- Defining database constraints
- Applying database normalization
- Selecting appropriate PostgreSQL data types
- Designing the database schema
- Creating the database tables
- Testing database integrity

---

## 2. Entities

The Expense Management System consists of four main entities:

### 2.1 User

Represents a user who owns financial data in the system.

Attributes:

- `id`
- `email`
- `password`
- `fullname`

---

### 2.2 Category

Represents an expense category owned by a user.

Attributes:

- `id`
- `name`
- `user_id`

Examples:

- Food
- Transportation
- Entertainment
- Bills

---

### 2.3 Transaction

Represents a financial transaction made by a user.

Attributes:

- `id`
- `date`
- `amount`
- `type`
- `category_id`
- `description`
- `user_id`

Transaction types:

- `income`
- `expense`

An income transaction may not have a category, while an expense transaction must have a category. The expense-category rule will be validated in the backend.

---

### 2.4 Budget

Represents a budget allocated by a user for a specific category and period.

Attributes:

- `id`
- `user_id`
- `category_id`
- `amount`
- `start_date`
- `end_date`

---

# 3. Primary Keys and Foreign Keys

## 3.1 Users

Primary Key:

- `id`

Foreign Keys:

- None

---

## 3.2 Categories

Primary Key:

- `id`

Foreign Key:

- `user_id` → `users.id`

The `user_id` identifies the owner of the category.

---

## 3.3 Transactions

Primary Key:

- `id`

Foreign Keys:

- `user_id` → `users.id`
- `category_id` → `categories.id`

The `user_id` identifies the transaction owner.

The `category_id` identifies the category associated with the transaction.

`category_id` is nullable because income transactions do not require a category.

---

## 3.4 Budgets

Primary Key:

- `id`

Foreign Keys:

- `user_id` → `users.id`
- `category_id` → `categories.id`

The `user_id` identifies the budget owner.

The `category_id` identifies the category associated with the budget.

---

# 4. Relationships

The database uses the following relationships:

| Relationship           | Cardinality |
| ---------------------- | ----------- |
| User → Category        | 1 : N       |
| User → Transaction     | 1 : N       |
| User → Budget          | 1 : N       |
| Category → Transaction | 1 : N       |
| Category → Budget      | 1 : N       |

### Explanation

- One user can have many categories.
- One user can have many transactions.
- One user can have many budgets.
- One category can be associated with many transactions.
- One category can have many budgets.

There are no many-to-many relationships in the current MVP design.

---

# 5. Database Constraints

## 5.1 Users

| Column     | Constraint  | Reason                      |
| ---------- | ----------- | --------------------------- |
| `id`       | PRIMARY KEY | Uniquely identifies a user  |
| `email`    | NOT NULL    | Email is required           |
| `email`    | UNIQUE      | Prevents duplicate accounts |
| `password` | NOT NULL    | Password hash is required   |
| `fullname` | NOT NULL    | User name is required       |

---

## 5.2 Categories

| Column          | Constraint  | Reason                                              |
| --------------- | ----------- | --------------------------------------------------- |
| `id`            | PRIMARY KEY | Uniquely identifies a category                      |
| `name`          | NOT NULL    | Category name is required                           |
| `user_id`       | NOT NULL    | Every category must have an owner                   |
| `user_id`       | FOREIGN KEY | Ensures the owner exists                            |
| `user_id, name` | UNIQUE      | Prevents duplicate category names for the same user |

The same category name can still exist for different users.

For example:

```text
User A → Food
User B → Food
```
