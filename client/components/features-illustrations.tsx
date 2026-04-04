"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ink = "#2a4540";
const mint = "#5a9b8a";
const warm = "#b89585";

/** Hero art: abstract clinical + digital layers with subtle motion */
export function FeaturesHeroIllustration() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-md"
      initial={false}
      animate={reduce ? { y: 0 } : { y: [0, -5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 320 280"
        className="h-auto w-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient
            id="featGrad"
            x1="40"
            y1="40"
            x2="280"
            y2="240"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={mint} stopOpacity="0.35" />
            <stop offset="0.5" stopColor={ink} stopOpacity="0.2" />
            <stop offset="1" stopColor={warm} stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <rect
          x="24"
          y="32"
          width="272"
          height="216"
          rx="3"
          stroke={ink}
          strokeOpacity="0.2"
          strokeWidth="1.5"
          fill="url(#featGrad)"
        />
        <path
          d="M48 88h224M48 120h160M48 152h200M48 184h128"
          stroke={ink}
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="6 8"
          className="motion-safe:animate-pulse-soft motion-reduce:animate-none"
          style={{
            animationDuration: "3.5s",
            transformOrigin: "center",
            transformBox: "fill-box",
          }}
        />
        <circle
          cx="248"
          cy="72"
          r="10"
          fill={mint}
          opacity="0.45"
          className="motion-safe:animate-pulse-soft motion-reduce:animate-none"
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
        />
        <circle
          cx="72"
          cy="200"
          r="6"
          fill={warm}
          opacity="0.5"
          className="motion-safe:animate-pulse-soft motion-reduce:animate-none"
          style={{
            animationDelay: "0.8s",
            transformOrigin: "center",
            transformBox: "fill-box",
          }}
        />
        <path
          className="motion-safe:animate-draw-path motion-reduce:[stroke-dashoffset:0]"
          style={{ strokeDasharray: 380, strokeDashoffset: 380 }}
          d="M200 200c-28-48-12-88 32-104 28-10 58 2 72 28 14 28 8 62-16 88-22 24-54 32-88 28"
          stroke={ink}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.35"
        />
        <rect
          x="56"
          y="56"
          width="72"
          height="56"
          rx="3"
          stroke={mint}
          strokeWidth="1.5"
          strokeOpacity="0.5"
          fill="white"
          fillOpacity="0.35"
        />
      </svg>
    </motion.div>
  );
}

function MiniWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      animate={reduce ? { scale: 1 } : { scale: [1, 1.03, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function FeatureMiniIllustration({
  index,
  className = "h-16 w-16 shrink-0",
}: {
  index: number;
  className?: string;
}) {
  const v = index % 6;
  return (
    <MiniWrapper className={className}>
      <svg
        viewBox="0 0 64 64"
        className="h-full w-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect
          x="6"
          y="6"
          width="52"
          height="52"
          rx="3"
          stroke={ink}
          strokeOpacity="0.18"
          strokeWidth="1.2"
          fill={`${mint}14`}
        />
        {v === 0 && (
          <>
            <circle
              cx="32"
              cy="30"
              r="14"
              stroke={mint}
              strokeWidth="2"
              strokeOpacity="0.55"
              className="motion-safe:animate-pulse-soft motion-reduce:animate-none"
              style={{ transformOrigin: "32px 30px", transformBox: "fill-box" }}
            />
            <path
              d="M22 44h20"
              stroke={ink}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.35"
            />
          </>
        )}
        {v === 1 && (
          <>
            <rect
              x="20"
              y="18"
              width="24"
              height="28"
              rx="2"
              stroke={mint}
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            <path
              d="M26 26h12M26 32h12M26 38h8"
              stroke={ink}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.3"
              className="motion-safe:animate-pulse-soft motion-reduce:animate-none"
              style={{ animationDuration: "2.8s" }}
            />
          </>
        )}
        {v === 2 && (
          <>
            <circle cx="22" cy="24" r="6" fill={mint} fillOpacity="0.35" />
            <circle cx="42" cy="24" r="6" fill={warm} fillOpacity="0.35" />
            <path
              d="M20 40h24"
              stroke={ink}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.35"
            />
            <path
              d="M32 28v10"
              stroke={mint}
              strokeWidth="1.5"
              strokeOpacity="0.45"
              strokeLinecap="round"
            />
          </>
        )}
        {v === 3 && (
          <>
            <path
              d="M22 40V24h8l4-6 4 6h8v16"
              stroke={mint}
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeOpacity="0.55"
            />
            <circle
              cx="44"
              cy="22"
              r="3"
              fill={warm}
              fillOpacity="0.6"
              className="motion-safe:animate-pulse-soft motion-reduce:animate-none"
              style={{ transformOrigin: "center", transformBox: "fill-box" }}
            />
          </>
        )}
        {v === 4 && (
          <>
            <rect
              x="22"
              y="20"
              width="20"
              height="26"
              rx="2"
              stroke={ink}
              strokeWidth="1.4"
              strokeOpacity="0.4"
            />
            <path
              d="M28 30h8M28 36h8"
              stroke={mint}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.5"
              className="motion-safe:animate-pulse-soft motion-reduce:animate-none"
            />
          </>
        )}
        {v === 5 && (
          <>
            <path
              d="M20 42h24M26 36h12M32 30v20"
              stroke={ink}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeOpacity="0.35"
            />
            <circle
              cx="32"
              cy="22"
              r="8"
              stroke={mint}
              strokeWidth="1.8"
              strokeOpacity="0.45"
              className="motion-safe:animate-pulse-soft motion-reduce:animate-none"
              style={{ transformOrigin: "32px 22px", transformBox: "fill-box" }}
            />
          </>
        )}
      </svg>
    </MiniWrapper>
  );
}
