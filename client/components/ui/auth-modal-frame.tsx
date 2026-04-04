"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useId } from "react";

/** Subtle medical cross rhythm — institutional, not decorative noise */
function ClinicalGridBg() {
  const pid = useId().replace(/:/g, "");
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.11]"
      aria-hidden
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={`nsc-plus-${pid}`}
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M24 14v20M14 24h20"
              fill="none"
              stroke="#142c38"
              strokeWidth="1.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#nsc-plus-${pid})`} />
      </svg>
    </div>
  );
}

type AuthModalFrameProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  highlights: string[];
  supportText?: string;
  children: ReactNode;
};

export function AuthModalFrame({
  eyebrow,
  title,
  subtitle,
  imageUrl,
  imageAlt,
  highlights,
  supportText,
  children,
}: AuthModalFrameProps) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col bg-[#fdfbf7] lg:grid lg:grid-cols-2">
      {/* Form column — full height, scroll inside */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fdfbf7]">
        <ClinicalGridBg />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/90 to-transparent" />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overscroll-contain px-6 py-8 sm:px-10 sm:py-10 lg:px-8 lg:py-12">
          <div className="w-full max-w-[420px] text-center">
            <div className="text-left">{children}</div>
            <p className="mt-10 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[#8f6b57]/90">
              Secure connection · Patient data protected
            </p>
          </div>
        </div>
      </div>

      {/* Visual column — desktop only, full bleed height */}
      <div className="relative hidden min-h-0 lg:block lg:border-l lg:border-[#2f4b45]/12">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover opacity-50"
          sizes="55vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2f4b45] via-[#243d38] to-[#1a2e2a]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#2f4b45] to-transparent opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(197,108,74,0.1),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[length:180px_180px] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.5)_2px,rgba(255,255,255,0.5)_3px)]" />

        <div className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-8 overflow-y-auto overscroll-contain p-9 xl:p-11">
          <header className="shrink-0 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#c8ddd4] xl:text-[11px]">
              {eyebrow}
            </p>
            <h1 className="max-w-lg font-display text-[1.85rem] font-semibold leading-[1.12] text-white xl:text-[2.35rem] xl:leading-[1.1]">
              {title}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/88">
              {subtitle}
            </p>
          </header>

          <ul className="flex min-h-0 flex-1 flex-col justify-center gap-2.5">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-sm border border-white/10 bg-black/25 px-3.5 py-2.5 text-sm leading-snug text-[#f4faf8] backdrop-blur-md"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c56c4a]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {supportText ? (
            <p className="shrink-0 rounded-sm border border-white/12 bg-black/30 px-3.5 py-2.5 text-xs leading-relaxed text-[#eef4f1]/95 backdrop-blur-md">
              {supportText}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
