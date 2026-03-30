"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      if (data.requiresOTP) {
        sessionStorage.setItem("pendingPhone", formData.phoneNumber);
        sessionStorage.setItem("requiresOTP", "true");
        router.push("/verify-otp");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("phoneNumber", formData.phoneNumber);
        router.push("/dashboard");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-[#c56c4a]/25 bg-[#fff6ec] p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9a6c56]">
            Join The Platform
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold text-[#233b35]">
            Create Your NSC-AI Account
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#665b53]">
            Register once to book dermatology consultations, upload skin images,
            and track your treatment journey with The Nairobi Skin Centre.
          </p>

          <div className="mt-8 space-y-3 rounded-2xl border border-[#c56c4a]/20 bg-white p-5 text-sm text-[#61564f]">
            <p className="font-semibold text-[#2f4b45]">Why sign up?</p>
            <p>Centralized profile and health records</p>
            <p>Faster specialist booking and review flow</p>
            <p>Optional OTP verification for account security</p>
          </div>
        </section>

        <section className="nsc-glass rounded-[2rem] p-8 sm:p-10">
          <h2 className="font-display text-4xl font-semibold text-[#234039]">
            Account Details
          </h2>
          <p className="mt-2 text-sm text-[#6b5e55]">
            Fill in your details to get started.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#3b4b45]">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#c8b6a6] bg-white px-4 py-3 text-[#2d2a26] outline-none transition focus:border-[#2f4b45]"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#3b4b45]">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#c8b6a6] bg-white px-4 py-3 text-[#2d2a26] outline-none transition focus:border-[#2f4b45]"
                  placeholder="Doe"
                />
              </div>
            </div>

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
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3b4b45]">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#c8b6a6] bg-white px-4 py-3 text-[#2d2a26] outline-none transition focus:border-[#2f4b45]"
                placeholder="0721-497-444"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#3b4b45]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#c8b6a6] bg-white px-4 py-3 text-[#2d2a26] outline-none transition focus:border-[#2f4b45]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[#c56c4a] px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#ad5d41] disabled:opacity-60"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6a5d55]">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-bold text-[#2f4b45] hover:text-[#203732]"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
