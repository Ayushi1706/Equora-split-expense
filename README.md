# Equora – Smart Expense Splitting Application

Equora is a full-stack web application that helps groups of people manage shared expenses, calculate balances, track settlements, and receive notifications. It simplifies expense sharing for trips, roommates, families, friends, and events — with secure JWT authentication, real-time balance calculations, settlement tracking, and a modern responsive interface.

---

## Live Links

| Layer | URL |
|---|---|
| Frontend | https://equora-split-expense.vercel.app |
| Backend API | https://equora-split-expense-backend.onrender.com |
| Database | Supabase PostgreSQL |

---

## Tech Stack

**Frontend**
- React.js + Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React Icons

**Backend**
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA + Hibernate
- Maven

**Database**
- PostgreSQL, hosted on Supabase

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → Supabase PostgreSQL

---

## Deployment Architecture

```
                Vercel
          (React Frontend)
                 │
                 │ HTTPS
                 ▼
         Render Spring Boot
           REST API Server
                 │
                 │ JPA / Hibernate
                 ▼
       Supabase PostgreSQL
```

---

## Authentication

Implemented end-to-end with JWT:

- User registration
- User login
- Password encryption with BCrypt
- JWT token generation
- JWT authentication filter on every request
- Protected APIs (everything except `/api/auth/**`)
- Stateless sessions — no server-side session state

---

## Database Schema

### User
| Field | Description |
|---|---|
| id | Primary key |
| name | Display name |
| email | Unique login identifier |
| password | BCrypt hash |
| avatarColor | UI accent color |
| createdAt | Timestamp |

### Group
| Field | Description |
|---|---|
| id | Primary key |
| name | e.g. "Goa Trip", "Flat Expenses", "Office Party" |
| emoji | Display icon |
| category | TRIP / HOME / FOOD / EVENT / OTHER |
| currency | Group's default currency |
| createdAt | Timestamp |

### GroupMember
Many-to-many mapping between Users and Groups.
- Composite key: `groupId` + `userId`

### Expense
| Field | Description |
|---|---|
| id | Primary key |
| group | Owning group |
| description | What the expense was for |
| category | Expense category |
| amount | Total amount |
| currency | Currency code |
| paidBy | User who paid |
| expenseDate | When it was incurred |

### ExpenseSplit
| Field | Description |
|---|---|
| expenseId | Parent expense |
| userId | Participant |
| amountOwed | That participant's share |

Supports both **equal split** and **exact split** strategies.

### Settlement
| Field | Description |
|---|---|
| id | Primary key |
| groupId | Owning group |
| fromUser | Who paid |
| toUser | Who received |
| amount | Settlement amount |
| method | Payment method |
| status | PENDING / COMPLETED |
| settledAt | Completion timestamp |

### Notification
| Field | Description |
|---|---|
| id | Primary key |
| user | Recipient |
| actor | User who triggered it (nullable) |
| type | EXPENSE_ADDED / SETTLEMENT_REQUEST / SETTLEMENT_RECEIVED / GROUP_INVITE / REMINDER |
| title | Short headline |
| description | Full message |
| read | Read state |
| createdAt | Timestamp |

---

## Backend Modules & Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### User
```
GET /api/user/{id}
```

### Group
```
POST   /api/group
GET    /api/group/{id}
GET    /api/group/user/{userId}
PUT    /api/group/{id}
DELETE /api/group/{id}
POST   /api/group/{groupId}/members
DELETE /api/group/{groupId}/members/{userId}
GET    /api/group/search
GET    /api/group/{groupId}/members/count
```

### Expense
```
POST   /api/expense
GET    /api/expense/{id}
DELETE /api/expense/{id}
GET    /api/expense/group/{groupId}
GET    /api/expense/user/{userId}
```

### Balance
```
GET /api/balance/group/{groupId}
GET /api/balance/user/{userId}
```

### Settlement
```
POST  /api/settlement
GET   /api/settlement/{id}
GET   /api/settlement/group/{groupId}
GET   /api/settlement/user/{userId}
PATCH /api/settlement/{id}/status
```

### Notification
```
GET    /api/notification/user/{userId}
PATCH  /api/notification/{id}/read
DELETE /api/notification/{id}
```

### Dashboard
```
GET /api/dashboard/{userId}
```
Returns: groups, balances, recent notifications, unread notification count.

---

## Frontend Pages

| Page | Purpose |
|---|---|
| Login / Register | Authentication |
| Dashboard | Total you owe, total you're owed, groups, notifications |
| Groups | Create, edit, delete, search groups |
| Group Details | Members, expenses, balances, settlements for one group |
| Expense | Add expense, expense history, expense details |
| Settlements | Pending settlements, settlement history |
| Notifications | Notification list, mark read, delete |
| Profile | User information, groups joined, logout |

---

## Security

- JWT authentication on every protected route
- BCrypt password encryption
- Spring Security filter chain with a custom `JwtAuthFilter`
- Stateless sessions (`SessionCreationPolicy.STATELESS`)
- CORS configuration scoped to the deployed frontend origin

---

## Features

- ✅ JWT Authentication
- ✅ Password Encryption
- ✅ Group Management
- ✅ Member Management
- ✅ Expense Management
- ✅ Equal Expense Split
- ✅ Exact Expense Split
- ✅ Balance Calculation
- ✅ Settlement Tracking
- ✅ Notification System
- ✅ Dashboard
- ✅ Search Groups
- ✅ Responsive UI
- ✅ PostgreSQL Database
- ✅ REST APIs

---

## Project Flow

```
User Registers
      │
      ▼
User Logs In
      │
      ▼
JWT Token Generated
      │
      ▼
Frontend Stores Token
      │
      ▼
Authenticated API Requests
      │
      ▼
Create Group
      │
      ▼
Add Members
      │
      ▼
Add Expenses
      │
      ▼
Expense Split Created
      │
      ▼
Balances Calculated
      │
      ▼
Settlement Created
      │
      ▼
Notifications Generated
      │
      ▼
Dashboard Updated
```

---

## About This Project

Equora demonstrates secure authentication, REST API design, relational database modeling, backend business logic (balance calculation, expense splitting), and a modern, responsive frontend — built as a full-stack portfolio project covering the complete lifecycle from local development through cloud deployment.
