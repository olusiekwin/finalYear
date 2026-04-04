"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import { glassCard, motionFadeUp, staggerContainer } from "@/lib/tailwind-patterns";

function HeroIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 420 420"
      fill="none"
    >
      <defs>
        <linearGradient id="nscStroke" x1="86" y1="60" x2="350" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7eb8a8" />
          <stop offset="0.45" stopColor="#2a4540" />
          <stop offset="1" stopColor="#b89585" />
        </linearGradient>
        <filter
          id="nscGlow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft floating orbs */}
      <circle cx="320" cy="138" r="18" fill="#5a9b8a" opacity="0.2" />
      <circle cx="120" cy="260" r="22" fill="#2a4540" opacity="0.16" />
      <circle
        cx="284"
        cy="250"
        r="9"
        fill="#7eb8a8"
        className="motion-safe:animate-pulse-soft motion-reduce:animate-none"
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      <circle
        cx="158"
        cy="158"
        r="7"
        fill="#2a4540"
        className="motion-safe:animate-pulse-soft motion-reduce:animate-none"
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />

      {/* Main “skin triage” contour */}
      <path
        className="motion-safe:animate-draw-path motion-reduce:[stroke-dashoffset:0]"
        style={{ strokeDasharray: 520, strokeDashoffset: 520 }}
        d="M120 215c26-70 80-110 133-110 44 0 73 24 83 54 10 30 5 65-18 96-21 29-52 43-84 57-45 20-74 45-87 75-10 22-48 16-56-9-6-20 2-44 7-63 7-28 15-55 22-99Z"
        stroke="url(#nscStroke)"
        strokeWidth="5"
        strokeLinecap="round"
        filter="url(#nscGlow)"
      />

      {/* Tech lines */}
      <path
        d="M90 290c35-22 74-33 118-30 46 3 92 20 132 48"
        stroke="rgba(90,155,138,0.55)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="10 10"
      />
      <path
        d="M105 140c28 12 56 17 86 14 36-3 70-16 102-39"
        stroke="rgba(42,69,64,0.45)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="10 10"
      />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? "h-4 w-4"}
    >
      <path
        d="M12 2.5l3.1 6.7 7.3 1.1-5.3 5.2 1.3 7.2-6.4-3.4-6.4 3.4 1.3-7.2-5.3-5.2 7.3-1.1L12 2.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Home() {
  const [isLoggedIn] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return !!localStorage.getItem("token");
  });

  const serviceHighlights: Array<{
    title: string;
    description: string;
    icon: ReactNode;
  }> = [
    {
      title: "AI Skin Triage",
      description:
        "Upload skin images for guided, structured pre-consult analysis before clinical review.",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
          <path
            d="M9.5 4.5c-2.2 1-3.8 3.2-3.8 5.7 0 2.3 1.3 4.3 3.2 5.4.4.2.6.7.5 1.1l-.5 2.4 2-1.1c.3-.2.7-.2 1 0l2 1.1-.5-2.4c-.1-.4.1-.9.5-1.1 1.9-1.1 3.2-3.1 3.2-5.4 0-2.5-1.6-4.7-3.8-5.7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 9.5h4M10 12h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "Specialist Bookings",
      description:
        "Schedule consultations with dermatology professionals and track every appointment in one place.",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
          <path
            d="M7 7h10v4a5 5 0 0 1-10 0V7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 7V5.8c0-1.2 1-2.3 3-2.3s3 1.1 3 2.3V7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 11v4M10 13h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "Pharmacy Follow-up",
      description:
        "Manage prescriptions and treatment continuity with connected medication workflows.",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
          <path
            d="M12 3v18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7 7h6.5a3.5 3.5 0 0 1 0 7H7V7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M18 13l2 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  const processSteps = [
    {
      title: "Create Your Secure Profile",
      text: "Sign up once and keep your dermatology records, images, and consultations organized.",
    },
    {
      title: "Upload And Get AI Guidance",
      text: "Use image upload with intelligent triage to speed up your clinical pathway.",
    },
    {
      title: "Consult, Treat, Track",
      text: "Book, pay, and review your progress from dashboard to pharmacy follow-up.",
    },
  ];

  return (
    <div className="overflow-x-hidden text-[#1c2c2a]">
      <section
        className={`relative isolate min-h-[min(100dvh,58rem)] overflow-hidden ${motionFadeUp}`}
      >
        <Image
          src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1800&q=80"
          alt="Clinical care team with patient"
          fill
          className="pointer-events-none absolute inset-0 z-0 object-cover opacity-[0.08]"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(165deg,#f4faf9_0%,#e8f2ef_45%,#f0f7f5_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_60%_at_10%_15%,rgba(94,160,145,0.16),transparent_50%),radial-gradient(ellipse_70%_50%_at_90%_30%,rgba(42,69,64,0.1),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(184,149,133,0.08),transparent_45%)]" />
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#5a9b8a]/14 blur-3xl sm:right-0 sm:h-80 sm:w-80" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-[#2a4540]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-[12.25rem] sm:px-6 sm:pb-24 sm:pt-[13rem] lg:px-8 lg:pb-28 lg:pt-[14rem]">
          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14">
            <div className="max-w-2xl space-y-7 lg:max-w-none">
              <div className="inline-flex items-center gap-2 rounded-sm border border-[#2a4540]/18 bg-white/80 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#356b5f] shadow-sm backdrop-blur-sm sm:text-xs">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5a9b8a]"
                  aria-hidden
                />
                Dermatology · Digital care · Nairobi
              </div>

              <div className="space-y-4">
                <h1 className="font-display text-[2.15rem] font-semibold leading-[1.1] tracking-tight text-[#14221f] sm:text-5xl sm:leading-tight lg:text-6xl xl:text-7xl">
                  Specialist skin care,
                  <span className="mt-2 block bg-gradient-to-r from-[#2a4540] via-[#356b5f] to-[#2a4540] bg-clip-text text-transparent lg:mt-0">
                    supported by thoughtful technology.
                  </span>
                </h1>
                <p className="max-w-xl text-[15px] leading-relaxed text-[#4a5c59] sm:text-base sm:leading-relaxed lg:text-lg">
                  Hospital-aligned workflows for Nairobi Skin Centre: secure
                  triage, dermatology bookings, and continuity from first
                  concern through treatment—without replacing your clinician.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/signup"
                      className="rounded-sm bg-[#2a4540] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-md shadow-[#1a2e2a]/20 transition hover:bg-[#1f3330]"
                    >
                      Start your journey
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-sm border border-[#2a4540]/35 bg-white/90 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-[#2a4540] shadow-sm backdrop-blur-sm transition hover:border-[#2a4540]/55 hover:bg-white"
                    >
                      Sign in
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/bookings/new"
                      className="rounded-sm bg-[#2a4540] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-md shadow-[#1a2e2a]/20 transition hover:bg-[#1f3330]"
                    >
                      Book consultation
                    </Link>
                    <Link
                      href="/dashboard"
                      className="rounded-sm border border-[#2a4540]/35 bg-white/90 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-[#2a4540] shadow-sm backdrop-blur-sm transition hover:border-[#2a4540]/55 hover:bg-white"
                    >
                      Open dashboard
                    </Link>
                  </>
                )}
              </div>

              <div className={`grid gap-3 sm:grid-cols-3 sm:gap-4 ${staggerContainer}`}>
                <div className="rounded-sm border border-[#2a4540]/12 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                  <p className="text-xl font-extrabold text-[#2a4540] sm:text-2xl">
                    8am–5pm
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5a6e6a]">
                    Mon–Fri clinical hours
                  </p>
                </div>
                <div className="rounded-sm border border-[#2a4540]/12 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                  <p className="text-xl font-extrabold text-[#2a4540] sm:text-2xl">
                    Two lines
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5a6e6a]">
                    0721 / 0780-497-444
                  </p>
                </div>
                <div className="rounded-sm border border-[#2a4540]/12 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:col-span-1">
                  <p className="text-xl font-extrabold text-[#2a4540] sm:text-2xl">
                    One platform
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5a6e6a]">
                    Triage · bookings · pharmacy
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
              <div className="relative aspect-[5/4] w-full sm:aspect-[4/3] lg:aspect-auto lg:min-h-[min(420px,50vh)]">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.95] sm:-inset-3 lg:-inset-4">
                  <HeroIllustration />
                </div>
                <div className="relative z-[1] flex h-full min-h-[280px] items-stretch sm:min-h-[300px] lg:min-h-0">
                  <div
                    className={`flex w-full flex-col justify-center rounded-sm border border-[#2a4540]/12 p-6 shadow-[0_20px_50px_-24px_rgba(26,46,42,0.25)] sm:p-7 ${glassCard}`}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#356b5f]">
                      Clinical snapshot
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#2a4540] sm:text-4xl">
                      Patient-first,
                      <span className="block text-[#4d7c70]">
                        dermatologist-led
                      </span>
                    </h2>
                    <div className="mt-5 space-y-2.5">
                      {[
                        "Structured intake before your dermatology consultation",
                        "Appointments, records, and billing in one secure place",
                        "Pharmacy and follow-up aligned with hospital practice",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 rounded-sm border border-[#2a4540]/10 bg-white/85 p-3"
                        >
                          <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-[#5a9b8a]" />
                          <p className="text-sm leading-snug text-[#4a5c59]">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className={`scroll-mt-28 bg-[#f4faf9] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 ${motionFadeUp}`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#356b5f] sm:text-xs">
              Core services
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-[#23342f] sm:text-4xl lg:text-[2.65rem]">
              Designed around real care journeys
            </h2>
          </div>

          <div className={`grid gap-5 sm:gap-6 md:grid-cols-3 ${staggerContainer}`}>
            {serviceHighlights.map((item) => (
              <article
                key={item.title}
                className="flex h-full flex-col rounded-xl border border-[#2a4540]/14 bg-white p-6 shadow-sm shadow-[#1a2e2a]/8 transition hover:-translate-y-0.5 hover:shadow-lg sm:p-7"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#2a4540] text-white">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#253632] sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#665b53]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`scroll-mt-28 bg-[#e8f2ef] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 ${motionFadeUp}`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#356b5f] sm:text-xs">
              Patient stories
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-[#23342f] sm:text-4xl lg:text-[2.65rem]">
              Care that feels calm and confident
            </h2>
          </div>

          <div className={`grid gap-5 sm:gap-6 md:grid-cols-3 ${staggerContainer}`}>
            {[
              {
                initials: "AN",
                name: "Anita N.",
                role: "Patient",
                image:
                  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
                quote:
                  "The triage flow helped me describe symptoms clearly before my visit. Booking felt straightforward.",
              },
              {
                initials: "JM",
                name: "John M.",
                role: "Patient",
                image:
                  "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=900&q=80",
                quote:
                  "I could track my follow-up and medication continuity in one place. It removed a lot of the back-and-forth during treatment.",
              },
              {
                initials: "EW",
                name: "Dr. Wanjiku",
                role: "Dermatologist",
                image:
                  "https://images.unsplash.com/photo-1612277795421-9bc7706a4a41?auto=format&fit=crop&w=900&q=80",
                quote:
                  "Patients arrive better prepared. The workflow supports faster intake and cleaner handoffs, while keeping the care human-first.",
              },
            ].map((t) => (
              <article
                key={t.name}
                className="flex h-full flex-col rounded-xl border border-[#2a4540]/12 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={t.image}
                    alt={`${t.name} testimonial portrait`}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-bold text-[#2a4540]">{t.name}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5a6e6a]">
                      {t.role}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-[#5a9b8a]">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#5f554d]">
                  {t.quote}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 ${motionFadeUp}`}
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-14">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#356b5f] sm:text-xs">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-[#22332e] sm:text-4xl lg:text-[2.65rem]">
              From concern to care—step by step
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#62564e] sm:text-[15px]">
              A clearer digital path: one profile, guided intake, then bookings
              and follow-up without losing context.
            </p>
          </div>

          <div className={`space-y-3 sm:space-y-4 ${staggerContainer}`}>
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-xl border border-[#2a4540]/12 bg-[#f8fcfb] p-4 shadow-sm sm:p-5"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#2a4540] text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2c3f3a]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#665b53]">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        className={`scroll-mt-28 bg-[#f4faf9] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 ${motionFadeUp}`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#356b5f] sm:text-xs">
              FAQ
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-[#22332e] sm:text-4xl lg:text-[2.65rem]">
              Quick answers before you book
            </h2>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {[
              {
                q: "Is the AI triage a replacement for a dermatologist?",
                a: "No. The AI triage helps structure your intake and highlight patterns, but clinical care always remains human-reviewed and dermatologist-led.",
              },
              {
                q: "How fast can I get started?",
                a: "Most patients can begin in minutes: create an account, upload images when needed, and proceed to bookings based on your care journey.",
              },
              {
                q: "Can I track treatment and pharmacy follow-up?",
                a: "Yes. Your dashboard keeps consultation history connected to follow-up steps, so medication continuity stays organized.",
              },
              {
                q: "Do I need special equipment to upload photos?",
                a: "No. Use a normal phone camera in good lighting. Clear images help the triage generate better structured guidance.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-[#2a4540]/14 bg-[#f8fcfb]/70 px-5 py-4 sm:px-6 sm:py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-[#2a4540]">
                    {item.q}
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#5a9b8a]/25 text-[#2a4540] transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#5f554d]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`px-4 py-14 sm:px-6 sm:py-16 lg:px-8 ${motionFadeUp}`}
      >
        <div className="mx-auto grid max-w-7xl gap-8 rounded-sm border border-[#2a4540]/25 bg-gradient-to-br from-[#1a2e2a] via-[#243d38] to-[#2a4540] p-7 text-white shadow-lg shadow-[#0f1c1a]/35 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d9b8a8]">
              Visit The Clinic
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
              Fortis Suites, Hospital Road, Nairobi
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[#ecdfd4]">
              Rm409, 4th Floor, Off Ngong Road, Opp Nairobi Club. Book digitally
              and continue treatment with in-person specialist care.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="tel:+254721497444"
              className="inline-flex justify-center rounded-sm bg-white px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.1em] text-[#2a4540] transition hover:bg-[#f0f7f5]"
            >
              0721-497-444
            </a>
            <a
              href="mailto:drwanyika14@gmail.com"
              className="inline-flex justify-center rounded-sm border border-white/45 px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-white/10"
            >
              Email clinic
            </a>
          </div>
        </div>
      </section>

      {!isLoggedIn && (
        <section
          className={`px-4 pb-16 pt-2 sm:px-6 lg:px-8 ${motionFadeUp}`}
        >
          <div className="mx-auto max-w-3xl rounded-sm border border-[#2a4540]/14 bg-gradient-to-b from-[#f4faf9] to-[#e4f0ed] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
            <h2 className="font-display text-3xl font-semibold text-[#263a35] sm:text-4xl">
              Start with one sign-up
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#675b53]">
              Create your profile, verify your phone by SMS, then use triage,
              bookings, and follow-up in one place.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex rounded-sm bg-[#2a4540] px-9 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-md shadow-[#1a2e2a]/25 transition hover:bg-[#1f3330]"
            >
              Create account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
