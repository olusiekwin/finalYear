"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motionFadeUp } from "@/lib/tailwind-patterns";
import { apiUrl } from "@/lib/api";

interface UserProfile {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchProfile(token);
  }, [router]);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch(apiUrl("/users/profile"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.user);
      setFormData({
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        phoneNumber: data.user.phone_number || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(apiUrl("/users/profile"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setProfile(data.user);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to update profile. Please try again.");
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
      <div className="mx-auto max-w-4xl">
        <section
          className={`mb-8 rounded-sm border border-[#2a4540]/12 bg-white p-8 shadow-sm sm:p-10 ${motionFadeUp}`}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#356b5f]">
            Profile
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-[#1a2e2a] sm:text-5xl">
            My account
          </h1>
          <p className="mt-2 text-sm text-[#5e5148]">
            Manage identity, contact details, and account information.
          </p>
        </section>

        {error && (
          <div className="mb-5 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-sm border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            {success}
          </div>
        )}

        {profile && (
          <section
            className={`rounded-sm border border-[#2a4540]/10 bg-white p-8 shadow-sm sm:p-10 ${motionFadeUp}`}
          >
            <div className="mb-8 flex flex-col gap-5 border-b border-slate-200/90 pb-8 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br from-[#4d7c70] to-[#2a4540] text-3xl font-semibold text-white">
                {profile.first_name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#1a2e2a]">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-sm text-[#5e5148]">{profile.email}</p>
                <p className="mt-1 text-xs text-[#6b7a76]">
                  Member since{" "}
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {!isEditing ? (
              <div className="space-y-5">
                <Field label="First name" value={profile.first_name} />
                <Field label="Last name" value={profile.last_name} />
                <Field label="Email" value={profile.email} />
                <Field
                  label="Phone number"
                  value={profile.phone_number || "Not provided"}
                />
                <Field label="Role" value={profile.role} />

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="mt-2 w-full rounded-sm bg-[#2a4540] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#1f3330]"
                >
                  Edit profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <Input
                  label="Phone number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="flex-1 rounded-sm bg-[#2a4540] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#1f3330]"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 rounded-sm border border-[#2a4540]/25 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#2a4540] transition hover:bg-[#f8fcfb]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7a76]">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-[#1a2e2a]">{value}</p>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1a2e2a]">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-sm border border-slate-200 bg-[#fafafa] px-4 py-3 text-[#1a2e2a] outline-none transition focus:border-[#2f4b45]/45 focus:ring-2 focus:ring-[#2f4b45]/12"
      />
    </div>
  );
}
