from sqlalchemy.orm import Session
from app.models.member import Member
from app.schemas.member import MemberCreate


def create_member(db: Session, member: MemberCreate):
    db_member = Member(**member.dict())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

# def get_members(db: Session):
#     return db.query(Member).all()

def get_members(db: Session):
    return db.query(Member).all()

def update_member(db: Session, member_id: int, member_update: MemberCreate):
    db_member = db.query(Member).filter(Member.member_id == member_id).first()
    if db_member:
        update_data = member_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_member, key, value)
        db.commit()
        db.refresh(db_member)
    return db_member

def delete_member(db: Session, member_id: int):
    db_member = db.query(Member).filter(Member.member_id == member_id).first()
    if db_member:
        db.delete(db_member)
        db.commit()
        return True
    return False
