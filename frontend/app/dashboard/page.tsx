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

/* ============================================================
   ICONS
============================================================ */

function PackageIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M21 8.5L12 4L3 8.5L12 13L21 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M3 8.5V17L12 21L21 17V8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 13V21"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CategoryIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M4 6.5L12 3L20 6.5L12 10L4 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 12L12 15.5L20 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 17.5L12 21L20 17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarehouseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3 21V8L12 3L21 8V21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7 21V12H17V21"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.5 15H14.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MovementIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M5 7H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 3L19 7L15 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 17H5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 13L5 17L9 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3V15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7 11L12 16L17 11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20H20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L21 19H3L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 9V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="0.8" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12L10 17L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12H8L10 5L14 19L16 12H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   KPI CARD
============================================================ */

function StatCard({
  title,
  value,
  href,
  icon,
  accent,
  description,
}: {
  title: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  accent: "cyan" | "purple" | "green" | "orange";
  description: string;
}) {
  const accentStyles = {
    cyan: {
      icon: "bg-cyan-400/10 text-cyan-400",
      number: "text-cyan-300",
      line: "bg-cyan-400",
    },
    purple: {
      icon: "bg-purple-400/10 text-purple-400",
      number: "text-purple-300",
      line: "bg-purple-400",
    },
    green: {
      icon: "bg-emerald-400/10 text-emerald-400",
      number: "text-emerald-300",
      line: "bg-emerald-400",
    },
    orange: {
      icon: "bg-orange-400/10 text-orange-400",
      number: "text-orange-300",
      line: "bg-orange-400",
    },
  };

  const styles = accentStyles[accent];

  return (
    <Link
      href={href}
      className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 transition-colors hover:border-zinc-700"
    >
      <div className={`absolute left-0 top-0 h-full w-[2px] ${styles.line}`} />

      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.icon}`}
        >
          {icon}
        </div>

        <ArrowIcon />
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium text-zinc-500">
          {title}
        </p>

        <div className="mt-1 flex items-end justify-between gap-3">
          <p
            className={`text-3xl font-semibold tracking-tight ${styles.number}`}
          >
            {value}
          </p>

          <span className="pb-1 text-[10px] text-zinc-600">
            {description}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
   DASHBOARD
============================================================ */

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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
      setExporting(true);

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
    } finally {
      setExporting(false);
    }
  }

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090b] text-white">
        <Navbar />

        <main className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="space-y-6 animate-pulse">
            <div className="h-8 w-64 rounded bg-zinc-900" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-36 rounded-xl bg-zinc-900"
                />
              ))}
            </div>

            <div className="h-72 rounded-xl bg-zinc-900" />
          </div>
        </main>
      </div>
    );
  }

  /* ============================================================
     MAIN
  ============================================================ */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08090b] text-white">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-5 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <header className="mb-7 flex flex-col justify-between gap-5 border-b border-zinc-800 pb-7 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Inventory system
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Inventory Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Monitor stock, warehouse capacity and inventory activity
              from one place.
            </p>
          </div>

          <button
            onClick={handleExportStock}
            disabled={exporting}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <DownloadIcon />

            {exporting ? "Exporting..." : "Export Stock"}
          </button>
        </header>

        {/* KPI CARDS */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Products"
            value={products.length}
            href="/products"
            icon={<PackageIcon />}
            accent="cyan"
            description="catalog"
          />

          <StatCard
            title="Categories"
            value={categories.length}
            href="/categories"
            icon={<CategoryIcon />}
            accent="purple"
            description="groups"
          />

          <StatCard
            title="Warehouses"
            value={warehouses.length}
            href="/warehouses"
            icon={<WarehouseIcon />}
            accent="green"
            description="locations"
          />

          <StatCard
            title="Movements"
            value={movements.length}
            href="/stock-movements"
            icon={<MovementIcon />}
            accent="orange"
            description="records"
          />
        </section>

        {/* MAIN OVERVIEW */}
        <section className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">

          {/* Stock summary */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60">
            <div className="border-b border-zinc-800 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-zinc-100">
                    Stock Overview
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    Current state of tracked inventory.
                  </p>
                </div>

                <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-[10px] text-zinc-400">
                  {stockLevels.length} records
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-3">
              <div className="border-b border-zinc-800 p-6 sm:border-b-0 sm:border-r">
                <p className="text-xs text-zinc-500">
                  Total units
                </p>

                <p className="mt-2 text-3xl font-semibold text-cyan-300">
                  {totalUnits}
                </p>
              </div>

              <div className="border-b border-zinc-800 p-6 sm:border-b-0 sm:border-r">
                <p className="text-xs text-zinc-500">
                  Low stock
                </p>

                <p className="mt-2 text-3xl font-semibold text-amber-300">
                  {lowStockItems.length}
                </p>
              </div>

              <div className="p-6">
                <p className="text-xs text-zinc-500">
                  Out of stock
                </p>

                <p className="mt-2 text-3xl font-semibold text-red-300">
                  {outOfStockCount}
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-800 px-6 py-5">
              <div className="mb-2 flex justify-between">
                <span className="text-xs text-zinc-500">
                  Inventory availability
                </span>

                <span className="text-xs font-semibold text-emerald-400">
                  {stockHealth}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                  style={{
                    width: `${stockHealth}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Health gauge */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-zinc-100">
                  Stock Health
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Available stock records
                </p>
              </div>

              <div className="rounded-lg bg-emerald-400/10 p-2 text-emerald-400">
                <CheckIcon />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center">
              <div
                className="relative flex h-36 w-36 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(
                    rgb(52 211 153) ${stockHealth}%,
                    rgb(39 39 42) ${stockHealth}% 100%
                  )`,
                }}
              >
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-zinc-900">
                  <span className="text-3xl font-semibold text-emerald-300">
                    {stockHealth}%
                  </span>

                  <span className="mt-1 text-[10px] uppercase tracking-wider text-zinc-600">
                    healthy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHARTS */}
        <section className="mt-5 grid gap-5 lg:grid-cols-2">

          {/* Warehouse distribution */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-zinc-100">
                  Warehouse Distribution
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Quantity currently stored by warehouse.
                </p>
              </div>

              <div className="rounded-lg bg-cyan-400/10 p-2 text-cyan-400">
                <WarehouseIcon />
              </div>
            </div>

            {warehouseStock.length === 0 ? (
              <div className="mt-8 flex h-52 items-center justify-center rounded-lg border border-dashed border-zinc-800">
                <p className="text-sm text-zinc-600">
                  No stock assigned to warehouses.
                </p>
              </div>
            ) : (
              <div className="mt-7 space-y-5">
                {warehouseStock.map((warehouse, index) => {
                  const percentage =
                    (warehouse.total / maxWarehouseStock) * 100;

                  const barColors = [
                    "bg-cyan-400",
                    "bg-purple-400",
                    "bg-emerald-400",
                    "bg-orange-400",
                    "bg-pink-400",
                  ];

                  const barColor =
                    barColors[index % barColors.length];

                  return (
                    <div key={warehouse.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${barColor}`}
                          />

                          <span className="truncate text-xs text-zinc-400">
                            {warehouse.name}
                          </span>
                        </div>

                        <span className="ml-3 text-xs font-semibold text-zinc-300">
                          {warehouse.total}
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-zinc-800">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Movement chart */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-zinc-100">
                  Movement Activity
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Quantity moved during the last 7 days.
                </p>
              </div>

              <div className="rounded-lg bg-orange-400/10 p-2 text-orange-400">
                <ActivityIcon />
              </div>
            </div>

            {!hasMovementActivity ? (
              <div className="mt-8 flex h-52 items-center justify-center rounded-lg border border-dashed border-zinc-800">
                <div className="text-center">
                  <ActivityIcon />

                  <p className="mt-3 text-sm text-zinc-500">
                    No movement activity
                  </p>

                  <p className="mt-1 text-xs text-zinc-700">
                    No movements recorded in the last 7 days.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-7">
                <div className="flex h-48 items-end gap-3 border-b border-zinc-800 px-2">
                  {movementTrend.map((day) => {
                    const height =
                      day.quantity > 0
                        ? Math.max(
                            (day.quantity / maxMovementQuantity) * 100,
                            8
                          )
                        : 2;

                    return (
                      <div
                        key={day.date}
                        className="flex h-full flex-1 flex-col items-center justify-end"
                      >
                        <div className="mb-2 text-[10px] text-zinc-500">
                          {day.quantity > 0
                            ? day.quantity
                            : ""}
                        </div>

                        <div className="flex h-36 w-full items-end justify-center">
                          <div
                            className="w-full max-w-9 rounded-t-md bg-orange-400/80"
                            style={{
                              height: `${height}%`,
                            }}
                            title={`${day.quantity} units`}
                          />
                        </div>

                        <span className="mt-3 text-[10px] text-zinc-600">
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ALERTS + MOVEMENTS */}
        <section className="mt-5 grid gap-5 lg:grid-cols-2">

          {/* Low stock */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-zinc-100">
                  Stock Alerts
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Products requiring attention.
                </p>
              </div>

              <div
                className={`rounded-md px-2.5 py-1 text-[10px] font-medium ${
                  lowStockItems.length > 0
                    ? "bg-amber-400/10 text-amber-400"
                    : "bg-emerald-400/10 text-emerald-400"
                }`}
              >
                {lowStockItems.length} alerts
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {lowStockItems.length === 0 ? (
                <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="rounded-lg bg-emerald-400/10 p-2 text-emerald-400">
                    <CheckIcon />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-emerald-300">
                      Inventory looks good
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      No products are currently below their minimum stock.
                    </p>
                  </div>
                </div>
              ) : (
                lowStockItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-lg bg-amber-400/10 p-2 text-amber-400">
                        <AlertIcon />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-300">
                          {item.product?.name ?? "Unknown product"}
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-600">
                          {item.product?.reference ?? "No reference"}
                        </p>
                      </div>
                    </div>

                    <div className="ml-4 text-right">
                      <p className="text-sm font-semibold text-amber-300">
                        {item.quantity}
                      </p>

                      <p className="text-[10px] text-zinc-600">
                        units
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent movements */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-zinc-100">
                  Recent Activity
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Latest stock movements.
                </p>
              </div>

              <Link
                href="/stock-movements"
                className="text-xs text-zinc-500 transition-colors hover:text-white"
              >
                View all →
              </Link>
            </div>

            <div className="mt-6 space-y-2">
              {recentMovements.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-800 p-8 text-center text-sm text-zinc-600">
                  No stock movements yet.
                </div>
              ) : (
                recentMovements.map((movement) => {
                  const type = movement.type?.toUpperCase();

                  let typeClass = "text-cyan-400";
                  let dotClass = "bg-cyan-400";

                  if (type === "IN") {
                    typeClass = "text-emerald-400";
                    dotClass = "bg-emerald-400";
                  } else if (type === "OUT") {
                    typeClass = "text-red-400";
                    dotClass = "bg-red-400";
                  } else if (type === "TRANSFER") {
                    typeClass = "text-purple-400";
                    dotClass = "bg-purple-400";
                  } else if (type === "CORRECTION") {
                    typeClass = "text-orange-400";
                    dotClass = "bg-orange-400";
                  }

                  return (
                    <div
                      key={movement.id}
                      className="flex items-center justify-between border-b border-zinc-800/70 py-3 last:border-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`}
                        />

                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold ${typeClass}`}
                          >
                            {movement.type}
                          </p>

                          <p className="mt-1 truncate text-[10px] text-zinc-600">
                            {new Date(
                              movement.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <p className="ml-4 text-sm font-semibold text-zinc-300">
                        {movement.quantity}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* CURRENT STOCK TABLE */}
        <section className="mt-5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
            <div>
              <h2 className="font-semibold text-zinc-100">
                Current Stock
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Current quantities across tracked inventory.
              </p>
            </div>

            <Link
              href="/products"
              className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-cyan-400"
            >
              Products
              <ArrowIcon />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-zinc-950/60">
                <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-600">
                  <th className="px-6 py-4 font-medium">
                    Product
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Warehouse
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Quantity
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {stockLevels.slice(0, 8).map((item) => {
                  const quantity = Number(item.quantity || 0);

                  const isLowStock = lowStockItems.some(
                    (lowItem) => lowItem.id === item.id
                  );

                  let status = "Healthy";
                  let statusClass =
                    "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";

                  if (quantity === 0) {
                    status = "Out of stock";
                    statusClass =
                      "border-red-500/20 bg-red-500/5 text-red-400";
                  } else if (isLowStock) {
                    status = "Low stock";
                    statusClass =
                      "border-amber-500/20 bg-amber-500/5 text-amber-400";
                  }

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-800/70 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-zinc-300">
                          {item.product?.name ?? "Unknown product"}
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-600">
                          {item.product?.reference ?? "-"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-xs text-zinc-500">
                        {item.warehouse?.name ?? "Unknown warehouse"}
                      </td>

                      <td
                        className={`px-6 py-4 text-sm font-semibold ${
                          quantity === 0
                            ? "text-red-400"
                            : isLowStock
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {quantity}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-[10px] font-medium ${statusClass}`}
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

        {/* MODULES */}
        <section className="mt-5 grid gap-4 md:grid-cols-2">

          <Link
            href="/inventory-counts"
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-colors hover:border-emerald-500/30"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-400/10 p-3 text-emerald-400">
                <PackageIcon />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-200">
                  Inventory Counts
                </h3>

                <p className="mt-1 text-xs text-zinc-600">
                  Create and validate physical inventory counts.
                </p>
              </div>
            </div>

            <ArrowIcon />
          </Link>

          <Link
            href="/audit-logs"
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-colors hover:border-purple-500/30"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-400/10 p-3 text-purple-400">
                <ActivityIcon />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-200">
                  Audit Logs
                </h3>

                <p className="mt-1 text-xs text-zinc-600">
                  Review tracked actions in the inventory system.
                </p>
              </div>
            </div>

            <ArrowIcon />
          </Link>
        </section>
      </main>
    </div>
  );
}