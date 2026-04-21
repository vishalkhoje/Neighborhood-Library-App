def test_create_book(client):
    response = client.post(
        "/api/books/",
        json={
            "isbn_code": "ISBN001",
            "book_title": "The Hobbit",
            "author_name": "J.R.R. Tolkien",
            "category": "Fantasy",
            "publisher_name": "Allen & Unwin",
            "location_name": "A1",
            "publication_year": 1937,
            "book_edition": "1st",
            "copies_total": 5
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["book_title"] == "The Hobbit"
    assert data["copies_total"] == 5
    assert "book_id" in data

def test_read_books(client):
    client.post("/api/books/", json={"isbn_code": "ISBN002", "book_title": "1984", "author_name": "George Orwell", "publisher_name": "Secker & Warburg", "location_name": "B1", "publication_year": 1949, "book_edition": "1st", "copies_total": 3})
    response = client.get("/api/books/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert any(book["book_title"] == "1984" for book in data)

def test_update_book(client):
    create_response = client.post("/api/books/", json={"isbn_code": "ISBN003", "book_title": "Dune", "author_name": "Frank Herbert", "publisher_name": "Chilton", "location_name": "C1", "publication_year": 1965, "book_edition": "1st", "copies_total": 2})
    book_id = create_response.json()["book_id"]

    response = client.put(f"/api/books/{book_id}", json={"isbn_code": "ISBN003", "book_title": "Dune Messiah", "author_name": "Frank Herbert", "publisher_name": "Chilton", "location_name": "C1", "publication_year": 1965, "book_edition": "1st", "copies_total": 4, "category": "Sci-Fi"})
    assert response.status_code == 200
    assert response.json()["book_title"] == "Dune Messiah"

def test_delete_book(client):
    create_response = client.post("/api/books/", json={"isbn_code": "ISBN004", "book_title": "Foundation", "author_name": "Isaac Asimov", "publisher_name": "Gnome Press", "location_name": "D1", "publication_year": 1951, "book_edition": "1st", "copies_total": 1})
    book_id = create_response.json()["book_id"]

    response = client.delete(f"/api/books/{book_id}")
    assert response.status_code == 204

    # Verify it's deleted
    get_response = client.get("/api/books/")
    books = get_response.json()
    assert not any(book["book_id"] == book_id for book in books)
