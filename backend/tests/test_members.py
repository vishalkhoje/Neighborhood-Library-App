def test_create_member(client):
    response = client.post(
        "/api/members/",
        json={
            "first_name": "Alice",
            "last_name": "Smith",
            "city": "London",
            "mobile_no": "1234567890",
            "email_id": "alice@example.com",
            "date_of_birth": "1990-01-01",
            "account_status": "Active",
            "account_type": "Premium"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "Alice"
    assert data["email_id"] == "alice@example.com"
    assert "member_id" in data

def test_read_members(client):
    client.post("/api/members/", json={"first_name": "Bob", "last_name": "Jones", "city": "NY", "mobile_no": "0987654321", "email_id": "bob@example.com", "date_of_birth": "1990-01-01", "account_status": "Active", "account_type": "Standard"})
    response = client.get("/api/members/")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert any(m["email_id"] == "bob@example.com" for m in response.json())

def test_update_member(client):
    create_response = client.post("/api/members/", json={"first_name": "Charlie", "last_name": "Brown", "city": "SF", "mobile_no": "1112223334", "email_id": "charlie@example.com", "date_of_birth": "1990-01-01", "account_status": "Active", "account_type": "Standard"})
    member_id = create_response.json()["member_id"]

    response = client.put(f"/api/members/{member_id}", json={"first_name": "Charlie", "last_name": "Brown", "city": "LA", "mobile_no": "1112223334", "email_id": "charlie@example.com", "date_of_birth": "1990-01-01", "account_status": "Inactive", "account_type": "Standard"})
    assert response.status_code == 200
    assert response.json()["city"] == "LA"
    assert response.json()["account_status"] == "Inactive"

def test_delete_member(client):
    create_response = client.post("/api/members/", json={"first_name": "Dave", "last_name": "White", "city": "Chicago", "mobile_no": "4445556667", "email_id": "dave@example.com", "date_of_birth": "1990-01-01", "account_status": "Active", "account_type": "Standard"})
    member_id = create_response.json()["member_id"]

    response = client.delete(f"/api/members/{member_id}")
    assert response.status_code == 204

    # Verify deleted
    get_response = client.get("/api/members/")
    members = get_response.json()
    assert not any(m["member_id"] == member_id for m in members)
