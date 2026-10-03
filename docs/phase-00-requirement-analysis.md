# Phase 0 — Requirement & Problem Analysis

## 1. Project Overview

Expense Management System is a full-stack web application designed to help users manage and monitor their personal financial activities.

The system allows users to record income and expenses, organize expenses into categories, define category-based budgets, and monitor their financial condition through a dashboard.

This project is developed using a Learning by Doing approach. The development process is divided into several phases, where each phase focuses on analysis, implementation, testing, debugging, documentation, and review.

The initial technology direction for this project is:

- Frontend: React
- Backend: Node.js and Express.js
- Database: PostgreSQL
- API Testing: Postman
- Version Control: Git and GitHub
- Containerization: Docker
- Deployment: To be determined in a later phase

The system will initially focus on a single user role. More advanced features and architecture will be introduced gradually based on the requirements of each development phase.

---

## 2. Problem Definition

Managing personal expenses manually can become difficult as the amount of financial data increases.

When financial records are stored manually, users may have difficulty answering questions such as:

- How much income was received during a specific period?
- How much money was spent?
- Which category consumes the most money?
- How much budget has been used?
- How much budget remains?
- What is the current balance?

Without a centralized system, users must calculate and organize this information manually.

The Expense Management System is intended to address this problem by providing a structured way to record financial transactions and automatically calculate financial summaries.

---

## 3. Project Objective

The main objective of this project is to develop a web-based expense management system that allows users to manage their financial records in a structured manner.

The system should allow users to:

1. Register and authenticate themselves.
2. Record income and expense transactions.
3. Organize expenses using categories.
4. Create and manage category-based budgets.
5. Monitor budget usage.
6. View total income and expenses.
7. Calculate the current financial balance.
8. View expense summaries by category.

Besides solving the functional problem, this project is also intended as a practical learning project for developing full-stack engineering skills.

The project will be used to practice:

- REST API development
- Backend architecture
- PostgreSQL and SQL
- Authentication and authorization
- Business logic implementation
- React frontend development
- API integration
- Testing and debugging
- Git and GitHub workflow
- Docker
- Deployment

---

## 4. Actor

The MVP has one primary actor:

### User

The user is the owner of the financial data stored in the system.

A user can:

- Register an account.
- Log in.
- Manage their own categories.
- Create financial transactions.
- View their own transactions.
- Update their own transactions.
- Delete their own transactions.
- Create budgets.
- View budget usage.
- Update budgets.
- Delete budgets.
- View financial summaries.

Each user's financial data must be isolated from other users.

For example, User A must not be able to access transactions, categories, or budgets belonging to User B.

An administrator role is not required for the initial version.

---

## 5. Functional Requirements

### 5.1 Authentication

The system must provide authentication functionality.

Users can:

- Register an account.
- Log in.
- Log out.

Authentication is required because financial data belongs to individual users and must not be accessible by other users.

---

### 5.2 Transaction Management

Users can manage their financial transactions.

The system must support:

- Create transaction
- Read transaction
- Read transaction by ID
- Update transaction
- Delete transaction
- Filter transactions

Each transaction contains information such as:

- Date
- Amount
- Type
- Category
- Description
- Owner

Transaction types are:

- `income`
- `expense`

---

### 5.3 Category Management

Users can manage their own expense categories.

The system must support:

- Create category
- Read categories
- Update category
- Delete category

Examples of categories include:

- Food
- Transportation
- Entertainment
- Bills
- Shopping

Categories are user-owned. A user cannot use another user's category.

---

### 5.4 Budget Management

Users can create budgets based on expense categories.

The system must support:

- Create budget
- Read budgets
- Update budget
- Delete budget
- Calculate budget usage

Each budget is associated with:

- User
- Category
- Budget amount
- Start date
- End date

Budget usage is calculated from expenses belonging to the same category and period.

---

### 5.5 Dashboard

The dashboard provides a summary of the user's financial condition.

The dashboard should display:

- Total income
- Total expense
- Balance
- Expense summary by category
- Budget summary
- Budget usage

The dashboard is intended to provide a high-level overview without requiring the user to manually calculate financial data.

