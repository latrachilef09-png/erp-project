"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

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
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090909] text-[#f5f5f5]">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage: `
            linear-gradient(#ffffff12 1px, transparent 1px),
            linear-gradient(90deg, #ffffff12 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
        }}
      />

      {/* Ambient colored lights */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#f2b84b]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 right-[-100px] h-[500px] w-[500px] rounded-full bg-[#7ca7e8]/[0.06] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid w-full overflow-hidden rounded-3xl border border-[#292929] bg-[#101010]/95 shadow-2xl shadow-black/40 lg:grid-cols-[1.08fr_0.92fr]">
          {/* Left section */}
          <section className="relative hidden min-h-[680px] overflow-hidden border-r border-[#292929] bg-[#0d0d0d] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            {/* Decorative warehouse drawing */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
              <svg
                viewBox="0 0 700 700"
                className="absolute -bottom-8 -right-24 h-[620px] w-[620px]"
                fill="none"
              >
                <path
                  d="M80 300L350 120L620 300V610H80V300Z"
                  stroke="#f2b84b"
                  strokeWidth="2"
                />
                <path
                  d="M80 300L350 470L620 300"
                  stroke="#f2b84b"
                  strokeWidth="2"
                />
                <path
                  d="M350 120V470"
                  stroke="#f2b84b"
                  strokeWidth="2"
                />
                <path
                  d="M80 390L350 560L620 390"
                  stroke="#7ca7e8"
                  strokeWidth="2"
                />
                <path
                  d="M80 480L350 650L620 480"
                  stroke="#72c6a0"
                  strokeWidth="2"
                />
                <rect
                  x="245"
                  y="365"
                  width="210"
                  height="245"
                  rx="4"
                  stroke="#f2b84b"
                  strokeWidth="2"
                />
                <path
                  d="M350 365V610"
                  stroke="#f2b84b"
                  strokeWidth="2"
                />
                <path
                  d="M245 425H455M245 485H455M245 545H455"
                  stroke="#f2b84b"
                  strokeWidth="2"
                />
                <path
                  d="M150 340V580M550 340V580"
                  stroke="#7ca7e8"
                  strokeWidth="2"
                />
                <path
                  d="M130 580H570"
                  stroke="#72c6a0"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Brand */}
            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f2b84b]/40 bg-[#f2b84b]/10">
                  <svg
                    width="27"
                    height="27"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f2b84b"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8L12 3L21 8V19L12 23L3 19V8Z" />
                    <path d="M3 8L12 13L21 8" />
                    <path d="M12 13V23" />
                    <path d="M7.5 5.5L16.5 10.5" />
                  </svg>
                </div>

                <div>
                  <p className="text-xl font-semibold tracking-tight">
                    Stock<span className="text-[#f2b84b]">Flow</span>
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#777]">
                    Inventory management
                  </p>
                </div>
              </div>

              <div className="max-w-md">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-[#f2b84b]">
                  Control your inventory
                </p>

                <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight text-[#f5f5f5] xl:text-5xl">
                  Everything in
                  <br />
                  <span className="text-[#f2b84b]">its right place.</span>
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-[#929292]">
                  Manage products, warehouses, stock movements and inventory
                  counts from one simple workspace.
                </p>
              </div>
            </div>

            {/* Feature cards */}
            <div className="relative z-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[#292929] bg-[#151515]/90 p-4">
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2b84b]/10 text-[#f2b84b]">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 8L12 3L3 8L12 13L21 8Z" />
                    <path d="M3 8V16L12 21L21 16V8" />
                    <path d="M12 13V21" />
                  </svg>
                </div>

                <p className="text-sm font-medium text-[#e7e7e7]">Products</p>
                <p className="mt-1 text-xs text-[#777]">Organized stock</p>
              </div>

              <div className="rounded-2xl border border-[#292929] bg-[#151515]/90 p-4">
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#7ca7e8]/10 text-[#7ca7e8]">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21V8L12 3L21 8V21H3Z" />
                    <path d="M7 21V12H17V21" />
                    <path d="M7 8H17" />
                  </svg>
                </div>

                <p className="text-sm font-medium text-[#e7e7e7]">Warehouses</p>
                <p className="mt-1 text-xs text-[#777]">Centralized storage</p>
              </div>

              <div className="rounded-2xl border border-[#292929] bg-[#151515]/90 p-4">
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#72c6a0]/10 text-[#72c6a0]">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12H21" />
                    <path d="M16 7L21 12L16 17" />
                    <path d="M8 17L3 12L8 7" />
                  </svg>
                </div>

                <p className="text-sm font-medium text-[#e7e7e7]">Movements</p>
                <p className="mt-1 text-xs text-[#777]">Real-time tracking</p>
              </div>
            </div>
          </section>

          {/* Right section */}
          <section className="flex min-h-[680px] items-center justify-center bg-[#121212] px-6 py-12 sm:px-12">
            <div className="w-full max-w-md">
              {/* Mobile brand */}
              <div className="mb-12 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f2b84b]/40 bg-[#f2b84b]/10">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f2b84b"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8L12 3L21 8V19L12 23L3 19V8Z" />
                    <path d="M3 8L12 13L21 8" />
                    <path d="M12 13V23" />
                  </svg>
                </div>

                <div>
                  <p className="text-xl font-semibold">
                    Stock<span className="text-[#f2b84b]">Flow</span>
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#777]">
                    Inventory management
                  </p>
                </div>
              </div>

              <div className="mb-9">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#72c6a0]/20 bg-[#72c6a0]/[0.07] px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#72c6a0]" />
                  <span className="text-[11px] font-medium text-[#9ad8bb]">
                    Secure workspace
                  </span>
                </div>

                <h2 className="text-3xl font-semibold tracking-tight text-[#f5f5f5]">
                  Welcome back
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#858585]">
                  Sign in to continue managing your inventory.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.13em] text-[#a3a3a3]"
                  >
                    Email address
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#666] transition-colors group-focus-within:text-[#f2b84b]">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="M3 7L12 13L21 7" />
                      </svg>
                    </div>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-[#303030] bg-[#0c0c0c] py-3.5 pl-12 pr-4 text-sm text-[#f5f5f5] outline-none transition placeholder:text-[#555] focus:border-[#f2b84b]/70 focus:ring-4 focus:ring-[#f2b84b]/[0.07]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium uppercase tracking-[0.13em] text-[#a3a3a3]"
                    >
                      Password
                    </label>
                  </div>

                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#666] transition-colors group-focus-within:text-[#f2b84b]">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path d="M8 10V7A4 4 0 0 1 16 7V10" />
                      </svg>
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-[#303030] bg-[#0c0c0c] py-3.5 pl-12 pr-12 text-sm text-[#f5f5f5] outline-none transition placeholder:text-[#555] focus:border-[#f2b84b]/70 focus:ring-4 focus:ring-[#f2b84b]/[0.07]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] transition hover:text-[#f2b84b]"
                    >
                      {showPassword ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 3L21 21" />
                          <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
                          <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4C17 4 20.5 8 22 12C21.4 13.6 20.4 15.2 19 16.5" />
                          <path d="M6.2 6.2C4.6 7.5 3.4 9.3 2 12C3.5 16 7 20 12 20C13.7 20 15.2 19.6 16.6 18.8" />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12C3.5 8 7 4 12 4C17 4 20.5 8 22 12C20.5 16 17 20 12 20C7 20 3.5 16 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#f2b84b] px-5 py-3.5 text-sm font-semibold text-[#17120a] transition hover:bg-[#ffca68] focus:outline-none focus:ring-4 focus:ring-[#f2b84b]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeOpacity="0.3"
                        />
                        <path
                          d="M21 12A9 9 0 0 0 12 3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to StockFlow
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        <path d="M5 12H19" />
                        <path d="M13 6L19 12L13 18" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-10 flex items-center justify-center gap-2 text-xs text-[#555]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path d="M8 10V7A4 4 0 0 1 16 7V10" />
                </svg>
                Your workspace is protected
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}