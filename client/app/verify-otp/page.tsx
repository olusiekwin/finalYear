"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthModalFrame } from "@/components/ui/auth-modal-frame";
import { apiUrl } from "@/lib/api";

function formatPhoneDisplay(digits: string) {
  if (digits.startsWith("254") && digits.length >= 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ··· ${digits.slice(-3)}`;
  }
  return digits;
}

export default function VerifyOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [requiresOTP, setRequiresOTP] = useState(false);

  useEffect(() => {
    const pendingPhone = sessionStorage.getItem("pendingPhone");
    const requiresOTPFlag = sessionStorage.getItem("requiresOTP");

    if (!pendingPhone || requiresOTPFlag !== "true") {
      router.push("/signup");
      return;
    }

    setPhoneNumber(pendingPhone);
    setRequiresOTP(true);
  }, [router]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiUrl("/auth/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "OTP verification failed");
        return;
      }

      setSuccess("Verified. Redirecting to your dashboard…");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.removeItem("pendingPhone");
      sessionStorage.removeItem("requiresOTP");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl("/auth/resend-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Resend failed");
        return;
      }

      setSuccess("A new code was sent to your phone.");
      setResendCountdown(60);
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!requiresOTP) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center">
        <div
          className="h-10 w-10 animate-pulse rounded-full bg-[#dce8ef] ring-4 ring-[#dce8ef]/5"
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <AuthModalFrame
        eyebrow="Identity check"
        title="Confirm your mobile number"
        subtitle={`Enter the 6-digit code we sent to ${formatPhoneDisplay(phoneNumber)}. This matches hospital SMS reminders for appointments.`}
        imageUrl="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Clinical care environment"
        highlights={[
          "Codes expire in minutes—request a new one if needed",
          "Never share your code with anyone calling you unexpectedly",
          "After verification you can sign in with email and password",
        ]}
        supportText="Front desk & appointments: 0721-497-444 during clinic hours."
      >
        {error ? (
          <div
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-900"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-900">
            {success}
          </div>
        ) : null}

        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#4a7c6f]">
          SMS verification
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-[#142c38] sm:text-4xl">
          One-time code
        </h2>

        <form onSubmit={handleOTPSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="otp-input"
              className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#1e4556]"
            >
              6-digit code
            </label>
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              placeholder="• • • • • •"
              className="w-full rounded-xl border border-[#c5d4de] bg-[#fcfbfa] px-4 py-4 text-center font-mono text-2xl tracking-[0.45em] text-[#142c38] outline-none focus:border-[#4a7c6f] focus:ring-2 focus:ring-[#4a7c6f]/20"
            />
            <p className="mt-2 text-xs text-[#5a7a8a]">
              From the SMS titled verification or Nairobi Skin Centre.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full rounded-xl bg-[linear-gradient(165deg,#4a7c6f_0%,#3a6358_100%)] px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-[#2d4f45]/22 transition hover:brightness-[1.03] disabled:opacity-50"
          >
            {isLoading ? "Verifying…" : "Verify & continue"}
          </button>
        </form>

        <div className="mt-6 border-t border-[#dce8ef] pt-6 text-center">
          <p className="text-sm text-[#3d5a66]">Did not receive a code?</p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendCountdown > 0 || isLoading}
            className="mt-2 text-sm font-semibold text-[#1e4556] underline-offset-2 hover:text-[#4a7c6f] hover:underline disabled:text-[#8aa0ad] disabled:no-underline"
          >
            {resendCountdown > 0
              ? `Resend in ${resendCountdown}s`
              : "Resend SMS code"}
          </button>

          <p className="mt-4 text-xs text-[#5a7a8a]">
            Wrong number?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#1e4556] hover:text-[#4a7c6f] hover:underline"
            >
              Start registration again
            </Link>
          </p>
        </div>
      </AuthModalFrame>
    </div>
  );
}
