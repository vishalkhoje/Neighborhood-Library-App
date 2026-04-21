from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.core.database import Base
from sqlalchemy.orm import relationship

class Member(Base):
    __tablename__ = "member"

    member_id = Column(Integer, primary_key=True)

    first_name = Column(String)
    last_name = Column(String)

    city = Column(String)
    mobile_no = Column(String)

    email_id = Column(String, unique=True)
    date_of_birth = Column(Date)

    account_type = Column(String, default="Standard")
    account_status = Column(String, default="Active") # "Active" or "Inactive"
    membership_start_date = Column(Date)
    membership_end_date = Column(Date)