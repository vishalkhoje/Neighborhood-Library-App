"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getStaff, createStaff, updateStaff, deleteStaff } from "@/services/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function Staff() {
    const emptyForm = {
        staff_name: "",
        staff_designation: "",
    };

    const [staffList, setStaffList] = useState([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, id: null });

    const loadStaff = async () => {
        setLoading(true);
        try {
            const res = await getStaff();
            setStaffList(res.data || res || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadStaff(); }, []);

    const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = async () => {
        if (!form.staff_name) return toast.error("Staff name is required.");
        if (!form.staff_designation) return toast.error("Staff designation is required.");
        
        try {
            editingId ? await updateStaff(editingId, form) : await createStaff(form);
            toast.success(editingId ? "Staff member updated successfully!" : "Staff member added successfully!");
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(false);
            loadStaff();
        } catch (e) {
            const detail = e.response?.data?.detail;
            const errMsg = Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : (detail || "Error saving staff member.");
            toast.error(errMsg);
        }
    };

    const handleEdit = (s) => {
        setForm({
            staff_name: s.staff_name || "",
            staff_designation: s.staff_designation || "",
        });
        setEditingId(s.issued_by_id);
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
            await deleteStaff(id);
            loadStaff();
            toast.success("Staff member deleted successfully!");
        }
        catch (e) { toast.error(e.response?.data?.detail || "Error deleting staff member."); }
    };

    const filtered = staffList.filter(s =>
        s.staff_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.staff_designation?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Library Staff</h1>
                    <p>Manage library personnel and their roles.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
                >
                    {showForm ? "✕ Close Form" : "+ Add New Staff"}
                </button>
            </div>

            {/* FORM */}
            {showForm && (
                <div className="card" style={{ marginBottom: "1.5rem", borderTop: "3px solid #2563eb" }}>
                    <div className="card-header">
                        <h2>{editingId ? "Edit Staff Member" : "Add New Staff Member"}</h2>
                    </div>
                    <div className="card-body">
                        <div className="form-grid">
                            <div className="form-group span-2">
                                <label>Full Name *</label>
                                <input placeholder="e.g. Jane Doe" value={form.staff_name}
                                    onChange={e => f("staff_name", e.target.value)} />
                            </div>
                            <div className="form-group span-2">
                                <label>Designation *</label>
                                <input placeholder="e.g. Senior Librarian" value={form.staff_designation}
                                    onChange={e => f("staff_designation", e.target.value)} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={handleSubmit}>
                                {editingId ? "Save Changes" : "Add Staff"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SEARCH */}
            <div className="search-bar">
                <input
                    placeholder="Search by name or designation..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* TABLE */}
            <div className="card">
                <div className="card-header">
                    <h2>All Staff</h2>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{filtered.length} records</span>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Staff Name</th>
                                <th>Designation</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" className="table-empty">Loading...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="3" className="table-empty">No staff found.</td></tr>
                            ) : filtered.map(s => (
                                <tr key={s.issued_by_id}>
                                    <td>
                                        <div className="td-primary">{s.staff_name}</div>
                                        <div className="td-sub">ID #{s.issued_by_id}</div>
                                    </td>
                                    <td>{s.staff_designation}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <div className="actions" style={{ justifyContent: "flex-end" }}>
                                            <button className="btn-secondary btn-sm" onClick={() => handleEdit(s)}>Edit</button>
                                            <button className="btn-danger btn-sm" onClick={() => confirmDelete(s.issued_by_id)}>Delete</button>
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
                message="Are you sure you want to delete this staff member? This action cannot be undone."
            />
        </Layout>
    );
}
