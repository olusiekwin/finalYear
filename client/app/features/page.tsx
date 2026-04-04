"use client";

import {
  FeatureMiniIllustration,
  FeaturesHeroIllustration,
} from "@/components/features-illustrations";
import { motionFadeUp, staggerContainer } from "@/lib/tailwind-patterns";

export default function FeaturesPage() {
  const features = [
    {
      title: "AI-Assisted Dermatology Intake",
      description:
        "Capture and organize skin images with structured symptom context to support faster clinical review.",
      bullets: [
        "Guided upload flow",
        "Severity-oriented triage cues",
        "Consistent case documentation",
      ],
    },
    {
      title: "End-To-End Appointment Management",
      description:
        "Handle consultation booking, rescheduling, status tracking, and follow-up planning in one place.",
      bullets: [
        "Clear timeline visibility",
        "Urgency-aware booking workflow",
        "Booking history and updates",
      ],
    },
    {
      title: "Role-Based Clinical Workspace",
      description:
        "Support patients, dermatologists, and administrators with dedicated tools and focused dashboards.",
      bullets: [
        "Patient dashboard",
        "Dermatologist case view",
        "Admin operations panel",
      ],
    },
    {
      title: "Integrated Pharmacy Flow",
      description:
        "Connect prescriptions and medication follow-up to maintain continuity after consultation.",
      bullets: [
        "Medication requests",
        "Order tracking experience",
        "Treatment continuity",
      ],
    },
    {
      title: "Secure Authentication + OTP",
      description:
        "Protect account access using robust authentication and optional OTP verification for key onboarding steps.",
      bullets: [
        "Token-based sessions",
        "OTP verification support",
        "Protected routes",
      ],
    },
    {
      title: "Payments + Record Continuity",
      description:
        "Keep payment status, bookings, and profile records synchronized for clearer patient and clinic operations.",
      bullets: [
        "Payment status tracking",
        "Booking-linked records",
        "Operational transparency",
      ],
    },
  ];

  const faqs = [
    {
      q: "Is this a replacement for dermatologist consultation?",
      a: "No. The platform supports triage and workflow efficiency, while diagnosis and treatment remain clinician-led.",
    },
    {
      q: "Can patients use this entirely on mobile?",
      a: "Yes. Pages are optimized for mobile and desktop, including booking, login, and image upload flows.",
    },
    {
      q: "Does the platform support different user roles?",
      a: "Yes. Patients, dermatologists, and admins each have role-specific screens and capabilities.",
    },
  ];

  return (
    <div className="px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <section
          className={`rounded-sm border border-[#2a4540]/20 bg-gradient-to-r from-[#1e3330] to-[#2a4540] p-6 text-white sm:p-10 lg:p-12 ${motionFadeUp}`}
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_min(36%,20rem)] lg:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a8cfc4]">
                Platform overview
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Everything needed for modern skin care workflows
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#dce9e5] sm:text-base">
                From AI-guided intake to bookings, pharmacy follow-up, and
                role-based dashboards, NSC-AI supports The Nairobi Skin Centre
                with coordinated, patient-centered digital care.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[16rem] opacity-95 sm:max-w-[18rem] lg:max-w-none">
                <FeaturesHeroIllustration />
              </div>
            </div>
          </div>
        </section>

        <section
          className={`mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3 ${staggerContainer}`}
        >
          {features.map((feature, i) => (
            <article
              key={feature.title}
              className="rounded-sm border border-[#2a4540]/14 bg-[#f8fcfb] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-7"
            >
              <FeatureMiniIllustration
                index={i}
                className="mb-4 h-[4.5rem] w-[4.5rem] shrink-0"
              />
              <h2 className="text-lg font-bold text-[#1c2c2a] sm:text-xl">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#4a5c59]">
                {feature.description}
              </p>
              <ul className="mt-4 space-y-2">
                {feature.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-sm text-[#4a5c59]"
                  >
                    <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-[#5a9b8a]" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section
          className={`mt-12 rounded-sm border border-[#2a4540]/14 bg-[#e8f2ef] p-6 sm:p-8 ${motionFadeUp}`}
        >
          <h2 className="font-display text-2xl font-semibold text-[#1c2c2a] sm:text-3xl">
            Clinic context
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[#4a5c59]">
            Aligned to Nairobi Skin Centre: clinic hours, in-person
            dermatologist workflow, and digital channels for patients. It
            complements specialist care with clearer flow and traceability.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-sm border border-[#2a4540]/12 bg-white p-4 shadow-sm">
              <p className="text-xl font-extrabold text-[#2a4540] sm:text-2xl">
                8.00a.m - 5.00p.m
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5a6e6a]">
                Mon - Fri
              </p>
            </div>
            <div className="rounded-sm border border-[#2a4540]/12 bg-white p-4 shadow-sm">
              <p className="text-xl font-extrabold text-[#2a4540] sm:text-2xl">
                8.00a.m - 1.00p.m
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5a6e6a]">
                Saturday
              </p>
            </div>
            <div className="rounded-sm border border-[#2a4540]/12 bg-white p-4 shadow-sm">
              <p className="text-xl font-extrabold text-[#2a4540] sm:text-2xl">
                9.00a.m - 3.00p.m
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5a6e6a]">
                Public holidays
              </p>
            </div>
          </div>
        </section>

        <section className={`mx-auto mt-12 max-w-4xl ${motionFadeUp}`}>
          <h2 className="text-center font-display text-2xl font-semibold text-[#1c2c2a] sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className={`mt-6 space-y-3 ${staggerContainer}`}>
            {faqs.map((item) => (
              <article
                key={item.q}
                className="rounded-sm border border-[#2a4540]/12 bg-[#f8fcfb] p-5 sm:p-6"
              >
                <h3 className="text-base font-bold text-[#2a4540] sm:text-lg">
                  {item.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4a5c59]">
                  {item.a}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
