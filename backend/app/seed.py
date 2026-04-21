from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta

from app.core.database import SessionLocal, Base, engine
from app.models import (
    Author,
    Book,
    Member,
    BookAuthor,
    BookIssue,
    BookRequest,
    Category,
    Publisher,
    Location,
    LibraryStaff,
    FineDue,
    FinePayment,
)


def seed_data():
    db: Session = SessionLocal()

    try:
        print("Ensuring tables exist...")
        Base.metadata.create_all(bind=engine)

        print("Cleaning existing data...")

        # Delete in order of dependency
        db.query(FinePayment).delete()
        db.query(FineDue).delete()
        db.query(BookIssue).delete()
        db.query(BookRequest).delete()
        db.query(BookAuthor).delete()
        db.query(Book).delete()
        db.query(Member).delete()
        db.query(Author).delete()
        db.query(LibraryStaff).delete()
        db.query(Category).delete()
        db.query(Publisher).delete()
        db.query(Location).delete()
        
        db.commit()

        # -------------------------
        # AUTHORS
        # -------------------------
        print("Seeding authors...")
        authors = [
            Author(first_name="Robert", last_name="Martin"),
            Author(first_name="James", last_name="Clear"),
            Author(first_name="J.K.", last_name="Rowling"),
            Author(first_name="George R.R.", last_name="Martin"),
            Author(first_name="Andrew", last_name="Ng"),
            Author(first_name="Martin", last_name="Fowler"),
            Author(first_name="Kyle", last_name="Simpson"),
        ]
        db.add_all(authors)
        db.commit()

        # -------------------------
        # BOOKS
        # -------------------------
        print("Seeding books...")

        books = [
            Book(
                isbn_code="9780132350884",
                book_title="Clean Code",
                author_name="Robert Martin",
                category="Programming",
                publisher_name="Prentice Hall",
                location_name="Shelf A1",
                publication_year=2008,
                book_edition="1st",
                copies_total=5,
            ),
            Book(
                isbn_code="9780735211292",
                book_title="Atomic Habits",
                author_name="James Clear",
                category="Self-Help",
                publisher_name="Avery",
                location_name="Shelf B2",
                publication_year=2018,
                book_edition="1st",
                copies_total=10,
            ),
            Book(
                isbn_code="9780747532699",
                book_title="Harry Potter",
                author_name="J.K. Rowling",
                category="Fantasy",
                publisher_name="Bloomsbury",
                location_name="Shelf C1",
                publication_year=1997,
                book_edition="1st",
                copies_total=8,
            ),
            Book(
                isbn_code="9780553103540",
                book_title="A Game of Thrones",
                author_name="George R.R. Martin",
                category="Fantasy",
                publisher_name="Bantam Spectra",
                location_name="Shelf C2",
                publication_year=1996,
                book_edition="1st",
                copies_total=6,
            ),
            Book(
                isbn_code="9781119481867",
                book_title="Machine Learning",
                author_name="Andrew Ng",
                category="Technology",
                publisher_name="DeepLearning.AI",
                location_name="Shelf D1",
                publication_year=2018,
                book_edition="1st",
                copies_total=15,
            ),
            Book(
                isbn_code="9780134757599",
                book_title="Refactoring",
                author_name="Martin Fowler",
                category="Programming",
                publisher_name="Addison-Wesley",
                location_name="Shelf A2",
                publication_year=2018,
                book_edition="2nd",
                copies_total=4,
            ),
            Book(
                isbn_code="9781491904244",
                book_title="You Don't Know JS",
                author_name="Kyle Simpson",
                category="Programming",
                publisher_name="O'Reilly Media",
                location_name="Shelf A3",
                publication_year=2015,
                book_edition="1st",
                copies_total=12,
            ),
            Book(
                isbn_code="9780134494166",
                book_title="Clean Architecture",
                author_name="Robert Martin",
                category="Programming",
                publisher_name="Prentice Hall",
                location_name="Shelf A1",
                publication_year=2017,
                book_edition="1st",
                copies_total=7,
            ),
        ]
        db.add_all(books)
        db.commit()

        # -------------------------
        # BOOK-AUTHOR MAPPING
        # -------------------------
        book_authors = [
            BookAuthor(book_id=books[0].book_id, author_id=authors[0].author_id),
            BookAuthor(book_id=books[1].book_id, author_id=authors[1].author_id),
            BookAuthor(book_id=books[2].book_id, author_id=authors[2].author_id),
            BookAuthor(book_id=books[3].book_id, author_id=authors[3].author_id),
            BookAuthor(book_id=books[4].book_id, author_id=authors[4].author_id),
            BookAuthor(book_id=books[5].book_id, author_id=authors[5].author_id),
            BookAuthor(book_id=books[6].book_id, author_id=authors[6].author_id),
            BookAuthor(book_id=books[7].book_id, author_id=authors[0].author_id),
        ]
        db.add_all(book_authors)
        db.commit()

        # -------------------------
        # MEMBERS
        # -------------------------
        print("Seeding members...")

        members = [
            Member(
                first_name="Vishal",
                last_name="Khoje",
                city="Mumbai",
                mobile_no="9999999999",
                email_id="vishal@example.com",
                date_of_birth=date(1990, 1, 1),
                account_type="Premium",
                account_status="Active",
                membership_start_date=date.today() - timedelta(days=100),
                membership_end_date=date.today() + timedelta(days=265)
            ),
            Member(
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
            ),
            Member(
                first_name="Priya",
                last_name="Patel",
                city="Ahmedabad",
                mobile_no="7777777777",
                email_id="priya@example.com",
                date_of_birth=date(1992, 5, 20),
                account_type="Standard",
                account_status="Active",
                membership_start_date=date.today() - timedelta(days=50),
                membership_end_date=date.today() + timedelta(days=315)
            ),
            Member(
                first_name="Amit",
                last_name="Kumar",
                city="Delhi",
                mobile_no="6666666666",
                email_id="amit@example.com",
                date_of_birth=date(1988, 12, 10),
                account_type="Premium",
                account_status="Suspended",
                membership_start_date=date.today() - timedelta(days=200),
                membership_end_date=date.today() + timedelta(days=165)
            ),
            Member(
                first_name="Sneha",
                last_name="Reddy",
                city="Hyderabad",
                mobile_no="5555555555",
                email_id="sneha@example.com",
                date_of_birth=date(1994, 3, 5),
                account_type="Premium",
                account_status="Active",
                membership_start_date=date.today() - timedelta(days=10),
                membership_end_date=date.today() + timedelta(days=355)
            ),
        ]
        db.add_all(members)
        db.commit()

        # -------------------------
        # STAFF
        # -------------------------
        print("Seeding staff...")

        staff_list = [
            LibraryStaff(staff_name="Admin User", staff_designation="Librarian"),
            LibraryStaff(staff_name="Sarah Jenkins", staff_designation="Assistant Librarian"),
            LibraryStaff(staff_name="Mike Ross", staff_designation="Support Staff"),
        ]
        db.add_all(staff_list)
        db.commit()

        # -------------------------
        # ISSUE TRANSACTIONS
        # -------------------------
        print("Seeding issue transactions...")

        issues = [
            # Overdue issue
            BookIssue(
                book_id=books[0].book_id,
                member_id=members[0].member_id,
                issued_by_id=staff_list[0].issued_by_id,
                issue_date=datetime.utcnow() - timedelta(days=20),
                due_date=datetime.utcnow() - timedelta(days=6),
                issue_status="ISSUED",
            ),
            # Returned issue
            BookIssue(
                book_id=books[1].book_id,
                member_id=members[1].member_id,
                issued_by_id=staff_list[0].issued_by_id,
                issue_date=datetime.utcnow() - timedelta(days=15),
                due_date=datetime.utcnow() - timedelta(days=1),
                return_date=datetime.utcnow() - timedelta(days=2),
                issue_status="RETURNED",
            ),
            # Active on-time issue
            BookIssue(
                book_id=books[2].book_id,
                member_id=members[2].member_id,
                issued_by_id=staff_list[1].issued_by_id,
                issue_date=datetime.utcnow() - timedelta(days=2),
                due_date=datetime.utcnow() + timedelta(days=5),
                issue_status="ISSUED",
            ),
            # Another active issue
            BookIssue(
                book_id=books[5].book_id,
                member_id=members[4].member_id,
                issued_by_id=staff_list[1].issued_by_id,
                issue_date=datetime.utcnow() - timedelta(days=5),
                due_date=datetime.utcnow() + timedelta(days=2),
                issue_status="ISSUED",
            ),
        ]
        db.add_all(issues)
        db.commit()

        # -------------------------
        # FINES
        # -------------------------
        print("Seeding fines...")

        # Fine for the overdue book (Vishal)
        fine1 = FineDue(
            member_id=members[0].member_id,
            issue_id=issues[0].issue_id,
            amount=60, # 6 days overdue * 10 fine per day
            paid_status=False,
        )
        # Paid fine (Amit) - linked to a dummy past issue or just independent
        fine2 = FineDue(
            member_id=members[3].member_id,
            amount=50,
            paid_status=True,
        )
        db.add_all([fine1, fine2])
        db.commit()

        # Payment for Amit's fine
        payment1 = FinePayment(
            fine_id=fine2.fine_id,
            amount_paid=50,
            payment_date=datetime.utcnow() - timedelta(days=10)
        )
        db.add(payment1)
        db.commit()

        # -------------------------
        # BOOK REQUESTS
        # -------------------------
        print("Seeding requests...")

        requests = [
            BookRequest(
                book_id=books[3].book_id,
                member_id=members[3].member_id,
                request_date=datetime.utcnow() - timedelta(days=1),
                status="PENDING",
            ),
            BookRequest(
                book_id=books[7].book_id,
                member_id=members[1].member_id,
                request_date=datetime.utcnow() - timedelta(days=3),
                status="APPROVED",
            ),
            BookRequest(
                book_id=books[6].book_id,
                member_id=members[4].member_id,
                request_date=datetime.utcnow() - timedelta(days=5),
                status="REJECTED",
            ),
        ]
        db.add_all(requests)
        db.commit()

        print("✅ Seed data inserted successfully with comprehensive records!")

    except Exception as e:
        db.rollback()
        print("❌ Error while seeding:", str(e))
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()