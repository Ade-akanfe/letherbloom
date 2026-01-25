import { useState } from "react";
import PlanCard from "./PlanCard";
import Link from "next/link";

export default function PlansSection({
  onSelect,
}: {
  onSelect?: (plan: { name: string; priceId: string }) => void;
}) {
  const [eliteDuration, setEliteDuration] = useState(3); // months

  const eliteMonthlyPrice = 59;
  const eliteTotalPrice = eliteMonthlyPrice * eliteDuration;

  const plans = [
    {
      name: "Basic",
      price: "29",
      priceNote: "month",
      description: "Perfect for getting started on your journey.",
      features: [
        "Weekly workout plans",
        "Form guides & videos",
        "Basic progress tracking",
        "Email support",
      ],
      priceId: "price_1Basic",
    },
    {
      name: "Elite",
      price: eliteTotalPrice.toString(),
      priceNote: `for ${eliteDuration} months`,
      description: "Maximum accountability and personalization.",
      features: [
        "1:1 coaching sessions",
        "Personalized nutrition guidance",
        "VIP community access",
        "Direct coach messaging",
        "Quarterly form assessments",
      ],
      priceId: "price_1Elite",
      hasSelector: true,
      eliteDuration: eliteDuration,
      onDurationChange: setEliteDuration,
    },
  ];

  return (
    <section id="plans" className="mt-8 mb-12">
      <div className="flex items-center justify-center mb-10 lg:mb-30">
        <h2 className="text-4xl font-bold text-zinc-900">Choose Your Plan</h2>
      </div>

      <div className="flex justify-center px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
          {/* Individual Plans */}
          {plans.map((plan) => (
            //@ts-ignore - PlanCard props mismatch with dynamic Elite props
            <PlanCard key={plan.name} {...plan} onSelect={onSelect} />
          ))}

          {/* Organization Plan Card */}
          <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white p-6 shadow-lg flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="h-6 w-6 text-rose-600 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-xl font-bold text-zinc-900">
                Organization
              </h3>
            </div>

            <div className="mb-4">
              <div className="text-3xl font-bold text-zinc-900">$10</div>
              <div className="text-sm text-zinc-600">per user/month</div>
            </div>

            <p className="text-sm text-zinc-600 mb-4 flex-grow">
              Perfect for teams, gyms, and corporate wellness programs.
            </p>

            <ul className="space-y-2 text-sm text-zinc-700 mb-6">
              <li className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Flexible duration</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Admin dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Add/remove members</span>
              </li>
            </ul>

            <div className="mt-auto space-y-3">
              <Link
                href="/pricing/organization"
                className="block w-full text-center rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/admin/dashboard"
                className="block text-center text-xs text-rose-600 hover:text-rose-700 hover:underline"
              >
                Admin Login →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


