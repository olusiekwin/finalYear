"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isLoggedIn] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return !!localStorage.getItem("token");
  });

  const serviceHighlights = [
    {
      title: "AI Skin Triage",
      description:
        "Upload skin images for guided, structured pre-consult analysis before clinical review.",
      icon: "AI",
    },
    {
      title: "Specialist Bookings",
      description:
        "Schedule consultations with dermatology professionals and track every appointment in one place.",
      icon: "MD",
    },
    {
      title: "Pharmacy Follow-up",
      description:
        "Manage prescriptions and treatment continuity with connected medication workflows.",
      icon: "RX",
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
    <div className="text-[#2d2822]">
      <section className="nsc-reveal relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="absolute right-[-4rem] top-[-2rem] h-72 w-72 rounded-full bg-[#c56c4a]/20 blur-3xl" />
        <div className="absolute bottom-[-3rem] left-[-3rem] h-80 w-80 rounded-full bg-[#2f4b45]/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="nsc-fade-up space-y-8">
            <div className="inline-flex items-center rounded-full border border-[#c56c4a]/30 bg-[#fff5ea] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a45]">
              The Nairobi Skin Centre Platform
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-5xl font-semibold leading-tight text-[#1f2f2b] sm:text-6xl lg:text-7xl">
                Smarter Dermatology,
                <span className="block text-[#c56c4a]">
                  Rooted In Human Care.
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-[#5f554d] sm:text-lg">
                Built for patients and clinicians, NSC-AI combines efficient
                booking, AI-assisted skin triage, and continuity tools to
                deliver a more seamless care journey from first concern to
                follow-up.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/signup"
                    className="rounded-full bg-[#c56c4a] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#ad5d41]"
                  >
                    Start Your Journey
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-full border border-[#2f4b45] px-8 py-3 text-sm font-bold uppercase tracking-wider text-[#2f4b45] transition hover:bg-[#2f4b45]/5"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/bookings/new"
                    className="rounded-full bg-[#c56c4a] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#ad5d41]"
                  >
                    Book Consultation
                  </Link>
                  <Link
                    href="/dashboard"
                    className="rounded-full border border-[#2f4b45] px-8 py-3 text-sm font-bold uppercase tracking-wider text-[#2f4b45] transition hover:bg-[#2f4b45]/5"
                  >
                    Open Dashboard
                  </Link>
                </>
              )}
            </div>

            <div className="nsc-stagger grid max-w-2xl gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#c56c4a]/25 bg-[#fff9f2] p-4">
                <p className="text-2xl font-extrabold text-[#2f4b45]">
                  8am-5pm
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#826c60]">
                  Mon-Fri Care Window
                </p>
              </div>
              <div className="rounded-2xl border border-[#c56c4a]/25 bg-[#fff9f2] p-4">
                <p className="text-2xl font-extrabold text-[#2f4b45]">
                  2 Channels
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#826c60]">
                  0721-497-444 / 0780-497-444
                </p>
              </div>
              <div className="rounded-2xl border border-[#c56c4a]/25 bg-[#fff9f2] p-4">
                <p className="text-2xl font-extrabold text-[#2f4b45]">
                  One Platform
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#826c60]">
                  Bookings, AI, Pharmacy
                </p>
              </div>
            </div>
          </div>

          <div className="nsc-float relative">
            <div className="nsc-glass rounded-[2rem] p-7 shadow-2xl shadow-[#2f4b45]/10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9d6d57]">
                Clinic Snapshot
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold text-[#2f4b45]">
                Patient-First,
                <span className="block text-[#c56c4a]">Technology-Enabled</span>
              </h2>
              <div className="mt-6 space-y-3">
                {[
                  "AI-assisted intake before dermatologist consultation",
                  "Integrated appointment, payment, and profile history",
                  "Treatment continuity via pharmacy and follow-up tracking",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl bg-white/80 p-3"
                  >
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#c56c4a]" />
                    <p className="text-sm text-[#5f554d]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="nsc-reveal px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#936955]">
              Core Services
            </p>
            <h2 className="font-display text-5xl font-semibold text-[#23342f]">
              Designed Around Real Care Journeys
            </h2>
          </div>

          <div className="nsc-stagger grid gap-6 md:grid-cols-3">
            {serviceHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-[#c56c4a]/20 bg-[#fffdf9] p-7 shadow-md shadow-[#2f4b45]/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f4b45] text-sm font-bold tracking-widest text-white">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#253632]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#665b53]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="nsc-reveal bg-[#fff6ec] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#936955]">
              How It Works
            </p>
            <h2 className="mt-3 font-display text-5xl font-semibold text-[#22332e]">
              A Calm, Structured Path From Concern To Care
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#62564e]">
              We simplified the digital experience so every patient can navigate
              dermatology care with confidence, clarity, and timely specialist
              support.
            </p>
          </div>

          <div className="nsc-stagger space-y-4">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-2xl border border-[#c56c4a]/20 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#2f4b45] text-sm font-bold text-white">
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

      <section className="nsc-reveal px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#c56c4a]/25 bg-gradient-to-r from-[#2f4b45] to-[#355a53] p-8 text-white lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d9b8a8]">
              Visit The Clinic
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold">
              Fortis Suites, Hospital Road, Nairobi
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[#ecdfd4]">
              Rm409, 4th Floor, Off Ngong Road, Opp Nairobi Club. Book digitally
              and continue treatment with in-person specialist care.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+254721497444"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#2f4b45]"
            >
              0721-497-444
            </a>
            <a
              href="mailto:drwanyika14@gmail.com"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white"
            >
              Email Clinic
            </a>
          </div>
        </div>
      </section>

      {!isLoggedIn && (
        <section className="nsc-reveal px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#c56c4a]/25 bg-[#fff5ea] p-10 text-center">
            <h2 className="font-display text-5xl font-semibold text-[#263a35]">
              Start With One Sign Up
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#675b53]">
              Register in under a minute and unlock intelligent skin triage,
              specialist bookings, and connected treatment support.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-block rounded-full bg-[#c56c4a] px-10 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#ad5d41]"
            >
              Create Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
