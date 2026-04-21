from sqlalchemy import Column, Integer, ForeignKey, Numeric, DateTime, Boolean
from app.core.database import Base
from datetime import datetime, date

class FineDue(Base):
    __tablename__ = "fine_due"

    fine_id = Column(Integer, primary_key=True)
    member_id = Column(Integer, ForeignKey("member.member_id"))
    issue_id = Column(Integer, ForeignKey("book_issue.issue_id"))

    amount = Column(Integer)
    paid_status = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class FinePayment(Base):
    __tablename__ = "fine_payment"
    payment_id = Column(Integer, primary_key=True)
    fine_id = Column(Integer, ForeignKey("fine_due.fine_id"))
    amount_paid = Column(Integer)
    payment_date = Column(DateTime, default=datetime.utcnow)