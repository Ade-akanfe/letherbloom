"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [fetchedCode, setFetchedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found. Please contact support.");
      setIsLoading(false);
      return;
    }

    const fetchCode = async () => {
      try {
        const res = await fetch(`/api/get-code?session_id=${sessionId}`, { cache: "no-store" });
        const data = await res.json();

        if (data.code) {
          setFetchedCode(data.code);
          setIsLoading(false);
        } else {
          // Code not found yet, likely webhook delay
          if (retryCount < 10) {
            setTimeout(() => {
              setRetryCount((prev) => prev + 1);
            }, 2000); // Retry every 2 seconds
          } else {
            // Stop retrying after 10 attempts (20 seconds)
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error("Error fetching code:", err);
        if (retryCount < 10) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 2000);
        } else {
          setIsLoading(false);
        }
      }
    };

    fetchCode();
  }, [sessionId, retryCount]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navigation />
      <main className="flex flex-1 flex-col items-center justify-center p-4 my-10">
        <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-zinc-100 animate-in fade-in zoom-in duration-500">
          {/* Header Section */}
          <div
            className={`px-8 py-10 text-center text-white ${fetchedCode
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-rose-400 to-rose-500"
              }`}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              {fetchedCode ? (
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {fetchedCode ? "Payment Successful!" : "Finalizing Order..."}
            </h1>
            <p
              className={`mt-2 opacity-90 ${fetchedCode ? "text-green-50" : "text-zinc-300"
                }`}
            >
              {fetchedCode
                ? "You're all set to join the live session."
                : "Securely generating your access code."}
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-10 flex flex-col items-center">
            {isLoading && !fetchedCode && (
              <div className="text-center py-6">
                <p className="text-zinc-500 animate-pulse">
                  Please wait while we confirm your payment and generate your
                  unique access code...
                </p>
              </div>
            )}

            {!isLoading && !fetchedCode && (
              <div className="text-center">
                <p className="text-zinc-600 mb-4">
                  We verified your payment, but your code is taking a bit longer
                  to generate. Please check your email{" "}
                  <strong>{searchParams.get("email")}</strong> in a few minutes.
                </p>
                <Link
                  href="/live-training"
                  className="text-rose-600 font-semibold hover:underline"
                >
                  Go to Live Training Login
                </Link>
              </div>
            )}

            {fetchedCode && (
              <>
                <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Your Access Code
                </p>
                <div className="relative group w-full mb-8">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
                  <div className="relative w-full bg-zinc-50 border border-zinc-200 rounded-xl p-6 text-center">
                    <p className="text-4xl font-mono font-bold text-zinc-900 tracking-widest break-all select-all">
                      {fetchedCode}
                    </p>
                    <p className="text-xs text-zinc-400 mt-2">
                      A copy has been sent to your email
                    </p>
                  </div>
                </div>

                <Link
                  href={`/live-training?code=${fetchedCode}`}
                  className="w-full group relative flex items-center justify-center overflow-hidden rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-green-200 transition-all duration-300 hover:bg-green-700 hover:shadow-green-300 hover:-translate-y-0.5"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Go to Live Training
                    <svg
                      className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>
              </>
            )}

            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
          </div>

          {/* Footer */}
          <div className="bg-zinc-50 px-8 py-4 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-400">
              Need help?{" "}
              <a
                href="mailto:support@letherbloom.com"
                className="text-zinc-600 hover:underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
