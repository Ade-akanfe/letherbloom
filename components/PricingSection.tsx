"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface PricingTierProps {
  name: string;
  price: string;
  features: string[];
  isSelected: boolean;
  onSelect: () => void;
}

function PricingTier({
  name,
  price,
  features,
  isSelected,
  onSelect,
}: PricingTierProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
    >
      <div
        onClick={onSelect}
        className={`rounded-2xl p-8 transition cursor-pointer ${isSelected
          ? "scale-105 border-2 border-rose-600 bg-gradient-to-br from-rose-50 to-white shadow-2xl"
          : "border border-zinc-200 bg-white shadow-lg"
          }`}>
        <h3 className={`text-2xl font-bold ${isSelected ? "text-rose-600" : "text-zinc-900"}`}>
          {name}
        </h3>
        <div className="mt-4">
          <span className="text-4xl font-black text-zinc-900">${price}</span>
          <span className="text-zinc-600">/month</span>
        </div>

        <ul className="mt-8 space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <span className="text-rose-600">✓</span>
              <span className="text-zinc-700">{feature}</span>
            </li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button className={`mt-8 w-full rounded-full py-3 px-4 font-semibold transition ${isSelected
            ? "bg-rose-600 text-white shadow-lg"
            : "border border-rose-600 text-rose-600 hover:bg-rose-50"
            }`}>
            Choose {name}
          </button>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState("Premium");

  const tiers = [
    {
      name: "Basic",
      price: "29",
      features: [
        "Weekly workout plans",
        "Form guides & videos",
        "Basic progress tracking",
        "Email support",
      ],
    },
    {
      name: "Premium",
      price: "59",
      features: [
        "Custom workout plans",
        "Progress tracking & analytics",
        "Community access",
        "Priority support",
        "Monthly form check-ins",
      ],
    },
    {
      name: "Elite",
      price: "99",
      features: [
        "1:1 coaching sessions",
        "Personalized nutrition guidance",
        "VIP community access",
        "Direct coach messaging",
        "Quarterly form assessments",
      ],
    },
  ];

  return (
    <section id="plans" className="bg-gradient-to-b from-white to-rose-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}

        >
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
              Membership
            </p>
            <h2 className="mt-2 text-4xl font-bold text-zinc-900">
              Choose Your Plan
            </h2>
            <p className="mt-4 text-zinc-600">Cancel anytime · 7-day free trial</p>
          </div>
        </motion.div>

        <div className="flex justify-center">
          <div className="grid gap-6 md:grid-cols-3 w-full max-w-5xl">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PricingTier
                  {...tier}
                  isSelected={selectedPlan === tier.name}
                  onSelect={() => setSelectedPlan(tier.name)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
