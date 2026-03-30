"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

      const response = await fetch("http://localhost:5000/api/bookings", {
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
        <section className="nsc-reveal mb-8 rounded-[2rem] border border-[#c56c4a]/25 bg-gradient-to-r from-[#2f4b45] to-[#355a53] p-8 text-white sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#dbb8a8]">
            Schedule Consultation
          </p>
          <h1 className="mt-2 font-display text-5xl font-semibold">
            Book An Appointment
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#e9ddd4]">
            Choose your preferred date and time for dermatologist consultation.
            Clinic hours align with Nairobi Skin Centre availability.
          </p>
        </section>

        <section className="nsc-reveal nsc-glass rounded-3xl p-8 sm:p-10">
          {error && (
            <div className="mb-5 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-[#c56c4a]/20 bg-[#fff6ed] p-4 text-sm text-[#5d524a]">
              Mon-Fri: 8.00a.m - 5.00p.m, Saturday: 8.00a.m - 1.00p.m.
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#354941]">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={today}
                  className="w-full rounded-xl border border-[#c8b6a6] bg-white px-4 py-3 text-[#2d2a26] outline-none transition focus:border-[#2f4b45]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#354941]">
                  Appointment Time
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
                  className="w-full rounded-xl border border-[#c8b6a6] bg-white px-4 py-3 text-[#2d2a26] outline-none transition focus:border-[#2f4b45]"
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
              <label className="mb-2 block text-sm font-semibold text-[#354941]">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information for the dermatologist..."
                rows={4}
                className="w-full resize-none rounded-xl border border-[#c8b6a6] bg-white px-4 py-3 text-[#2d2a26] outline-none transition focus:border-[#2f4b45]"
              />
            </div>

            <div className="rounded-2xl border border-[#c56c4a]/20 bg-white p-4 text-sm text-[#5f544d]">
              {formData.appointmentDate ? (
                <p>
                  Booking:{" "}
                  {new Date(formData.appointmentDate).toLocaleDateString()} at{" "}
                  {formData.appointmentTime} | Estimated fee: KES 500
                </p>
              ) : (
                <p>Select date and time to preview booking summary.</p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-full bg-[#c56c4a] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#ad5d41] disabled:opacity-60"
              >
                {isLoading ? "Booking..." : "Confirm Booking"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-full border border-[#2f4b45] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#2f4b45]"
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
