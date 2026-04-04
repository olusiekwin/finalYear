"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motionFadeUp, staggerContainer } from "@/lib/tailwind-patterns";
import { apiUrl } from "@/lib/api";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

interface Booking {
  _id: string;
  appointment_date: string;
  severity_score: number | null;
  status: string;
  payment_status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    severityScore: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchBookings(token);
  }, [router]);

  const fetchBookings = async (token: string) => {
    try {
      const response = await fetch(apiUrl("/bookings"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      const bookingData = data.bookings || [];
      setBookings(bookingData);

      const total = bookingData.length;
      const pending = bookingData.filter(
        (b: Booking) => b.status === "pending",
      ).length;
      const completed = bookingData.filter(
        (b: Booking) => b.status === "completed",
      ).length;
      const avgSeverity =
        bookingData.length > 0
          ? Math.round(
              bookingData.reduce(
                (sum: number, b: Booking) => sum + (b.severity_score || 0),
                0,
              ) / bookingData.length,
            )
          : 0;

      setStats({
        totalBookings: total,
        pendingBookings: pending,
        completedBookings: completed,
        severityScore: avgSeverity,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRole = () => user?.role || "patient";

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#5a9b8a]/35 border-t-[#2a4540]" />
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section
          className={`rounded-sm border border-[#2a4540]/12 bg-[#2a4540] p-8 text-white shadow-sm sm:p-10 ${motionFadeUp}`}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b8d4cc]">
            Patient workspace
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Welcome, {user?.firstName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#dce9e5]">
            Track consultations, monitor progress, and manage your next
            skin-care steps from one dashboard.
          </p>
        </section>

        <section
          className={`mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${staggerContainer}`}
        >
          {[
            { label: "Total bookings", value: stats.totalBookings },
            { label: "Pending", value: stats.pendingBookings },
            { label: "Completed", value: stats.completedBookings },
            { label: "Avg severity", value: stats.severityScore },
          ].map((stat) => (
            <article
              key={stat.label}
              className="rounded-sm border border-[#2a4540]/10 bg-white p-6 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7a76]">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-[#1a2e2a] sm:text-4xl">
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-[#1a2e2a] sm:text-3xl">
            Quick actions
          </h2>
          <div
            className={`mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${staggerContainer}`}
          >
            {getUserRole() === "patient" && (
              <>
                <ActionCard
                  href="/bookings/new"
                  title="Book consultation"
                  description="Schedule a dermatologist appointment."
                />
                <ActionCard
                  href="/upload-image"
                  title="Analyze skin"
                  description="Upload an image for AI-supported triage."
                />
                <ActionCard
                  href="/pharmacy"
                  title="Pharmacy"
                  description="Review prescriptions and place orders."
                />
                <ActionCard
                  href="/profile"
                  title="My profile"
                  description="Update your details and contact info."
                />
              </>
            )}

            {getUserRole() === "dermatologist" && (
              <>
                <ActionCard
                  href="/dermatologist"
                  title="My patients"
                  description="Review appointments and active cases."
                />
                <ActionCard
                  href="/profile"
                  title="My profile"
                  description="Manage professional information."
                />
              </>
            )}

            {getUserRole() === "admin" && (
              <>
                <ActionCard
                  href="/admin"
                  title="Admin dashboard"
                  description="Monitor operations and platform metrics."
                />
                <ActionCard
                  href="/profile"
                  title="My profile"
                  description="Manage account and preferences."
                />
              </>
            )}
          </div>
        </section>

        <section
          className={`mt-10 rounded-sm border border-[#2a4540]/10 bg-white p-6 shadow-sm sm:p-8 ${motionFadeUp}`}
        >
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl font-semibold text-[#1a2e2a] sm:text-3xl">
              Recent consultations
            </h2>
            <Link
              href="/bookings"
              className="inline-flex w-fit items-center rounded-sm border border-[#2a4540]/25 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#2a4540] transition hover:bg-[#f8fcfb]"
            >
              View all
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-sm border border-dashed border-[#2a4540]/18 bg-[#f8fcfb] p-8 text-center">
              <p className="text-sm text-[#5e5148]">
                No consultations scheduled yet.
              </p>
              <Link
                href="/bookings/new"
                className="mt-4 inline-block rounded-sm bg-[#2a4540] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#1f3330]"
              >
                Schedule first consultation
              </Link>
            </div>
          ) : (
            <div className={`space-y-3 ${staggerContainer}`}>
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-col gap-3 rounded-sm border border-slate-200/90 bg-[#fafcfb] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#1a2e2a]">
                      {new Date(booking.appointment_date).toLocaleDateString()}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7a76]">
                      Status: {booking.status}
                    </p>
                  </div>
                  <div className="text-sm text-[#5e5148]">
                    Payment: {booking.payment_status}
                  </div>
                  <div className="text-sm font-semibold text-[#356b5f]">
                    Severity: {booking.severity_score ?? "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-sm border border-[#2a4540]/10 bg-[#f8fcfb] p-5 shadow-sm transition hover:border-[#2a4540]/22 hover:bg-white hover:shadow-md"
    >
      <h3 className="text-base font-semibold text-[#1a2e2a]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#5e5148]">
        {description}
      </p>
    </Link>
  );
}
