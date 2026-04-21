"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Books", href: "/books" },
    { name: "Members", href: "/members" },
    { name: "Issue", href: "/issue" },
    { name: "Fines", href: "/fine" },
    { name: "Staff", href: "/staff" },
  ];

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand">
            <span>📚</span> Neighborhood Library Service
          </Link>

          <ul className="navbar-links">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={pathname === l.href ? "active" : ""}>
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>

          <button
            className="hamburger-btn"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${open ? "open" : ""}`}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={pathname === l.href ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {l.name}
          </Link>
        ))}
      </div>
    </header>
  );
}