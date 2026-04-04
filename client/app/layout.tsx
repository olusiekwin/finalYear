"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteChat } from "@/components/site-chat";
import { motionFadeUp } from "@/lib/tailwind-patterns";
import { Providers } from "@/app/providers";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/verify-otp" ||
    pathname?.startsWith("/reset-password");
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
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} scroll-smooth`}
    >
      <body
        className={`font-sans antialiased selection:bg-[rgba(90,155,138,0.22)] selection:text-[#14221f] ${
          isAuthRoute
            ? "min-h-dvh overflow-hidden bg-transparent text-[#1a2a32]"
            : "relative bg-background text-foreground"
        }`}
      >
        <Providers>
        {isAuthRoute ? (
          <div className="relative z-0 flex min-h-dvh flex-col bg-[#fdfbf7]">
            <div
              className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,rgba(197,108,74,0.07),transparent_55%),radial-gradient(ellipse_80%_60%_at_100%_100%,rgba(47,75,69,0.06),transparent_50%)]"
              aria-hidden
            />
            <div className="relative z-30 w-full shrink-0 bg-[#2a4540] px-4 py-2.5 text-[11px] leading-relaxed text-[#f8ede2] sm:px-6 sm:py-3 sm:text-sm">
              <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <p className="text-pretty">
                  Mon-Fri: 8.00a.m - 5.00p.m | Saturday: 8.00a.m - 1.00p.m
                </p>
                <p className="text-pretty sm:text-end">
                  Public Holidays: 9.00a.m - 3.00p.m | Call: 0721-497-444
                </p>
              </div>
            </div>
            <header className="relative z-30 w-full shrink-0 border-b border-[#e0d9d0] bg-[#fdfbf7]">
              <div className="relative mx-auto flex min-h-14 w-full max-w-7xl items-center px-4 py-2.5 sm:min-h-16 sm:px-6 lg:px-8">
                <Link
                  href="/"
                  className="relative z-10 flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br from-[#4d7c70] to-[#2a4540] text-sm font-bold text-white shadow-sm sm:h-10 sm:w-10 sm:text-base">
                    N
                  </div>
                  <div className="min-w-0 leading-tight">
                    <p className="truncate font-display text-base font-semibold text-[#1a2e2a] sm:text-lg">
                      Nairobi Skin Centre
                    </p>
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2a4540] sm:text-[11px] sm:tracking-[0.22em]">
                      Patient portal
                    </p>
                  </div>
                </Link>

                <p className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[min(52vw,18rem)] -translate-x-1/2 -translate-y-1/2 truncate text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[#6f5849]/90 sm:block md:w-[min(40vw,22rem)] lg:w-auto lg:max-w-md lg:whitespace-normal lg:tracking-[0.2em]">
                  Fortis Suites · Hospital Road · Nairobi
                </p>

                <nav
                  className="relative z-10 ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5"
                  aria-label="Auth navigation"
                >
                  <Link
                    href="/"
                    className="hidden rounded-sm px-3 py-2 text-xs font-semibold text-[#2a4540] transition hover:bg-[#f0ebe4]/80 sm:inline-block sm:text-sm"
                  >
                    Home
                  </Link>
                  {pathname !== "/login" ? (
                    <Link
                      href="/login"
                      className="rounded-sm border border-[#2a4540]/40 bg-white px-3 py-2 text-xs font-semibold text-[#2a4540] transition hover:border-[#2a4540] hover:bg-white sm:text-sm"
                    >
                      Sign in
                    </Link>
                  ) : null}
                  {pathname !== "/signup" ? (
                    <Link
                      href="/signup"
                      className="rounded-sm bg-[linear-gradient(165deg,#2a4540_0%,#1a2e2a_100%)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm"
                    >
                      Register
                    </Link>
                  ) : null}

                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#d4ccc4] bg-white text-[#1a2e2a] transition hover:border-[#2a4540]/35 sm:hidden"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-expanded={menuOpen}
                    aria-label="Open menu"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {menuOpen ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      )}
                    </svg>
                  </button>
                </nav>
              </div>

              {menuOpen ? (
                <div className="border-t border-[#e5ddd4] bg-[#faf8f5] px-4 py-3 sm:hidden">
                  <div className="mx-auto max-w-7xl space-y-1">
                    <Link
                      href="/"
                      className="block rounded-sm px-3 py-2.5 text-sm font-semibold text-[#1a2e2a] hover:bg-[#f0ebe4]"
                      onClick={() => setMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      href="/features"
                      className="block rounded-sm px-3 py-2.5 text-sm font-semibold text-[#1a2e2a] hover:bg-[#f0ebe4]"
                      onClick={() => setMenuOpen(false)}
                    >
                      Features
                    </Link>
                  </div>
                </div>
              ) : null}
            </header>

            <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fdfbf7]">
              {children}
            </main>
          </div>
        ) : (
          <>
            <div
              className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#f0f7f5] to-[#e2ece9]"
              aria-hidden
            />
            <div
              className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_88%_6%,rgba(90,155,138,0.14),transparent_28%),radial-gradient(circle_at_10%_85%,rgba(42,69,64,0.1),transparent_30%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none fixed inset-0 -z-10 opacity-80 motion-safe:animate-bg-drift bg-[length:100%_100%,100%_100%,420px_420px] bg-[radial-gradient(circle_at_18%_12%,rgba(94,160,145,0.1),transparent_42%),radial-gradient(circle_at_78%_32%,rgba(42,69,64,0.08),transparent_50%),repeating-linear-gradient(45deg,rgba(42,69,64,0.028)_0px,rgba(42,69,64,0.028)_1px,transparent_1px,transparent_12px)] motion-reduce:animate-none"
              aria-hidden
            />
            <header className="fixed left-0 right-0 top-0 z-50 w-full">
              <div className="w-full bg-[#2a4540] px-4 py-2.5 text-[11px] leading-relaxed text-[#f8ede2] sm:px-6 sm:py-3 sm:text-sm">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                  <p className="text-pretty">
                    Mon-Fri: 8.00a.m - 5.00p.m | Saturday: 8.00a.m - 1.00p.m
                  </p>
                  <p className="text-pretty sm:text-end">
                    Public Holidays: 9.00a.m - 3.00p.m | Call: 0721-497-444
                  </p>
                </div>
              </div>

              <div className="border-b border-[#2a4540]/12 bg-white/85 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                  <nav
                    aria-label="Primary navigation"
                    className="flex min-h-14 w-full items-center justify-between gap-3 rounded-sm border border-[#2a4540]/12 bg-[#fffcf9]/95 px-3 py-2 shadow-sm backdrop-blur-sm sm:min-h-16 sm:gap-4 sm:px-5"
                  >
                    <Link
                      href="/"
                      className="flex min-w-0 max-w-[min(100%,16rem)] shrink-0 items-center gap-2 sm:max-w-none sm:gap-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br from-[#4d7c70] to-[#2a4540] text-base font-bold text-white shadow-sm sm:h-11 sm:w-11 sm:text-lg">
                        N
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-display text-lg font-semibold leading-tight text-[#2a4540] sm:text-xl lg:text-2xl">
                          Nairobi Skin Centre
                        </p>
                        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8f6b57] sm:text-[11px] sm:tracking-[0.25em]">
                          AI Assistant
                        </p>
                      </div>
                    </Link>

                    <div className="hidden min-w-0 flex-1 items-center justify-center gap-4 px-2 lg:flex xl:gap-7">
                      {sharedLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="whitespace-nowrap text-xs font-semibold tracking-wide text-[#3b3731] transition hover:text-[#356b5f] xl:text-sm"
                        >
                          {link.label.toUpperCase()}
                        </Link>
                      ))}
                      {isLoggedIn &&
                        signedInLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="whitespace-nowrap text-xs font-semibold tracking-wide text-[#3b3731] transition hover:text-[#356b5f] xl:text-sm"
                          >
                            {link.label.toUpperCase()}
                          </Link>
                        ))}
                    </div>

                    <div className="hidden shrink-0 items-center gap-2 md:flex md:gap-3">
                      {!isLoggedIn ? (
                        <>
                          <Link
                            href="/login"
                            className="whitespace-nowrap rounded-sm border border-[#2a4540] px-3 py-2 text-xs font-semibold text-[#2a4540] transition hover:bg-[#2a4540]/5 sm:px-4 sm:text-sm"
                          >
                            Login
                          </Link>
                          <Link
                            href="/signup"
                            className="whitespace-nowrap rounded-sm bg-[#2a4540] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1f3330] sm:px-4 sm:text-sm"
                          >
                            Sign Up
                          </Link>
                        </>
                      ) : (
                        <>
                          <span className="max-w-[10rem] truncate text-xs font-medium text-[#6f5849] sm:max-w-44 sm:text-sm">
                            Welcome, {userName}
                          </span>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="whitespace-nowrap rounded-sm bg-[#f2dfcc] px-3 py-2 text-xs font-semibold text-[#694533] transition hover:bg-[#ecccaf] sm:px-4 sm:text-sm"
                          >
                            Logout
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#2a4540]/15 text-[#2a4540] transition hover:bg-[#2a4540]/5 md:hidden"
                      onClick={() => setMenuOpen(!menuOpen)}
                      aria-expanded={menuOpen}
                      aria-label="Toggle navigation menu"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {menuOpen ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        )}
                      </svg>
                    </button>
                  </nav>

                  {menuOpen ? (
                    <div
                      className={`mt-2 rounded-sm border border-[#2a4540]/15 bg-[#fffaf4]/98 p-4 shadow-sm backdrop-blur-sm md:hidden ${motionFadeUp}`}
                    >
                      <div className="space-y-1">
                        {sharedLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block rounded-sm px-3 py-2.5 text-sm font-semibold text-[#2a4540] hover:bg-[#dce9e5]/80"
                            onClick={() => setMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                        {isLoggedIn &&
                          signedInLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="block rounded-sm px-3 py-2.5 text-sm font-semibold text-[#2a4540] hover:bg-[#dce9e5]/80"
                              onClick={() => setMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                      </div>

                      <div className="mt-4 flex gap-3 border-t border-[#2a4540]/15 pt-4">
                        {!isLoggedIn ? (
                          <>
                            <Link
                              href="/login"
                              className="flex-1 rounded-sm border border-[#2a4540] px-4 py-2.5 text-center text-sm font-semibold text-[#2a4540]"
                              onClick={() => setMenuOpen(false)}
                            >
                              Login
                            </Link>
                            <Link
                              href="/signup"
                              className="flex-1 rounded-sm bg-[#2a4540] px-4 py-2.5 text-center text-sm font-semibold text-white"
                              onClick={() => setMenuOpen(false)}
                            >
                              Sign Up
                            </Link>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              handleLogout();
                              setMenuOpen(false);
                            }}
                            className="w-full rounded-sm bg-[#f2dfcc] px-4 py-2.5 text-sm font-semibold text-[#694533]"
                          >
                            Logout
                          </button>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </header>

            <main
              className={isHome ? "relative z-0 pt-0" : "pt-32 sm:pt-36"}
            >
              {children}
            </main>

            {!isAuthRoute ? <SiteChat /> : null}

            <footer
              className="mt-20 border-t border-[#2a4540]/12 bg-[#f0f7f5]"
              id="contact"
            >
              <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
                <div>
                  <h3 className="font-display text-3xl font-semibold text-[#2a4540]">
                    The Nairobi Skin Centre
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5e5148]">
                    AI-assisted dermatology platform designed to support
                    patients, dermatologists, and care teams with smarter triage
                    and better continuity.
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
                    Rm409, Fortis Suites, 4th Flr, Hospital Road, Off Ngong
                    Road, Opp Nairobi Club, Nairobi.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href="/features"
                      className="rounded-md bg-[#dce9e5] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#2a4540]"
                    >
                      Explore Features
                    </Link>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#2a4540]/15 px-4 py-5 text-center text-xs text-[#7f6d61]">
                &copy; 2026 Nairobi Skin Centre AI Platform. All rights
                reserved.
              </div>
            </footer>
          </>
        )}
        </Providers>
      </body>
    </html>
  );
}
