# Neighborhood Library Service - Application Workflow

This document outlines the end-to-end workflows of the Library Management System, describing the interaction between the Frontend (Next.js), Backend (FastAPI), and Database (PostgreSQL).

## System Workflow Diagram

![Neighborhood Library Service](./documentation/Library%20management%20flow.png)


---

## Detailed Workflow Descriptions

### 1. Book & Member Management
- **Action**: Administrators add new books (with details like ISBN, Title, and Author) and register new members.
- **Data Flow**: Frontend sends a POST request to `/api/books` or `/api/members`. The backend validates the data using Pydantic schemas and persists it to the PostgreSQL database via SQLAlchemy.

### 2. Book Issuance (Borrowing)
- **Searchable Selection**: Instead of manual ID entry, staff use a **Searchable Dropdown**. Typing a name or ID triggers a filter against the locally cached book/member list.
- **Validation**:
    - The system checks if the book has available copies (Total Copies vs. Active Issues).
    - It verifies if the member already has the same book issued.
- **Record Creation**: Upon confirmation, an `Issue` record is created with a `due_date` (defaulting to 14 days from issuance). The status is set to `ISSUED`.

### 3. Return & Overdue Processing
- **Action**: When a book is brought back, the staff clicks **Return**.
- **Return Logic**:
    - The backend sets the `return_date` to the current timestamp.
    - It calculates the difference between the `due_date` and the `return_date`.
- **Automatic Fine Generation**:
    - If the book is late, the system calculates a fine (Current rate: **₹10 per day**).
    - A new entry is created in the `fine_due` table, linked to both the member and the specific issue record.

### 4. Fine Payment & Settlement
- **Visibility**: All pending and paid fines are visible in the **Fine Register**.
- **Payment Flow**:
    - Staff selects **Mark as Paid** for a pending fine.
    - The system creates a record in the `fine_payment` table for audit purposes.
    - The `paid_status` in the `fine_due` table is updated to `True`.
- **Persistence**: This ensures a complete history of who owed what and when it was settled.

---

## Technical Stack
- **Frontend**: Next.js (App Router), Tailwind CSS (via @import), React Hot Toast for notifications.
- **Backend**: FastAPI (Python), SQLAlchemy ORM, Pydantic for validation.
- **Database**: PostgreSQL 15.
- **Infrastructure**: Podman/Docker Compose for containerized deployment.
