"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getBooks, getMembers, getIssues, getPendingFines } from "@/services/api";
import Link from "next/link";

export default function Home() {
  const [stats, setStats] = useState({ books: 0, members: 0, issues: 0, fines: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [books, members, issues, fines] = await Promise.all([
          getBooks(), getMembers(), getIssues(), getPendingFines()
        ]);
        setStats({
          books: books.data?.length || 0,
          members: members.data?.length || 0,
          issues: issues.data?.filter(i => !i.return_date).length || 0,
          fines: fines.data?.length || 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const val = (n) => loading ? "—" : n;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome! Here is a live overview of your library system.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📖</div>
          <div className="stat-info">
            <span className="stat-label">Total Books</span>
            <span className="stat-value">{val(stats.books)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon indigo">👥</div>
          <div className="stat-info">
            <span className="stat-label">Active Members</span>
            <span className="stat-value">{val(stats.members)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">📅</div>
          <div className="stat-info">
            <span className="stat-label">Books Out</span>
            <span className="stat-value">{val(stats.issues)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">₹</div>
          <div className="stat-info">
            <span className="stat-label">Pending Fines</span>
            <span className="stat-value" style={{ color: stats.fines > 0 ? "#dc2626" : "#111827" }}>
              {val(stats.fines)}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="quick-actions">
            <Link href="/issue" className="btn-primary" style={{ textDecoration: "none", display: "flex", justifyContent: "center", padding: "0.65rem 1rem" }}>
              + Issue a Book
            </Link>
            <Link href="/books" className="btn-secondary" style={{ textDecoration: "none", display: "flex", justifyContent: "center", padding: "0.65rem 1rem" }}>
              Manage Books
            </Link>
            <Link href="/members" className="btn-secondary" style={{ textDecoration: "none", display: "flex", justifyContent: "center", padding: "0.65rem 1rem" }}>
              Register Member
            </Link>
            <Link href="/fine" className="btn-danger" style={{ textDecoration: "none", display: "flex", justifyContent: "center", padding: "0.65rem 1rem" }}>
              Collect Fine
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
