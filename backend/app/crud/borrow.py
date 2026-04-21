from datetime import datetime
from app.models import BorrowRecord
from app.models import Book

def borrow_book(db, book_id, member_id):
    book = db.query(Book).filter(Book.id == book_id).first()

    if not book or not book.available:
        raise Exception("Book not available")

    record = BorrowRecord(book_id=book_id, member_id=member_id)
    book.available = False

    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def return_book(db, record_id):
    record = db.query(BorrowRecord).filter_by(id=record_id).first()

    if not record or record.returned_at:
        raise Exception("Invalid return")

    record.returned_at = datetime.utcnow()

    book = db.query(Book).filter(Book.id == record.book_id).first()
    book.available = True

    db.commit()
    return record