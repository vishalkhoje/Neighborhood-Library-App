from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Location(Base):
    __tablename__ = "location"

    location_id = Column(Integer, primary_key=True)
    shelf_no = Column(String)
    shelf_name = Column(String)
    floor_no = Column(Integer)