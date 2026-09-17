"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

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
      {/* Warehouse background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-zinc-800/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-zinc-800/20 blur-3xl" />

        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(#27272a_1px,transparent_1px),linear-gradient(90deg,#27272a_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-40">
          <div className="absolute bottom-0 left-[8%] h-64 w-2 bg-zinc-700" />
          <div className="absolute bottom-0 left-[8%] h-2 w-[34rem] bg-zinc-700" />
          <div className="absolute bottom-32 left-[8%] h-2 w-[34rem] bg-zinc-700" />
          <div className="absolute bottom-64 left-[8%] h-2 w-[34rem] bg-zinc-700" />

          <div className="absolute bottom-2 left-[14%] h-20 w-24 border border-zinc-700 bg-zinc-900" />
          <div className="absolute bottom-2 left-[28%] h-28 w-28 border border-zinc-700 bg-zinc-900" />
          <div className="absolute bottom-2 left-[43%] h-16 w-20 border border-zinc-700 bg-zinc-900" />

          <div className="absolute bottom-0 right-[10%] h-80 w-2 bg-zinc-800" />
          <div className="absolute bottom-0 right-[10%] h-2 w-80 bg-zinc-800" />
          <div className="absolute bottom-40 right-[10%] h-2 w-80 bg-zinc-800" />
          <div className="absolute bottom-80 right-[10%] h-2 w-80 bg-zinc-800" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col lg:flex-row">
        {/* Branding section */}
        <section className="hidden flex-1 flex-col justify-center px-12 lg:flex">
          <div className="max-w-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-xl font-bold">
                S
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
              <span className="text-zinc-500">Move your business forward.</span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-6 text-zinc-400">
              A centralized workspace for products, warehouses, inventory
              movements, and stock monitoring.
            </p>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="mb-3 text-zinc-500">▦</div>
                <p className="text-sm font-medium">Products</p>
                <p className="mt-1 text-xs text-zinc-600">Organized</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="mb-3 text-zinc-500">⌂</div>
                <p className="text-sm font-medium">Warehouses</p>
                <p className="mt-1 text-xs text-zinc-600">Centralized</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="mb-3 text-zinc-500">↗</div>
                <p className="text-sm font-medium">Movements</p>
                <p className="mt-1 text-xs text-zinc-600">Tracked</p>
              </div>
            </div>
          </div>
        </section>

        {/* Login section */}
        <section className="flex w-full items-center justify-center px-6 py-10 lg:w-[460px] lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-xl font-bold">
                S
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