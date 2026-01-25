import { useState } from "react";
import { motion } from "framer-motion";
import PlanCard from "./PlanCard";

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState("Elite");
  const [eliteDuration, setEliteDuration] = useState(3); // months

  const eliteMonthlyPrice = 59;
  const eliteTotalPrice = eliteMonthlyPrice * eliteDuration;

  const tiers = [
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
    },
    {
      name: "Elite",
      price: eliteTotalPrice.toString(),
      priceNote: `for ${eliteDuration} months`,
      description: "Maximum accountability and personalization.",
      features: [
        "Custom workout plans",
        "Progress tracking & analytics",
        "Community access",
        "Priority support",
        "Monthly form check-ins",
      ],
      hasSelector: true,
    },
    {
      name: "Organization",
      price: "10",
      priceNote: "per user/month",
      description: "Perfect for teams, gyms, and corporate wellness.",
      features: [
        "Flexible duration",
        "Admin dashboard",
        "Add/remove members",
        "Bulk pricing",
      ],
      isOrganization: true,
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
            <p className="mt-4 text-zinc-600">Cancel anytime</p>
          </div>
        </motion.div>

        <div className="flex justify-center">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                {/* @ts-ignore - PlanCard has some optional props mismatch with tiers object */}
                <PlanCard
                  {...tier}
                  featured={selectedPlan === tier.name}
                  eliteDuration={tier.name === "Elite" ? eliteDuration : undefined}
                  onDurationChange={tier.name === "Elite" ? setEliteDuration : undefined}
                // We don't pass onSelect if we want it to trigger checkout directly unless it's for selection highlighting only?
                // PlanCard logic: if onSelect is present, it calls onSelect. If NOT present, it calls handleSubscribe (checkout).
                // But we want to highlight it when clicked too?
                // Actually, PlanCard doesn't have a "selection only" mode that ALSO keeps checkout button?
                // Let's modify PlanCard a bit or just use it for checkout.
                // If we want "click to select" AND "click button to checkout", PlanCard supports that via button.
                // But PlanCard top-level div has onSelect.
                // If we pass onSelect, it disables checkout on div click.
                // Maybe we want to update selectedPlan when clicked, but let the button trigger checkout?
                // For now, let's just make clicking it trigger checkout, as user requested "go to site to pay".
                // So we will NOT pass onSelect used for wizard.
                // We can pass `featured` to highlight it if we match it.
                // But how to update `selectedPlan`?
                // Maybe we don't need `selectedPlan` state here if clicking goes to checkout?
                // Or we use onMouseEnter to set selected?
                // Let's simpler: clicking anywhere triggers checkout.
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

