import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from app.core.database import Base

class BorrowRecord(Base):
    __tablename__ = "borrow_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    book_id = Column(Integer, ForeignKey("book.book_id"), nullable=False)
    member_id = Column(Integer, ForeignKey("member.member_id"), nullable=False)
    borrowed_at = Column(DateTime, default=datetime.utcnow)
    returned_at = Column(DateTime, nullable=True)