from pydantic import BaseModel, Field

class BookCreate(BaseModel):
    isbn_code: str = Field(example="ISBN001")
    book_title: str = Field(example="Clean Code")
    author_name: str = Field(example="Robert C. Martin")
    category: str | None = None
    publisher_name: str = Field(example="Himalaya")
    location_name: str = Field(example="F1R1")
   
    publication_year: int = Field(example=2008)
    book_edition: str = Field(example="1st")
    copies_total: int = Field(example=5)


class BookResponse(BookCreate):
    book_id: int

    class Config:
        from_attributes = True