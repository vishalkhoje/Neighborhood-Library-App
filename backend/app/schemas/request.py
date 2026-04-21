from pydantic import BaseModel

class RequestCreate(BaseModel):
    book_id: int
    member_id: int


class RequestResponse(BaseModel):
    request_id: int
    status: str

    class Config:
        from_attributes = True