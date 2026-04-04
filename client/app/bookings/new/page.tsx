"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motionFadeUp } from "@/lib/tailwind-patterns";
import { apiUrl } from "@/lib/api";

export default function NewBookingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "09:00",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!formData.appointmentDate) {
      setError("Please select an appointment date");
      return;
    }

    setIsLoading(true);

    try {
      const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

      const response = await fetch(apiUrl("/bookings"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentDate: appointmentDateTime }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create booking");
        return;
      }

      router.push("/bookings");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section
          className={`mb-8 rounded-sm border border-[#2a4540]/12 bg-[#2a4540] p-8 text-white shadow-sm sm:p-10 ${motionFadeUp}`}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b8d4cc]">
            Schedule consultation
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
            Book an appointment
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#dce9e5]">
            Choose your preferred date and time for dermatologist consultation.
            Clinic hours align with Nairobi Skin Centre availability.
          </p>
        </section>

        <section
          className={`rounded-sm border border-[#2a4540]/10 bg-white p-8 shadow-sm sm:p-10 ${motionFadeUp}`}
        >
          {error && (
            <div className="mb-5 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-sm border border-[#2a4540]/10 bg-[#f8fcfb] p-4 text-sm text-[#5e5148]">
              Mon–Fri: 8.00a.m – 5.00p.m, Saturday: 8.00a.m – 1.00p.m.
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a2e2a]">
                  Appointment date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={today}
                  className="w-full rounded-sm border border-slate-200 bg-[#fafafa] px-4 py-3 text-[#1a2e2a] outline-none transition focus:border-[#2f4b45]/45 focus:ring-2 focus:ring-[#2f4b45]/12"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a2e2a]">
                  Appointment time
                </label>
                <select
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointmentTime: e.target.value,
                    })
                  }
                  className="w-full rounded-sm border border-slate-200 bg-[#fafafa] px-4 py-3 text-[#1a2e2a] outline-none transition focus:border-[#2f4b45]/45 focus:ring-2 focus:ring-[#2f4b45]/12"
                >
                  {[
                    "09:00",
                    "09:30",
                    "10:00",
                    "10:30",
                    "11:00",
                    "11:30",
                    "14:00",
                    "14:30",
                    "15:00",
                    "15:30",
                    "16:00",
                    "16:30",
                  ].map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a2e2a]">
                Additional notes (optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information for the dermatologist..."
                rows={4}
                className="w-full resize-none rounded-sm border border-slate-200 bg-[#fafafa] px-4 py-3 text-[#1a2e2a] outline-none transition focus:border-[#2f4b45]/45 focus:ring-2 focus:ring-[#2f4b45]/12"
              />
            </div>

            <div className="rounded-sm border border-slate-200/90 bg-[#fafcfb] p-4 text-sm text-[#5e5148]">
              {formData.appointmentDate ? (
                <p>
                  Booking:{" "}
                  {new Date(formData.appointmentDate).toLocaleDateString()} at{" "}
                  {formData.appointmentTime} · Estimated fee: KES 500
                </p>
              ) : (
                <p>Select date and time to preview booking summary.</p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-sm bg-[#2a4540] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#1f3330] disabled:opacity-60"
              >
                {isLoading ? "Booking…" : "Confirm booking"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-sm border border-[#2a4540]/25 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#2a4540] transition hover:bg-[#f8fcfb]"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
