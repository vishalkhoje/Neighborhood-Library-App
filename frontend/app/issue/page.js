"use client";

import { useEffect, useState, useRef } from "react";
import Layout from "@/components/Layout";
import { issueBook, getIssues, deleteIssue, updateIssue, returnBook, getBooks, getMembers } from "@/services/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function Issue() {
    const today = new Date().toISOString().split("T")[0];
    const twoWeeks = new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split("T")[0];

    const emptyForm = { book_id: "", member_id: "", issued_by_id: 1, issue_date: today, due_date: twoWeeks };

    const SearchableSelect = ({ label, placeholder, options, value, onSelect, displayValue, onSearchChange, showDropdown, setShowDropdown, filterFn }) => {
        const containerRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (containerRef.current && !containerRef.current.contains(event.target)) {
                    setShowDropdown(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [setShowDropdown]);

        return (
            <div className="form-group dropdown-container" ref={containerRef}>
                <label className="form-label">{label}</label>
                <div className="search-input-wrapper">
                    <input 
                        className="input-field"
                        placeholder={placeholder} 
                        value={displayValue}
                        onChange={e => {
                            onSearchChange(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                    />
                    {displayValue && (
                        <span className="search-clear-btn" onClick={() => {
                            onSelect("");
                            onSearchChange("");
                        }}>✕</span>
                    )}
                </div>
                {showDropdown && (
                    <div className="dropdown-menu">
                        {options.filter(opt => filterFn(opt, displayValue)).length > 0 ? (
                            options.filter(opt => filterFn(opt, displayValue)).map(opt => (
                                <div 
                                    key={opt.id} 
                                    className="dropdown-item"
                                    onClick={() => {
                                        onSelect(opt.id);
                                        onSearchChange(opt.label);
                                        setShowDropdown(false);
                                    }}
                                >
                                    <span className="dropdown-item-title">{opt.label}</span>
                                    <span className="dropdown-item-id">ID: {opt.id}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-gray-400 text-center text-xs">No results found</div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const [issues, setIssues] = useState([]);
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [bookSearch, setBookSearch] = useState("");
    const [memberSearch, setMemberSearch] = useState("");
    const [showBookDropdown, setShowBookDropdown] = useState(false);
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, id: null });
    const [returnConfig, setReturnConfig] = useState({ isOpen: false, id: null });

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const res = await getIssues();
            setIssues(res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchData = async () => {
        try {
            const [bRes, mRes] = await Promise.all([getBooks(), getMembers()]);
            setBooks(bRes.data || []);
            setMembers(mRes.data || []);
        } catch (e) { console.error("Error fetching data:", e); }
    };

    useEffect(() => { 
        fetchIssues();
        fetchData();
    }, []);

    const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = async () => {
        if (!form.book_id) return toast.error("Book ID is required.");
        if (!form.member_id) return toast.error("Member ID is required.");
        if (!form.issue_date || !form.due_date) return toast.error("Both dates are required.");
        if (new Date(form.due_date) < new Date(form.issue_date)) return toast.error("Due date must be after issue date.");

        const payload = { ...form, issue_date: new Date(form.issue_date), due_date: new Date(form.due_date) };
        try {
            editId ? await updateIssue(editId, payload) : await issueBook(payload);
            toast.success(editId ? "Issue updated!" : "Book issued successfully!");
            setForm(emptyForm);
            setBookSearch("");
            setMemberSearch("");
            setEditId(null);
            setShowForm(false);
            fetchIssues();
        } catch (e) {
            const detail = e.response?.data?.detail;
            const message = Array.isArray(detail)
                ? detail.map(d => `${d.loc.join(".")}: ${d.msg}`).join(", ")
                : detail || "Error processing issue.";
            toast.error(message);
        }
    };

    const handleEdit = (issue) => {
        const book = books.find(b => b.book_id === issue.book_id);
        const member = members.find(m => m.member_id === issue.member_id);
        
        setForm({
            book_id: issue.book_id,
            member_id: issue.member_id,
            issued_by_id: issue.issued_by_id || 1,
            issue_date: issue.issue_date?.slice(0, 10),
            due_date: issue.due_date?.slice(0, 10),
        });
        setBookSearch(book ? book.book_title : "");
        setMemberSearch(member ? `${member.first_name} ${member.last_name}` : "");
        setEditId(issue.issue_id);
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
            await deleteIssue(id);
            fetchIssues();
            toast.success("Issue record deleted successfully!");
        }
        catch (e) { toast.error(e.response?.data?.detail || "Error deleting."); }
    };

    const confirmReturn = (id) => {
        setReturnConfig({ isOpen: true, id });
    };

    const executeReturn = async () => {
        const id = returnConfig.id;
        if (!id) return;
        try {
            const res = await returnBook(id);
            const { late_days, fine } = res.data;
            toast.success(
                late_days > 0
                    ? `Book returned!\n⚠️ ${late_days} days late — fine of ₹${fine} has been applied.`
                    : "Book returned on time. No fine applied."
            );
            fetchIssues();
        } catch (e) {
            toast.error(e.response?.data?.detail || "Could not process return.");
        }
    };

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Borrowing Books</h1>
                    <p>Issue books to members and track active fines. (Fine per day ₹10)</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
                >
                    {showForm ? "✕ Close Form" : "+ Issue a Book"}
                </button>
            </div>

            {/* FORM */}
            {showForm && (
                <div className="card" style={{ marginBottom: "1.5rem", borderTop: "3px solid #2563eb" }}>
                    <div className="card-header">
                        <h2>{editId ? "Edit Issue Record" : "New Book Issue"}</h2>
                    </div>
                    <div className="card-body">
                        <div className="form-grid">
                            <SearchableSelect 
                                label="Book *"
                                placeholder="Search by ID or Title..."
                                options={books.map(b => ({ id: b.book_id, label: b.book_title }))}
                                value={form.book_id}
                                displayValue={bookSearch}
                                onSelect={id => f("book_id", id)}
                                onSearchChange={setBookSearch}
                                showDropdown={showBookDropdown}
                                setShowDropdown={setShowBookDropdown}
                                filterFn={(opt, search) => 
                                    opt.id.toString().includes(search) || 
                                    opt.label.toLowerCase().includes(search.toLowerCase()) ||
                                    search === opt.label // Ensure it still shows if fully selected
                                }
                            />
                            <SearchableSelect 
                                label="Member *"
                                placeholder="Search by ID or Name..."
                                options={members.map(m => ({ id: m.member_id, label: `${m.first_name} ${m.last_name}` }))}
                                value={form.member_id}
                                displayValue={memberSearch}
                                onSelect={id => f("member_id", id)}
                                onSearchChange={setMemberSearch}
                                showDropdown={showMemberDropdown}
                                setShowDropdown={setShowMemberDropdown}
                                filterFn={(opt, search) => 
                                    opt.id.toString().includes(search) || 
                                    opt.label.toLowerCase().includes(search.toLowerCase()) ||
                                    search === opt.label
                                }
                            />
                            <div className="form-group">
                                <label className="form-label">Issue Date *</label>
                                <input type="date" className="input-field" value={form.issue_date}
                                    onChange={e => f("issue_date", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Due Date *</label>
                                <input type="date" className="input-field" value={form.due_date}
                                    onChange={e => f("due_date", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Librarian ID</label>
                                <input type="number" className="input-field" value={form.issued_by_id}
                                    onChange={e => f("issued_by_id", Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditId(null); }}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={handleSubmit}>
                                {editId ? "Save Changes" : "Confirm Issue"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TABLE */}
            <div className="card">
                <div className="card-header">
                    <h2>Active Loans</h2>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{issues.length} records</span>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Borrower</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th className="hide-mobile">Status</th>
                                <th className="hide-mobile">Fine</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="table-empty">Loading...</td></tr>
                            ) : issues.length === 0 ? (
                                <tr><td colSpan="7" className="table-empty">No loan records found.</td></tr>
                            ) : issues.map(i => {
                                const isOverdue = !i.return_date && new Date(i.due_date) < new Date();
                                const isReturned = i.issue_status === "RETURNED" || !!i.return_date;
                                return (
                                    <tr key={i.issue_id}>
                                        <td>
                                            <div className="td-primary">{i.book_name || `Book #${i.book_id}`}</div>
                                            <div className="td-sub">ID #{i.book_id}</div>
                                        </td>
                                        <td>
                                            <div className="td-primary">{i.member_name || `Member #${i.member_id}`}</div>
                                            <div className="td-sub">ID #{i.member_id}</div>
                                        </td>
                                        <td>{new Date(i.issue_date).toLocaleDateString("en-IN")}</td>
                                        <td style={{ color: isOverdue ? "#dc2626" : "inherit", fontWeight: isOverdue ? "600" : "normal" }}>
                                            {new Date(i.due_date).toLocaleDateString("en-IN")}
                                            {isOverdue && <div className="td-sub" style={{ color: "#dc2626" }}>Overdue ⚠️</div>}
                                        </td>
                                        <td className="hide-mobile">
                                            <span className={`badge ${isReturned ? "badge-green" : isOverdue ? "badge-red" : "badge-blue"}`}>
                                                {isReturned ? "Returned" : isOverdue ? "Overdue" : "Active"}
                                            </span>
                                        </td>
                                        <td className="hide-mobile">
                                            {i.fine > 0 ? (
                                                <span style={{ color: "#dc2626", fontWeight: "600" }}>₹{i.fine}</span>
                                            ) : "—"}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <div className="actions" style={{ justifyContent: "flex-end" }}>
                                                {!isReturned && (
                                                    <button className="btn-success btn-sm" onClick={() => confirmReturn(i.issue_id)}>Return</button>
                                                )}
                                                <button className="btn-secondary btn-sm" onClick={() => handleEdit(i)}>Edit</button>
                                                <button className="btn-danger btn-sm" onClick={() => confirmDelete(i.issue_id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteConfig.isOpen}
                onClose={() => setDeleteConfig({ isOpen: false, id: null })}
                onConfirm={executeDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this issue record? This action cannot be undone."
            />

            <ConfirmModal
                isOpen={returnConfig.isOpen}
                onClose={() => setReturnConfig({ isOpen: false, id: null })}
                onConfirm={executeReturn}
                title="Confirm Return"
                message="Are you sure you want to mark this book as returned?"
            />
        </Layout>
    );
}