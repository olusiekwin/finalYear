export function apiUrl(path: string): string {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  ).replace(/\/$/, "");
  const sub = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api${sub}`;
}

/** Match backend Kenya-style normalization for OTP session storage. */
export function sanitizePhoneNumber(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = "254" + digits.slice(1);
  }
  return digits;
}
