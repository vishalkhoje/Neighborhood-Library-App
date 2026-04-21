def test_create_staff(client):
    response = client.post(
        "/api/staff/",
        json={
            "staff_name": "Jane Admin",
            "staff_designation": "Manager"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["staff_name"] == "Jane Admin"
    assert data["staff_designation"] == "Manager"
    assert "issued_by_id" in data

def test_read_staffs(client):
    client.post("/api/staff/", json={"staff_name": "Tim Worker", "staff_designation": "Librarian"})
    response = client.get("/api/staff/")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert any(s["staff_name"] == "Tim Worker" for s in response.json())

def test_update_staff(client):
    create_response = client.post("/api/staff/", json={"staff_name": "Sara Intern", "staff_designation": "Intern"})
    staff_id = create_response.json()["issued_by_id"]

    response = client.put(f"/api/staff/{staff_id}", json={"staff_designation": "Junior Librarian"})
    assert response.status_code == 200
    assert response.json()["staff_designation"] == "Junior Librarian"

def test_delete_staff(client):
    create_response = client.post("/api/staff/", json={"staff_name": "Mike Temp", "staff_designation": "Temp"})
    staff_id = create_response.json()["issued_by_id"]

    response = client.delete(f"/api/staff/{staff_id}")
    assert response.status_code == 204

    # Verify deleted
    get_response = client.get("/api/staff/")
    staffs = get_response.json()
    assert not any(s["issued_by_id"] == staff_id for s in staffs)
