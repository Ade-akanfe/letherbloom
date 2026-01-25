"use client";

import { useState } from "react";

interface CodeEntryProps {
    onSuccess: (code: string, email?: string) => void;
    initialCode?: string;
}

export default function CodeEntry({ onSuccess, initialCode }: CodeEntryProps) {
    const [code, setCode] = useState(initialCode || "");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isOrganization, setIsOrganization] = useState(false);
    const [needsEmail, setNeedsEmail] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/validate-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, email: email || undefined }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Check if this is an organization code that needs email
                if (data.isOrganization && !email) {
                    setIsOrganization(true);
                    setNeedsEmail(true);
                    setError("This is an organization code. Please enter your email.");
                    setIsLoading(false);
                    return;
                }

                throw new Error(data.error || "Invalid code");
            }

            // Success
            onSuccess(code, data.email);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-rose-100 animate-in fade-in zoom-in duration-500">
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-10 text-center text-white">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
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
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Join Live Session
                    </h1>
                    <p className="mt-2 text-rose-100 opacity-90">
                        {needsEmail
                            ? "Enter your organization email to continue."
                            : "Enter your unique access code to get started."}
                    </p>
                </div>

                <div className="p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="code"
                                className="text-sm font-semibold text-zinc-700 uppercase tracking-wider"
                            >
                                Access Code
                            </label>
                            <input
                                id="code"
                                type="text"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="e.g., LHB-XYZ12 or ORG-ABC12"
                                disabled={needsEmail}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-lg font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {needsEmail && (
                            <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-zinc-700 uppercase tracking-wider"
                                >
                                    Organization Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@company.com"
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-lg font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNeedsEmail(false);
                                        setIsOrganization(false);
                                        setEmail("");
                                        setError("");
                                    }}
                                    className="text-sm text-rose-600 hover:text-rose-700 hover:underline"
                                >
                                    ← Use a different code
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 flex items-start gap-3 text-sm text-red-600 animate-in slide-in-from-top-2 fade-in duration-200">
                                <svg
                                    className="h-5 w-5 shrink-0 text-red-500 mt-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !code || (needsEmail && !email)}
                            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-rose-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-rose-200 transition-all duration-300 hover:bg-rose-700 hover:shadow-rose-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Enter</span>
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
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-zinc-500">
                            Don't have a code?{" "}
                            <a
                                href="/pricing"
                                className="font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                            >
                                Get code
                            </a>
                        </p>
                        <p className="mt-2 text-xs text-zinc-400">
                            Having trouble?{" "}
                            <a
                                href="mailto:support@letherbloom.com"
                                className="hover:text-zinc-600 hover:underline"
                            >
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
