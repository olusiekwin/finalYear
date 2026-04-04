"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { SignInButton } from "@clerk/nextjs";
import { apiUrl } from "@/lib/api";
import { AuthModalFrame } from "@/components/ui/auth-modal-frame";
import { IconEye, IconEyeOff } from "@/lib/password-eye-icons";

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

const inputClass =
  "flex h-11 w-full rounded-sm border border-slate-200 bg-[#fafafa] px-3.5 py-2 text-sm text-[#1a2e2a] outline-none ring-offset-2 placeholder:text-slate-400 focus:border-[#2f4b45]/45 focus:ring-2 focus:ring-[#2f4b45]/15 disabled:opacity-50";

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export function SignInCard() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const dur = reduceMotion ? 0 : 0.45;

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isHovered, setIsHovered] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 403 && data?.phoneNumber) {
        sessionStorage.setItem("pendingPhone", data.phoneNumber);
        sessionStorage.setItem("requiresOTP", "true");
        router.push("/verify-otp");
        return;
      }

      if (!response.ok) {
        setError(data?.error || "Sign in failed. Try again.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthModalFrame
      eyebrow="Returning patient"
      title="Welcome back to your care record"
      subtitle="Access bookings, skin image uploads, prescriptions, and messages from your dermatology team—in one secure place."
      imageUrl="https://images.unsplash.com/photo-1516549655169-df83a077451b?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Bright, calm hospital corridor"
      highlights={[
        "Same credentials you used when you registered your phone",
        "Encrypted session; sign out on shared devices",
        "Need help? Our front desk line is on your appointment SMS",
      ]}
      supportText="Clinical hours: Mon–Fri 8am–5pm · Sat 8am–1pm · 0721-497-444"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#2f4b45]">
          Sign in
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#1a2e2a] sm:text-4xl">
          Patient access
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#5e5148]">
          Use the email and password for your NSC account.
        </p>

        {error ? (
          <div
            className="mt-5 rounded-sm border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-900"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-6">
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
            <SignInButton
              mode="modal"
              fallbackRedirectUrl="/auth/clerk-sync"
              signUpFallbackRedirectUrl="/auth/clerk-sync"
            >
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-sm border border-[#2a4540]/20 bg-white px-3 py-3 text-sm font-semibold text-[#1a2e2a] shadow-sm transition hover:border-[#2a4540]/35 hover:bg-[#f8fcfb]"
              >
                <Image
                  src="/auth/google.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 shrink-0"
                  aria-hidden
                />
                <span>Continue with Google</span>
              </button>
            </SignInButton>
          ) : (
            <button
              type="button"
              disabled
              title="Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
              className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-sm border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-xs font-medium text-slate-500"
            >
              <Image
                src="/auth/google.svg"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 shrink-0 opacity-40"
                aria-hidden
              />
              <span>Google sign-in — add Clerk keys to enable</span>
            </button>
          )}
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 font-medium uppercase tracking-wider text-[#6f5849]">
              Or continue with email
            </span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="nsc-email"
              className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#2f4b45]"
            >
              Email
            </label>
            <input
              id="nsc-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="nsc-password"
              className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#2f4b45]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="nsc-password"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={cn(inputClass, "pr-11")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 z-10 flex items-center rounded-sm pr-3 pl-2 text-[#2a4540]/55 transition hover:bg-[#f0f7f5] hover:text-[#2a4540]"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
              >
                {isPasswordVisible ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </button>
            </div>
          </div>

          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.008 }}
            whileTap={reduceMotion ? undefined : { scale: 0.99 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="pt-1"
          >
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "relative w-full overflow-hidden rounded-sm bg-[linear-gradient(165deg,#2f4b45_0%,#243a36_100%)] py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-sm transition hover:brightness-[1.03] disabled:opacity-50",
                isHovered && !reduceMotion ? "shadow-xl shadow-[#1a2e2a]/30" : "",
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? "Signing in…" : "Sign in"}
                <IconArrowRight className="h-4 w-4" />
              </span>
              {isHovered && !reduceMotion ? (
                <motion.span
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="pointer-events-none absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  style={{ filter: "blur(8px)" }}
                />
              ) : null}
            </button>
          </motion.div>

          <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-center text-sm sm:flex-row sm:justify-center sm:gap-8 sm:pt-6">
            <Link
              href="/reset-password"
              className="font-semibold text-[#2f4b45] underline-offset-2 hover:text-[#356b5f] hover:underline"
            >
              Forgot password?
            </Link>
            <Link
              href="/signup"
              className="font-semibold text-[#2f4b45] underline-offset-2 hover:text-[#356b5f] hover:underline"
            >
              New patient — register
            </Link>
          </div>
        </form>
      </motion.div>
    </AuthModalFrame>
  );
}

export default function TravelConnectSignIn() {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <SignInCard />
    </div>
  );
}
