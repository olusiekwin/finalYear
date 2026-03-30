"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      const response = await fetch("http://localhost:5000/api/bookings", {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#c56c4a]/30 border-t-[#2f4b45]" />
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="nsc-reveal rounded-[2rem] border border-[#c56c4a]/25 bg-gradient-to-r from-[#2f4b45] to-[#355a53] p-8 text-white sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#dbb8a8]">
            Patient Workspace
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold">
            Welcome, {user?.firstName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#ecdfd4]">
            Track consultations, monitor progress, and manage your next
            skin-care steps from one dashboard.
          </p>
        </section>

        <section className="nsc-stagger mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Bookings", value: stats.totalBookings },
            { label: "Pending", value: stats.pendingBookings },
            { label: "Completed", value: stats.completedBookings },
            { label: "Avg Severity", value: stats.severityScore },
          ].map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-[#c56c4a]/20 bg-[#fffdf8] p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7468]">
                {stat.label}
              </p>
              <p className="mt-2 text-4xl font-extrabold text-[#29413b]">
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="font-display text-4xl font-semibold text-[#25403a]">
            Quick Actions
          </h2>
          <div className="nsc-stagger mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {getUserRole() === "patient" && (
              <>
                <ActionCard
                  href="/bookings/new"
                  title="Book Consultation"
                  description="Schedule a dermatologist appointment."
                />
                <ActionCard
                  href="/upload-image"
                  title="Analyze Skin"
                  description="Upload an image for AI-supported triage."
                />
                <ActionCard
                  href="/pharmacy"
                  title="Pharmacy"
                  description="Review prescriptions and place orders."
                />
                <ActionCard
                  href="/profile"
                  title="My Profile"
                  description="Update your details and contact info."
                />
              </>
            )}

            {getUserRole() === "dermatologist" && (
              <>
                <ActionCard
                  href="/dermatologist"
                  title="My Patients"
                  description="Review appointments and active cases."
                />
                <ActionCard
                  href="/profile"
                  title="My Profile"
                  description="Manage professional information."
                />
              </>
            )}

            {getUserRole() === "admin" && (
              <>
                <ActionCard
                  href="/admin"
                  title="Admin Dashboard"
                  description="Monitor operations and platform metrics."
                />
                <ActionCard
                  href="/profile"
                  title="My Profile"
                  description="Manage account and preferences."
                />
              </>
            )}
          </div>
        </section>

        <section className="nsc-reveal mt-10 rounded-3xl border border-[#c56c4a]/20 bg-[#fffdf8] p-7">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-3xl font-semibold text-[#25403a]">
              Recent Consultations
            </h2>
            <Link
              href="/bookings"
              className="rounded-full border border-[#2f4b45] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2f4b45]"
            >
              View All
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#c56c4a]/30 bg-[#fff4e9] p-8 text-center">
              <p className="text-sm text-[#6d6057]">
                No consultations scheduled yet.
              </p>
              <Link
                href="/bookings/new"
                className="mt-4 inline-block rounded-full bg-[#c56c4a] px-6 py-2 text-xs font-bold uppercase tracking-wider text-white"
              >
                Schedule First Consultation
              </Link>
            </div>
          ) : (
            <div className="nsc-stagger space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-col gap-3 rounded-2xl border border-[#c56c4a]/20 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#2e413c]">
                      {new Date(booking.appointment_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-[#86756a]">
                      Status: {booking.status}
                    </p>
                  </div>
                  <div className="text-sm text-[#5d534c]">
                    Payment: {booking.payment_status}
                  </div>
                  <div className="text-sm font-semibold text-[#2f4b45]">
                    Severity: {booking.severity_score ?? "-"}
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
      className="rounded-2xl border border-[#c56c4a]/20 bg-[#fff6ed] p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <h3 className="text-lg font-bold text-[#2d433d]">{title}</h3>
      <p className="mt-2 text-sm text-[#665b53]">{description}</p>
    </Link>
  );
}
