"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";

interface Warehouse {
  id: number;
  name: string;
  type: string;
}

export default function WarehousesPage() {
  const {
    data: warehouses,
    isLoading,
    error,
  } = useQuery<Warehouse[]>({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await api.get("/warehouses");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Loading warehouses...</p>
      </div>
    );
  }

  if (error) {
    console.error("Warehouses error:", error);

    return (
      <div className="p-8">
        <p className="text-red-500">Failed to load warehouses</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Warehouses</h1>
      </div>

      {!warehouses || warehouses.length === 0 ? (
        <div className="border rounded-lg p-6 text-gray-500">
          No warehouses found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="border-collapse border w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left text-gray-800">ID</th>
                <th className="border p-3 text-left text-gray-800">Name</th>
                <th className="border p-3 text-left text-gray-800">Type</th>
                <th className="border p-3 text-left text-gray-800">
                  Locations
                </th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td className="border p-3">{warehouse.id}</td>
                  <td className="border p-3">{warehouse.name}</td>
                  <td className="border p-3">{warehouse.type}</td>
                  <td className="border p-3">
                    <Link
                      href={`/warehouses/${warehouse.id}/locations`}
                      className="text-blue-600 hover:underline"
                    >
                      View locations
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