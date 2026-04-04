/** Composable Tailwind class fragments (no custom CSS files). */

export const motionFadeUp =
  "motion-safe:animate-fade-up motion-reduce:animate-none motion-reduce:opacity-100";

export const glassCard =
  "border border-[#2a4540]/14 bg-[#f8fcfb]/82 backdrop-blur-md";

export const staggerContainer =
  [
    "[&>*:nth-child(1)]:motion-safe:animate-fade-up [&>*:nth-child(1)]:motion-safe:[animation-delay:50ms] [&>*:nth-child(1)]:motion-reduce:animate-none [&>*:nth-child(1)]:motion-reduce:opacity-100",
    "[&>*:nth-child(2)]:motion-safe:animate-fade-up [&>*:nth-child(2)]:motion-safe:[animation-delay:120ms] [&>*:nth-child(2)]:motion-reduce:animate-none [&>*:nth-child(2)]:motion-reduce:opacity-100",
    "[&>*:nth-child(3)]:motion-safe:animate-fade-up [&>*:nth-child(3)]:motion-safe:[animation-delay:190ms] [&>*:nth-child(3)]:motion-reduce:animate-none [&>*:nth-child(3)]:motion-reduce:opacity-100",
    "[&>*:nth-child(4)]:motion-safe:animate-fade-up [&>*:nth-child(4)]:motion-safe:[animation-delay:260ms] [&>*:nth-child(4)]:motion-reduce:animate-none [&>*:nth-child(4)]:motion-reduce:opacity-100",
    "[&>*:nth-child(5)]:motion-safe:animate-fade-up [&>*:nth-child(5)]:motion-safe:[animation-delay:330ms] [&>*:nth-child(5)]:motion-reduce:animate-none [&>*:nth-child(5)]:motion-reduce:opacity-100",
    "[&>*:nth-child(6)]:motion-safe:animate-fade-up [&>*:nth-child(6)]:motion-safe:[animation-delay:400ms] [&>*:nth-child(6)]:motion-reduce:animate-none [&>*:nth-child(6)]:motion-reduce:opacity-100",
  ].join(" ");
