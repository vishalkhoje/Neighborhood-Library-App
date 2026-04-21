from sqlalchemy.orm import Session
from app.models.issue import BookIssue
from app.models.book import Book
from fastapi import HTTPException


def issue_book(db: Session, data):
    active_issue = db.query(BookIssue).filter(
        BookIssue.book_id == data.book_id,
        BookIssue.issue_status == "ISSUED"
    ).first()

    if active_issue:
        raise HTTPException(status_code=400, detail="Book already issued")

    return True