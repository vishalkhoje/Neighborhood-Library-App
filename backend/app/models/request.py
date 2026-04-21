from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from app.core.database import Base
import enum

class RequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class BookRequest(Base):
    __tablename__ = "book_request"

    request_id = Column(Integer, primary_key=True)

    book_id = Column(Integer, ForeignKey("book.book_id"))
    member_id = Column(Integer, ForeignKey("member.member_id"))

    request_date = Column(DateTime)
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)