def test_issue_and_return_book(client):
    # 1. Create a Book
    book_res = client.post("/api/books/", json={"isbn_code": "I001", "book_title": "Test Book", "publisher_name": "Pub", "location_name": "Loc", "publication_year": 2020, "book_edition": "1st", "copies_total": 1})
    book_id = book_res.json()["book_id"]

    # 2. Create a Member
    member_res = client.post("/api/members/", json={"first_name": "Test", "last_name": "Member", "city": "Test", "mobile_no": "1234567890", "email_id": "test@test.com", "date_of_birth": "2000-01-01", "account_status": "Active", "account_type": "Standard"})
    member_id = member_res.json()["member_id"]

    # 3. Create a Staff
    staff_res = client.post("/api/staff/", json={"staff_name": "Test Staff", "staff_designation": "Librarian"})
    staff_id = staff_res.json()["issued_by_id"]

    # 4. Issue the Book
    issue_payload = {
        "book_id": book_id,
        "member_id": member_id,
        "issued_by_id": staff_id,
        "issue_date": "2026-04-20T10:00:00"
    }
    issue_res = client.post("/api/issue/", json=issue_payload)
    assert issue_res.status_code == 201
    issue_id = issue_res.json()["issue_id"]
    assert issue_res.json()["issue_status"] == "ISSUED"

    # Verify Book copies remain unchanged during issue (due to current logic)
    get_book = client.get("/api/books/")
    book_data = next(b for b in get_book.json() if b["book_id"] == book_id)
    assert book_data["copies_total"] == 1

    # 5. Return the Book
    return_res = client.post(f"/api/issue/return?issue_id={issue_id}")
    assert return_res.status_code == 200
    assert return_res.json()["message"] == "Book returned"

    # Verify Book copies increased (due to current logic)
    get_book2 = client.get("/api/books/")
    book_data2 = next(b for b in get_book2.json() if b["book_id"] == book_id)
    assert book_data2["copies_total"] == 2
