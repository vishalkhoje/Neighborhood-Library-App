from sqlalchemy.orm import Session
from app.models.staff import LibraryStaff
from app.schemas.staff import StaffCreate, StaffUpdate

def get_staffs(db: Session):
    return db.query(LibraryStaff).all()

def create_staff(db: Session, staff: StaffCreate):
    db_staff = LibraryStaff(**staff.dict())
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

def update_staff(db: Session, staff_id: int, staff_update: StaffUpdate):
    db_staff = db.query(LibraryStaff).filter(LibraryStaff.issued_by_id == staff_id).first()
    if db_staff:
        update_data = staff_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_staff, key, value)
        db.commit()
        db.refresh(db_staff)
    return db_staff

def delete_staff(db: Session, staff_id: int):
    db_staff = db.query(LibraryStaff).filter(LibraryStaff.issued_by_id == staff_id).first()
    if db_staff:
        db.delete(db_staff)
        db.commit()
        return True
    return False
