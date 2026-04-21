from enum import Enum
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class BookIssue(Base):
    __tablename__ = "book_issue"

    issue_id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey("book.book_id"))
    member_id = Column(Integer, ForeignKey("member.member_id"))
    issued_by_id = Column(Integer, ForeignKey("library_staff.issued_by_id"))

    issue_date = Column(DateTime)
    return_date = Column(DateTime)

    issue_status = Column(Enum(IssueStatus), default=IssueStatus.ISSUED)

    book = relationship("Book", back_populates="issues")