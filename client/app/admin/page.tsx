"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardSummary {
  bookings_today: number;
  revenue_today: number;
  pending_bookings: number;
  total_patients: number;
  total_dermatologists: number;
  sms_delivery_rate: string;
}

interface PersonRef {
  _id?: string;
  first_name?: string;
  last_name?: string;
}

interface Booking {
  _id: string;
  user_id?: PersonRef;
  dermatologist_id?: PersonRef;
  appointment_date: string;
  consultation_type: string;
  status: string;
  payment_status: string;
}

interface Transaction {
  _id: string;
  user_id?: PersonRef;
  amount: number;
  status: string;
  transaction_type: string;
  created_at: string;
}

interface SMSLog {
  _id: string;
  phone_number: string;
  delivery_status: string;
  reminder_type: string;
  sent_at: string;
}

type AdminTab = "overview" | "bookings" | "payments" | "sms" | "users";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const loadSummary = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/summary",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch summary");
        }

        const data: DashboardSummary = await response.json();
        setSummary(data);
        setError("");
      } catch {
        setError("Error loading dashboard summary");
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [token, router]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadTabData = async () => {
      if (activeTab === "overview" || activeTab === "users") {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        if (activeTab === "bookings") {
          const response = await fetch(
            `http://localhost:5000/api/admin/bookings?page=${page}&limit=10`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          if (!response.ok) {
            throw new Error("Failed to fetch bookings");
          }

          const data = await response.json();
          setBookings(data.bookings || []);
        }

        if (activeTab === "payments") {
          const response = await fetch(
            `http://localhost:5000/api/admin/payments?page=${page}&limit=10`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          if (!response.ok) {
            throw new Error("Failed to fetch transactions");
          }

          const data = await response.json();
          setTransactions(data.transactions || []);
        }

        if (activeTab === "sms") {
          const response = await fetch(
            `http://localhost:5000/api/admin/sms-logs?page=${page}&limit=10`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          if (!response.ok) {
            throw new Error("Failed to fetch SMS logs");
          }

          const data = await response.json();
          setSmsLogs(data.logs || []);
        }
      } catch {
        setError(`Error loading ${activeTab} data`);
      } finally {
        setIsLoading(false);
      }
    };

    loadTabData();
  }, [activeTab, page, token]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cancellationReason: "Cancelled by admin" }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? {
                ...b,
                status: "cancelled",
              }
            : b,
        ),
      );
    } catch {
      setError("Error cancelling booking");
    }
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="nsc-reveal rounded-[2rem] border border-[#c56c4a]/25 bg-gradient-to-r from-[#2f4b45] to-[#355a53] p-8 text-white sm:p-10">
          <Link
            href="/dashboard"
            className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4c9ba]"
          >
            Back to Dashboard
          </Link>
          <h1 className="mt-3 font-display text-5xl font-semibold">
            Admin Control Center
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#eaded5]">
            Manage bookings, payments, and communication metrics for Nairobi
            Skin Centre operations.
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-[#c56c4a]/20 bg-[#fff9f2] p-2">
          {(
            ["overview", "bookings", "payments", "sms", "users"] as AdminTab[]
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab
                  ? "bg-[#2f4b45] text-white"
                  : "text-[#6d5f55] hover:bg-[#f0e2d4]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <section className="nsc-stagger mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <LoadingBlock />
            ) : (
              <>
                <Metric
                  label="Today Bookings"
                  value={summary?.bookings_today ?? 0}
                />
                <Metric
                  label="Revenue Today"
                  value={`KES ${summary?.revenue_today ?? 0}`}
                />
                <Metric
                  label="Pending"
                  value={summary?.pending_bookings ?? 0}
                />
                <Metric label="Patients" value={summary?.total_patients ?? 0} />
                <Metric
                  label="Dermatologists"
                  value={summary?.total_dermatologists ?? 0}
                />
                <Metric
                  label="SMS Delivery"
                  value={summary?.sms_delivery_rate ?? "-"}
                />
              </>
            )}
          </section>
        )}

        {activeTab === "bookings" && (
          <section className="mt-7 space-y-3">
            {isLoading ? (
              <LoadingBlock />
            ) : bookings.length === 0 ? (
              <EmptyState text="No bookings found" />
            ) : (
              bookings.map((booking) => (
                <article
                  key={booking._id}
                  className="rounded-2xl border border-[#c56c4a]/20 bg-[#fffdf8] p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#2d423c]">
                        {booking.user_id?.first_name || "Patient"}{" "}
                        {booking.user_id?.last_name || ""}
                      </h3>
                      <p className="text-sm text-[#6d5f55]">
                        {new Date(booking.appointment_date).toLocaleString()}
                      </p>
                      <p className="text-sm text-[#6d5f55]">
                        With:{" "}
                        {booking.dermatologist_id?.first_name ||
                          "Dermatologist"}{" "}
                        {booking.dermatologist_id?.last_name || ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge tone="neutral">{booking.status}</Badge>
                      <Badge tone="ok">{booking.payment_status}</Badge>
                    </div>
                  </div>

                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="mt-4 rounded-full border border-[#b65946] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#b65946]"
                    >
                      Cancel Booking
                    </button>
                  )}
                </article>
              ))
            )}
          </section>
        )}

        {activeTab === "payments" && (
          <section className="mt-7 space-y-3">
            {isLoading ? (
              <LoadingBlock />
            ) : transactions.length === 0 ? (
              <EmptyState text="No transactions found" />
            ) : (
              transactions.map((tx) => (
                <article
                  key={tx._id}
                  className="rounded-2xl border border-[#c56c4a]/20 bg-[#fffdf8] p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#2d423c]">
                        {tx.user_id?.first_name || "User"}{" "}
                        {tx.user_id?.last_name || ""}
                      </h3>
                      <p className="text-sm text-[#6d5f55]">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-[#6d5f55]">
                        Type: {tx.transaction_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-[#2d423c]">
                        KES {tx.amount}
                      </p>
                      <Badge tone="ok">{tx.status}</Badge>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        )}

        {activeTab === "sms" && (
          <section className="mt-7 space-y-3">
            {isLoading ? (
              <LoadingBlock />
            ) : smsLogs.length === 0 ? (
              <EmptyState text="No SMS logs found" />
            ) : (
              smsLogs.map((log) => (
                <article
                  key={log._id}
                  className="rounded-2xl border border-[#c56c4a]/20 bg-[#fffdf8] p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#2d423c]">
                        {log.phone_number}
                      </h3>
                      <p className="text-sm text-[#6d5f55]">
                        Type: {log.reminder_type}
                      </p>
                      <p className="text-sm text-[#6d5f55]">
                        Sent: {new Date(log.sent_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      tone={
                        log.delivery_status === "delivered" ? "ok" : "neutral"
                      }
                    >
                      {log.delivery_status}
                    </Badge>
                  </div>
                </article>
              ))
            )}
          </section>
        )}

        {activeTab === "users" && (
          <section className="mt-7 rounded-2xl border border-dashed border-[#c56c4a]/30 bg-[#fff7ee] p-8 text-sm text-[#6d5f55]">
            User management controls can be plugged in here once backend
            endpoints are available.
          </section>
        )}

        {(["bookings", "payments", "sms"] as AdminTab[]).includes(
          activeTab,
        ) && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded-full border border-[#2f4b45] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2f4b45] disabled:opacity-40"
            >
              Previous
            </button>
            <span className="rounded-full bg-[#f2dfcc] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#6b4f3f]">
              Page {page}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-full border border-[#2f4b45] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2f4b45]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded-2xl border border-[#c56c4a]/20 bg-[#fffdf8] p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8b776a]">
        {label}
      </p>
      <p className="mt-2 text-4xl font-extrabold text-[#2d423c]">{value}</p>
    </article>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "ok" | "neutral";
}) {
  const cls =
    tone === "ok"
      ? "bg-[#e3f2e8] text-[#2a6a48]"
      : "bg-[#f2dfcc] text-[#6c4d3d]";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${cls}`}
    >
      {children}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#c56c4a]/30 bg-[#fff7ee] p-10 text-center text-sm text-[#6d5f55]">
      {text}
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="col-span-3 flex items-center justify-center py-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#c56c4a]/30 border-t-[#2f4b45]" />
    </div>
  );
}
