"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      const response = await fetch("http://localhost:5000/api/users/profile", {
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
      const response = await fetch("http://localhost:5000/api/users/profile", {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#c56c4a]/30 border-t-[#2f4b45]" />
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="nsc-reveal mb-8 rounded-[2rem] border border-[#c56c4a]/25 bg-[#fff6ec] p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9a6c56]">
            Profile
          </p>
          <h1 className="mt-2 font-display text-5xl font-semibold text-[#253b35]">
            My Account
          </h1>
          <p className="mt-2 text-sm text-[#62564e]">
            Manage identity, contact details, and account information.
          </p>
        </section>

        {error && (
          <div className="mb-5 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-300 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {profile && (
          <section className="nsc-reveal nsc-glass rounded-3xl p-8 sm:p-10">
            <div className="mb-8 flex flex-col gap-5 border-b border-[#c56c4a]/20 pb-8 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#c56c4a] to-[#8f4f35] text-3xl font-bold text-white">
                {profile.first_name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#2d433d]">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-sm text-[#665b53]">{profile.email}</p>
                <p className="text-xs text-[#86756a]">
                  Member since{" "}
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {!isEditing ? (
              <div className="space-y-5">
                <Field label="First Name" value={profile.first_name} />
                <Field label="Last Name" value={profile.last_name} />
                <Field label="Email" value={profile.email} />
                <Field
                  label="Phone Number"
                  value={profile.phone_number || "Not provided"}
                />
                <Field label="Role" value={profile.role} />

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 w-full rounded-full bg-[#c56c4a] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-[#c56c4a] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 rounded-full border border-[#2f4b45] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#2f4b45]"
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
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8b776a]">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-[#2d433d]">{value}</p>
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
      <label className="mb-2 block text-sm font-semibold text-[#354941]">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#c8b6a6] bg-white px-4 py-3 text-[#2d2a26] outline-none transition focus:border-[#2f4b45]"
      />
    </div>
  );
}
