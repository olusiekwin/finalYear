"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthModalFrame } from "@/components/ui/auth-modal-frame";
import { apiUrl } from "@/lib/api";
import { IconEye, IconEyeOff } from "@/lib/password-eye-icons";

const fieldClass =
  "w-full rounded-sm border border-slate-200 bg-[#fafafa] px-4 py-3 text-[15px] text-[#1a2e2a] outline-none transition placeholder:text-slate-400 focus:border-[#2f4b45]/45 focus:ring-2 focus:ring-[#2f4b45]/15";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#2f4b45]";

const btnPrimary =
  "w-full rounded-sm bg-[linear-gradient(165deg,#2f4b45_0%,#243a36_100%)] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-sm transition hover:brightness-[1.03] disabled:opacity-55";

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function ConfirmResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("This link is missing a token. Request a new reset email.");
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError(
        "Use at least 8 characters with one uppercase letter and one number.",
      );
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(apiUrl("/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || "Could not reset password.");
        return;
      }
      setSuccess(data?.message || "Password updated. You can sign in now.");
      setTimeout(() => router.push("/login"), 1800);
    } catch {
      setError("Request failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error ? (
        <div
          className="mt-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="mt-5 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {success}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="new-pass" className={labelClass}>
            New password
          </label>
          <div className="relative">
            <input
              id="new-pass"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(fieldClass, "pr-11")}
              autoComplete="new-password"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 z-10 flex items-center rounded-sm pr-3 pl-2 text-[#2a4540]/55 transition hover:bg-[#f0f7f5] hover:text-[#2a4540]"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="new-pass2" className={labelClass}>
            Confirm password
          </label>
          <div className="relative">
            <input
              id="new-pass2"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={cn(fieldClass, "pr-11")}
              autoComplete="new-password"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 z-10 flex items-center rounded-sm pr-3 pl-2 text-[#2a4540]/55 transition hover:bg-[#f0f7f5] hover:text-[#2a4540]"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={
                showConfirm ? "Hide confirm password" : "Show confirm password"
              }
            >
              {showConfirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={isLoading} className={btnPrimary}>
          {isLoading ? "Updating…" : "Update password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <AuthModalFrame
        eyebrow="Account recovery"
        title="Choose a new password"
        subtitle="Use a strong password you have not used on other sites. After saving, you will return to sign in."
        imageUrl="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Medical records in a clinical setting"
        highlights={[
          "Links expire automatically",
          "Minimum 8 characters, one uppercase, one number",
          "Need help? 0721-497-444",
        ]}
        supportText="Mon–Fri 8am–5pm · Sat 8am–1pm"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#2f4b45]">
          Reset password
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#1a2e2a] sm:text-4xl">
          Secure your account
        </h2>
        <Suspense
          fallback={
            <p className="mt-6 text-sm text-[#5e5148]">Loading…</p>
          }
        >
          <ConfirmResetForm />
        </Suspense>
        <p className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-[#5e5148]">
          <Link
            href="/login"
            className="font-semibold text-[#2f4b45] underline-offset-2 hover:text-[#356b5f] hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </AuthModalFrame>
    </div>
  );
}
