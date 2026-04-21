from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

# 1. Base Class: Common fields shared across Create, Update, and Response
class MemberBase(BaseModel):
    first_name: str = Field(..., example="Vishal")
    last_name: str = Field(..., example="Khoje")
    city: str = Field(..., example="Mumbai")
    mobile_no: str = Field(..., example="9999999999")
    email_id: str = Field(..., example="vishal@test.com")
    date_of_birth: date = Field(..., example="1998-05-10")
    account_type: Optional[str] = Field(..., example="Standard")
    account_status: Optional[str] = Field(..., example="Active")
    membership_start_date: Optional[date] = None
    membership_end_date: Optional[date] = None

# 2. For POST /members/
class MemberCreate(MemberBase):
    pass

# 3. For PUT /members/{member_id}
# We use Optional so the frontend isn't forced to send everything
class MemberUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    city: Optional[str] = None
    mobile_no: Optional[str] = None
    email_id: Optional[str] = None
    date_of_birth: Optional[date] = None

    # Add these so the backend accepts them in the request body
    account_status: Optional[str] = None
    membership_start_date: Optional[date] = None
    membership_end_date: Optional[date] = None

class MemberResponse(BaseModel):
    member_id: int
    first_name: str
    last_name: str
    city: str
    mobile_no: str
    email_id: str
    date_of_birth: date
    
    account_type: Optional[str] = None
    account_status: Optional[str] = None
    membership_start_date: Optional[date] = None
    membership_end_date: Optional[date] = None

    class Config:
        from_attributes = True