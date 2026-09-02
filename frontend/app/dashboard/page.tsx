"use client";

import Link from "next/link";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
interface Product {
  id: number;
  name: string;
}

interface Category {
  id: number;
}

interface Warehouse {
  id: number;
  name?: string;
}

interface StockMovement {
  id: number;
}

interface StockLevel {
  id: number;
  quantity: number;
  product: Product;
  warehouse: Warehouse & {
    name: string;
  };
}

interface LowStockItem {
  id: number;
  quantity: number;
  product: Product;
  warehouse: Warehouse & {
    name: string;
  };
}

interface InventoryCount {
  id: number;
  status: string;
  warehouse?: {
    name: string;
  };
}

export default function Dashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [warehousesCount, setWarehousesCount] = useState(0);
  const [stockMovementsCount, setStockMovementsCount] = useState(0);

  const [inventoryCounts, setInventoryCounts] = useState<
    InventoryCount[]
  >([]);

  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          productsRes,
          categoriesRes,
          warehousesRes,
          stockMovementsRes,
          stockLevelsRes,
          lowStockRes,
          inventoryCountsRes,
        ] = await Promise.all([
          api.get("/products?page=1&limit=1000"),
          api.get("/product-categories"),
          api.get("/warehouses"),
          api.get("/stock-movements"),
          api.get("/stock-levels"),
          api.get("/stock-levels/low-stock"),
          api.get("/inventory-counts"),
        ]);

        /*
         * Products now return a paginated object:
         * {
         *   data: [...],
         *   total: ...,
         *   page: ...,
         *   limit: ...,
         *   totalPages: ...
         * }
         */

        setProductsCount(productsRes.data.total ?? 0);

        setCategoriesCount(
          Array.isArray(categoriesRes.data)
            ? categoriesRes.data.length
            : categoriesRes.data.total ?? 0,
        );

        setWarehousesCount(
          Array.isArray(warehousesRes.data)
            ? warehousesRes.data.length
            : warehousesRes.data.total ?? 0,
        );

        setStockMovementsCount(
          Array.isArray(stockMovementsRes.data)
            ? stockMovementsRes.data.length
            : stockMovementsRes.data.total ?? 0,
        );

        setStockLevels(
          Array.isArray(stockLevelsRes.data)
            ? stockLevelsRes.data
            : stockLevelsRes.data.data ?? [],
        );

        setLowStockItems(
          Array.isArray(lowStockRes.data)
            ? lowStockRes.data
            : lowStockRes.data.data ?? [],
        );

        setInventoryCounts(
          Array.isArray(inventoryCountsRes.data)
            ? inventoryCountsRes.data
            : inventoryCountsRes.data.data ?? [],
        );

        setLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="p-6">
        {loading && <div>Loading dashboard...</div>}

        {error && (
          <div className="text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Main navigation cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

              {/* Products */}
              <Link
                href="/products"
                className="block rounded-lg border p-4 hover:bg-gray-50 transition"
              >
                <h2 className="text-lg font-semibold">
                  Products
                </h2>

                <p className="text-2xl font-bold">
                  {productsCount}
                </p>
              </Link>

              {/* Categories */}
              <Link
  href="/categories"
  className="block rounded-lg border p-4 hover:bg-gray-50 transition"
>
  <h2 className="text-lg font-semibold">Categories</h2>
  <p className="text-2xl font-bold">{categoriesCount}</p>
</Link>

              {/* Warehouses */}
              <Link
                href="/warehouses"
                className="block rounded-lg border p-4 hover:bg-gray-50 transition"
              >
                <h2 className="text-lg font-semibold">
                  Warehouses
                </h2>

                <p className="text-2xl font-bold">
                  {warehousesCount}
                </p>
              </Link>

              {/* Movements */}
              <Link
                href="/stock-movements"
                className="block rounded-lg border p-4 hover:bg-gray-50 transition"
              >
                <h2 className="text-lg font-semibold">
                  Movements
                </h2>

                <p className="text-2xl font-bold">
                  {stockMovementsCount}
                </p>
              </Link>
            </div>

            {/* Additional navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              {/* Inventory Counts */}
              <Link
                href="/inventory-counts"
                className="block rounded-lg border p-4 hover:bg-gray-50 transition"
              >
                <h2 className="text-xl font-semibold">
                  Inventory Counts
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  View and validate inventory counts
                </p>

                <p className="text-2xl font-bold mt-2">
                  {inventoryCounts.length}
                </p>
              </Link>

              {/* Audit Logs */}
              <Link
                href="/audit-logs"
                className="block rounded-lg border p-4 hover:bg-gray-50 transition"
              >
                <h2 className="text-xl font-semibold">
                  Audit Logs
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  Monitor system activity
                </p>
              </Link>
            </div>

            {/* Low Stock Alerts */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                Low Stock Alerts
              </h2>

              {lowStockItems.length === 0 ? (
                <p>No low stock alerts 🎉</p>
              ) : (
                <div>
                  {lowStockItems.map((item) => (
                    <p key={item.id}>
                      ⚠️ {item.product.name} in{" "}
                      {item.warehouse.name}: {item.quantity} left
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Live Stock Levels */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">
                  Live Stock Levels
                </h2>

                <button
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/stock-levels/export`,
                      "_blank",
                    )
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Export Excel
                </button>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">
                      Product
                    </th>

                    <th className="border p-2 text-left">
                      Warehouse
                    </th>

                    <th className="border p-2 text-left">
                      Quantity
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {stockLevels.map((item) => (
                    <tr key={item.id}>
                      <td className="border p-2">
                        {item.product.name}
                      </td>

                      <td className="border p-2">
                        {item.warehouse.name}
                      </td>

                      <td className="border p-2">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}