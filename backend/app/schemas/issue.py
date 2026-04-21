from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class IssueCreate(BaseModel):
    book_id: int = Field(example=1)
    member_id: int = Field(example=1)
    issued_by_id: Optional[int] = Field(example=1)
    issue_date: datetime
    due_date: Optional[datetime] = None 


class IssueResponse(BaseModel):
    issue_id: int
    book_id: int
    member_id: int
    issued_by_id: int
    issue_date: datetime
    due_date: datetime
    return_date: datetime | None
    issue_status: str

    class Config:
        from_attributes = True

class IssueOut(BaseModel):
    issue_id: int
    book_id: int
    member_id: int
    issued_by_id: Optional[int] = None
    issue_date: datetime = None
    due_date: Optional[datetime] = None 
    return_date: Optional[datetime]

    class Config:
        orm_mode = True

class IssueUpdate(BaseModel):
    due_date: Optional[datetime] = None