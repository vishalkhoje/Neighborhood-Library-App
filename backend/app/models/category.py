from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Category(Base):
    __tablename__ = "category"

    category_id = Column(Integer, primary_key=True)
    category_name = Column(String, nullable=False)