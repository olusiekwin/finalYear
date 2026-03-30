"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber, otp }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "OTP verification failed");
        return;
      }

      setSuccess("OTP verified successfully. Redirecting...");
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
      const response = await fetch(
        "http://localhost:5000/api/auth/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Resend failed");
        return;
      }

      setSuccess("OTP sent to your phone number");
      setResendCountdown(60);
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!requiresOTP) {
    return null;
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <section className="nsc-reveal rounded-[2rem] border border-[#c56c4a]/25 bg-gradient-to-r from-[#2f4b45] to-[#355a53] p-8 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#dbb8a8]">
            Security Verification
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold">
            Verify Phone Number
          </h1>
          <p className="mt-2 text-sm text-[#e9ddd4]">
            Enter the 6-digit code sent to {phoneNumber}.
          </p>
        </section>

        <section className="nsc-reveal nsc-glass mt-6 rounded-3xl p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-300 bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleOTPSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#354941]">
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                placeholder="000000"
                className="w-full rounded-xl border border-[#c8b6a6] bg-white px-4 py-4 text-center font-mono text-2xl tracking-[0.35em] text-[#2d2a26] outline-none focus:border-[#2f4b45]"
              />
              <p className="mt-2 text-xs text-[#7e6e63]">
                Use the code from your SMS message.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full rounded-full bg-[#c56c4a] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-60"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-6 border-t border-[#c56c4a]/20 pt-5 text-center">
            <p className="text-sm text-[#675b53]">Did not receive a code?</p>
            <button
              onClick={handleResendOTP}
              disabled={resendCountdown > 0 || isLoading}
              className="mt-2 text-sm font-semibold text-[#2f4b45] disabled:text-[#a7988d]"
            >
              {resendCountdown > 0
                ? `Resend in ${resendCountdown}s`
                : "Resend OTP"}
            </button>

            <p className="mt-4 text-xs text-[#7d6c61]">
              Wrong number?{" "}
              <Link href="/signup" className="font-semibold text-[#2f4b45]">
                Create new account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
