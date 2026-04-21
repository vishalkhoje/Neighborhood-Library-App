from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Publisher(Base):
    __tablename__ = "publisher"

    publisher_id = Column(Integer, primary_key=True)
    publisher_name = Column(String)
    publication_language = Column(String)
    publication_type = Column(String)