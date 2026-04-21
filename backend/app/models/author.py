from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class Author(Base):
    __tablename__ = "author"

    author_id = Column(Integer, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)


class BookAuthor(Base):
    __tablename__ = "book_author"

    book_id = Column(Integer, ForeignKey("book.book_id"), primary_key=True)
    author_id = Column(Integer, ForeignKey("author.author_id"), primary_key=True)