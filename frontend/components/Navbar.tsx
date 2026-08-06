"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  return (
    <nav className="flex gap-6 p-4 border-b mb-6">

      <Link href="/dashboard">
        Dashboard
      </Link>

      {role === "ADMIN" && (
        <Link href="/users">
          Users
        </Link>
      )}

      {(role === "ADMIN" || role === "STOCK_MANAGER") && (
        <Link href="/stock-movements">
          Stock
        </Link>
      )}

      {(role === "ADMIN" || role === "STOCK_MANAGER") && (
        <Link href="/inventory-counts">
          Inventory Counts
        </Link>
      )}

    </nav>
  );
}