"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

function WarehouseIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 20L24 8L42 20V40H6V20Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 20H44"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M13 25H20V32H13V25Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M28 25H35V32H28V25Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 40V32H28V40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 8V3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M3 7L12 3L21 7V17L12 21L3 17V7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M3 7L12 12L21 7M12 12V21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarehouseSmallIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M3 10L12 4L21 10V20H3V10Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M2 10H22M8 14H10V17H8V14ZM14 14H16V17H14V14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MovementIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M4 17L9 12L13 16L20 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 8H20V13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);

      if (response.data.user?.role) {
        localStorage.setItem("role", response.data.user.role);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-black text-white">
      {/* Subtle ERP background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-zinc-800/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-emerald-950/10 blur-3xl" />

        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(#52525b_1px,transparent_1px),linear-gradient(90deg,#52525b_1px,transparent_1px)] [background-size:72px_72px]" />

        {/* Large, subtle warehouse outline */}
        <svg
          viewBox="0 0 700 500"
          className="absolute -bottom-12 -left-20 w-[650px] text-zinc-800/50"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M50 210L350 40L650 210V470H50V210Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M35 210H665"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M125 255H260V470H125V255ZM440 255H575V470H440V255Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M290 470V300H410V470"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M170 290H215M170 330H215M170 370H215M485 290H530M485 330H530M485 370H530"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col lg:flex-row">
        {/* Branding */}
        <section className="hidden flex-1 flex-col justify-center px-12 lg:flex">
          <div className="max-w-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900">
                <WarehouseIcon />
              </div>

              <div>
                <p className="text-lg font-semibold tracking-tight">
                  StockFlow
                </p>

                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  ERP Management
                </p>
              </div>
            </div>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              Manage your stock.
              <br />
              <span className="text-zinc-500">
                Move your business forward.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-6 text-zinc-400">
              A centralized workspace for products, warehouses, inventory
              movements, and stock monitoring.
            </p>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="mb-3 text-zinc-500">
                  <PackageIcon />
                </div>
                <p className="text-sm font-medium">Products</p>
                <p className="mt-1 text-xs text-zinc-600">Organized</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="mb-3 text-zinc-500">
                  <WarehouseSmallIcon />
                </div>
                <p className="text-sm font-medium">Warehouses</p>
                <p className="mt-1 text-xs text-zinc-600">Centralized</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="mb-3 text-zinc-500">
                  <MovementIcon />
                </div>
                <p className="text-sm font-medium">Movements</p>
                <p className="mt-1 text-xs text-zinc-600">Tracked</p>
              </div>
            </div>
          </div>
        </section>

        {/* Login */}
        <section className="flex w-full items-center justify-center px-6 py-10 lg:w-[460px] lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900">
                <WarehouseIcon />
              </div>

              <p className="text-lg font-semibold">StockFlow</p>

              <p className="mt-1 text-sm text-zinc-500">
                ERP Stock & Warehouse Management
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/95 p-8 shadow-2xl backdrop-blur">
              <div className="mb-7">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                  Secure access
                </p>

                <h2 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Sign in to access your stock workspace.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 pr-20 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 transition hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-white py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="mt-7 flex items-center justify-center gap-2 text-xs text-zinc-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Inventory management workspace
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-zinc-600">
              StockFlow ERP · Stock & Warehouse Module
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}