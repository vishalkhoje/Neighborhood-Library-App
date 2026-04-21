from pydantic import BaseModel

class BorrowRequest(BaseModel):
    book_id: str
    member_id: str