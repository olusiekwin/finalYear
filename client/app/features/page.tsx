"use client";

export default function FeaturesPage() {
  const features = [
    {
      icon: "01",
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
      icon: "02",
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
      icon: "03",
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
      icon: "04",
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
      icon: "05",
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
      icon: "06",
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
        <section className="nsc-reveal rounded-[2rem] border border-[#c56c4a]/25 bg-gradient-to-r from-[#2f4b45] to-[#355a53] p-8 text-white sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e4c2b2]">
            Platform Overview
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">
            Everything Needed For Modern Skin Care Workflows
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#e9dbd0] sm:text-base">
            From AI-guided intake to bookings, pharmacy follow-up, and
            role-based dashboards, NSC-AI was designed to help The Nairobi Skin
            Centre deliver coordinated, patient-centered digital care.
          </p>
        </section>

        <section className="nsc-stagger mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-[#c56c4a]/20 bg-[#fffdf8] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2dfcc] text-sm font-extrabold text-[#815640]">
                {feature.icon}
              </div>
              <h2 className="text-xl font-bold text-[#273b35]">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#665b53]">
                {feature.description}
              </p>
              <ul className="mt-4 space-y-2">
                {feature.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-sm text-[#5f554d]"
                  >
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#c56c4a]" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="nsc-reveal mt-14 rounded-[2rem] border border-[#c56c4a]/25 bg-[#fff6ec] p-8 sm:p-10">
          <h2 className="font-display text-4xl font-semibold text-[#23352f]">
            Clinic Context
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[#61564f]">
            This system is aligned to the Nairobi Skin Centre service context,
            including clinic hours, in-person dermatologist workflow, and
            digital support channels for patients. It is meant to complement
            specialist care with better flow and traceability.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#c56c4a]/20 bg-white p-4">
              <p className="text-2xl font-extrabold text-[#2f4b45]">
                8.00a.m - 5.00p.m
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#836f63]">
                Mon - Fri
              </p>
            </div>
            <div className="rounded-2xl border border-[#c56c4a]/20 bg-white p-4">
              <p className="text-2xl font-extrabold text-[#2f4b45]">
                8.00a.m - 1.00p.m
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#836f63]">
                Saturday
              </p>
            </div>
            <div className="rounded-2xl border border-[#c56c4a]/20 bg-white p-4">
              <p className="text-2xl font-extrabold text-[#2f4b45]">
                9.00a.m - 3.00p.m
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#836f63]">
                Public Holidays
              </p>
            </div>
          </div>
        </section>

        <section className="nsc-reveal mx-auto mt-14 max-w-4xl">
          <h2 className="text-center font-display text-4xl font-semibold text-[#243631]">
            Frequently Asked Questions
          </h2>
          <div className="nsc-stagger mt-6 space-y-4">
            {faqs.map((item) => (
              <article
                key={item.q}
                className="rounded-2xl border border-[#c56c4a]/20 bg-[#fffdf9] p-6"
              >
                <h3 className="text-lg font-bold text-[#2d3f39]">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#665b53]">
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
