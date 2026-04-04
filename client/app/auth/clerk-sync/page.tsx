"use client";

import dynamic from "next/dynamic";

const ClerkSyncInner = dynamic(
  () =>
    import("./clerk-sync-inner").then((m) => ({
      default: m.ClerkSyncInner,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#5a9b8a]/35 border-t-[#2a4540]" />
        <p className="mt-6 text-sm text-[#5e5148]">Loading…</p>
      </div>
    ),
  },
);

export default function ClerkSyncPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
        <p className="max-w-md text-center text-sm text-[#5e5148]">
          Google sign-in is not configured. Add{" "}
          <code className="rounded-sm bg-slate-100 px-1 py-0.5 text-xs">
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
          </code>{" "}
          to your environment.
        </p>
      </div>
    );
  }

  return <ClerkSyncInner />;
}
