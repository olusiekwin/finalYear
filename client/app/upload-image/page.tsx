"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motionFadeUp, staggerContainer } from "@/lib/tailwind-patterns";
import { apiUrl } from "@/lib/api";

interface AnalysisResult {
  severityScore: number;
  condition: string;
  confidence: string;
  recommendations: string[];
}

export default function UploadImagePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      setError("Please select an image");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", fileInputRef.current.files[0]);

      const response = await fetch(
        apiUrl("/ai/analyze-image"),
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section
          className={`mb-8 rounded-sm border border-[#2a4540]/12 bg-[#2a4540] p-8 text-white shadow-sm sm:p-10 ${motionFadeUp}`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#dbb8a8]">
            AI Triage
          </p>
          <h1 className="mt-2 font-display text-5xl font-semibold">
            Skin Image Analysis
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#e8dbd2]">
            Upload a clear image to get AI-assisted triage signals before
            dermatologist consultation.
          </p>
        </section>

        {error && (
          <div className="mb-5 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className={`grid gap-6 md:grid-cols-2 ${staggerContainer}`}>
          <section className="rounded-sm border border-[#2a4540]/10 bg-white p-8 shadow-sm">
            <h2 className="font-display text-3xl font-semibold text-[#2b433d]">
              Upload Image
            </h2>
            <p className="mt-2 text-sm text-[#675b53]">
              Use a well-lit image focused on the affected skin area.
            </p>

            <div className="mt-5">
              {preview ? (
                <Image
                  src={preview}
                  alt="Selected skin preview"
                  width={1024}
                  height={768}
                  unoptimized
                  className="h-72 w-full rounded-2xl object-cover"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-72 w-full items-center justify-center rounded-sm border-2 border-dashed border-[#2a4540]/20 bg-[#f8fcfb] text-sm font-semibold text-[#5e5148]"
                >
                  Click to select an image
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 rounded-sm border border-[#2a4540]/25 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-[#2a4540] transition hover:bg-[#f8fcfb]"
              >
                Choose Image
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !preview}
                className="flex-1 rounded-sm bg-[#2a4540] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#1f3330] disabled:opacity-60"
              >
                {isLoading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </section>

          <section className="rounded-sm border border-[#2a4540]/10 bg-white p-8 shadow-sm">
            <h2 className="font-display text-3xl font-semibold text-[#2b433d]">
              Results
            </h2>

            {analysis ? (
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7468]">
                    Severity Score
                  </p>
                  <p className="mt-1 text-5xl font-extrabold text-[#2c433d]">
                    {analysis.severityScore}/10
                  </p>
                  <div className="mt-3 h-2 overflow-hidden rounded-sm bg-[#dce9e5]">
                    <div
                      className="h-full bg-[#356b5f]"
                      style={{
                        width: `${(analysis.severityScore / 10) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7468]">
                    Condition
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#2f4b45]">
                    {analysis.condition}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7468]">
                    Confidence
                  </p>
                  <p className="mt-1 text-xl font-semibold text-[#2f4b45]">
                    {(parseFloat(analysis.confidence) * 100).toFixed(0)}%
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7468]">
                    Recommendations
                  </p>
                  <ul className="mt-2 space-y-2">
                    {analysis.recommendations.map((recommendation) => (
                      <li
                        key={recommendation}
                        className="rounded-sm border border-slate-200 bg-[#fafcfb] px-3 py-2 text-sm text-[#5e5148]"
                      >
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-sm border border-dashed border-[#2a4540]/18 bg-[#f8fcfb] p-8 text-center text-sm text-[#5e5148]">
                Upload an image to view analysis results.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
