"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface Product {
  id: number;
  name: string;
}

interface Warehouse {
  id: number;
  name: string;
}

interface StockMovement {
  id: number;
  type: string;
  quantity: number;
  reference?: string | null;
  createdAt: string;
  product?: Product;
  warehouse?: Warehouse;
}

export default function StockMovementsPage() {
  const {
    data: movements,
    isLoading,
    error,
  } = useQuery<StockMovement[]>({
    queryKey: ["stock-movements"],
    queryFn: async () => {
      const response = await api.get("/stock-movements");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading stock movements...</p>
      </div>
    );
  }

  if (error) {
    console.error("Stock movements error:", error);

    return (
      <div className="p-8">
        <p className="text-red-500">Failed to load stock movements</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stock Movements</h1>

        <a
          href="/stock-movements/create"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create Movement
        </a>
      </div>

      {!movements || movements.length === 0 ? (
        <div className="rounded-lg border p-6 text-gray-500">
          No stock movements found.
        </div>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left text-gray-800">ID</th>
              <th className="border p-3 text-left text-gray-800">Type</th>
              <th className="border p-3 text-left text-gray-800">Product</th>
              <th className="border p-3 text-left text-gray-800">Warehouse</th>
              <th className="border p-3 text-left text-gray-800">Quantity</th>
              <th className="border p-3 text-left text-gray-800">
                Reference
              </th>
              <th className="border p-3 text-left text-gray-800">Date</th>
            </tr>
          </thead>

          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td className="border p-3">{movement.id}</td>
                <td className="border p-3 font-medium">
                  {movement.type}
                </td>
                <td className="border p-3">
                  {movement.product?.name ?? "-"}
                </td>
                <td className="border p-3">
                  {movement.warehouse?.name ?? "-"}
                </td>
                <td className="border p-3">{movement.quantity}</td>
                <td className="border p-3">
                  {movement.reference ?? "-"}
                </td>
                <td className="border p-3">
                  {new Date(movement.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}