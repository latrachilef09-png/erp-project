"use client";

import { useEffect, useState } from "react";
import { getInventoryCounts } from "@/lib/api";
import Link from "next/link";

interface InventoryCount {
  id: number;
  status: string;
  warehouse?: {
    id: number;
    name: string;
  };
}

export default function InventoryCountsPage() {
  const [counts, setCounts] = useState<InventoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadCounts() {
      try {
        setLoading(true);
        setError(false);

        const data = await getInventoryCounts();
        setCounts(data as InventoryCount[]);
      } catch (err) {
        console.error("Failed to load inventory counts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void loadCounts();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading inventory counts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Inventory Counts</h1>
        <p className="text-red-500">
          Failed to load inventory counts.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Counts</h1>

        <Link
          href="/inventory-counts/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Count
        </Link>
      </div>

      {counts.length === 0 ? (
        <div className="border rounded-lg p-6 text-gray-500">
          No inventory counts found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="border-collapse border w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left text-gray-800">ID</th>
                <th className="border p-3 text-left text-gray-800">
                  Warehouse
                </th>
                <th className="border p-3 text-left text-gray-800">
                  Status
                </th>
                <th className="border p-3 text-left text-gray-800">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {counts.map((count) => (
                <tr key={count.id}>
                  <td className="border p-3">{count.id}</td>
                  <td className="border p-3">
                    {count.warehouse?.name ?? "-"}
                  </td>
                  <td className="border p-3">{count.status}</td>
                  <td className="border p-3">
                    <Link
                      href={`/inventory-counts/${count.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}