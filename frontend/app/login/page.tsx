"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

function WarehouseScene() {
  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden rounded-3xl border border-zinc-800 bg-[#080808]">
      {/* Background glow */}
      <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#52525b_1px,transparent_1px),linear-gradient(90deg,#52525b_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Header */}
      <div className="absolute left-8 right-8 top-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900">
            <svg
              viewBox="0 0 48 48"
              className="h-7 w-7 text-white"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 20L24 8L42 20V40H6V20Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M4 20H44M13 25H20V32H13V25ZM28 25H35V32H28V25Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 40V32H28V40"
                stroke="currentColor"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">StockFlow</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
              Warehouse ERP
            </p>
          </div>
        </div>

        <div className="rounded-full border border-emerald-900/60 bg-emerald-950/30 px-3 py-1.5 text-[10px] uppercase tracking-widest text-emerald-500">
          System online
        </div>
      </div>

      {/* Main illustration */}
      <svg
        viewBox="0 0 700 560"
        className="absolute inset-x-0 bottom-8 h-[72%] w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Illustration of warehouse shelves, packages, and inventory tracking"
      >
        {/* Floor */}
        <path
          d="M40 465L350 350L660 465L350 550L40 465Z"
          fill="#111111"
          stroke="#27272A"
          strokeWidth="2"
        />

        {/* Perspective floor lines */}
        <path d="M350 350V550" stroke="#27272A" strokeWidth="2" />
        <path d="M40 465L350 465L660 465" stroke="#27272A" />
        <path d="M180 412L350 550M520 412L350 550" stroke="#27272A" />

        {/* Left storage rack */}
        <g stroke="#52525B" strokeWidth="5" strokeLinecap="round">
          <path d="M95 145V455" />
          <path d="M270 145V455" />
          <path d="M95 145H270" />
          <path d="M95 245H270" />
          <path d="M95 345H270" />
          <path d="M95 445H270" />
        </g>

        {/* Left rack boxes */}
        <g stroke="#71717A" strokeWidth="2">
          <path d="M115 170H165V220H115V170Z" fill="#27272A" />
          <path d="M175 170H245V220H175V170Z" fill="#18181B" />
          <path d="M115 270H190V320H115V270Z" fill="#18181B" />
          <path d="M200 270H250V320H200V270Z" fill="#27272A" />
          <path d="M115 370H155V420H115V370Z" fill="#27272A" />
          <path d="M165 370H245V420H165V370Z" fill="#18181B" />
        </g>

        {/* Right storage rack */}
        <g stroke="#52525B" strokeWidth="5" strokeLinecap="round">
          <path d="M430 145V455" />
          <path d="M605 145V455" />
          <path d="M430 145H605" />
          <path d="M430 245H605" />
          <path d="M430 345H605" />
          <path d="M430 445H605" />
        </g>

        {/* Right rack boxes */}
        <g stroke="#71717A" strokeWidth="2">
          <path d="M450 170H500V220H450V170Z" fill="#27272A" />
          <path d="M510 170H580V220H510V170Z" fill="#18181B" />
          <path d="M450 270H525V320H450V270Z" fill="#18181B" />
          <path d="M535 270H585V320H535V270Z" fill="#27272A" />
          <path d="M450 370H490V420H450V370Z" fill="#27272A" />
          <path d="M500 370H580V420H500V370Z" fill="#18181B" />
        </g>

        {/* Central package */}
        <g>
          <path
            d="M285 290L350 255L415 290L350 327L285 290Z"
            fill="#3F3F46"
            stroke="#A1A1AA"
            strokeWidth="2"
          />
          <path
            d="M285 290V370L350 410V327L285 290Z"
            fill="#27272A"
            stroke="#71717A"
            strokeWidth="2"
          />
          <path
            d="M350 327L415 290V370L350 410V327Z"
            fill="#18181B"
            stroke="#71717A"
            strokeWidth="2"
          />
          <path
            d="M350 255V327M320 272L385 309"
            stroke="#D4D4D8"
            strokeWidth="2"
          />

          {/* Barcode */}
          <g stroke="#E4E4E7" strokeWidth="2">
            <path d="M325 348V378M331 351V382M337 354V386M343 357V389M349 360V392" />
          </g>
        </g>

        {/* Scanning line */}
        <path
          d="M120 230H580"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity="0.7"
        />

        {/* Floating labels */}
        <g>
          <rect
            x="110"
            y="92"
            width="118"
            height="38"
            rx="8"
            fill="#18181B"
            stroke="#3F3F46"
          />
          <circle cx="126" cy="111" r="4" fill="#10B981" />
          <text
            x="138"
            y="115"
            fill="#D4D4D8"
            fontSize="11"
            fontFamily="Arial, sans-serif"
          >
            STORAGE A
          </text>
        </g>

        <g>
          <rect
            x="472"
            y="92"
            width="118"
            height="38"
            rx="8"
            fill="#18181B"
            stroke="#3F3F46"
          />
          <circle cx="488" cy="111" r="4" fill="#10B981" />
          <text
            x="500"
            y="115"
            fill="#D4D4D8"
            fontSize="11"
            fontFamily="Arial, sans-serif"
          >
            STORAGE B
          </text>
        </g>
      </svg>

      {/* Bottom information */}
      <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
            Inventory control
          </p>

          <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-400">
            Track products, monitor stock levels, and manage warehouse
            operations from one workspace.
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-3xl font-semibold text-zinc-300">01</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-600">
            Stock module
          </p>
        </div>
      </div>
    </div>
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
    <main className="min-h-screen bg-black px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[1.35fr_0.85fr]">
        {/* Warehouse visual */}
        <section className="hidden lg:block">
          <WarehouseScene />
        </section>

        {/* Login panel */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900">
                <svg
                  viewBox="0 0 48 48"
                  className="h-7 w-7"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 20L24 8L42 20V40H6V20Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M4 20H44M13 25H20V32H13V25ZM28 25H35V32H28V25Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div>
                <p className="font-semibold">StockFlow</p>
                <p className="text-xs text-zinc-500">
                  ERP Stock & Warehouse Management
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-7 shadow-2xl sm:p-9">
              <div className="mb-8">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
                  Secure access
                </p>

                <h1 className="text-3xl font-semibold tracking-tight">
                  Welcome back
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Sign in to continue managing your inventory.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-400"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-300"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3.5 pr-20 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-300"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 transition hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                StockFlow ERP system
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-zinc-600">
              Stock & Warehouse Management Module
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}