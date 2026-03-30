"use client";

import Link from "next/link";
import { useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return !!localStorage.getItem("token");
  });
  const [userName] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const user = localStorage.getItem("user");
    if (!user) {
      return "";
    }

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.firstName || parsedUser.email || "";
    } catch {
      return "";
    }
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const sharedLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
  ];

  const signedInLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/bookings", label: "Bookings" },
  ];

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="text-[#2c2924]">
          <header className="sticky top-0 z-50 border-b border-[#c56c4a]/20 bg-[#fffaf4]/80 backdrop-blur">
            <div className="bg-[#2f4b45] px-4 py-2 text-xs text-[#f8ede2] sm:text-sm">
              <div className="mx-auto flex max-w-7xl flex-col justify-between gap-1 sm:flex-row sm:gap-4">
                <p>Mon-Fri: 8.00a.m - 5.00p.m | Saturday: 8.00a.m - 1.00p.m</p>
                <p>Public Holidays: 9.00a.m - 3.00p.m | Call: 0721-497-444</p>
              </div>
            </div>

            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#c56c4a] to-[#8f4f35] text-lg font-bold text-white shadow-lg shadow-[#c56c4a]/35">
                  N
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold leading-none text-[#2f4b45]">
                    Nairobi Skin Centre
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8f6b57]">
                    AI Assistant
                  </p>
                </div>
              </Link>

              <div className="hidden items-center gap-7 md:flex">
                {sharedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-semibold tracking-wide text-[#3b3731] transition hover:translate-y-[-1px] hover:text-[#c56c4a]"
                  >
                    {link.label.toUpperCase()}
                  </Link>
                ))}
                {isLoggedIn &&
                  signedInLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-semibold tracking-wide text-[#3b3731] transition hover:translate-y-[-1px] hover:text-[#c56c4a]"
                    >
                      {link.label.toUpperCase()}
                    </Link>
                  ))}
              </div>

              <div className="hidden items-center gap-3 md:flex">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/login"
                      className="rounded-full border border-[#2f4b45] px-5 py-2 text-sm font-semibold text-[#2f4b45] transition hover:translate-y-[-1px] hover:bg-[#2f4b45]/5"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-full bg-[#c56c4a] px-5 py-2 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-[#a8583b]"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="max-w-44 truncate text-sm font-medium text-[#6f5849]">
                      Welcome, {userName}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="rounded-full bg-[#f2dfcc] px-5 py-2 text-sm font-semibold text-[#694533] transition hover:translate-y-[-1px] hover:bg-[#ecccaf]"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>

              <button
                className="text-[#2f4b45] md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </nav>

            {menuOpen && (
              <div className="nsc-fade-up border-t border-[#c56c4a]/20 bg-[#fff7ee] px-4 py-4 md:hidden">
                <div className="space-y-2">
                  {sharedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#2f4b45] hover:bg-[#f2dfcc]/60"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isLoggedIn &&
                    signedInLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#2f4b45] hover:bg-[#f2dfcc]/60"
                      >
                        {link.label}
                      </Link>
                    ))}
                </div>

                <div className="mt-4 flex gap-3 border-t border-[#c56c4a]/20 pt-4">
                  {!isLoggedIn ? (
                    <>
                      <Link
                        href="/login"
                        className="flex-1 rounded-full border border-[#2f4b45] px-4 py-2 text-center text-sm font-semibold text-[#2f4b45]"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="flex-1 rounded-full bg-[#c56c4a] px-4 py-2 text-center text-sm font-semibold text-white"
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-full bg-[#f2dfcc] px-4 py-2 text-sm font-semibold text-[#694533]"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            )}
          </header>

          <main>{children}</main>

          <footer
            className="mt-20 border-t border-[#c56c4a]/20 bg-[#fff8f0]"
            id="contact"
          >
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
              <div>
                <h3 className="font-display text-3xl font-semibold text-[#2f4b45]">
                  The Nairobi Skin Centre
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5e5148]">
                  AI-assisted dermatology platform designed to support patients,
                  dermatologists, and care teams with smarter triage and better
                  continuity.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#7c5d4c]">
                  Business Hours
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-[#5e5148]">
                  <li>Mon - Fri: 8.00a.m - 5.00p.m</li>
                  <li>Saturday: 8.00a.m - 1.00p.m</li>
                  <li>Sunday: Closed</li>
                  <li>Public Holidays: 9.00a.m - 3.00p.m</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#7c5d4c]">
                  Contact
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-[#5e5148]">
                  <li>0721-497-444</li>
                  <li>0780-497-444</li>
                  <li>drwanyika14@gmail.com</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#7c5d4c]">
                  Location
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-[#5e5148]">
                  Rm409, Fortis Suites, 4th Flr, Hospital Road, Off Ngong Road,
                  Opp Nairobi Club, Nairobi.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href="/features"
                    className="rounded-full bg-[#f2dfcc] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#6a4d3d]"
                  >
                    Explore Features
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-t border-[#c56c4a]/20 px-4 py-5 text-center text-xs text-[#7f6d61]">
              &copy; 2026 Nairobi Skin Centre AI Platform. All rights reserved.
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
