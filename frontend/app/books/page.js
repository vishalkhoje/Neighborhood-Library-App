"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getBooks, createBook, updateBook, deleteBook } from "@/services/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, id: null });

    const emptyForm = {
        book_title: "", isbn_code: "", author_name: "", category: "", publisher_name: "",
        location_name: "", publication_year: "", book_edition: "", copies_total: "",
    };
    const [form, setForm] = useState(emptyForm);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await getBooks();
            setBooks(res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBooks(); }, []);

    const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = async () => {
        if (!form.book_title) return toast.error("Book title is required.");
        if (!form.author_name) return toast.error("Author name is required.");
        if (!form.isbn_code) return toast.error("ISBN code is required.");
        if (!form.copies_total || Number(form.copies_total) < 1) return toast.error("Copies must be at least 1.");
        try {
            editingId ? await updateBook(editingId, form) : await createBook(form);
            toast.success(editingId ? "Book updated successfully!" : "Book created successfully!");
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(false);
            fetchBooks();
        } catch (e) {
            const detail = e.response?.data?.detail;
            const message = Array.isArray(detail) 
                ? detail.map(d => `${d.loc.join(".")}: ${d.msg}`).join(", ") 
                : detail || "Error saving book.";
            toast.error(message);
        }
    };

    const handleEdit = (b) => {
        setForm(b);
        setEditingId(b.book_id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const confirmDelete = (id) => {
        setDeleteConfig({ isOpen: true, id });
    };

    const executeDelete = async () => {
        const id = deleteConfig.id;
        if (!id) return;
        try { 
            await deleteBook(id); 
            fetchBooks(); 
            toast.success("Book deleted successfully!");
        }
        catch (e) { toast.error(e.response?.data?.detail || "Error deleting book."); }
    };

    const filtered = books.filter(b =>
        b.book_title?.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn_code?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Book Catalog</h1>
                    <p>Manage all books available in your library.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
                >
                    {showForm ? "✕ Close Form" : "+ Add New Book"}
                </button>
            </div>

            {/* ADD / EDIT FORM */}
            {showForm && (
                <div className="card" style={{ marginBottom: "1.5rem", borderTop: "3px solid #2563eb" }}>
                    <div className="card-header">
                        <h2>{editingId ? "Edit Book" : "Add New Book"}</h2>
                    </div>
                    <div className="card-body">
                        <div className="form-grid">
                            <div className="form-group span-2">
                                <label>Book Title *</label>
                                <input placeholder="Enter full book title" value={form.book_title}
                                    onChange={e => f("book_title", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Author Name *</label>
                                <input placeholder="e.g. Robert Martin" value={form.author_name}
                                    onChange={e => f("author_name", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>ISBN Code *</label>
                                <input placeholder="e.g. 978-3-16-148410-0" value={form.isbn_code}
                                    onChange={e => f("isbn_code", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input placeholder="e.g. Science, Fiction" value={form.category}
                                    onChange={e => f("category", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Publisher Name</label>
                                <input placeholder="e.g. Penguin Books" value={form.publisher_name}
                                    onChange={e => f("publisher_name", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Edition</label>
                                <input placeholder="e.g. 3rd Edition" value={form.book_edition}
                                    onChange={e => f("book_edition", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Publication Year</label>
                                <input type="number" placeholder="e.g. 2022" value={form.publication_year}
                                    onChange={e => f("publication_year", Number(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label>Shelf Location</label>
                                <input placeholder="e.g. Rack A-12" value={form.location_name}
                                    onChange={e => f("location_name", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Total Copies *</label>
                                <input type="number" min="1" placeholder="e.g. 5" value={form.copies_total}
                                    onChange={e => f("copies_total", Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={handleSubmit}>
                                {editingId ? "Save Changes" : "Add Book"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SEARCH */}
            <div className="search-bar">
                <input
                    placeholder="Search by title or ISBN..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* TABLE */}
            <div className="card">
                <div className="card-header">
                    <h2>All Books</h2>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{filtered.length} records</span>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>ISBN</th>
                                <th className="hide-mobile">Category</th>
                                <th className="hide-mobile">Publisher</th>
                                <th className="hide-mobile">Location</th>
                                <th>Copies</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="table-empty">Loading...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="7" className="table-empty">No books found.</td></tr>
                            ) : filtered.map(b => (
                                <tr key={b.book_id}>
                                    <td>
                                        <div className="td-primary">{b.book_title}</div>
                                        <div className="td-sub">{b.book_edition}</div>
                                    </td>
                                    <td>{b.author_name}</td>
                                    <td>{b.isbn_code}</td>
                                    <td className="hide-mobile">
                                        {b.category && (
                                            <span className="badge badge-blue">{b.category}</span>
                                        )}
                                    </td>
                                    <td className="hide-mobile">{b.publisher_name}</td>
                                    <td className="hide-mobile">{b.location_name}</td>
                                    <td>
                                        <strong>{b.copies_total}</strong>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <div className="actions" style={{ justifyContent: "flex-end" }}>
                                            <button className="btn-secondary btn-sm" onClick={() => handleEdit(b)}>Edit</button>
                                            <button className="btn-danger btn-sm" onClick={() => confirmDelete(b.book_id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <ConfirmModal 
                isOpen={deleteConfig.isOpen}
                onClose={() => setDeleteConfig({ isOpen: false, id: null })}
                onConfirm={executeDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this book? This action cannot be undone."
            />
        </Layout>
    );
}