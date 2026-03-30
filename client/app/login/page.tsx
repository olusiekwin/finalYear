"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"traditional" | "clerk">(
    "clerk",
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-[#c56c4a]/25 bg-gradient-to-r from-[#2f4b45] to-[#355a53] p-8 text-white sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#dbb8a8]">
            Welcome Back
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold">
            Continue Your Skin Care Journey
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#ecdfd4]">
            Access bookings, image uploads, consultation records, and treatment
            follow-up in one place. Designed for patients and clinicians at The
            Nairobi Skin Centre.
          </p>
          <div className="mt-8 space-y-3 text-sm text-[#f3e7de]">
            <p>Mon - Fri: 8.00a.m - 5.00p.m</p>
            <p>Saturday: 8.00a.m - 1.00p.m</p>
            <p>Support: 0721-497-444</p>
          </div>
        </section>

        <section className="nsc-glass rounded-[2rem] p-8 sm:p-10">
          <h2 className="font-display text-4xl font-semibold text-[#234039]">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-[#6b5e55]">
            Sign in with Google or use your account credentials.
          </p>

          {/* Auth Method Tabs */}
          <div className="mt-6 flex gap-2 border-b border-[#d4c4ba]">
            <button
              onClick={() => setAuthMethod("clerk")}
              className={`px-4 py-3 text-sm font-semibold transition ${
                authMethod === "clerk"
                  ? "border-b-2 border-[#c56c4a] text-[#c56c4a]"
                  : "text-[#8b7d74] hover:text-[#6b5e55]"
              }`}
            >
              Quick Sign In
            </button>
            <button
              onClick={() => setAuthMethod("traditional")}
              className={`px-4 py-3 text-sm font-semibold transition ${
                authMethod === "traditional"
                  ? "border-b-2 border-[#c56c4a] text-[#c56c4a]"
                  : "text-[#8b7d74] hover:text-[#6b5e55]"
              }`}
            >
              Traditional Login
            </button>
          </div>

          {/* Clerk Sign In */}
          {authMethod === "clerk" && (
            <div className="mt-8">
              <div className="rounded-xl bg-[#f9f7f4] p-6">
                <SignIn
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "w-full shadow-none border-none bg-transparent",
                      social: {
                        google: {
                          button:
                            "w-full h-12 rounded-full border-2 border-[#c56c4a] text-[#c56c4a] hover:bg-[#c56c4a]/5 font-semibold",
                        },
                      },
                      button: {
                        primary:
                          "w-full bg-[#c56c4a] hover:bg-[#a8583b] text-white rounded-full",
                      },
                      input:
                        "rounded-lg border border-[#d4c4ba] focus:border-[#c56c4a]",
                      formButtonPrimary:
                        "rounded-full bg-[#c56c4a] hover:bg-[#a8583b] text-white w-full",
                    },
                  }}
                  redirectUrl="/dashboard"
                />
              </div>
            </div>
          )}

          {/* Traditional Login Form */}
          {authMethod === "traditional" && (
            <>
              {error && (
                <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#3b4b45]">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#c8b6a6] bg-white px-4 py-3 text-[#2d2a26] outline-none transition focus:border-[#2f4b45]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#3b4b45]">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#c8b6a6] bg-white px-4 py-3 text-[#2d2a26] outline-none transition focus:border-[#2f4b45]"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-[#c56c4a] px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#ad5d41] disabled:opacity-60"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#6a5d55]">
                Need an account?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-[#2f4b45] hover:text-[#203732]"
                >
                  Create one
                </Link>
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
