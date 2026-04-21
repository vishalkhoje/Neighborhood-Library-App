from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta

from app.core.database import SessionLocal
from app.models import (
    Author,
    Book,
    Member,
    BookAuthor,
    BookIssue,
    BookRequest,
)

from app.models.staff import LibraryStaff


def seed_data():
    db: Session = SessionLocal()

    try:
        print("Cleaning existing data...")

        db.query(BookIssue).delete()
        db.query(BookRequest).delete()
        db.query(BookAuthor).delete()
        db.query(Book).delete()
        db.query(Member).delete()
        db.query(Author).delete()
        db.commit()

        # -------------------------
        # AUTHORS
        # -------------------------
        authors = [
            Author(first_name="Robert", last_name="Martin"),
            Author(first_name="James", last_name="Clear"),
        ]
        db.add_all(authors)
        db.commit()

        # -------------------------
        # BOOKS
        # -------------------------
        print("Seeding books...")

        book1 = Book(
            isbn_code="ISBN001",
            book_title="Clean Code",
            author_name="Robert Martin",
            category="Programming",
            publisher_name="Prentice Hall",
            location_name="A1 Shelf",
            publication_year=2008,
            book_edition="1st",
            copies_total=5,
        )

        book2 = Book(
            isbn_code="ISBN002",
            book_title="Atomic Habits",
            author_name="James Clear",
            category="Programming",
            publisher_name="Addison-Wesley",
            location_name="B1 Shelf",
            publication_year=2018,
            book_edition="1st",
            copies_total=3,
        )

        db.add_all([book1, book2])
        db.commit()

        # -------------------------
        # BOOK-AUTHOR MAPPING
        # -------------------------
        book_authors = [
            BookAuthor(book_id=book1.book_id, author_id=authors[0].author_id),
            BookAuthor(book_id=book2.book_id, author_id=authors[1].author_id),
        ]
        db.add_all(book_authors)
        db.commit()

        # -------------------------
        # MEMBERS
        # -------------------------
        print("Seeding members...")

        member1 = Member(
                first_name="Vishal",
                last_name="Khoje",
                city="Mumbai",
                mobile_no="9999999999",
                email_id="vishal@example.com",
                date_of_birth=date(1990, 1, 1),
                account_type="Premium",
                account_status="Active",
                membership_start_date=date.today(),
                membership_end_date=date.today() + timedelta(days=365)
            )

        member2 = Member(
                first_name="Rahul",
                last_name="Sharma",
                city="Pune",
                mobile_no="8888888888",
                email_id="rahul@example.com",
                date_of_birth=date(1995, 8, 15),
                account_type="Standard",
                account_status="Inactive",
                membership_start_date=date.today() - timedelta(days=400),
                membership_end_date=date.today() - timedelta(days=35)
            )
        

        db.add_all([member1, member2])
        db.commit()
        print("Successfully seeded merged Member table!")

        # -------------------------
        # STAFF
        # -------------------------
        print("Seeding staff...")

        staff_admin = LibraryStaff(
            staff_name="Admin User",
            staff_designation="Librarian"
        )

        db.add(staff_admin)
        db.commit()

        # -------------------------
        # ISSUE (WITH DUE DATE)
        # -------------------------
        print("Seeding issue transactions...")

        issue1 = BookIssue(
            book_id=book1.book_id,
            member_id=member1.member_id,
            issued_by_id=staff_admin.issued_by_id,
            issue_date=datetime.utcnow() - timedelta(days=10),
            due_date=datetime.utcnow() - timedelta(days=10),  # overdue
            issue_status="ISSUED",
        )

        issue2 = BookIssue(
            book_id=book2.book_id,
            member_id=member2.member_id,
            issued_by_id=staff_admin.issued_by_id,
            issue_date=datetime.utcnow(),
            due_date=datetime.utcnow() + timedelta(days=7),
            issue_status="ISSUED",
        )

        db.add_all([issue1, issue2])
        db.commit()

        # -------------------------
        # BOOK REQUEST
        # -------------------------
        print("Seeding requests...")

        request1 = BookRequest(
            book_id=book2.book_id,
            member_id=member2.member_id,
            request_date=datetime.utcnow(),
            status="PENDING",
        )

        db.add(request1)
        db.commit()

        print("✅ Seed data inserted successfully!")

    except Exception as e:
        db.rollback()
        print("❌ Error while seeding:", str(e))
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()