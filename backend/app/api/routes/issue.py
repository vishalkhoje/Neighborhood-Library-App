from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.issue import IssueCreate, IssueResponse, IssueUpdate
from app.crud.issue import create_issue, get_issue_books
from app.services.issue_service import issue_book
from app.models.fine import FineDue
from app.models.issue import BookIssue as Issue
from fastapi import HTTPException
from datetime import datetime, timedelta
from app.core.config import settings
from app.models.book import Book
from app.models.member import Member
from app.models.fine import FineDue

router = APIRouter(prefix="/issue", tags=["Issue"])

FINE_PER_DAY = 10

@router.post("/return")
def return_book(issue_id: int, db: Session = Depends(get_db)):

    issue = db.query(Issue).filter(Issue.issue_id == issue_id).first()

    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    if issue.return_date:
        raise HTTPException(status_code=400, detail="Already returned")

    today = datetime.utcnow()
    issue.return_date = today

    # Calculate late days
    late_days = (today.date() - issue.due_date.date()).days
    late_days = max(late_days, 0)

    fine_amount = late_days * FINE_PER_DAY

    # ✅ Create FineDue entry if fine exists
    if fine_amount > 0:
        fine = FineDue(
            member_id=issue.member_id,
            issue_id=issue.issue_id,
            amount=fine_amount,
            paid_status=False
        )
        db.add(fine)

    # ✅ INCREASE COPIES BACK
    book = db.query(Book).filter(Book.book_id == issue.book_id).first()
    book.copies_total += 1

    issue.issue_status = "RETURNED"

    db.commit()
    db.refresh(issue)

    return {
        "message": "Book returned",
        "late_days": late_days,
        "fine": fine_amount
    }


@router.post("/", response_model=IssueResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Issue a book",
    description="Issue a book to a member if not already issued"
)
def create_issue(data: IssueCreate, db: Session = Depends(get_db)):
# -------------------------
    # ✅ 1. VALIDATE MEMBER
    # -------------------------
    member = db.query(Member).filter(Member.member_id == data.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    # -------------------------
    # ✅ 2. VALIDATE BOOK
    # -------------------------
    book = db.query(Book).filter(Book.book_id == data.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
# -------------------------
    # ✅ 3. CHECK AVAILABILITY (Multi-copy logic)
    # -------------------------
    # Count how many copies of this book are currently out
    active_issues_count = db.query(Issue).filter(
        Issue.book_id == data.book_id,
        Issue.issue_status == "ISSUED"
    ).count()

    # Compare against the book's total capacity
    if active_issues_count >= book.copies_total:
        raise HTTPException(
            status_code=400, 
            detail=f"All {book.copies_total} copies of this book are currently issued."
        )

    # -------------------------
    # ✅ 4. PREVENT DOUBLE-ISSUE TO SAME MEMBER
    # -------------------------
    # (Optional but recommended: same person can't take two copies of the same book)
    user_has_book = db.query(Issue).filter(
        Issue.book_id == data.book_id,
        Issue.member_id == data.member_id,
        Issue.issue_status == "ISSUED"
    ).first()

    if user_has_book:
        raise HTTPException(status_code=400, detail="This member already has this book.")

    # ✅ Step 1: Default issue_date
    issue_date = data.issue_date or datetime.utcnow()

    # ✅ Step 2: Control due_date
    if data.due_date:
        if data.due_date < issue_date:
            raise HTTPException(status_code=400, detail="Due date cannot be before issue date")
        due_date = data.due_date
    else:
        due_date = issue_date + timedelta(days=settings.DEFAULT_BORROW_DAYS)# ✅ Step 3: Create issue
    new_issue = Issue(
        book_id=data.book_id,
        member_id=data.member_id,
        issued_by_id=data.issued_by_id,
        issue_date=issue_date,
        due_date=due_date,
        issue_status="ISSUED"
    )

    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)

    return new_issue

# @router.get("/")
# def issue(db: Session = Depends(get_db)):

#     issues = db.query(Issue).all()
#     result = []

#     for issue in issues:
#         fine = db.query(FineDue).filter(
#             FineDue.issue_id == issue.issue_id
#         ).first()

#         result.append({
#             "issue_id": issue.issue_id,
#             "book_id": issue.book_id,
#             "member_id": issue.member_id,
#             "issued_by_id": issue.issued_by_id,
#             "issue_date": issue.issue_date,
#             "due_date": issue.due_date,
#             "return_date": issue.return_date,
#             "issue_status": issue.issue_status,
#             "fine": fine.amount if fine else 0,
#             "fine_status": fine.paid_status if fine else None
#         })

#     return result

@router.get("/")
def issue(db: Session = Depends(get_db)):
    # Join Issue with Book, Member, and FineDue (outer join for fine)
    query_result = db.query(
        Issue, 
        Book.book_title, 
        Member.first_name, 
        Member.last_name
    ).join(Book, Issue.book_id == Book.book_id)\
     .join(Member, Issue.member_id == Member.member_id)\
     .all()

    result = []

    for issue, book_title, first_name, last_name in query_result:
        # Fetch fine (Still better to join this too, but keeping it simple for now)
        fine = db.query(FineDue).filter(FineDue.issue_id == issue.issue_id).first()

        result.append({
            "issue_id": issue.issue_id,
            "book_id": issue.book_id,
            "book_name": book_title,
            "member_id": issue.member_id,
            "member_name": f"{first_name} {last_name}",
            "issued_by_id": issue.issued_by_id,
            "issue_date": issue.issue_date,
            "due_date": issue.due_date,
            "return_date": issue.return_date,
            "issue_status": issue.issue_status,
            "fine": fine.amount if fine else 0,
            "fine_status": fine.paid_status if fine else None
        })

    return result


@router.delete("/{id}")
def delete_issue(id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).get(id)
    db.delete(issue)
    db.commit()

@router.put("/{issue_id}")
def update_issue(issue_id: int, data: IssueUpdate, db: Session = Depends(get_db)):

    issue = db.query(Issue).filter(Issue.issue_id == issue_id).first()

    if not issue:
        raise HTTPException(404, "Issue not found")

    # ❌ Do not allow update if already returned
    if issue.issue_status == "RETURNED":
        raise HTTPException(400, "Cannot update returned issue")

    # ✅ Only allow due_date update
    if data.due_date:
# Convert to naive datetime to prevent offset-naive vs offset-aware crash
        requested_due_date = data.due_date.replace(tzinfo=None)
        
        # Ensure issue.issue_date is also treated as naive (if not already)
        current_issue_date = issue.issue_date.replace(tzinfo=None)

        if requested_due_date < current_issue_date:
            raise HTTPException(status_code=400, detail="Due date cannot be before issue date")

        issue.due_date = requested_due_date

    db.commit()
    db.refresh(issue)

    return issue