"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getMembers, createMember, updateMember, deleteMember } from "@/services/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function Members() {
    const today = new Date().toISOString().split("T")[0];
    const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0];

    const emptyForm = {
        first_name: "", last_name: "", city: "", mobile_no: "",
        email_id: "", date_of_birth: "",
        account_type: "Standard",
        account_status: "Active",
        membership_start_date: today,
        membership_end_date: nextYear,
    };

    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, id: null });

    const loadMembers = async () => {
        setLoading(true);
        try {
            const res = await getMembers();
            setMembers(res.data || res || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadMembers(); }, []);

    const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = async () => {
        if (!form.first_name || !form.last_name) return toast.error("First and last name are required.");
        if (!form.email_id.includes("@")) return toast.error("Please enter a valid email address.");
        if (String(form.mobile_no).length < 10) return toast.error("Mobile number must be at least 10 digits.");
        try {
            editingId ? await updateMember(editingId, form) : await createMember(form);
            toast.success(editingId ? "Member updated successfully!" : "Member registered successfully!");
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(false);
            loadMembers();
        } catch (e) {
            const detail = e.response?.data?.detail;
            const errMsg = Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : (detail || "Error saving member.");
            toast.error(errMsg);
        }
    };

    const handleEdit = (m) => {
        setForm({
            ...m,
            date_of_birth: m.date_of_birth?.split("T")[0] || "",
            membership_start_date: m.membership_start_date?.split("T")[0] || "",
            membership_end_date: m.membership_end_date?.split("T")[0] || "",
        });
        setEditingId(m.member_id);
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
            await deleteMember(id);
            loadMembers();
            toast.success("Member deleted successfully!");
        }
        catch (e) { toast.error(e.response?.data?.detail || "Error deleting member."); }
    };

    const filtered = members.filter(m =>
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        m.email_id?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Member Directory</h1>
                    <p>Manage all library patron accounts and memberships.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
                >
                    {showForm ? "✕ Close Form" : "+ Add New Member"}
                </button>
            </div>

            {/* FORM */}
            {showForm && (
                <div className="card" style={{ marginBottom: "1.5rem", borderTop: "3px solid #2563eb" }}>
                    <div className="card-header">
                        <h2>{editingId ? "Edit Member" : "Register New Member"}</h2>
                    </div>
                    <div className="card-body">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name *</label>
                                <input placeholder="John" value={form.first_name}
                                    onChange={e => f("first_name", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input placeholder="Doe" value={form.last_name}
                                    onChange={e => f("last_name", e.target.value)} />
                            </div>
                            <div className="form-group span-2">
                                <label>Email Address *</label>
                                <input type="email" placeholder="john@example.com" value={form.email_id}
                                    onChange={e => f("email_id", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number *</label>
                                <input placeholder="10-digit number" value={form.mobile_no}
                                    onChange={e => f("mobile_no", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input placeholder="e.g. Mumbai" value={form.city}
                                    onChange={e => f("city", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input type="date" value={form.date_of_birth}
                                    onChange={e => f("date_of_birth", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Account Status</label>
                                <select value={form.account_status}
                                    onChange={e => f("account_status", e.target.value)}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Membership Start</label>
                                <input type="date" value={form.membership_start_date}
                                    onChange={e => f("membership_start_date", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Membership Expiry</label>
                                <input type="date" value={form.membership_end_date}
                                    onChange={e => f("membership_end_date", e.target.value)} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={handleSubmit}>
                                {editingId ? "Save Changes" : "Register Member"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SEARCH */}
            <div className="search-bar">
                <input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* TABLE */}
            <div className="card">
                <div className="card-header">
                    <h2>All Members</h2>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{filtered.length} records</span>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th className="hide-mobile">Email</th>
                                <th className="hide-mobile">Mobile</th>
                                <th className="hide-mobile">City</th>
                                <th>Expiry</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="table-empty">Loading...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="7" className="table-empty">No members found.</td></tr>
                            ) : filtered.map(m => (
                                <tr key={m.member_id}>
                                    <td>
                                        <div className="td-primary">{m.first_name} {m.last_name}</div>
                                        <div className="td-sub">ID #{m.member_id}</div>
                                    </td>
                                    <td className="hide-mobile">{m.email_id}</td>
                                    <td className="hide-mobile">{m.mobile_no}</td>
                                    <td className="hide-mobile">{m.city}</td>
                                    <td>
                                        <div>{m.membership_end_date ? new Date(m.membership_end_date).toLocaleDateString("en-IN") : "—"}</div>
                                    </td>
                                    <td>
                                        <span className={`badge ${m.account_status === "Active" ? "badge-green" : "badge-gray"}`}>
                                            {m.account_status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <div className="actions" style={{ justifyContent: "flex-end" }}>
                                            <button className="btn-secondary btn-sm" onClick={() => handleEdit(m)}>Edit</button>
                                            <button className="btn-danger btn-sm" onClick={() => confirmDelete(m.member_id)}>Delete</button>
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
                message="Are you sure you want to delete this member? This action cannot be undone."
            />
        </Layout>
    );
}
