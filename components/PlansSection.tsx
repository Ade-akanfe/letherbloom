"use client";

import PlanCard from "./PlanCard";

const plans = [
  {
    name: "Basic",
    price: "29",
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
    name: "Premium",
    price: "59",
    description: "Most popular choice for serious results.",
    features: [
      "Custom workout plans",
      "Progress tracking & analytics",
      "Community access",
      "Priority support",
      "Monthly form check-ins",
    ],
    featured: true,
    priceId: "price_1Premium",
  },
  {
    name: "Elite",
    price: "99",
    description: "Maximum accountability and personalization.",
    features: [
      "1:1 coaching sessions",
      "Personalized nutrition guidance",
      "VIP community access",
      "Direct coach messaging",
      "Quarterly form assessments",
    ],
    priceId: "price_1Elite",
  },
];

export default function PlansSection({ onSelect }: { onSelect?: (plan: { name: string; priceId: string }) => void }) {
  return (
    <section id="plans" className="mt-8 mb-12">
      <div className="flex items-center justify-center mb-10 lg:mb-30">
        <h2 className="text-4xl font-bold text-zinc-900">Choose Your Plan</h2>
      </div>

      <div className="flex justify-center">
        <div className="grid gap-8 md:grid-cols-3 w-full max-w-6xl ">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              {...plan}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
