"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [warehousesCount, setWarehousesCount] = useState(0);
  const [stockMovementsCount, setStockMovementsCount] = useState(0);

  const [stockLevels, setStockLevels] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          productsRes,
          categoriesRes,
          warehousesRes,
          stockMovementsRes,
          stockLevelsRes,
          lowStockRes,
        ] = await Promise.all([
          fetch("http://localhost:3001/products", { headers }),
          fetch("http://localhost:3001/product-categories", { headers }),
          fetch("http://localhost:3001/warehouses", { headers }),
          fetch("http://localhost:3001/stock-movements", { headers }),
          fetch("http://localhost:3001/stock-levels", { headers }),
          fetch("http://localhost:3001/stock-levels/low-stock", { headers }),
        ]);

        const [
          products,
          categories,
          warehouses,
          stockMovements,
          stockLevelsData,
          lowStockData,
        ] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          warehousesRes.json(),
          stockMovementsRes.json(),
          stockLevelsRes.json(),
          lowStockRes.json(),
        ]);

        setProductsCount(products.length);
        setCategoriesCount(categories.length);
        setWarehousesCount(warehouses.length);
        setStockMovementsCount(stockMovements.length);

        setStockLevels(stockLevelsData);
        setLowStockItems(lowStockData);

        setLoading(false);

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
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
          <>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="border rounded-lg p-6 shadow">
                <h2 className="text-gray-500">
                  Products
                </h2>
                <p className="text-3xl font-bold">
                  {productsCount}
                </p>
              </div>


              <div className="border rounded-lg p-6 shadow">
                <h2 className="text-gray-500">
                  Categories
                </h2>
                <p className="text-3xl font-bold">
                  {categoriesCount}
                </p>
              </div>


              <div className="border rounded-lg p-6 shadow">
                <h2 className="text-gray-500">
                  Warehouses
                </h2>
                <p className="text-3xl font-bold">
                  {warehousesCount}
                </p>
              </div>


              <div className="border rounded-lg p-6 shadow">
                <h2 className="text-gray-500">
                  Movements
                </h2>
                <p className="text-3xl font-bold">
                  {stockMovementsCount}
                </p>
              </div>

            </div>


            <div className="mt-8 border rounded-lg p-6 shadow">

              <h2 className="text-xl font-bold mb-4">
                Low Stock Alerts
              </h2>


              {lowStockItems.length === 0 ? (

                <p className="text-green-600">
                  No low stock alerts 🎉
                </p>

              ) : (

                lowStockItems.map((item) => (

                  <div
                    key={item.id}
                    className="text-red-600 mb-2"
                  >
                    ⚠️ {item.product.name} in{" "}
                    {item.warehouse.name}
                    : {item.quantity} left
                  </div>

                ))

              )}

            </div>



            <div className="mt-10">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-2xl font-bold">
                  Live Stock Levels
                </h2>


                <button
                  onClick={() =>
                    window.open(
                      "http://localhost:3001/stock-levels/export",
                      "_blank"
                    )
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Export Excel
                </button>

              </div>


              <table className="w-full border border-gray-300">

                <thead className="bg-gray-100">

                  <tr>
                    <th className="border p-2">
                      Product
                    </th>

                    <th className="border p-2">
                      Warehouse
                    </th>

                    <th className="border p-2">
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


                      <td className="border p-2 font-bold">
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