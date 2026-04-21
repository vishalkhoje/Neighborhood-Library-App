from app.core.database import SessionLocal
from app.models.fine import FineDue
from app.models.issue import BookIssue

db = SessionLocal()
issue = db.query(BookIssue).first()
if issue:
    f1 = FineDue(member_id=issue.member_id, issue_id=issue.issue_id, amount=100, paid_status=False)
    f2 = FineDue(member_id=issue.member_id, issue_id=issue.issue_id, amount=50, paid_status=True)
    db.add(f1)
    db.add(f2)
    db.commit()
    print("Fines seeded")
