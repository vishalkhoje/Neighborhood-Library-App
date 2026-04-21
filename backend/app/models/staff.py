from sqlalchemy import Column, Integer, String
from app.core.database import Base

class LibraryStaff(Base):
    __tablename__ = "library_staff"

    issued_by_id = Column(Integer, primary_key=True)
    staff_name = Column(String)
    staff_designation = Column(String)