---

## 6. Core Entities

The MVP consists of four primary entities:

### 6.1 User

Represents the owner of financial data.

A user can have:

- Many transactions
- Many categories
- Many budgets

Relationship:

```text
User 1 ──── N Transaction
User 1 ──── N Category
User 1 ──── N Budget
```

---

### 6.2 Category

Represents a classification for expenses.

A category belongs to one user and can be associated with multiple expense transactions.

Examples:

```text
Food
Transportation
Entertainment
Bills
Shopping
```

A category can also be associated with multiple budgets over different periods.

---

### 6.3 Transaction

Represents a financial activity.

A transaction belongs to one user.

A transaction can be:

```text
income
expense
```

Expense transactions are associated with a category.

Income transactions do not require a category in the MVP.

---

### 6.4 Budget

Represents a spending limit for a specific category within a defined period.

For example:

```text
Category: Food
Budget: Rp1,500,000
Period: October 1 – October 31
```

The system compares the budget amount with the total expense for the same category and period.

---

## 7. Transaction Concept

A transaction represents a financial activity recorded by a user.

There are two transaction types:

### Income

Income represents money received by the user.

Example:

```text
Type: income
Amount: Rp5,000,000
Date: 2026-10-01
Description: Monthly salary
Category: None
```

Income does not require a category in the MVP.

---

### Expense

Expense represents money spent by the user.

Example:

```text
Type: expense
Amount: Rp50,000
Date: 2026-10-02
Description: Lunch
Category: Food
```

An expense must have a category because categories are used to analyze spending and calculate budget usage.

---

## 8. Category Concept

Categories are used to classify expense transactions.

A category belongs to a specific user.

For example, User A may have:

```text
Food
Transportation
Entertainment
Bills
```

User B may have a completely different set of categories.

The system must ensure that users can only manage and use their own categories.

Categories are important because they provide the basis for:

- Expense analysis
- Expense summaries
- Category-based budgets
- Budget usage calculation

---

## 9. Budget Concept

A budget represents the maximum amount a user plans to spend for a specific category during a defined period.

Example:

```text
Category: Food
Budget Amount: Rp1,500,000
Start Date: 2026-10-01
End Date: 2026-10-31
```

Suppose the user has spent:

```text
Food expenses = Rp900,000
```

Then:

```text
Remaining Budget = Rp1,500,000 - Rp900,000
                 = Rp600,000
```

Budget usage:

```text
Usage = Rp900,000 / Rp1,500,000 × 100
      = 60%
```

The budget is category-based rather than one global spending limit.

The system can still calculate a total budget summary by aggregating individual category budgets.

---

## 10. Entity Relationships

The main relationships are:

```text
User
 │
 ├──────────< Transaction
 │
 ├──────────< Category
 │                │
 │                ├──────────< Transaction
 │                │
 │                └──────────< Budget
 │
 └──────────< Budget
```

Conceptually:

### User → Transaction

One user can have many transactions.

```text
User 1 ──── N Transaction
```

Each transaction belongs to exactly one user.

### User → Category

One user can have many categories.

```text
User 1 ──── N Category
```

Each category belongs to exactly one user.

### User → Budget

One user can have many budgets.

```text
User 1 ──── N Budget
```

Each budget belongs to exactly one user.

### Category → Transaction

One category can be associated with many expense transactions.

```text
Category 1 ──── N Transaction
```

An income transaction does not require a category in the MVP.

### Category → Budget

One category can have multiple budgets across different periods.

```text
Category 1 ──── N Budget
```

This allows a user to define different budgets for the same category over time.

---

## 11. Business Rules

### Rule 1 — Users can only access their own data

A user must only be able to access and manage their own:

- Transactions
- Categories
- Budgets

This prevents users from accessing financial data belonging to other users.

### Rule 2 — Transaction amount must be greater than zero

The transaction amount must be greater than zero.

```text
amount > 0
```

Zero or negative transaction amounts are not accepted.

### Rule 3 — Transaction type is limited

A transaction can only have one of two types:

```text
income
expense
```

Other transaction types are not part of the initial system.

### Rule 4 — Expense requires a category

