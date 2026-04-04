"use client";

import { useState } from "react";

export function SiteChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    window.setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <div
          className="flex w-[min(100vw-2.5rem,22rem)] flex-col overflow-hidden rounded-md border border-[#2a4540]/18 bg-[#f8fcfb]/96 shadow-[0_20px_50px_-20px_rgba(26,46,42,0.3)] backdrop-blur-md sm:w-[24rem]"
          role="dialog"
          aria-label="Chat with Nairobi Skin Centre"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-[#2a4540] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">NSC Care desk</p>
              <p className="text-[11px] text-white/75">
                Mon–Fri 8am–5pm · Sat 8am–1pm
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-sm p-1.5 text-white/90 transition hover:bg-white/15"
              aria-label="Close chat"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="max-h-64 space-y-3 overflow-y-auto px-4 py-4 text-sm">
            <div className="rounded-md bg-[#f4f0ea] px-3 py-2 text-[#4a423b]">
              <p className="font-semibold text-[#2a4540]">Front desk</p>
              <p className="mt-1 leading-relaxed">
                Hi — ask about bookings, hours, or getting started. For urgent
                medical concerns, please call{" "}
                <a href="tel:+254721497444" className="font-semibold underline">
                  0721-497-444
                </a>
                .
              </p>
            </div>
            {sent ? (
              <p className="text-center text-xs text-[#6f5849]">
                Thanks — we&apos;ll reply during business hours. For immediate
                help, use the number above.
              </p>
            ) : null}
          </div>
          <form
            onSubmit={handleSend}
            className="border-t border-[#2a4540]/10 p-3"
          >
            <label htmlFor="site-chat-msg" className="sr-only">
              Your message
            </label>
            <textarea
              id="site-chat-msg"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message…"
              className="mb-2 w-full resize-none rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-[#1c2c2a] outline-none placeholder:text-slate-400 focus:border-[#2a4540]/40 focus:ring-2 focus:ring-[#5a9b8a]/20"
            />
            <button
              type="submit"
              className="w-full rounded-sm bg-[#2a4540] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f3330]"
            >
              Send message
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2a4540] text-white shadow-lg shadow-[#1a2e2a]/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#5a9b8a] focus:ring-offset-2"
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        ) : (
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
