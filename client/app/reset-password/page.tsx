"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthModalFrame } from "@/components/ui/auth-modal-frame";
import { apiUrl } from "@/lib/api";

const fieldClass =
  "w-full rounded-xl border border-[#c5d4de] bg-[#fcfbfa] px-4 py-3 text-[#142c38] outline-none transition placeholder:text-[#6d8494] focus:border-[#4a7c6f] focus:ring-2 focus:ring-[#4a7c6f]/20";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devLink, setDevLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setDevLink("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(apiUrl("/auth/request-password-reset"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          data?.error ||
            "We could not process that request right now. Please try again.",
        );
        return;
      }

      setSuccess(
        data?.message ||
          "If an account exists for that email, reset instructions are ready.",
      );
      if (typeof data?.devResetUrl === "string") {
        setDevLink(data.devResetUrl);
      }
    } catch {
      setError("Request failed. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <AuthModalFrame
        eyebrow="Account recovery"
        title="Reset your portal password"
        subtitle="We use the same email you registered with. You will complete the reset on a secure link—just like recovering access to a hospital patient portal."
        imageUrl="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Medical records in a clinical setting"
        highlights={[
          "Reset links expire for your protection",
          "Choose a strong password you have not used elsewhere",
          "Still stuck? Our clinic line can verify your identity",
        ]}
        supportText="0721-497-444 · Mon–Fri 8am–5pm, Sat 8am–1pm"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#4a7c6f]">
          Password reset
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-[#142c38] sm:text-4xl">
          Email recovery
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#3d5a66]">
          Enter your account email. In development, the server may return a
          one-time link in the response.
        </p>

        {error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-900">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-900">
            {success}
            {devLink ? (
              <p className="mt-3 break-all text-xs text-emerald-800">
                Dev link:{" "}
                <a href={devLink} className="font-mono underline">
                  {devLink}
                </a>
              </p>
            ) : null}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="reset-email"
              className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#1e4556]"
            >
              Account email
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[linear-gradient(165deg,#4a7c6f_0%,#3a6358_100%)] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-[#2d4f45]/22 transition hover:brightness-[1.03] disabled:opacity-55"
          >
            {isLoading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 border-t border-[#dce8ef] pt-6 text-center text-sm text-[#3d5a66]">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#1e4556] underline-offset-2 hover:text-[#4a7c6f] hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </AuthModalFrame>
    </div>
  );
}
