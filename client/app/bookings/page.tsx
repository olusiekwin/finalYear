"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Booking {
  _id: string;
  appointment_date: string;
  severity_score: number | null;
  status: string;
  payment_status: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

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
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <section className="nsc-reveal mb-8 flex flex-col gap-5 rounded-[2rem] border border-[#c56c4a]/25 bg-[#fff6ec] p-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9a6c56]">
              Consultation Timeline
            </p>
            <h1 className="mt-2 font-display text-5xl font-semibold text-[#253b35]">
              My Bookings
            </h1>
            <p className="mt-2 text-sm text-[#645850]">
              Review every appointment, status, and payment update.
            </p>
          </div>
          <Link
            href="/bookings/new"
            className="rounded-full bg-[#c56c4a] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white"
          >
            New Booking
          </Link>
        </section>

        {bookings.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-[#c56c4a]/30 bg-[#fffdf8] p-12 text-center">
            <p className="text-sm text-[#6c6057]">
              No consultations scheduled yet.
            </p>
            <Link
              href="/bookings/new"
              className="mt-4 inline-block rounded-full border border-[#2f4b45] px-6 py-2 text-xs font-bold uppercase tracking-wider text-[#2f4b45]"
            >
              Create First Booking
            </Link>
          </section>
        ) : (
          <section className="nsc-stagger space-y-4">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="rounded-3xl border border-[#c56c4a]/20 bg-[#fffdf8] p-6"
              >
                <div className="grid gap-4 md:grid-cols-3 md:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#8a7468]">
                      Appointment
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#2b3f39]">
                      {new Date(booking.appointment_date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                    <p className="text-sm text-[#655951]">
                      {new Date(booking.appointment_date).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-full bg-[#f2dfcc] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#6f4d3c]">
                      {booking.status}
                    </span>
                    <span className="rounded-full bg-[#e5f4eb] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2b6e4d]">
                      {booking.payment_status}
                    </span>
                  </div>

                  <div className="text-sm text-[#5f544d] md:text-right">
                    <p>Severity: {booking.severity_score ?? "-"}</p>
                    <p className="mt-1 truncate">ID: {booking._id}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
