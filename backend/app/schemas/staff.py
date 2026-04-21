from pydantic import BaseModel, Field
from typing import Optional

class StaffBase(BaseModel):
    staff_name: str = Field(..., example="John Doe")
    staff_designation: str = Field(..., example="Librarian")

class StaffCreate(StaffBase):
    pass

class StaffUpdate(BaseModel):
    staff_name: Optional[str] = None
    staff_designation: Optional[str] = None

class StaffResponse(StaffBase):
    issued_by_id: int

    class Config:
        from_attributes = True