Every expense must have a category.

This is required because category information is used for expense analysis and budget calculation.

### Rule 5 — Income does not require a category

Income does not require a category in the MVP.

The initial system focuses category-based analysis on expenses.

### Rule 6 — Users can only use their own categories

A user cannot associate a transaction with a category owned by another user.

### Rule 7 — Users can only manage their own budgets

A user cannot access or modify budgets belonging to another user.

### Rule 8 — Budget must have a defined period

Every budget must have a start date and end date.

This allows the system to determine which expenses should be included in budget usage calculations.

### Rule 9 — Budget is category-based

Each budget is associated with a specific expense category.

### Rule 10 — Budget usage is calculated from matching expenses

Budget usage is calculated using expenses that:

1. Belong to the same user.
2. Belong to the same category.
3. Occur within the budget period.

---

## 12. User Flow

### 12.1 New User Flow

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Create Category
   ↓
Create Budget
   ↓
Create Transaction
   ↓
View Financial Summary
```

### 12.2 Expense Flow

```text
Dashboard
   ↓
Create Transaction
   ↓
Select Expense
   ↓
Select Category
   ↓
Enter Amount
   ↓
Enter Date
   ↓
Enter Description
   ↓
Save
   ↓
System Updates Financial Summary
   ↓
System Updates Budget Usage
```

### 12.3 Income Flow

```text
Dashboard
   ↓
Create Transaction
   ↓
Select Income
   ↓
Enter Amount
   ↓
Enter Date
   ↓
Enter Description
   ↓
Save
   ↓
System Updates Financial Summary
```

### 12.4 Budget Flow

```text
Dashboard
   ↓
Create Budget
   ↓
Select Category
   ↓
Enter Budget Amount
   ↓
Set Period
   ↓
Save
   ↓
System Calculates Budget Usage
```

### 12.5 Dashboard Flow

The dashboard retrieves financial data and calculates:

```text
Total Income
Total Expense
Balance
Expense by Category
Budget Usage
Remaining Budget
```

---

## 13. Financial Calculation

### 13.1 Total Income

Total income is the sum of all income transactions belonging to the user.

```text
Total Income = SUM(income transactions)
```

### 13.2 Total Expense

Total expense is the sum of all expense transactions belonging to the user.

```text
Total Expense = SUM(expense transactions)
```

### 13.3 Balance

The user's balance is calculated as:

```text
Balance = Total Income - Total Expense
```

Example:

```text
Total Income  = Rp5,000,000
Total Expense = Rp2,000,000

Balance       = Rp3,000,000
```

### 13.4 Budget Remaining

The remaining budget is:

```text
Remaining Budget = Budget Amount - Category Expense
```

Example:

```text
Budget Amount    = Rp1,500,000
Category Expense = Rp900,000

Remaining Budget = Rp600,000
```

### 13.5 Budget Usage

Budget usage percentage is:

```text
Usage = Category Expense / Budget Amount × 100%
```

Example:

```text
Category Expense = Rp900,000
Budget Amount    = Rp1,500,000

Usage = 900,000 / 1,500,000 × 100%
      = 60%
