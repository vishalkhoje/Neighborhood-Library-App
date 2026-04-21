from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.book import BookCreate, BookResponse
from app.crud import book as crud_books

router = APIRouter(prefix="/books", tags=["Books"])

@router.post("/", response_model=BookResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new book",
    description="Add a new book into the library system"
)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    return crud_books.create_book(db, book)


@router.get("/", response_model=List[BookResponse],
    summary="Get all books",
    description="Fetch list of all books in the library"
)
def get_books(db: Session = Depends(get_db)):
    return crud_books.get_books(db)

@router.put("/{book_id}", response_model=BookResponse,
    summary="Update a book",
    description="Update details of an existing book"
)
def update_book(book_id: int, book_update: BookCreate, db: Session = Depends(get_db)):
    """
    Update an existing book by its ID. 
    Note: Using BookCreate here for simplicity, but BookUpdate is better for partial edits.
    """
    db_book = crud_books.update_book(db, book_id, book_update)
    if db_book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Book with ID {book_id} not found"
        )
    return db_book

@router.delete("/{book_id}", 
    status_code=status.HTTP_204_NO_CONTENT, 
    summary="Delete a book"
)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    success = crud_books.delete_book(db, book_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Book with ID {book_id} not found"
        )
    return None # 204 status