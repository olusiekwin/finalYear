"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";

export function ClerkSyncInner() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const sessionToken = await getToken();
        if (!sessionToken) {
          if (!cancelled) {
            setMessage("Could not read your session. Try signing in again.");
          }
          return;
        }

        const res = await fetch(apiUrl("/auth/clerk-exchange"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (!cancelled) {
            setMessage(data?.error || "Could not complete sign-in.");
          }
          return;
        }

        if (data.token && data.user) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        if (!cancelled) {
          router.replace("/dashboard");
        }
      } catch {
        if (!cancelled) {
          setMessage("Something went wrong. Please try again.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken, router]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#5a9b8a]/35 border-t-[#2a4540]" />
      <p className="mt-6 max-w-md text-center text-sm text-[#5e5148]">
        {message}
      </p>
    </div>
  );
}
