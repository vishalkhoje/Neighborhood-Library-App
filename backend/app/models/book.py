from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class Book(Base):
    __tablename__ = "book"

    book_id = Column(Integer, primary_key=True)
    isbn_code = Column(String, unique=True)
    book_title = Column(String, nullable=False)
    author_name = Column(String, nullable=False)

    category = Column(String)  # optional, or remove completely
    publisher_name = Column(String)
    location_name = Column(String)

    publication_year = Column(Integer)
    book_edition = Column(String)

    copies_total = Column(Integer, nullable=False)