```

### 13.6 Total Budget

The total budget summary is calculated by aggregating individual category budgets.

```text
Total Budget = SUM(all category budgets)
```

This does not mean that the system has one global budget. Each budget remains associated with its category and period.

---

## 14. MVP Scope

The Minimum Viable Product includes the following functionality.

### Authentication

- Register
- Login
- Logout

### Transaction

- Create transaction
- View transactions
- View transaction by ID
- Update transaction
- Delete transaction
- Filter transactions

### Category

- Create category
- View categories
- Update category
- Delete category

### Budget

- Create budget
- View budgets
- Update budget
- Delete budget
- Calculate budget usage

### Dashboard

- Total income
- Total expense
- Balance
- Expense by category
- Budget summary
- Budget usage

The MVP is intentionally focused on the core functionality required for managing personal expenses.

---

## 15. Future Development Direction

The system may be extended with additional features and technologies after the core MVP has been completed.

### Admin Role

An administrator role may be introduced if the system later requires user management, monitoring, or administrative functionality.

### Multi-Currency

Multi-currency support may be added if the system needs to manage transactions using different currencies.

### Bank Integration

Bank integration may be explored to allow financial transactions to be retrieved or synchronized from external financial services.

### Payment Gateway

Payment gateway integration may be considered if the system later requires payment-related functionality.

### Email Notification

Email notifications may be added for events such as budget alerts or other important financial activities.

### Mobile Application

A mobile application may be developed as an additional client for users who need access from mobile devices.

### AI Financial Features

AI-related features may be explored for use cases such as financial insights, spending pattern analysis, or recommendations.

These features would be considered after the core financial management functionality has been established.

### Redis

Redis may be introduced for use cases such as caching, session management, rate limiting, or other performance-related requirements.

### RabbitMQ / Message Broker

A message broker such as RabbitMQ may be introduced when the system has asynchronous processing requirements that justify message-based communication.

### Microservices

The application may eventually be divided into multiple services if the system grows and there is a clear architectural reason to adopt a distributed architecture.

### WebSocket

WebSocket may be introduced if future requirements require real-time communication or real-time updates.

These future directions are not commitments to implement every feature. They serve as possible areas for future development and advanced learning.

---

## 16. Technology Direction

### Frontend — React

React will be used to build the user interface.

The frontend will be responsible for:

- Displaying financial data
- Managing user interaction
- Sending API requests
- Displaying transaction and budget information
- Rendering dashboard information

### Backend — Node.js

Node.js will be used as the backend runtime.

Node.js is selected because the project is intended to strengthen JavaScript backend development skills.

### Backend Framework — Express.js

Express.js will be used to build the REST API.

The backend will handle:

- Routing
- Request validation
- Authentication
- Authorization
- Business logic
- Database communication
- Error handling

### Database — PostgreSQL

PostgreSQL will be used as the primary relational database.

PostgreSQL is appropriate because the system contains structured relationships between:

```text
User
Category
Transaction
Budget
```

The project will initially use PostgreSQL directly to strengthen SQL and relational database fundamentals.

An ORM such as Prisma can be considered later if there is a clear learning or productivity reason to introduce it.

### API Testing — Postman

Postman will initially be used to test the backend API.

Testing will cover:

- HTTP methods
- Request body
- Query parameters
- Authentication
- Response status
- Response body
- Error handling

### Version Control — Git and GitHub

Git will be used to track changes to the project.

GitHub will be used as the remote repository and project management platform.

The project will use:

- GitHub Repository
- GitHub Issues
- GitHub Projects
- Git commits
- Documentation

Commits will follow the Conventional Commits format.

Examples:

```text
feat: add transaction creation endpoint
fix: handle invalid transaction amount
docs: add database design documentation
refactor: separate transaction service
test: add transaction API tests
chore: configure project tooling
```

### Docker

Docker will be introduced in a later phase.

The purpose is to learn containerization and create a more consistent development and deployment environment.

### Deployment

Deployment will be handled after the application has reached a stable stage.

The specific deployment platform will be determined during the deployment phase based on the application's requirements.

---

## 17. Phase 0 Conclusion

Phase 0 establishes the initial requirements, business rules, MVP scope, and technical direction of the Expense Management System.

The system currently focuses on four core entities:

```text
User
Category
Transaction
Budget
```

The primary functionality consists of:

```text
Authentication
Transaction Management
Category Management
Budget Management
Financial Dashboard
```

The system is intentionally designed so that additional technologies and features can be introduced gradually as the project evolves.

Possible future development areas include:

```text
Admin
Multi-Currency
Bank Integration
Payment Gateway
Email Notification
Mobile Application
AI Features
Redis
RabbitMQ
Microservices
WebSocket
```

These areas will be evaluated based on future requirements and learning objectives rather than being added without a clear purpose.

The next phase is:

**Phase 1 — Database Design**

Phase 1 will translate the requirements defined in this document into a relational database design, including:

- Table structure
- Columns
- Data types
- Primary keys
- Foreign keys
- Constraints
- Relationships
- Index considerations
- SQL implementation

**Status:** Completed
