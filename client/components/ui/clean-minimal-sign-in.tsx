"use client";

import * as React from "react";
import { useState } from "react";

function IconLogIn({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconLock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconChrome({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconApple({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2c1.5 0 2.5 1 3 2.5-1.5.5-2.5 1.5-3 3-.5-1.5-1.5-2.5-3-3 .5-1.5 1.5-2.5 3-2.5z" />
      <path d="M9 7c-2 0-3.5 2-3.5 4.5 0 3 2 6.5 4 6.5 1 0 1.5-.5 2.5-.5s1.5.5 2.5.5c2 0 4-3.5 4-6.5C18.5 9 17 7 15 7c-.8 0-1.5.3-2 .5-.5-.2-1.2-.5-2-.5z" />
    </svg>
  );
}

const SignIn2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    alert("Sign in successful! (Demo)");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center rounded-xl bg-white">
      <div className="w-full max-w-sm border border-[#c56c4a]/20 bg-gradient-to-b from-[#f7efe6]/60 to-white p-8 text-black shadow-xl">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-white shadow-lg">
          <IconLogIn className="h-7 w-7 text-[#2f4b45]" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-[#1f2f2b]">
          Sign in with email
        </h2>
        <p className="mb-6 text-sm text-[#6b5e55]">
          Access your patient account, bookings and image history.
        </p>
        <div className="mb-2 flex w-full flex-col gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconMail className="h-4 w-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#2f4b45]/20"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconLock className="h-4 w-4" />
            </span>
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-10 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#2f4b45]/20"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full">
            {error && <div className="text-left text-sm text-red-500">{error}</div>}
          </div>
        </div>
        <button
          onClick={handleSignIn}
          className="mb-4 mt-2 w-full bg-gradient-to-b from-[#355a53] to-[#223934] py-2 font-medium text-white transition hover:brightness-105"
        >
          Get Started
        </button>
        <div className="my-2 flex w-full items-center">
          <div className="min-w-0 flex-1 border-t border-dashed border-gray-200" />
          <span className="mx-2 text-xs text-gray-400">Or sign in with</span>
          <div className="min-w-0 flex-1 border-t border-dashed border-gray-200" />
        </div>
        <div className="mt-2 flex w-full justify-center gap-3">
          <button
            type="button"
            className="flex h-12 grow items-center justify-center border bg-white transition hover:bg-gray-100"
          >
            <IconChrome className="h-5 w-5 text-[#2f4b45]" />
          </button>
          <button
            type="button"
            className="flex h-12 grow items-center justify-center border bg-white transition hover:bg-gray-100"
          >
            <IconFacebook className="h-5 w-5 text-[#2f4b45]" />
          </button>
          <button
            type="button"
            className="flex h-12 grow items-center justify-center border bg-white transition hover:bg-gray-100"
          >
            <IconApple className="h-5 w-5 text-[#2f4b45]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { SignIn2 };
