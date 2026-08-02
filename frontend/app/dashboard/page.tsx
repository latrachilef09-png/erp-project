"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [warehousesCount, setWarehousesCount] = useState(0);
  const [stockMovementsCount, setStockMovementsCount] = useState(0);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
  useEffect(() => {
    const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError("");
        const token = localStorage.getItem("access_token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          productsRes,
          categoriesRes,
          warehousesRes,
          stockMovementsRes,
        ] = await Promise.all([
          fetch("http://localhost:3001/products", { headers }),
          fetch("http://localhost:3001/product-categories", { headers }),
          fetch("http://localhost:3001/warehouses", { headers }),
          fetch("http://localhost:3001/stock-movements", { headers }),
        ]);

        const [
          products,
          categories,
          warehouses,
          stockMovements,
        ] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          warehousesRes.json(),
          stockMovementsRes.json(),
        ]);

        setProductsCount(products.length);
        setCategoriesCount(categories.length);
        setWarehousesCount(warehouses.length);
        setStockMovementsCount(stockMovements.length);
        setLoading(false);
      } catch (error) {
  console.error("Dashboard error:", error);
  setError("Failed to load dashboard data");
  setLoading(false);
}
    };

    fetchDashboardData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">
          ERP Dashboard
        </h1>
        {loading && (
  <p className="text-gray-500">
    Loading dashboard...
  </p>
)}

{error && (
  <p className="text-red-500">
    {error}
  </p>
)}
        {!loading && !error && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border rounded-lg p-6 shadow">
            <h2 className="text-gray-500">Products</h2>
            <p className="text-3xl font-bold">{productsCount}</p>
          </div>

          <div className="border rounded-lg p-6 shadow">
            <h2 className="text-gray-500">Categories</h2>
            <p className="text-3xl font-bold">{categoriesCount}</p>
          </div>

          <div className="border rounded-lg p-6 shadow">
            <h2 className="text-gray-500">Warehouses</h2>
            <p className="text-3xl font-bold">{warehousesCount}</p>
          </div>

          <div className="border rounded-lg p-6 shadow">
            <h2 className="text-gray-500">Stock Movements</h2>
            <p className="text-3xl font-bold">{stockMovementsCount}</p>
          </div>

        </div>
        )}</div>
    </ProtectedRoute>
  );
}