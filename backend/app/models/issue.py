from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from app.core.database import Base
import enum

class IssueStatus(str, enum.Enum):
    ISSUED = "ISSUED"
    RETURNED = "RETURNED"
    OVERDUE = "OVERDUE"

class BookIssue(Base):
    __tablename__ = "book_issue"

    issue_id = Column(Integer, primary_key=True)

    book_id = Column(Integer, ForeignKey("book.book_id"))
    member_id = Column(Integer, ForeignKey("member.member_id"))
    issued_by_id = Column(Integer, ForeignKey("library_staff.issued_by_id"))

    issue_date = Column(DateTime, nullable=False)
    due_date = Column(DateTime, nullable=False)
    return_date = Column(DateTime)

    issue_status = Column(Enum(IssueStatus), default=IssueStatus.ISSUED)