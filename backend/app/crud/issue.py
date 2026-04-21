from sqlalchemy.orm import Session
from datetime import datetime
from app.models.issue import BookIssue


def create_issue(db: Session, data):
    issue = BookIssue(
        book_id=data.book_id,
        member_id=data.member_id,
        issued_by_id=data.issued_by_id,
        issue_date=datetime.utcnow()
    )
    db.add(issue)
    db.commit()
    db.refresh(issue)
    return issue

def get_issue_books(db: Session):
    return db.query(BookIssue).all()