"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function OrganizationPricingPage() {
    const router = useRouter();
    const [organizationName, setOrganizationName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [memberEmails, setMemberEmails] = useState<string[]>([""]);
    const [durationMonths, setDurationMonths] = useState(12);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const pricePerSeat = 10;
    const totalSeats = memberEmails.filter((e) => e.trim()).length;
    const totalCost = pricePerSeat * totalSeats * durationMonths;

    const addEmailField = () => {
        setMemberEmails([...memberEmails, ""]);
    };

    const removeEmailField = (index: number) => {
        setMemberEmails(memberEmails.filter((_, i) => i !== index));
    };

    const updateEmail = (index: number, value: string) => {
        const updated = [...memberEmails];
        updated[index] = value;
        setMemberEmails(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Filter out empty emails
        const validEmails = memberEmails.filter((e) => e.trim());

        if (validEmails.length === 0) {
            setError("Please add at least one member email");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/checkout_sessions/organization", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    organizationName,
                    adminEmail,
                    memberEmails: validEmails,
                    durationMonths,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create checkout session");
            }

            // Redirect to Stripe checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <Navigation />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
                        Organization Plan
                    </h1>
                    <p className="text-xl text-zinc-600">
                        Empower your entire team with access to live training sessions
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Organization Details */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-zinc-900">
                                Organization Details
                            </h2>

                            <div>
                                <label
                                    htmlFor="orgName"
                                    className="block text-sm font-semibold text-zinc-700 mb-2"
                                >
                                    Organization Name
                                </label>
                                <input
                                    id="orgName"
                                    type="text"
                                    required
                                    value={organizationName}
                                    onChange={(e) => setOrganizationName(e.target.value)}
                                    placeholder="Acme Corporation"
                                    className="w-full rounded-lg border border-zinc-200 px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="adminEmail"
                                    className="block text-sm font-semibold text-zinc-700 mb-2"
                                >
                                    Admin Email
                                </label>
                                <input
                                    id="adminEmail"
                                    type="email"
                                    required
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    placeholder="admin@acme.com"
                                    className="w-full rounded-lg border border-zinc-200 px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                />
                                <p className="mt-1 text-sm text-zinc-500">
                                    You'll receive login credentials to manage your organization
                                </p>
                            </div>
                        </div>

                        {/* Member Emails */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-zinc-900">
                                    Team Members
                                </h2>
                                <button
                                    type="button"
                                    onClick={addEmailField}
                                    className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                                >
                                    + Add Member
                                </button>
                            </div>

                            <div className="space-y-3">
                                {memberEmails.map((email, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => updateEmail(index, e.target.value)}
                                            placeholder={`member${index + 1}@acme.com`}
                                            className="flex-1 rounded-lg border border-zinc-200 px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                        />
                                        {memberEmails.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeEmailField(index)}
                                                className="px-4 py-2 text-zinc-400 hover:text-red-600"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-zinc-900">
                                Subscription Duration
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[1, 3, 6, 12].map((months) => (
                                    <button
                                        key={months}
                                        type="button"
                                        onClick={() => setDurationMonths(months)}
                                        className={`rounded-lg border-2 px-4 py-3 font-semibold transition ${durationMonths === months
                                                ? "border-rose-600 bg-rose-50 text-rose-600"
                                                : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                                            }`}
                                    >
                                        {months} {months === 1 ? "Month" : "Months"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pricing Summary */}
                        <div className="rounded-xl bg-zinc-50 p-6 space-y-3">
                            <h3 className="font-semibold text-zinc-900">Pricing Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-zinc-600">Price per seat/month:</span>
                                    <span className="font-medium">${pricePerSeat}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-600">Total seats:</span>
                                    <span className="font-medium">{totalSeats}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-600">Duration:</span>
                                    <span className="font-medium">{durationMonths} months</span>
                                </div>
                                <div className="border-t border-zinc-200 pt-2 mt-2 flex justify-between text-lg">
                                    <span className="font-bold text-zinc-900">Total:</span>
                                    <span className="font-bold text-rose-600">${totalCost}</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || totalSeats === 0}
                            className="w-full rounded-xl bg-rose-600 px-6 py-4 text-lg font-bold text-white shadow-lg hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Processing..." : `Proceed to Payment - $${totalCost}`}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm text-zinc-500">
                    <p>
                        Already have an organization?{" "}
                        <a
                            href="/admin/dashboard"
                            className="font-semibold text-rose-600 hover:text-rose-700"
                        >
                            Admin Login
                        </a>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
