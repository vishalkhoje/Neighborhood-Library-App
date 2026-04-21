from app.models.fine import FineDue, FinePayment
from app.models.member import Member
from app.models.issue import BookIssue
from app.models.book import Book
from sqlalchemy.orm import Session
from app.core.database import get_db
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/fine", tags=["Fine"])

@router.post("/pay")
def pay_fine(fine_id: int, amount: int, db: Session = Depends(get_db)):

    fine = db.query(FineDue).filter(FineDue.fine_id == fine_id).first()

    if not fine:
        raise HTTPException(status_code=404, detail="Fine not found")

    if fine.paid_status:
        raise HTTPException(status_code=400, detail="Already paid")

    if amount < fine.amount:
        raise HTTPException(status_code=400, detail="Partial payment not allowed")

    payment = FinePayment(
        fine_id=fine_id,
        amount_paid=amount
    )

    fine.paid_status = True

    db.add(payment)
    db.commit()

    return {
        "message": "Fine paid successfully"
    }

@router.get("/pending")
def get_pending_fines(db: Session = Depends(get_db)):
    results = db.query(
        FineDue,
        Member.first_name,
        Member.last_name,
        Member.mobile_no,
        Book.book_title
    ).join(
        Member, FineDue.member_id == Member.member_id
    ).join(
        BookIssue, FineDue.issue_id == BookIssue.issue_id
    ).join(
        Book, BookIssue.book_id == Book.book_id
    ).all()

    fines = []
    for fine, first_name, last_name, mobile_no, book_title in results:
        fines.append({
            "fine_id": fine.fine_id,
            "member_id": fine.member_id,
            "issue_id": fine.issue_id,
            "amount": fine.amount,
            "paid_status": fine.paid_status,
            "created_at": fine.created_at,
            "member_name": f"{first_name} {last_name}".strip(),
            "member_contact_number": mobile_no,
            "book_name": book_title
        })
    return fines