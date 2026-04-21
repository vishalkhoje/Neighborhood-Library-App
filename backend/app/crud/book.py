from sqlalchemy.orm import Session
from app.models.book import Book
from app.schemas.book import BookCreate


def create_book(db: Session, book: BookCreate):
    db_book = Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def get_books(db: Session):
    return db.query(Book).all()

def update_book(db: Session, book_id: int, book_update: BookCreate):
    db_book = db.query(Book).filter(Book.book_id == book_id).first()
    if db_book:
        # Update fields dynamically from the Pydantic model
        update_data = book_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_book, key, value)
        
        db.commit()
        db.refresh(db_book)
    return db_book

def delete_book(db: Session, book_id: int):
    db_book = db.query(Book).filter(Book.book_id == book_id).first()
    if db_book:
        db.delete(db_book)
        db.commit()
        return True
    return False