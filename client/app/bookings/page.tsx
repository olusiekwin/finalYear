"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motionFadeUp, staggerContainer } from "@/lib/tailwind-patterns";
import { apiUrl } from "@/lib/api";

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
      const response = await fetch(apiUrl("/bookings"), {
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#5a9b8a]/35 border-t-[#2a4540]" />
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section
          className={`mb-8 flex flex-col gap-5 rounded-sm border border-[#2a4540]/12 bg-white p-8 shadow-sm sm:flex-row sm:items-end sm:justify-between ${motionFadeUp}`}
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#356b5f]">
              Consultation timeline
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-[#1a2e2a] sm:text-5xl">
              My bookings
            </h1>
            <p className="mt-2 text-sm text-[#5e5148]">
              Review every appointment, status, and payment update.
            </p>
          </div>
          <Link
            href="/bookings/new"
            className="inline-flex items-center justify-center rounded-sm bg-[#2a4540] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#1f3330]"
          >
            New booking
          </Link>
        </section>

        {bookings.length === 0 ? (
          <section className="rounded-sm border border-dashed border-[#2a4540]/18 bg-[#f8fcfb] p-12 text-center">
            <p className="text-sm text-[#5e5148]">
              No consultations scheduled yet.
            </p>
            <Link
              href="/bookings/new"
              className="mt-4 inline-block rounded-sm border border-[#2a4540]/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#2a4540] transition hover:bg-white"
            >
              Create first booking
            </Link>
          </section>
        ) : (
          <section className={`space-y-4 ${staggerContainer}`}>
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="rounded-sm border border-[#2a4540]/10 bg-white p-6 shadow-sm"
              >
                <div className="grid gap-4 md:grid-cols-3 md:items-center">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7a76]">
                      Appointment
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#1a2e2a]">
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
                    <p className="text-sm text-[#5e5148]">
                      {new Date(booking.appointment_date).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-sm bg-[#eef6f3] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2a4540]">
                      {booking.status}
                    </span>
                    <span className="rounded-sm bg-[#e8f3ef] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#356b5f]">
                      {booking.payment_status}
                    </span>
                  </div>

                  <div className="text-sm text-[#5e5148] md:text-right">
                    <p>Severity: {booking.severity_score ?? "—"}</p>
                    <p className="mt-1 truncate font-mono text-xs text-[#6b7a76]">
                      ID: {booking._id}
                    </p>
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
