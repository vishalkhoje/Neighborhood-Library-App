from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.staff import StaffCreate, StaffResponse, StaffUpdate
from app.crud.staff import get_staffs, create_staff, update_staff, delete_staff

router = APIRouter(prefix="/staff", tags=["Staff"])

@router.get("/", response_model=List[StaffResponse])
def read_staffs(db: Session = Depends(get_db)):
    return get_staffs(db)

@router.post("/", response_model=StaffResponse, status_code=status.HTTP_201_CREATED)
def create_new_staff(staff: StaffCreate, db: Session = Depends(get_db)):
    return create_staff(db=db, staff=staff)

@router.put("/{staff_id}", response_model=StaffResponse)
def update_existing_staff(staff_id: int, staff: StaffUpdate, db: Session = Depends(get_db)):
    updated_staff = update_staff(db=db, staff_id=staff_id, staff_update=staff)
    if not updated_staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return updated_staff

@router.delete("/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_staff(staff_id: int, db: Session = Depends(get_db)):
    success = delete_staff(db=db, staff_id=staff_id)
    if not success:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return None
