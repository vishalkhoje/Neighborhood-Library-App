from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.member import MemberCreate, MemberResponse
from app.crud import member as members_crud

router = APIRouter(prefix="/members", tags=["Members"])


@router.post("/", response_model=MemberResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new member"
)
def create_member(member: MemberCreate, db: Session = Depends(get_db)):
    return members_crud.create_member(db, member)

@router.get(
    "/",
    response_model=List[MemberResponse],
    summary="Get all members",
)
def get_members(db: Session = Depends(get_db)):
    return members_crud.get_members(db)

@router.put("/{member_id}", response_model=MemberResponse, summary="Update a member")
def update_member(member_id: int, member_update: MemberCreate, db: Session = Depends(get_db)):
    db_member = members_crud.update_member(db, member_id, member_update)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return db_member

@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a member")
def delete_member(member_id: int, db: Session = Depends(get_db)):
    success = members_crud.delete_member(db, member_id)
    if not success:
        raise HTTPException(status_code=404, detail="Member not found")
    return None
