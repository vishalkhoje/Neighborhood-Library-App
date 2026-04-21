import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
});

export const getBooks = () => api.get("/books");
export const createBook = (data) => api.post("/books", data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

export const getMembers = () => api.get("/members");
export const createMember = (data) => api.post("/members", data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data);
export const deleteMember = (id) => api.delete(`/members/${id}`);

export const getMemberStatusesbyId = (id) => api.get(`/members/memberstatus/${id}`);
export const getMemberStatuses = () => api.get(`/members/memberstatus/`);

export const issueBook = (data) => api.post("/issue", data);
export const getIssues = () => api.get("/issue");

export const deleteIssue = (id) =>
    api.delete(`/issue/${id}`);

export const updateIssue = (id, data) =>
    api.put(`/issue/${id}`, data);


export const returnBook = (issue_id) =>
    api.post("/issue/return", null, {
        params: { issue_id }
    });

export const getPendingFines = () =>
    api.get("/fine/pending");

export const payFine = (fine_id, amount) =>
    api.post("/fine/pay", null, {
        params: { fine_id, amount }
    });

export const getStaff = () => api.get("/staff");
export const createStaff = (data) => api.post("/staff", data);
export const updateStaff = (id, data) => api.put(`/staff/${id}`, data);
export const deleteStaff = (id) => api.delete(`/staff/${id}`);
