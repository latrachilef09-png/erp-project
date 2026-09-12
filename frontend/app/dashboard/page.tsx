"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

interface Product {
  id: number;
  reference: string;
  name: string;
  minStock: number;
}

interface Category {
  id: number;
  name: string;
}

interface Warehouse {
  id: number;
  name: string;
}

interface StockLevel {
  id: number;
  productId?: number;
  warehouseId?: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    reference: string;
  };
  warehouse?: {
    id: number;
    name: string;
  };
}

interface LowStockItem {
  id: number;
  productId?: number;
  warehouseId?: number;
  quantity: number;
  minStock?: number;
  product?: {
    id: number;
    name: string;
    reference: string;
  };
  warehouse?: {
    id: number;
    name: string;
  };
}

interface Movement {
  id: number;
  type: string;
  quantity: number;
  createdAt: string;
}

function StatCard({
  title,
  value,
  href,
  valueColor = "text-white",
}: {
  title: string;
  value: number;
  href: string;
  valueColor?: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-zinc-600"
    >
      <p className="text-sm text-zinc-400">{title}</p>

      <p className={`mt-2 text-3xl font-semibold ${valueColor}`}>
        {value}
      </p>
    </Link>
  );
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          productsResponse,
          categoriesResponse,
          warehousesResponse,
          stockLevelsResponse,
          lowStockResponse,
          movementsResponse,
        ] = await Promise.all([
          api.get("/products?page=1&limit=1000"),
          api.get("/product-categories"),
          api.get("/warehouses"),
          api.get("/stock-levels"),
          api.get("/stock-levels/low-stock"),
          api.get("/stock-movements"),
        ]);

        setProducts(
          productsResponse.data?.data ?? productsResponse.data ?? []
        );

        setCategories(
          categoriesResponse.data?.data ?? categoriesResponse.data ?? []
        );

        setWarehouses(
          warehousesResponse.data?.data ?? warehousesResponse.data ?? []
        );

        setStockLevels(
          stockLevelsResponse.data?.data ?? stockLevelsResponse.data ?? []
        );

        setLowStockItems(
          lowStockResponse.data?.data ?? lowStockResponse.data ?? []
        );

        setMovements(
          movementsResponse.data?.data ?? movementsResponse.data ?? []
        );
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalUnits = useMemo(() => {
    return stockLevels.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }, [stockLevels]);

  const outOfStockCount = useMemo(() => {
    return stockLevels.filter(
      (item) => Number(item.quantity || 0) === 0
    ).length;
  }, [stockLevels]);

  const stockHealth = useMemo(() => {
    if (stockLevels.length === 0) return 100;

    const healthy = stockLevels.filter(
      (item) => Number(item.quantity || 0) > 0
    ).length;

    return Math.round((healthy / stockLevels.length) * 100);
  }, [stockLevels]);

  const recentMovements = useMemo(() => {
    return [...movements]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [movements]);

  const warehouseStock = useMemo(() => {
    return warehouses
      .map((warehouse) => {
        const total = stockLevels
          .filter(
            (item) =>
              item.warehouseId === warehouse.id ||
              item.warehouse?.id === warehouse.id
          )
          .reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
          );

        return {
          id: warehouse.id,
          name: warehouse.name,
          total,
        };
      })
      .filter((warehouse) => warehouse.total > 0);
  }, [warehouses, stockLevels]);

  /*
   * Convert a Date to a local calendar date.
   *
   * We intentionally do NOT use toISOString() here because
   * toISOString() converts the date to UTC and can move a
   * movement to the previous day in Tunisia.
   */
  const getLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const movementTrend = useMemo(() => {
    const days: {
      label: string;
      date: string;
      count: number;
      quantity: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const dateKey = getLocalDateKey(date);

      const dayMovements = movements.filter((movement) => {
        const movementDate = new Date(movement.createdAt);

        return getLocalDateKey(movementDate) === dateKey;
      });

      const quantity = dayMovements.reduce(
        (sum, movement) =>
          sum + Number(movement.quantity || 0),
        0
      );

      days.push({
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        date: dateKey,
        count: dayMovements.length,
        quantity,
      });
    }

    return days;
  }, [movements]);

  const hasMovementActivity = useMemo(() => {
    return movementTrend.some((day) => day.quantity > 0);
  }, [movementTrend]);

  const maxWarehouseStock = useMemo(() => {
    return Math.max(
      ...warehouseStock.map((warehouse) => warehouse.total),
      1
    );
  }, [warehouseStock]);

  const maxMovementQuantity = useMemo(() => {
    return Math.max(
      ...movementTrend.map((day) => day.quantity),
      1
    );
  }, [movementTrend]);

  async function handleExportStock() {
    try {
      const response = await api.get("/stock-levels/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "stock-export.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export stock:", error);
      alert("Failed to export stock.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded bg-zinc-800" />
            <div className="h-4 w-96 rounded bg-zinc-900" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 rounded-xl bg-zinc-900"
                />
              ))}
            </div>

            <div className="h-80 rounded-xl bg-zinc-900" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-zinc-500">
              ERP / Stock Management
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Inventory Dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Overview of products, warehouses, stock levels and
              inventory activity.
            </p>
          </div>

          <button
            onClick={handleExportStock}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Export Stock
          </button>
        </div>

        {/* Statistics */}
        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Products"
            value={products.length}
            href="/products"
            valueColor="text-blue-400"
          />

          <StatCard
            title="Categories"
            value={categories.length}
            href="/categories"
            valueColor="text-violet-400"
          />

          <StatCard
            title="Warehouses"
            value={warehouses.length}
            href="/warehouses"
            valueColor="text-emerald-400"
          />

          <StatCard
            title="Stock Movements"
            value={movements.length}
            href="/stock-movements"
            valueColor="text-orange-400"
          />
        </section>

        {/* Stock Overview */}
        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Stock Overview
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Current inventory status across all stock records.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-zinc-500">Total Units</p>

              <p className="mt-1 text-2xl font-semibold text-blue-400">
                {totalUnits}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Stock Records</p>

              <p className="mt-1 text-2xl font-semibold text-white">
                {stockLevels.length}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Low Stock</p>

              <p className="mt-1 text-2xl font-semibold text-yellow-400">
                {lowStockItems.length}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Out of Stock
              </p>

              <p className="mt-1 text-2xl font-semibold text-red-400">
                {outOfStockCount}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-zinc-400">
                Stock health
              </span>

              <span className="font-medium text-emerald-400">
                {stockHealth}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${stockHealth}%` }}
              />
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Stock by Warehouse */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div>
              <h2 className="text-lg font-semibold">
                Stock by Warehouse
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Current quantity stored in each active warehouse.
              </p>
            </div>

            {warehouseStock.length === 0 ? (
              <div className="mt-10 flex min-h-48 items-center justify-center text-center">
                <div>
                  <p className="text-sm font-medium text-zinc-300">
                    No stock is currently assigned to a warehouse.
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Stock quantities will appear here when inventory
                    is available.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-5">
                {warehouseStock.map((warehouse) => (
                  <div key={warehouse.id}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-zinc-300">
                        {warehouse.name}
                      </span>

                      <span className="font-medium text-blue-400">
                        {warehouse.total}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{
                          width: `${
                            (warehouse.total /
                              maxWarehouseStock) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stock Movement Trend */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div>
              <h2 className="text-lg font-semibold">
                Stock Movement Trend
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Movement quantity over the last 7 days.
              </p>
            </div>

            {!hasMovementActivity ? (
              <div className="mt-10 flex min-h-48 items-center justify-center text-center">
                <div>
                  <p className="text-sm font-medium text-zinc-300">
                    No movement activity
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    No stock movements have been recorded during
                    the last 7 days.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex h-56 items-end justify-between gap-3">
                {movementTrend.map((day) => {
                  const height =
                    day.quantity > 0
                      ? Math.max(
                          (day.quantity /
                            maxMovementQuantity) *
                            100,
                          8
                        )
                      : 2;

                  return (
                    <div
                      key={day.date}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <div className="mb-2 text-xs font-medium text-orange-400">
                        {day.quantity > 0
                          ? day.quantity
                          : ""}
                      </div>

                      <div className="flex h-40 w-full items-end justify-center">
                        <div
                          className="w-full max-w-10 rounded-t-md bg-orange-500 transition-all"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`${day.quantity} units`}
                        />
                      </div>

                      <div className="mt-3 text-xs text-zinc-500">
                        {day.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Lower Information */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Low Stock Alerts */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div>
              <h2 className="text-lg font-semibold">
                Low Stock Alerts
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Products requiring attention.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {lowStockItems.length === 0 ? (
                <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-4">
                  <p className="text-sm font-medium text-emerald-400">
                    No low stock alerts
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    All current stock levels are above their minimum.
                  </p>
                </div>
              ) : (
                lowStockItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.product?.name ?? "Unknown product"}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {item.product?.reference ?? "No reference"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-yellow-400">
                        {item.quantity}
                      </p>

                      <p className="text-xs text-zinc-500">
                        Current stock
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Movements */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div>
              <h2 className="text-lg font-semibold">
                Recent Movements
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Latest inventory activity.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {recentMovements.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No stock movements yet.
                </p>
              ) : (
                recentMovements.map((movement) => {
                  const type = movement.type?.toUpperCase();

                  let typeColor = "text-blue-400";

                  if (type === "IN") {
                    typeColor = "text-emerald-400";
                  } else if (type === "OUT") {
                    typeColor = "text-red-400";
                  } else if (type === "TRANSFER") {
                    typeColor = "text-blue-400";
                  } else if (type === "CORRECTION") {
                    typeColor = "text-yellow-400";
                  }

                  return (
                    <div
                      key={movement.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black p-4"
                    >
                      <div>
                        <p
                          className={`text-sm font-semibold ${typeColor}`}
                        >
                          {movement.type}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {new Date(
                            movement.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-orange-400">
                        {movement.quantity}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* Current Stock */}
        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Current Stock
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Current quantities for tracked products.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="pb-3 pr-4">Product</th>
                  <th className="pb-3 pr-4">Warehouse</th>
                  <th className="pb-3 pr-4">Quantity</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-900">
                {stockLevels.slice(0, 8).map((item) => {
                  const quantity = Number(item.quantity || 0);

                  const isLowStock = lowStockItems.some(
                    (lowItem) => lowItem.id === item.id
                  );

                  let status = "Healthy";
                  let statusClass =
                    "border-emerald-900/60 bg-emerald-950/20 text-emerald-400";

                  if (quantity === 0) {
                    status = "Out of stock";
                    statusClass =
                      "border-red-900/60 bg-red-950/20 text-red-400";
                  } else if (isLowStock) {
                    status = "Low stock";
                    statusClass =
                      "border-yellow-900/60 bg-yellow-950/20 text-yellow-400";
                  }

                  return (
                    <tr key={item.id}>
                      <td className="py-4 pr-4">
                        <p className="font-medium text-white">
                          {item.product?.name ?? "Unknown product"}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {item.product?.reference ?? "-"}
                        </p>
                      </td>

                      <td className="py-4 pr-4 text-zinc-400">
                        {item.warehouse?.name ??
                          "Unknown warehouse"}
                      </td>

                      <td
                        className={`py-4 pr-4 font-semibold ${
                          quantity === 0
                            ? "text-red-400"
                            : isLowStock
                              ? "text-yellow-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {quantity}
                      </td>

                      <td className="py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs ${statusClass}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Additional Modules */}
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <Link
            href="/inventory-counts"
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-zinc-600"
          >
            <h3 className="font-semibold text-white">
              Inventory Counts
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Create and validate physical inventory counts.
            </p>

            <p className="mt-4 text-sm font-medium text-blue-400">
              Open module →
            </p>
          </Link>

          <Link
            href="/audit-logs"
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-zinc-600"
          >
            <h3 className="font-semibold text-white">
              Audit Logs
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Review tracked actions performed in the system.
            </p>

            <p className="mt-4 text-sm font-medium text-violet-400">
              Open module →
            </p>
          </Link>
        </section>
      </main>
    </div>
  );
}