"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PatientRef {
  _id?: string;
  first_name?: string;
  last_name?: string;
}

interface Appointment {
  _id: string;
  user_id?: PatientRef;
  appointment_date: string;
  consultation_type: string;
  notes: string;
  status: string;
  is_urgent_slot: boolean;
  diagnosis_score?: number;
}

interface PatientHistory {
  _id: string;
  diagnoses: unknown[];
  prescriptions: unknown[];
  appointments: unknown[];
}

export default function DermatologistDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"today" | "urgent">("today");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [urgentCases, setUrgentCases] = useState<Appointment[]>([]);
  const [patientHistory, setPatientHistory] = useState<PatientHistory | null>(
    null,
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/api/dermatologist/schedule/today",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch schedule");
        }

        const data = await response.json();
        setAppointments(data.appointments || []);
      } catch {
        setError("Error loading schedule");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [token, router]);

  useEffect(() => {
    if (!token || activeTab !== "urgent") {
      return;
    }

    const loadUrgent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/api/dermatologist/urgent-cases",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch urgent cases");
        }

        const data = await response.json();
        setUrgentCases(data.cases || []);
      } catch {
        setError("Error loading urgent cases");
      } finally {
        setIsLoading(false);
      }
    };

    loadUrgent();
  }, [activeTab, token]);

  const fetchPatientHistory = async (appointmentId: string) => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/dermatologist/appointment/${appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointment details");
      }

      const data = await response.json();
      setSelectedAppointment(data.appointment);
      setPatientHistory(data.patientHistory);
      setError("");
    } catch {
      setError("Error loading patient history");
    }
  };

  const handleCompleteAppointment = async () => {
    if (!selectedAppointment || !token) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/dermatologist/appointment/${selectedAppointment._id}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notes: clinicalNotes }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to complete appointment");
      }

      setSelectedAppointment(null);
      setShowPrescriptionForm(false);
      setClinicalNotes("");
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === selectedAppointment._id
            ? {
                ...a,
                status: "completed",
              }
            : a,
        ),
      );
    } catch {
      setError("Error completing appointment");
    }
  };

  const handleIssuePrescription = async (
    medicationName: string,
    dosage: string,
    frequency: string,
  ) => {
    if (!selectedAppointment?.user_id?._id || !token) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/dermatologist/prescription/issue",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: selectedAppointment._id,
            user_id: selectedAppointment.user_id._id,
            medication_name: medicationName,
            dosage,
            frequency,
            duration: 7,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to issue prescription");
      }

      await fetchPatientHistory(selectedAppointment._id);
    } catch {
      setError("Error issuing prescription");
    }
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-[#c56c4a]/25 bg-gradient-to-r from-[#2f4b45] to-[#355a53] p-8 text-white sm:p-10">
          <Link
            href="/dashboard"
            className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4c9ba]"
          >
            Back to Dashboard
          </Link>
          <h1 className="mt-3 font-display text-5xl font-semibold">
            Clinical Workspace
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#eaded5]">
            Manage appointments, urgent triage cases, and prescription
            workflows.
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-7 flex gap-2 rounded-2xl border border-[#c56c4a]/20 bg-[#fff9f2] p-2">
          <button
            onClick={() => setActiveTab("today")}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider ${
              activeTab === "today"
                ? "bg-[#2f4b45] text-white"
                : "text-[#6d5f55]"
            }`}
          >
            Today Schedule
          </button>
          <button
            onClick={() => setActiveTab("urgent")}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider ${
              activeTab === "urgent"
                ? "bg-[#2f4b45] text-white"
                : "text-[#6d5f55]"
            }`}
          >
            Urgent Cases
          </button>
        </div>

        {isLoading ? (
          <div className="mt-8 flex items-center justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#c56c4a]/30 border-t-[#2f4b45]" />
          </div>
        ) : (
          <section className="mt-7 space-y-3">
            {activeTab === "today" &&
              (appointments.length === 0 ? (
                <Empty text="No appointments scheduled for today" />
              ) : (
                appointments.map((appointment) => (
                  <article
                    key={appointment._id}
                    className="cursor-pointer rounded-2xl border border-[#c56c4a]/20 bg-[#fffdf8] p-5"
                    onClick={() => fetchPatientHistory(appointment._id)}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#2d423c]">
                          {appointment.user_id?.first_name || "Patient"}{" "}
                          {appointment.user_id?.last_name || ""}
                        </h3>
                        <p className="text-sm text-[#6d5f55]">
                          {new Date(
                            appointment.appointment_date,
                          ).toLocaleTimeString()}{" "}
                          | {appointment.consultation_type}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Pill>{appointment.status}</Pill>
                        {appointment.is_urgent_slot && (
                          <Pill tone="danger">urgent</Pill>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              ))}

            {activeTab === "urgent" &&
              (urgentCases.length === 0 ? (
                <Empty text="No urgent cases at this time" />
              ) : (
                urgentCases.map((caseItem) => (
                  <article
                    key={caseItem._id}
                    className="cursor-pointer rounded-2xl border border-red-300/40 bg-red-50/40 p-5"
                    onClick={() => fetchPatientHistory(caseItem._id)}
                  >
                    <h3 className="text-lg font-semibold text-[#7d3428]">
                      {caseItem.user_id?.first_name || "Patient"}{" "}
                      {caseItem.user_id?.last_name || ""}
                    </h3>
                    <p className="text-sm text-[#8e4f45]">
                      Severity score: {caseItem.diagnosis_score ?? "-"}/10
                    </p>
                  </article>
                ))
              ))}
          </section>
        )}

        {selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-4 md:items-center md:justify-end">
            <div className="w-full max-w-md rounded-3xl bg-white p-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-3xl font-semibold text-[#2d423c]">
                  Patient Detail
                </h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-2xl text-[#7e6659]"
                >
                  ×
                </button>
              </div>

              {patientHistory && (
                <div className="mb-5 rounded-2xl border border-[#c56c4a]/20 bg-[#fff7ee] p-4 text-sm text-[#655951]">
                  <p>
                    Previous appointments: {patientHistory.appointments.length}
                  </p>
                  <p>Prescriptions: {patientHistory.prescriptions.length}</p>
                </div>
              )}

              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8b776a]">
                Clinical Notes
              </label>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[#c8b6a6] px-3 py-2 text-sm outline-none focus:border-[#2f4b45]"
              />

              {!showPrescriptionForm ? (
                <button
                  onClick={() => setShowPrescriptionForm(true)}
                  className="mt-4 w-full rounded-full border border-[#2f4b45] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2f4b45]"
                >
                  Issue Prescription
                </button>
              ) : (
                <PrescriptionForm
                  onSubmit={handleIssuePrescription}
                  onCancel={() => setShowPrescriptionForm(false)}
                />
              )}

              <button
                onClick={handleCompleteAppointment}
                className="mt-3 w-full rounded-full bg-[#c56c4a] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"
              >
                Complete Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PrescriptionForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (medicationName: string, dosage: string, frequency: string) => void;
  onCancel: () => void;
}) {
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");

  return (
    <div className="mt-4 space-y-2">
      <input
        type="text"
        placeholder="Medication name"
        value={medication}
        onChange={(e) => setMedication(e.target.value)}
        className="w-full rounded-xl border border-[#c8b6a6] px-3 py-2 text-sm outline-none focus:border-[#2f4b45]"
      />
      <input
        type="text"
        placeholder="Dosage"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        className="w-full rounded-xl border border-[#c8b6a6] px-3 py-2 text-sm outline-none focus:border-[#2f4b45]"
      />
      <input
        type="text"
        placeholder="Frequency"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full rounded-xl border border-[#c8b6a6] px-3 py-2 text-sm outline-none focus:border-[#2f4b45]"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSubmit(medication, dosage, frequency)}
          className="flex-1 rounded-full bg-[#2f4b45] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
        >
          Add
        </button>
        <button
          onClick={onCancel}
          className="flex-1 rounded-full border border-[#2f4b45] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2f4b45]"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "danger";
}) {
  const cls =
    tone === "danger"
      ? "bg-red-100 text-red-700"
      : "bg-[#f2dfcc] text-[#6d4f3f]";
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${cls}`}
    >
      {children}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#c56c4a]/30 bg-[#fff7ee] p-10 text-center text-sm text-[#6d5f55]">
      {text}
    </div>
  );
}
