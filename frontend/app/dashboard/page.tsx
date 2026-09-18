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
      width="20"
      height="20"
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
      width="20"
      height="20"
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
      width="20"
      height="20"
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
      width="20"
      height="20"
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
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
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
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
    >
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

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  href,
  icon,
  accent,
}: {
  title: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  accent: "blue" | "violet" | "emerald" | "amber";
}) {
  const accentStyles = {
    blue: {
      icon: "bg-blue-400/[0.08] text-blue-400",
      value: "text-blue-400",
      hover: "hover:border-blue-400/20",
    },
    violet: {
      icon: "bg-violet-400/[0.08] text-violet-400",
      value: "text-violet-400",
      hover: "hover:border-violet-400/20",
    },
    emerald: {
      icon: "bg-emerald-400/[0.08] text-emerald-400",
      value: "text-emerald-400",
      hover: "hover:border-emerald-400/20",
    },
    amber: {
      icon: "bg-amber-400/[0.08] text-amber-400",
      value: "text-amber-400",
      hover: "hover:border-amber-400/20",
    },
  };

  const styles = accentStyles[accent];

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-5 transition-all duration-300 hover:-translate-y-1 ${styles.hover}`}
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/[0.015] blur-2xl transition-all duration-500 group-hover:scale-150" />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}
        >
          {icon}
        </div>

        <div className="text-white/15 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white/40">
          <ArrowIcon />
        </div>
      </div>

      <div className="relative mt-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/35">
          {title}
        </p>

        <p
          className={`mt-2 text-3xl font-semibold tracking-tight ${styles.value}`}
        >
          {value}
        </p>
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
      <div className="min-h-screen bg-[#080808] text-white">
        <Navbar />

        <main className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="animate-pulse space-y-7">
            <div className="h-4 w-36 rounded bg-white/[0.05]" />

            <div className="h-10 w-72 rounded bg-white/[0.06]" />

            <div className="h-4 w-[450px] max-w-full rounded bg-white/[0.04]" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-36 rounded-2xl bg-[#0d0d0d]"
                />
              ))}
            </div>

            <div className="h-72 rounded-2xl bg-[#0d0d0d]" />
          </div>
        </main>
      </div>
    );
  }

  /* ============================================================
     MAIN
  ============================================================ */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white">
      <Navbar />

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute right-[-200px] top-[100px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.025] blur-[130px]" />

        <div className="absolute left-[-250px] top-[500px] h-[500px] w-[500px] rounded-full bg-amber-500/[0.018] blur-[130px]" />
      </div>

      <main className="relative mx-auto max-w-[1400px] px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* ======================================================
            HEADER
        ======================================================= */}

        <header className="flex flex-col justify-between gap-6 border-b border-white/[0.06] pb-8 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-400/70">
                System overview
              </span>
            </div>

            <p className="text-xs uppercase tracking-[0.15em] text-white/25">
              ERP / Stock Management
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Inventory Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
              Overview of products, warehouses, stock levels and
              inventory activity.
            </p>
          </div>

          <button
            onClick={handleExportStock}
            disabled={exporting}
            className="group flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-5 text-sm font-medium text-white/75 transition-all duration-200 hover:border-amber-400/25 hover:bg-amber-400/[0.05] hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <DownloadIcon />

            {exporting ? "Exporting..." : "Export Stock"}
          </button>
        </header>

        {/* ======================================================
            STATISTICS
        ======================================================= */}

        <section className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Products"
            value={products.length}
            href="/products"
            icon={<PackageIcon />}
            accent="blue"
          />

          <StatCard
            title="Categories"
            value={categories.length}
            href="/categories"
            icon={<CategoryIcon />}
            accent="violet"
          />

          <StatCard
            title="Warehouses"
            value={warehouses.length}
            href="/warehouses"
            icon={<WarehouseIcon />}
            accent="emerald"
          />

          <StatCard
            title="Stock Movements"
            value={movements.length}
            href="/stock-movements"
            icon={<MovementIcon />}
            accent="amber"
          />
        </section>

        {/* ======================================================
            STOCK OVERVIEW
        ======================================================= */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d0d]">
          <div className="flex flex-col justify-between gap-3 border-b border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold">
                Stock Overview
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Current inventory status across all stock records.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-white/25">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live inventory data
            </div>
          </div>

          <div className="grid divide-y divide-white/[0.05] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-white/[0.05]">
            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                Total Units
              </p>

              <p className="mt-2 text-2xl font-semibold text-blue-400">
                {totalUnits}
              </p>
            </div>

            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                Stock Records
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {stockLevels.length}
              </p>
            </div>

            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                Low Stock
              </p>

              <p className="mt-2 text-2xl font-semibold text-amber-400">
                {lowStockItems.length}
              </p>
            </div>

            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                Out of Stock
              </p>

              <p className="mt-2 text-2xl font-semibold text-red-400">
                {outOfStockCount}
              </p>
            </div>
          </div>

          {/* Health */}
          <div className="border-t border-white/[0.06] px-6 py-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-white/35">
                Stock health
              </span>

              <span className="text-xs font-medium text-emerald-400">
                {stockHealth}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                style={{
                  width: `${stockHealth}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* ======================================================
            CHARTS
        ======================================================= */}

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Warehouse chart */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">
                  Stock by Warehouse
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  Current quantity stored in each active warehouse.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/[0.07] text-blue-400">
                <WarehouseIcon />
              </div>
            </div>

            {warehouseStock.length === 0 ? (
              <div className="mt-8 flex min-h-[230px] items-center justify-center rounded-xl border border-dashed border-white/[0.07]">
                <div className="px-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] text-white/20">
                    <WarehouseIcon />
                  </div>

                  <p className="mt-4 text-sm font-medium text-white/50">
                    No stock assigned
                  </p>

                  <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-white/25">
                    Stock quantities will appear here when inventory
                    is available.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-5">
                {warehouseStock.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className="group"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-white/50 transition-colors group-hover:text-white/75">
                        {warehouse.name}
                      </span>

                      <span className="text-xs font-medium text-blue-400">
                        {warehouse.total}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full bg-blue-400 transition-all duration-700 group-hover:bg-blue-300"
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

          {/* Movement chart */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">
                  Stock Movement Trend
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  Movement quantity over the last 7 days.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/[0.07] text-amber-400">
                <MovementIcon />
              </div>
            </div>

            {!hasMovementActivity ? (
              <div className="mt-8 flex min-h-[230px] items-center justify-center rounded-xl border border-dashed border-white/[0.07]">
                <div className="px-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] text-white/20">
                    <MovementIcon />
                  </div>

                  <p className="mt-4 text-sm font-medium text-white/50">
                    No movement activity
                  </p>

                  <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-white/25">
                    No stock movements have been recorded during
                    the last 7 days.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-7 flex h-[235px] items-end gap-2 sm:gap-3">
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
                      className="group flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <div className="mb-2 h-4 text-[10px] font-medium text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                        {day.quantity > 0
                          ? day.quantity
                          : ""}
                      </div>

                      <div className="flex h-40 w-full items-end justify-center">
                        <div
                          className="w-full max-w-10 rounded-t-lg bg-amber-400/70 transition-all duration-500 group-hover:bg-amber-300"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`${day.quantity} units`}
                        />
                      </div>

                      <div className="mt-3 text-[10px] uppercase tracking-wide text-white/25">
                        {day.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ======================================================
            ALERTS + MOVEMENTS
        ======================================================= */}

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Low stock */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">
                  Low Stock Alerts
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  Products requiring attention.
                </p>
              </div>

              <div className="rounded-lg bg-amber-400/[0.07] px-2.5 py-1.5 text-[10px] font-medium text-amber-400">
                {lowStockItems.length} alerts
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              {lowStockItems.length === 0 ? (
                <div className="rounded-xl border border-emerald-400/[0.08] bg-emerald-400/[0.025] p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-400">
                      ✓
                    </span>

                    <div>
                      <p className="text-sm font-medium text-emerald-400/90">
                        No low stock alerts
                      </p>

                      <p className="mt-0.5 text-xs text-white/25">
                        Current inventory is above minimum levels.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                lowStockItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/40 p-4 transition-all duration-200 hover:border-amber-400/15 hover:bg-white/[0.015]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white/80">
                        {item.product?.name ?? "Unknown product"}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/25">
                        {item.product?.reference ?? "No reference"}
                      </p>
                    </div>

                    <div className="ml-4 text-right">
                      <p className="text-sm font-semibold text-amber-400">
                        {item.quantity}
                      </p>

                      <p className="mt-1 text-[10px] text-white/25">
                        Current
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent movements */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold">
                  Recent Movements
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  Latest inventory activity.
                </p>
              </div>

              <Link
                href="/stock-movements"
                className="text-[10px] uppercase tracking-[0.13em] text-white/25 transition-colors hover:text-white/60"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 space-y-2.5">
              {recentMovements.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/[0.07] p-6 text-center">
                  <p className="text-sm text-white/35">
                    No stock movements yet.
                  </p>
                </div>
              ) : (
                recentMovements.map((movement) => {
                  const type = movement.type?.toUpperCase();

                  let typeColor = "text-blue-400";
                  let dotColor = "bg-blue-400";

                  if (type === "IN") {
                    typeColor = "text-emerald-400";
                    dotColor = "bg-emerald-400";
                  } else if (type === "OUT") {
                    typeColor = "text-red-400";
                    dotColor = "bg-red-400";
                  } else if (type === "TRANSFER") {
                    typeColor = "text-blue-400";
                    dotColor = "bg-blue-400";
                  } else if (type === "CORRECTION") {
                    typeColor = "text-amber-400";
                    dotColor = "bg-amber-400";
                  }

                  return (
                    <div
                      key={movement.id}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/40 p-4 transition-all duration-200 hover:border-white/[0.11] hover:bg-white/[0.015]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`}
                        />

                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold ${typeColor}`}
                          >
                            {movement.type}
                          </p>

                          <p className="mt-1 truncate text-[10px] text-white/25">
                            {new Date(
                              movement.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <p className="ml-4 text-sm font-semibold text-white/70">
                        {movement.quantity}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* ======================================================
            CURRENT STOCK
        ======================================================= */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d0d]">
          <div className="flex flex-col justify-between gap-3 border-b border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold">
                Current Stock
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Current quantities for tracked products.
              </p>
            </div>

            <Link
              href="/products"
              className="group flex items-center gap-1.5 text-[10px] uppercase tracking-[0.13em] text-white/30 transition-colors hover:text-blue-400"
            >
              Manage products

              <span className="transition-transform duration-200 group-hover:translate-x-1">
                <ArrowIcon />
              </span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="border-b border-white/[0.05]">
                <tr className="text-[10px] uppercase tracking-[0.13em] text-white/25">
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

              <tbody className="divide-y divide-white/[0.04]">
                {stockLevels.slice(0, 8).map((item) => {
                  const quantity = Number(item.quantity || 0);

                  const isLowStock = lowStockItems.some(
                    (lowItem) => lowItem.id === item.id
                  );

                  let status = "Healthy";
                  let statusClass =
                    "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-400";

                  if (quantity === 0) {
                    status = "Out of stock";
                    statusClass =
                      "border-red-400/10 bg-red-400/[0.04] text-red-400";
                  } else if (isLowStock) {
                    status = "Low stock";
                    statusClass =
                      "border-amber-400/10 bg-amber-400/[0.04] text-amber-400";
                  }

                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-white/[0.012]"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white/75 transition-colors group-hover:text-white">
                          {item.product?.name ?? "Unknown product"}
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/25">
                          {item.product?.reference ?? "-"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-xs text-white/40">
                        {item.warehouse?.name ??
                          "Unknown warehouse"}
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
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] ${statusClass}`}
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

        {/* ======================================================
            ADDITIONAL MODULES
        ======================================================= */}

        <section className="mt-5 grid gap-5 md:grid-cols-2">
          <Link
            href="/inventory-counts"
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/[0.025] blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/[0.07] text-blue-400">
                <PackageIcon />
              </div>

              <div className="text-white/20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-blue-400">
                <ArrowIcon />
              </div>
            </div>

            <div className="relative mt-5">
              <h3 className="font-semibold">
                Inventory Counts
              </h3>

              <p className="mt-2 max-w-md text-xs leading-5 text-white/30">
                Create and validate physical inventory counts
                against the quantities recorded in the system.
              </p>

              <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.14em] text-blue-400/70">
                Open module
              </p>
            </div>
          </Link>

          <Link
            href="/audit-logs"
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-400/[0.025] blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/[0.07] text-violet-400">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 4H19V20H5V4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M8 8H16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8 12H16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8 16H13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="text-white/20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-violet-400">
                <ArrowIcon />
              </div>
            </div>

            <div className="relative mt-5">
              <h3 className="font-semibold">
                Audit Logs
              </h3>

              <p className="mt-2 max-w-md text-xs leading-5 text-white/30">
                Review tracked actions performed throughout the
                inventory management system.
              </p>

              <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.14em] text-violet-400/70">
                Open module
              </p>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}