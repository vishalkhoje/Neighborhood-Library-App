"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getPendingFines, payFine } from "@/services/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function FinePage() {
    const [fines, setFines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payConfig, setPayConfig] = useState({ isOpen: false, fine: null });

    const fetchFines = async () => {
        setLoading(true);
        try {
            const res = await getPendingFines();
            setFines(res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchFines(); }, []);

    const confirmPay = (fine) => {
        setPayConfig({ isOpen: true, fine });
    };

    const executePay = async () => {
        const fine = payConfig.fine;
        if (!fine) return;
        try {
            await payFine(fine.fine_id, fine.amount);
            toast.success("Fine marked as paid!");
            fetchFines();
        } catch (e) {
            toast.error("Error: " + (e.response?.data?.detail || e.message));
        }
    };

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Fine Register</h1>
                    <p>Collect and resolve outstanding late return penalties.</p>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>All Fines</h2>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{fines.length} total records</span>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Issue Reference</th>
                                <th>Amount</th>
                                <th className="hide-mobile">Created On</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="table-empty">Checking ledger...</td></tr>
                            ) : fines.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">✅</div>
                                            <h3>All Clear!</h3>
                                            <p>There are no outstanding fines at this time.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : fines.map(fine => (
                                <tr key={fine.fine_id}>
                                    <td>
                                        <div className="td-primary">{fine.member_name}</div>
                                        <div className="td-sub">#{fine.member_id} • {fine.member_contact_number}</div>
                                    </td>
                                    <td>
                                        <div className="td-primary">{fine.book_name}</div>
                                        <div className="td-sub">Issue #{fine.issue_id}</div>
                                    </td>
                                    <td>
                                        <span style={{ color: "#dc2626", fontWeight: "700", fontSize: "1.1rem" }}>
                                            ₹{fine.amount}
                                        </span>
                                    </td>
                                    <td className="hide-mobile">
                                        {fine.created_at ? new Date(fine.created_at).toLocaleDateString("en-IN") : "—"}
                                    </td>
                                    <td>
                                        {fine.paid_status ? (
                                            <span style={{ color: "#16a34a", fontWeight: "600" }}>Paid</span>
                                        ) : (
                                            <span style={{ color: "#dc2626", fontWeight: "600" }}>Not Paid</span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        {fine.paid_status ? (
                                            <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Settled</span>
                                        ) : (
                                            <button className="btn-primary btn-sm" onClick={() => confirmPay(fine)}>
                                                Mark as Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal 
                isOpen={payConfig.isOpen}
                onClose={() => setPayConfig({ isOpen: false, fine: null })}
                onConfirm={executePay}
                title="Confirm Payment"
                message={payConfig.fine ? `Are you sure you want to mark the ₹${payConfig.fine.amount} fine for Issue #${payConfig.fine.issue_id} as paid?` : ""}
            />
        </Layout>
    );
}