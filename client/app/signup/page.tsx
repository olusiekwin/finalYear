"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthModalFrame } from "@/components/ui/auth-modal-frame";
import { apiUrl, sanitizePhoneNumber } from "@/lib/api";
import { IconEye, IconEyeOff } from "@/lib/password-eye-icons";

const STEPS = [
  { id: 1, label: "Your name" },
  { id: 2, label: "Contact" },
  { id: 3, label: "Security" },
] as const;

const fieldClass =
  "w-full rounded-sm border border-slate-200 bg-[#fafafa] px-4 py-3 text-[15px] text-[#1a2e2a] outline-none transition placeholder:text-slate-400 focus:border-[#2f4b45]/45 focus:ring-2 focus:ring-[#2f4b45]/15";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#2f4b45]";

const btnPrimary =
  "w-full rounded-sm bg-[linear-gradient(165deg,#2f4b45_0%,#243a36_100%)] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-sm transition hover:brightness-[1.03] disabled:opacity-55";

const btnSecondary =
  "w-full rounded-sm border border-[#2f4b45]/35 bg-white px-4 py-3 text-sm font-semibold text-[#2f4b45] transition hover:bg-[#f8fcfb]";

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Please enter your first and last name.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!formData.phoneNumber?.trim()) {
      setError("Please enter your phone number for SMS verification.");
      return false;
    }
    const digits = sanitizePhoneNumber(formData.phoneNumber);
    if (!digits) {
      setError("Please enter a valid phone number.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must include at least one uppercase letter.");
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must include at least one number.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const goNext = () => {
    setError("");
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const goBack = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateStep3()) return;

    const phoneDigits = sanitizePhoneNumber(formData.phoneNumber);
    if (!phoneDigits) {
      setError("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiUrl("/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phoneNumber: formData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      if (data.requiresOTP) {
        sessionStorage.setItem("pendingPhone", phoneDigits);
        sessionStorage.setItem("requiresOTP", "true");
        router.push("/verify-otp");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <AuthModalFrame
        eyebrow="New patient registration"
        title="Build your care profile in minutes"
        subtitle="Use the same email and phone you will use for appointments. We send a one-time SMS code to verify your number before you can sign in."
        imageUrl="https://images.unsplash.com/photo-1584516150909-c43483ee793e?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Hospital care and patient support"
        highlights={[
          "One profile for bookings, uploads, and treatment history",
          "Structured intake so visits start with context",
          "SMS verification to protect your account",
        ]}
        supportText="Questions while registering? Call 0721-497-444 during business hours."
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#2f4b45]">
          Create account
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#1a2e2a] sm:text-4xl">
          Join the platform
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#5e5148]">
          Step {step} of {STEPS.length} — {STEPS[step - 1].label}
        </p>

        <nav
          className="mt-5 flex gap-2"
          aria-label="Registration progress"
        >
          {STEPS.map((s, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <div key={s.id} className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div
                  className={`h-1.5 rounded-sm transition-colors ${
                    done || active ? "bg-[#2f4b45]" : "bg-slate-200"
                  } ${active ? "ring-2 ring-[#2f4b45]/25 ring-offset-2 ring-offset-[#fdfbf7]" : ""}`}
                  aria-hidden
                />
                <span
                  className={`truncate text-[10px] font-semibold uppercase tracking-wider ${
                    active ? "text-[#2f4b45]" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </nav>

        {error ? (
          <div
            className="mt-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <form
          onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}
          className="mt-6 space-y-4"
        >
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="su-first" className={labelClass}>
                    First name
                  </label>
                  <input
                    id="su-first"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="John"
                    autoComplete="given-name"
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="su-last" className={labelClass}>
                    Last name
                  </label>
                  <input
                    id="su-last"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="Doe"
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <button type="button" onClick={goNext} className={btnPrimary}>
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="su-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="su-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="su-phone" className={labelClass}>
                  Phone (SMS code)
                </label>
                <input
                  id="su-phone"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="0721 497 444"
                  autoComplete="tel"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-row-reverse">
                <button type="button" onClick={goNext} className={`${btnPrimary} sm:flex-1`}>
                  Continue
                </button>
                <button type="button" onClick={goBack} className={`${btnSecondary} sm:flex-1`}>
                  Back
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm text-[#5e5148]">
                Use at least 8 characters, one uppercase letter, and one
                number.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="su-pass" className={labelClass}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="su-pass"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={cn(fieldClass, "pr-11")}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 z-10 flex items-center rounded-sm pr-3 pl-2 text-[#2a4540]/55 transition hover:bg-[#f0f7f5] hover:text-[#2a4540]"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <IconEyeOff size={18} />
                      ) : (
                        <IconEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="su-pass2" className={labelClass}>
                    Confirm
                  </label>
                  <div className="relative">
                    <input
                      id="su-pass2"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={cn(fieldClass, "pr-11")}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 z-10 flex items-center rounded-sm pr-3 pl-2 text-[#2a4540]/55 transition hover:bg-[#f0f7f5] hover:text-[#2a4540]"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <IconEyeOff size={18} />
                      ) : (
                        <IconEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-row-reverse">
                <button type="submit" disabled={isLoading} className={`${btnPrimary} sm:flex-1`}>
                  {isLoading ? "Creating account…" : "Create account"}
                </button>
                <button
                  type="button"
                  onClick={goBack}
                  disabled={isLoading}
                  className={`${btnSecondary} sm:flex-1`}
                >
                  Back
                </button>
              </div>
            </>
          )}
        </form>

        <p className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-[#5e5148]">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#2f4b45] underline-offset-2 hover:text-[#356b5f] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </AuthModalFrame>
    </div>
  );
}
